// =============================================
// BLUEPRINT — Types Briefs
// À ajouter dans lib/types.ts
// =============================================

// Statuts des briefs
export type BriefStatus =
  | 'pending_analysis'    // 🟡 En attente d'analyse
  | 'analyzing'           // 🔵 En cours d'analyse
  | 'proposals_ready'     // 🟣 Propositions prêtes
  | 'validated'           // ✅ Validé → Projet
  | 'archived'            // ⚫ Classé sans suite
  | 'rejected';           // 🔴 Rejeté

// Niveaux d'urgence
export type BriefUrgency = 'low' | 'normal' | 'high' | 'critical';

// Niveaux d'effort pour les propositions
export type EffortLevel = 'low' | 'medium' | 'high';

// Interface Brief
export interface Brief {
  id: string;
  name: string;
  problem: string | null;
  affected_users: string[];
  impact: string | null;
  constraints: string | null;
  initial_idea: string | null;
  urgency: BriefUrgency;
  context: string | null;
  status: BriefStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Interface pour créer un brief
export interface BriefInsert {
  name: string;
  problem?: string | null;
  affected_users?: string[];
  impact?: string | null;
  constraints?: string | null;
  initial_idea?: string | null;
  urgency?: BriefUrgency;
  context?: string | null;
  status?: BriefStatus;
  created_by?: string;
}

// Interface pour mettre à jour un brief
export interface BriefUpdate {
  name?: string;
  problem?: string | null;
  affected_users?: string[];
  impact?: string | null;
  constraints?: string | null;
  initial_idea?: string | null;
  urgency?: BriefUrgency;
  context?: string | null;
  status?: BriefStatus;
}

// Interface Proposition
export interface BriefProposal {
  id: string;
  brief_id: string;
  name: string;
  description: string | null;
  format: string | null;
  effort: EffortLevel;
  pros: string | null;
  cons: string | null;
  is_selected: boolean;
  selection_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Interface pour créer une proposition
export interface BriefProposalInsert {
  brief_id: string;
  name: string;
  description?: string | null;
  format?: string | null;
  effort?: EffortLevel;
  pros?: string | null;
  cons?: string | null;
}

// Interface pour mettre à jour une proposition
export interface BriefProposalUpdate {
  name?: string;
  description?: string | null;
  format?: string | null;
  effort?: EffortLevel;
  pros?: string | null;
  cons?: string | null;
  is_selected?: boolean;
  selection_reason?: string | null;
}

// Brief avec ses propositions (pour les vues détaillées)
export interface BriefWithProposals extends Brief {
  proposals: BriefProposal[];
}

// =============================================
// Helpers pour l'affichage
// =============================================

export const BRIEF_STATUS_CONFIG: Record<BriefStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  pending_analysis: {
    label: 'En attente d\'analyse',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  analyzing: {
    label: 'En cours d\'analyse',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  proposals_ready: {
    label: 'Propositions prêtes',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  validated: {
    label: 'Validé → Projet',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  archived: {
    label: 'Classé sans suite',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  rejected: {
    label: 'Rejeté',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};

export const URGENCY_CONFIG: Record<BriefUrgency, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  low: {
    label: 'Faible',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  normal: {
    label: 'Normal',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  high: {
    label: 'Urgent',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  critical: {
    label: 'Critique',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export const EFFORT_CONFIG: Record<EffortLevel, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  low: {
    label: 'Faible',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  medium: {
    label: 'Moyen',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  high: {
    label: 'Élevé',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

// Options pour les utilisateurs affectés (checkboxes du formulaire)
export const AFFECTED_USERS_OPTIONS = [
  { value: 'students', label: 'Élèves' },
  { value: 'teachers', label: 'Formateurs' },
  { value: 'sales', label: 'Équipe commerciale' },
  { value: 'marketing', label: 'Équipe marketing' },
  { value: 'support', label: 'Support client' },
  { value: 'management', label: 'Direction' },
  { value: 'tech', label: 'Équipe tech' },
  { value: 'other', label: 'Autre' },
] as const;
