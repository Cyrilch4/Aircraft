-- ============================================================
-- RPC : stats totales d'un filleul (lui + tout son sous-réseau)
-- Utilisée pour la ligne de synthèse sur la page individuelle
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_filleul_total_stats(
  p_earner_id  UUID,
  p_filleul_id UUID
)
RETURNS TABLE (
  full_name    TEXT,
  month_nb     BIGINT,
  month_amount NUMERIC,
  year_nb      BIGINT,
  year_amount  NUMERIC,
  has_recruits BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE subtree AS (
    SELECT id FROM public.profiles WHERE id = p_filleul_id
    UNION ALL
    SELECT p.id FROM public.profiles p
    JOIN subtree s ON p.sponsor_id = s.id
  )
  SELECT
    (SELECT full_name FROM public.profiles WHERE id = p_filleul_id),
    COUNT(DISTINCT CASE
      WHEN c.transaction_date >= date_trunc('month', current_date)::date
      THEN c.generator_id END),
    COALESCE(SUM(CASE
      WHEN c.transaction_date >= date_trunc('month', current_date)::date
      THEN c.amount END), 0),
    COUNT(DISTINCT CASE
      WHEN c.transaction_date >= date_trunc('year', current_date)::date
      THEN c.generator_id END),
    COALESCE(SUM(CASE
      WHEN c.transaction_date >= date_trunc('year', current_date)::date
      THEN c.amount END), 0),
    EXISTS(SELECT 1 FROM public.profiles WHERE sponsor_id = p_filleul_id)
  FROM subtree st
  JOIN public.commissions c
    ON c.generator_id = st.id
    AND c.earner_id = p_earner_id;
$$;
