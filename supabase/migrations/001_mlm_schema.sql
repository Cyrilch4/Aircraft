-- ============================================================
-- MLM Network - Schema & RPC Functions
-- ============================================================

-- Profiles (étend auth.users de Supabase)
create table public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  full_name  text not null,
  sponsor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Trigger : crée un profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Commissions : une ligne = une commission gagnée
create table public.commissions (
  id               uuid primary key default gen_random_uuid(),
  earner_id        uuid references public.profiles(id) not null,
  generator_id     uuid references public.profiles(id) not null,
  amount           numeric(10,2) not null check (amount > 0),
  rate             numeric(5,2)  not null,
  transaction_date date not null default current_date,
  created_at       timestamptz default now()
);

create index commissions_earner_date_idx on public.commissions(earner_id, transaction_date);
create index commissions_generator_idx   on public.commissions(generator_id);

alter table public.commissions enable row level security;

create policy "commissions_select_own" on public.commissions
  for select to authenticated using (auth.uid() = earner_id);

-- ============================================================
-- RPC : get_level_counts
-- Retourne le nombre de filleuls par niveau (pour les onglets)
-- ============================================================
create or replace function public.get_level_counts(p_root_id uuid)
returns table(level int, count bigint)
language sql stable security definer as $$
  with recursive tree as (
    select id, 1 as depth
    from   public.profiles
    where  sponsor_id = p_root_id

    union all

    select p.id, t.depth + 1
    from   public.profiles p
    join   tree t on p.sponsor_id = t.id
    where  t.depth < 5
  )
  select depth::int as level, count(*)
  from   tree
  group  by depth
  order  by depth;
$$;

-- ============================================================
-- RPC : get_network_stats
-- Pour chaque filleul au niveau p_level sous p_root_id,
-- retourne ce que leur réseau a rapporté à p_earner_id.
-- ============================================================
create or replace function public.get_network_stats(
  p_earner_id uuid,
  p_root_id   uuid,
  p_level     int
)
returns table (
  filleul_id   uuid,
  full_name    text,
  month_nb     bigint,
  month_amount numeric,
  year_nb      bigint,
  year_amount  numeric,
  has_recruits boolean
)
language sql stable security definer as $$
  with recursive
  -- Construit l'arbre complet depuis p_root_id (max 5 niveaux)
  -- filleul_at_level : l'ancêtre au niveau p_level de chaque membre
  tree as (
    select
      id            as member_id,
      id            as filleul_at_level,
      1             as depth
    from   public.profiles
    where  sponsor_id = p_root_id

    union all

    select
      p.id,
      case when t.depth < p_level then p.id else t.filleul_at_level end,
      t.depth + 1
    from   public.profiles p
    join   tree t on p.sponsor_id = t.member_id
    where  t.depth < 5
  ),
  -- Garde uniquement les membres dont la branche remonte à un filleul de niveau p_level
  scoped as (
    select filleul_at_level as filleul_id, member_id
    from   tree
    where  depth >= p_level
  ),
  -- Agrège les commissions par filleul
  agg as (
    select
      s.filleul_id,
      count(distinct case
        when c.transaction_date >= date_trunc('month', current_date)::date
        then c.generator_id end)                                               as month_nb,
      coalesce(sum(case
        when c.transaction_date >= date_trunc('month', current_date)::date
        then c.amount end), 0)                                                 as month_amount,
      count(distinct case
        when c.transaction_date >= date_trunc('year', current_date)::date
        then c.generator_id end)                                               as year_nb,
      coalesce(sum(case
        when c.transaction_date >= date_trunc('year', current_date)::date
        then c.amount end), 0)                                                 as year_amount
    from   scoped s
    left   join public.commissions c
           on  c.generator_id = s.member_id
           and c.earner_id    = p_earner_id
    group  by s.filleul_id
  )
  select
    a.filleul_id,
    pr.full_name,
    a.month_nb,
    a.month_amount,
    a.year_nb,
    a.year_amount,
    exists(select 1 from public.profiles sub where sub.sponsor_id = a.filleul_id) as has_recruits
  from   agg a
  join   public.profiles pr on pr.id = a.filleul_id
  order  by a.year_amount desc nulls last;
$$;
