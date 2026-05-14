-- RPC : résout un tableau d'UUIDs en items de breadcrumb (id + full_name)
-- SECURITY DEFINER pour contourner RLS sur profiles
CREATE OR REPLACE FUNCTION public.get_breadcrumb_chain(p_ids UUID[])
RETURNS TABLE (id UUID, full_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE p.id = ANY(p_ids);
$$;
