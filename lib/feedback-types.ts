// =============================================
// BLUEPRINT — Types Feedbacks
// À ajouter dans lib/types.ts ou lib/feedback-types.ts
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
  user_email: string | null;  // Email de l'auteur
  created_at: string;
  updated_at: string;
}

export interface FeedbackInsert {
  title: string;
  description?: string;
  category?: FeedbackCategory;
  created_by: string;
  user_email?: string;
}

export interface FeedbackUpdate {
  title?: string;
  description?: string;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
}

// Colonnes / Statuts
export const FEEDBACK_COLUMNS: { id: FeedbackStatus; label: string }[] = [
  { id: 'nouveau', label: '🟡 Nouveau' },
  { id: 'en_cours', label: '🔵 En cours' },
  { id: 'traite', label: '✅ Traité' },
];

// Catégories de feedback
export const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: 'bug', label: '🐛 Bug' },
  { value: 'amelioration', label: '✨ Amélioration' },
  { value: 'question', label: '❓ Question' },
  { value: 'autre', label: '📝 Autre' },
];
