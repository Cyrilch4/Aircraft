-- ============================================================
-- Fonction RPC : arborescence complète d'un utilisateur
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_network_tree(p_root_id UUID)
RETURNS TABLE (
  id         UUID,
  full_name  TEXT,
  sponsor_id UUID,
  depth      INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE tree AS (
    -- Racine (l'utilisateur lui-même, depth 0)
    SELECT
      pr.id,
      pr.full_name,
      pr.sponsor_id,
      0 AS depth
    FROM public.profiles pr
    WHERE pr.id = p_root_id

    UNION ALL

    -- Descendants directs de chaque nœud déjà dans l'arbre
    SELECT
      p.id,
      p.full_name,
      p.sponsor_id,
      t.depth + 1
    FROM public.profiles p
    JOIN tree t ON p.sponsor_id = t.id
    WHERE t.depth < 5
  )
  SELECT id, full_name, sponsor_id, depth
  FROM tree
  ORDER BY depth, full_name;
$$;
