-- ============================================================
-- Référentiel des activités métier
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activites (
  id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug    TEXT UNIQUE NOT NULL,
  nom     TEXT NOT NULL,
  couleur TEXT NOT NULL DEFAULT '#6E6E73'
);

INSERT INTO public.activites (slug, nom, couleur) VALUES
  ('plomberie',    'Plomberie',    '#0071E3'),
  ('electricite',  'Électricité',  '#FF9500'),
  ('maconnerie',   'Maçonnerie',   '#8E8E93'),
  ('chauffage',    'Chauffage',    '#FF3B30'),
  ('menuiserie',   'Menuiserie',   '#A2845E'),
  ('peinture',     'Peinture',     '#AF52DE'),
  ('couverture',   'Couverture',   '#34C759'),
  ('architecture', 'Architecture', '#1D1D1F')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.activites ENABLE ROW LEVEL SECURITY;

-- Lecture publique du référentiel (non sensible)
CREATE POLICY "activites_read" ON public.activites FOR SELECT USING (true);

-- ============================================================
-- Liaison artisan ↔ activités (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.artisan_activites (
  artisan_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activite_id UUID NOT NULL REFERENCES public.activites(id) ON DELETE CASCADE,
  PRIMARY KEY (artisan_id, activite_id)
);

ALTER TABLE public.artisan_activites ENABLE ROW LEVEL SECURITY;

-- RPC lecture des activités d'un artisan
CREATE OR REPLACE FUNCTION public.get_artisan_activites(p_artisan_id UUID)
RETURNS TABLE (slug TEXT, nom TEXT, couleur TEXT)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT a.slug, a.nom, a.couleur
  FROM public.artisan_activites aa
  JOIN public.activites a ON a.id = aa.activite_id
  WHERE aa.artisan_id = p_artisan_id;
$$;

-- ============================================================
-- Chantiers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chantiers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre           TEXT NOT NULL,
  client_id       TEXT,           -- sera une FK UUID quand Supabase Auth sera en place
  client_nom      TEXT NOT NULL,
  adresse         TEXT,
  statut          TEXT NOT NULL DEFAULT 'planifie'
                  CHECK (statut IN ('planifie', 'en_cours', 'termine')),
  date_debut      DATE,
  date_fin_prevue DATE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chantiers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Activités requises pour un chantier (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chantier_activites (
  chantier_id UUID NOT NULL REFERENCES public.chantiers(id) ON DELETE CASCADE,
  activite_id UUID NOT NULL REFERENCES public.activites(id) ON DELETE CASCADE,
  PRIMARY KEY (chantier_id, activite_id)
);

ALTER TABLE public.chantier_activites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Artisans assignés à un chantier
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chantier_artisans (
  chantier_id UUID NOT NULL REFERENCES public.chantiers(id) ON DELETE CASCADE,
  artisan_id  TEXT NOT NULL,   -- TEXT pour compatibilité demo UUIDs
  artisan_nom TEXT,
  activite_id UUID REFERENCES public.activites(id),
  PRIMARY KEY (chantier_id, artisan_id)
);

ALTER TABLE public.chantier_artisans ENABLE ROW LEVEL SECURITY;
