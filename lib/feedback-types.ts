// =============================================
// BLUEPRINT — Types Feedbacks
// À ajouter dans lib/types.ts
// =============================================

export type FeedbackStatus = 'nouveau' | 'en_cours' | 'traite';

export type FeedbackCategory = 'bug' | 'amelioration' | 'question' | 'autre';

export interface Feedback {
  id: string;
  title: string;
  description: string | null;
  category: FeedbackCategory;
  status: FeedbackStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Jointure optionnelle avec le profil utilisateur
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

export interface FeedbackInsert {
  title: string;
  description?: string;
  category?: FeedbackCategory;
  created_by: string;
}

export interface FeedbackUpdate {
  title?: string;
  description?: string;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
}

// Colonnes du Kanban
export const FEEDBACK_COLUMNS: { id: FeedbackStatus; label: string; color: string }[] = [
  { id: 'nouveau', label: '🟡 Nouveau', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'en_cours', label: '🔵 En cours', color: 'bg-blue-100 border-blue-300' },
  { id: 'traite', label: '✅ Traité', color: 'bg-green-100 border-green-300' },
];

// Catégories de feedback
export const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: 'bug', label: '🐛 Bug' },
  { value: 'amelioration', label: '✨ Amélioration' },
  { value: 'question', label: '❓ Question' },
  { value: 'autre', label: '📝 Autre' },
];
