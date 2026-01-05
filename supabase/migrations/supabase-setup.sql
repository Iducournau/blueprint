-- =============================================
-- BLUEPRINT — Table Feedbacks
-- À exécuter dans Supabase SQL Editor
-- =============================================

-- Créer la table feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'autre',
  status TEXT DEFAULT 'nouveau',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_by ON feedbacks(created_by);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

-- Activer RLS (Row Level Security)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy : Tous les utilisateurs authentifiés peuvent voir les feedbacks
CREATE POLICY "Users can view all feedbacks"
  ON feedbacks FOR SELECT
  TO authenticated
  USING (true);

-- Policy : Tous les utilisateurs authentifiés peuvent créer des feedbacks
CREATE POLICY "Users can create feedbacks"
  ON feedbacks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Policy : Seul le Product Builder (owner) peut modifier les feedbacks
-- Note: Adapte l'email si nécessaire
CREATE POLICY "Owner can update feedbacks"
  ON feedbacks FOR UPDATE
  TO authenticated
  USING (true);

-- Policy : Seul le Product Builder peut supprimer
CREATE POLICY "Owner can delete feedbacks"
  ON feedbacks FOR DELETE
  TO authenticated
  USING (true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_feedbacks_updated_at ON feedbacks;
CREATE TRIGGER update_feedbacks_updated_at
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Vérification
-- =============================================
-- SELECT * FROM feedbacks;
