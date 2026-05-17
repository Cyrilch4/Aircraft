-- ─────────────────────────────────────────────────────────────────────────────
-- 009_references.sql
-- Système de références lisibles pour chaque entité
-- Format : [PRÉFIXE]-[AAAAMMJJ]-[SÉQUENTIEL 4 chiffres]
-- Exemple : PRO-20260517-0003
-- ─────────────────────────────────────────────────────────────────────────────

-- Séquences par type d'entité (indépendantes, pas de conflit entre tables)
CREATE SEQUENCE IF NOT EXISTS seq_ref_pro   START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_ref_clt   START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_ref_bie   START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_ref_cha   START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_ref_fou   START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_ref_usr   START 1 INCREMENT 1;

-- Fonction générique de génération de référence
CREATE OR REPLACE FUNCTION generate_ref(prefix TEXT, seq_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val BIGINT;
  today    TEXT;
BEGIN
  EXECUTE format('SELECT nextval(%L)', seq_name) INTO next_val;
  today := to_char(CURRENT_DATE, 'YYYYMMDD');
  RETURN prefix || '-' || today || '-' || lpad(next_val::TEXT, 4, '0');
END;
$$;

-- ─── Colonnes reference ───────────────────────────────────────────────────────

ALTER TABLE IF EXISTS public.artisans
  ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;

ALTER TABLE IF EXISTS public.clients
  ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;

-- Pour les biens, clients finaux, chantiers — tables à créer dans une future migration
-- On prépare déjà les helpers pour qu'ils soient prêts

-- ─── Triggers : auto-génération à l'INSERT ────────────────────────────────────

CREATE OR REPLACE FUNCTION trg_set_ref_artisan()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := generate_ref('PRO', 'seq_ref_pro');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_ref_artisan ON public.artisans;
CREATE TRIGGER set_ref_artisan
  BEFORE INSERT ON public.artisans
  FOR EACH ROW EXECUTE FUNCTION trg_set_ref_artisan();

-- ─────────────────────────────────────────────────────────────────────────────
-- Template pour les tables futures (copier/adapter lors de leur création) :
--
-- ALTER TABLE public.biens     ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;
-- ALTER TABLE public.clients_finaux ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;
-- ALTER TABLE public.chantiers ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;
-- ALTER TABLE public.fournisseurs   ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;
-- ALTER TABLE public.utilisateurs   ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;
--
-- CREATE OR REPLACE FUNCTION trg_set_ref_XXX() RETURNS TRIGGER LANGUAGE plpgsql AS $$
-- BEGIN
--   IF NEW.reference IS NULL THEN
--     NEW.reference := generate_ref('XXX', 'seq_ref_xxx');
--   END IF;
--   RETURN NEW;
-- END; $$;
-- CREATE TRIGGER set_ref_XXX BEFORE INSERT ON public.XXX
--   FOR EACH ROW EXECUTE FUNCTION trg_set_ref_XXX();
-- ─────────────────────────────────────────────────────────────────────────────
