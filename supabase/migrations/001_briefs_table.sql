-- =============================================
-- BLUEPRINT — Migration table briefs
-- Exécuter dans Supabase SQL Editor
-- =============================================

-- 1. Supprimer l'ancienne table briefs si elle existe
-- (ATTENTION: cela supprimera toutes les données existantes)
-- Décommente cette ligne si tu veux repartir de zéro:
-- DROP TABLE IF EXISTS briefs CASCADE;

-- 2. Créer la nouvelle table briefs
CREATE TABLE IF NOT EXISTS briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  situation TEXT,
  consequences TEXT,
  affected_teams TEXT[] DEFAULT '{}',
  outcome_type TEXT,
  outcome_description TEXT,
  constraints JSONB,
  resources JSONB,
  status TEXT DEFAULT 'pending_analysis',
  priority TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Créer un index sur le statut pour filtrer rapidement
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);

-- 4. Créer un index sur created_by pour filtrer par utilisateur
CREATE INDEX IF NOT EXISTS idx_briefs_created_by ON briefs(created_by);

-- 5. Activer RLS (Row Level Security)
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- 6. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can view all briefs" ON briefs;
DROP POLICY IF EXISTS "Users can create briefs" ON briefs;
DROP POLICY IF EXISTS "Users can update briefs" ON briefs;
DROP POLICY IF EXISTS "Users can delete briefs" ON briefs;

-- 7. Créer les policies RLS
-- Lecture : tous les utilisateurs authentifiés peuvent voir tous les briefs
CREATE POLICY "Users can view all briefs" ON briefs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Création : les utilisateurs authentifiés peuvent créer des briefs
CREATE POLICY "Users can create briefs" ON briefs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Mise à jour : les utilisateurs authentifiés peuvent mettre à jour tous les briefs
-- (En V2, on pourra restreindre selon les rôles)
CREATE POLICY "Users can update briefs" ON briefs
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Suppression : les utilisateurs authentifiés peuvent supprimer tous les briefs
-- (En V2, on pourra restreindre selon les rôles)
CREATE POLICY "Users can delete briefs" ON briefs
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 8. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_briefs_updated_at ON briefs;

CREATE TRIGGER update_briefs_updated_at
    BEFORE UPDATE ON briefs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Vérification
-- =============================================

-- Pour vérifier que la table a été créée correctement:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'briefs';

-- =============================================
-- (OPTIONNEL) Migration des anciennes données
-- =============================================

-- Si tu avais déjà des briefs avec l'ancienne structure,
-- voici comment migrer les données:

-- UPDATE briefs SET
--   situation = problem,
--   consequences = impact,
--   affected_teams = affected_users
-- WHERE situation IS NULL AND problem IS NOT NULL;

-- Puis supprimer les anciennes colonnes:
-- ALTER TABLE briefs DROP COLUMN IF EXISTS problem;
-- ALTER TABLE briefs DROP COLUMN IF EXISTS affected_users;
-- ALTER TABLE briefs DROP COLUMN IF EXISTS impact;
-- ALTER TABLE briefs DROP COLUMN IF EXISTS initial_idea;
-- ALTER TABLE briefs DROP COLUMN IF EXISTS urgency;
-- ALTER TABLE briefs DROP COLUMN IF EXISTS context;
