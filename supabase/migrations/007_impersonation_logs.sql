-- Table d'audit des sessions d'impersonation (accès admin aux portails)
CREATE TABLE IF NOT EXISTS public.impersonation_logs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT        NOT NULL DEFAULT 'admin',
  target_id   TEXT        NOT NULL,
  target_type TEXT        NOT NULL CHECK (target_type IN ('artisan', 'client')),
  target_name TEXT        NOT NULL,
  started_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  ended_at    TIMESTAMPTZ
);

ALTER TABLE public.impersonation_logs ENABLE ROW LEVEL SECURITY;

-- RPC : enregistre le début d'une session d'impersonation
CREATE OR REPLACE FUNCTION public.log_impersonation_start(
  p_target_id   TEXT,
  p_target_type TEXT,
  p_target_name TEXT,
  p_admin_email TEXT DEFAULT 'admin'
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO public.impersonation_logs (admin_email, target_id, target_type, target_name)
  VALUES (p_admin_email, p_target_id, p_target_type, p_target_name)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- RPC : enregistre la fin d'une session d'impersonation
CREATE OR REPLACE FUNCTION public.log_impersonation_end(
  p_log_id UUID
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.impersonation_logs
  SET ended_at = now()
  WHERE id = p_log_id;
END;
$$;
