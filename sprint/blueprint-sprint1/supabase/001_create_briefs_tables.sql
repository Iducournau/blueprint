-- =============================================
-- BLUEPRINT — Sprint 1 : Tables Briefs
-- À exécuter dans Supabase SQL Editor
-- =============================================

-- 1. Table briefs
-- =============================================
CREATE TABLE IF NOT EXISTS briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  problem TEXT,
  affected_users TEXT[] DEFAULT '{}',
  impact TEXT,
  constraints TEXT,
  initial_idea TEXT,
  urgency TEXT DEFAULT 'normal',
  context TEXT,
  status TEXT DEFAULT 'pending_analysis',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commentaire sur la table
COMMENT ON TABLE briefs IS 'Briefs soumis décrivant un problème à résoudre';

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS briefs_status_idx ON briefs(status);
CREATE INDEX IF NOT EXISTS briefs_created_by_idx ON briefs(created_by);
CREATE INDEX IF NOT EXISTS briefs_created_at_idx ON briefs(created_at DESC);

-- 2. Table brief_proposals
-- =============================================
CREATE TABLE IF NOT EXISTS brief_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  format TEXT,
  effort TEXT DEFAULT 'medium',
  pros TEXT,
  cons TEXT,
  is_selected BOOLEAN DEFAULT FALSE,
  selection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commentaire sur la table
COMMENT ON TABLE brief_proposals IS 'Propositions de solutions pour un brief';

-- Index
CREATE INDEX IF NOT EXISTS brief_proposals_brief_id_idx ON brief_proposals(brief_id);

-- 3. Ajouter brief_id à la table projects (si elle existe)
-- =============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'brief_id') THEN
      ALTER TABLE projects ADD COLUMN brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- 4. Fonction pour mettre à jour updated_at automatiquement
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_briefs_updated_at ON briefs;
CREATE TRIGGER update_briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brief_proposals_updated_at ON brief_proposals;
CREATE TRIGGER update_brief_proposals_updated_at
  BEFORE UPDATE ON brief_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS)
-- =============================================

-- Activer RLS
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_proposals ENABLE ROW LEVEL SECURITY;

-- Policies pour briefs
-- Lecture : tous les utilisateurs authentifiés
CREATE POLICY "Users can view all briefs"
  ON briefs FOR SELECT
  TO authenticated
  USING (true);

-- Création : utilisateurs authentifiés
CREATE POLICY "Users can create briefs"
  ON briefs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Modification : utilisateurs authentifiés
CREATE POLICY "Users can update briefs"
  ON briefs FOR UPDATE
  TO authenticated
  USING (true);

-- Suppression : uniquement le créateur
CREATE POLICY "Users can delete own briefs"
  ON briefs FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies pour brief_proposals
-- Lecture : tous les utilisateurs authentifiés
CREATE POLICY "Users can view all proposals"
  ON brief_proposals FOR SELECT
  TO authenticated
  USING (true);

-- Création/Modification/Suppression : utilisateurs authentifiés
CREATE POLICY "Users can create proposals"
  ON brief_proposals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update proposals"
  ON brief_proposals FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete proposals"
  ON brief_proposals FOR DELETE
  TO authenticated
  USING (true);

-- 6. Données de test (optionnel)
-- =============================================
-- Décommenter pour insérer des données de test

/*
INSERT INTO briefs (name, problem, affected_users, impact, urgency, status) VALUES
(
  'Tableau de bord SEO',
  'Les équipes SEO n''ont pas de visibilité centralisée sur les performances organiques. Chaque analyse nécessite de jongler entre 5 outils différents.',
  ARRAY['SEO Team', 'Content Team', 'CMO'],
  'Perte de temps estimée à 4h/semaine par personne. Décisions parfois prises sur des données incomplètes.',
  'high',
  'pending_analysis'
),
(
  'Automatisation des rapports hebdo',
  'Les rapports hebdomadaires sont créés manuellement chaque lundi matin, mobilisant 2 personnes pendant 3h.',
  ARRAY['Marketing Team', 'Direction'],
  'Risque d''erreurs humaines, temps perdu, retard fréquent dans l''envoi.',
  'normal',
  'analyzing'
),
(
  'Intégration CRM-Newsletter',
  'Les contacts du CRM ne sont pas synchronisés avec l''outil newsletter. Import manuel chaque semaine.',
  ARRAY['Sales Team', 'Marketing Team'],
  'Contacts oubliés, doublons, segmentation impossible.',
  'low',
  'proposals_ready'
);
*/

-- =============================================
-- ✅ Script terminé
-- =============================================
