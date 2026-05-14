-- Table de configuration MLM (taux, modèle d'affaire, partage)
CREATE TABLE IF NOT EXISTS public.mlm_config (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Valeurs par défaut
INSERT INTO public.mlm_config (key, value) VALUES
(
  'mlm_rates',
  '[
    {"level":1,"taux":20,"conditions":["Minimum 2 filleuls directs actifs"]},
    {"level":2,"taux":5, "conditions":["Minimum 1 filleul actif"]},
    {"level":3,"taux":4, "conditions":[]},
    {"level":4,"taux":3, "conditions":[]},
    {"level":5,"taux":2, "conditions":[]}
  ]'
),
(
  'modele_affaire',
  '{"marketing":5,"operations":3}'
),
(
  'partage_affaire',
  '{"apporteur":30,"realisateur":70}'
)
ON CONFLICT (key) DO NOTHING;

-- Lecture (accessible en anon pour le mode démo)
CREATE OR REPLACE FUNCTION public.get_mlm_config(p_key TEXT)
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT value FROM public.mlm_config WHERE key = p_key;
$$;

-- Écriture (SECURITY DEFINER — sera restreint aux admins lors de l'auth)
CREATE OR REPLACE FUNCTION public.set_mlm_config(p_key TEXT, p_value JSONB)
RETURNS VOID
LANGUAGE sql SECURITY DEFINER AS $$
  INSERT INTO public.mlm_config (key, value, updated_at)
  VALUES (p_key, p_value, now())
  ON CONFLICT (key) DO UPDATE SET value = p_value, updated_at = now();
$$;
