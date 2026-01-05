// =============================================
// BLUEPRINT — Types
// =============================================

// =============================================
// BRIEFS
// =============================================

// Statuts des briefs
export type BriefStatus =
  | 'pending_analysis'    // 🟡 En attente d'analyse
  | 'analyzing'           // 🔵 En cours d'analyse
  | 'proposals_ready'     // 🟣 Propositions prêtes
  | 'validated'           // ✅ Validé → Projet
  | 'archived'            // ⚫ Classé sans suite
  | 'rejected';           // 🔴 Rejeté

// Priorité (définie par Product Builder + CPO)
export type BriefPriority = 'high' | 'medium' | 'low' | 'icebox';

// Types d'outcome
export type OutcomeType = 
  | 'time'        // ⏱️ Gagner du temps
  | 'errors'      // 📉 Réduire les erreurs
  | 'visibility'  // 🔍 Avoir plus de visibilité
  | 'experience'  // 😊 Améliorer une expérience
  | 'performance' // 📈 Augmenter une performance
  | 'compliance'  // 🔒 Être conforme / sécurisé
  | 'unknown';    // 🤷 Je ne sais pas encore

// Types de contraintes
export type ConstraintDeadline = 'urgent' | 'month' | 'quarter' | 'none';
export type ConstraintBudget = 'zero' | 'under_1k' | '1k_5k' | 'over_5k' | 'tbd';

export interface BriefConstraints {
  deadline?: ConstraintDeadline;
  budget?: ConstraintBudget;
  tool?: string;
  out_of_scope?: string;
  already_tried?: string;
  other?: string;
}

// Types de ressources
export type ResourceType = 'link' | 'note';

export interface BriefResource {
  type: ResourceType;
  url?: string;        // Pour les liens
  content?: string;    // Pour les notes
  description?: string;
}

// Niveaux d'effort pour les propositions
export type EffortLevel = 'low' | 'medium' | 'high';

// Interface Brief (nouvelle structure)
export interface Brief {
  id: string;
  name: string;
  situation: string | null;
  consequences: string | null;
  affected_teams: string[];
  outcome_type: OutcomeType | null;
  outcome_description: string | null;
  constraints: BriefConstraints | null;
  resources: BriefResource[] | null;
  status: BriefStatus;
  priority: BriefPriority | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Interface pour créer un brief
export interface BriefInsert {
  name: string;
  situation?: string | null;
  consequences?: string | null;
  affected_teams?: string[];
  outcome_type?: OutcomeType | null;
  outcome_description?: string | null;
  constraints?: BriefConstraints | null;
  resources?: BriefResource[] | null;
  status?: BriefStatus;
  priority?: BriefPriority | null;
  created_by?: string;
}

// Interface pour mettre à jour un brief
export interface BriefUpdate {
  name?: string;
  situation?: string | null;
  consequences?: string | null;
  affected_teams?: string[];
  outcome_type?: OutcomeType | null;
  outcome_description?: string | null;
  constraints?: BriefConstraints | null;
  resources?: BriefResource[] | null;
  status?: BriefStatus;
  priority?: BriefPriority | null;
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

// Brief avec ses propositions (pour les vues détaillées)
export interface BriefWithProposals extends Brief {
  proposals: BriefProposal[];
}

// =============================================
// Configuration d'affichage — Briefs
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

export const PRIORITY_CONFIG: Record<BriefPriority, {
  label: string;
  color: string;
  bgColor: string;
  emoji: string;
}> = {
  high: {
    label: 'Haute',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    emoji: '🔴',
  },
  medium: {
    label: 'Moyenne',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    emoji: '🟡',
  },
  low: {
    label: 'Basse',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    emoji: '🟢',
  },
  icebox: {
    label: 'Icebox',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    emoji: '❄️',
  },
};

export const OUTCOME_CONFIG: Record<OutcomeType, {
  label: string;
  emoji: string;
  placeholder: string;
}> = {
  time: {
    label: 'On gagnerait du temps',
    emoji: '⏱️',
    placeholder: 'Ex: Réduire le temps de recherche prospect de 2h à 30min/jour',
  },
  errors: {
    label: 'On ferait moins d\'erreurs',
    emoji: '📉',
    placeholder: 'Ex: Éliminer les doublons de saisie entre les outils',
  },
  visibility: {
    label: 'On aurait plus de visibilité',
    emoji: '🔍',
    placeholder: 'Ex: Voir en temps réel le pipeline commercial',
  },
  experience: {
    label: 'L\'expérience serait meilleure',
    emoji: '😊',
    placeholder: 'Ex: Simplifier le parcours d\'inscription apprenant',
  },
  performance: {
    label: 'Les performances augmenteraient',
    emoji: '📈',
    placeholder: 'Ex: Améliorer le taux de conversion des leads',
  },
  compliance: {
    label: 'On serait conforme / sécurisé',
    emoji: '🔒',
    placeholder: 'Ex: Respecter le RGPD sur les données prospects',
  },
  unknown: {
    label: 'Je ne sais pas encore',
    emoji: '🤷',
    placeholder: 'Ex: Décris ce qui irait mieux si le problème disparaissait',
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

export const DEADLINE_CONFIG: Record<ConstraintDeadline, {
  label: string;
}> = {
  urgent: { label: 'Urgent (< 2 semaines)' },
  month: { label: 'Dans le mois' },
  quarter: { label: 'Dans le trimestre' },
  none: { label: 'Pas de deadline précise' },
};

export const BUDGET_CONFIG: Record<ConstraintBudget, {
  label: string;
}> = {
  zero: { label: '0€ (ressources internes uniquement)' },
  under_1k: { label: '< 1 000€' },
  '1k_5k': { label: '1 000€ - 5 000€' },
  over_5k: { label: '> 5 000€' },
  tbd: { label: 'À définir' },
};

// =============================================
// Équipes affectées (multi-select 2 niveaux)
// =============================================

export interface TeamOption {
  value: string;
  label: string;
  poles?: { value: string; label: string }[];
}

export const AFFECTED_TEAMS_OPTIONS: TeamOption[] = [
  { 
    value: 'apprenants', 
    label: 'Apprenants' 
  },
  { 
    value: 'commerce', 
    label: 'Commerce',
    poles: [
      { value: 'commerce:conseillers', label: 'Conseillers d\'Admissions' },
      { value: 'commerce:recouvrement', label: 'Recouvrement' },
    ]
  },
  { 
    value: 'direction', 
    label: 'Direction' 
  },
  { 
    value: 'it', 
    label: 'IT',
    poles: [
      { value: 'it:developpeurs', label: 'Développeurs' },
      { value: 'it:integrateurs', label: 'Intégrateurs' },
    ]
  },
  { 
    value: 'pedagogique', 
    label: 'Pédagogique' 
  },
  { 
    value: 'plateforme', 
    label: 'Plateforme',
    poles: [
      { value: 'plateforme:coachs', label: 'Coachs' },
      { value: 'plateforme:produit', label: 'Produit' },
    ]
  },
  { 
    value: 'webmarketing', 
    label: 'Webmarketing',
    poles: [
      { value: 'webmarketing:cm', label: 'CM' },
      { value: 'webmarketing:sea', label: 'SEA' },
      { value: 'webmarketing:seo', label: 'SEO' },
      { value: 'webmarketing:ux', label: 'UX' },
    ]
  },
  { 
    value: 'autres', 
    label: 'Autres' 
  },
];

// =============================================
// Types de contraintes pour le formulaire
// =============================================

export type ConstraintType = 'deadline' | 'budget' | 'tool' | 'out_of_scope' | 'already_tried' | 'other';

export const CONSTRAINT_TYPES: { value: ConstraintType; label: string; emoji: string }[] = [
  { value: 'deadline', label: 'Délai', emoji: '⏰' },
  { value: 'budget', label: 'Budget', emoji: '💰' },
  { value: 'tool', label: 'Outil imposé', emoji: '🔧' },
  { value: 'out_of_scope', label: 'Hors périmètre', emoji: '🚫' },
  { value: 'already_tried', label: 'Déjà tenté sans succès', emoji: '🔄' },
  { value: 'other', label: 'Autre', emoji: '➕' },
];

// =============================================
// Types de ressources pour le formulaire
// =============================================

export const RESOURCE_TYPES: { value: ResourceType; label: string; emoji: string }[] = [
  { value: 'link', label: 'Lien (URL)', emoji: '🔗' },
  { value: 'note', label: 'Note / Texte libre', emoji: '📝' },
];

// =============================================
// PROJECTS (existant)
// =============================================

export type ProjectType = 'plateforme' | 'landing' | 'dashboard' | 'outil' | 'integration';
export type ProjectStatus = 'cadrage' | 'conception' | 'dev' | 'recette' | 'live' | 'pause' | 'abandonne';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  type: ProjectType;
  has_modules: boolean;
  status: ProjectStatus;
  brief_id: string | null;
  user_id: string;
  created_at: string;
}

export interface Block {
  id: string;
  project_id: string;
  module_id: string | null;
  tab: string;
  type: string;
  content: string;
  order: number;
  created_at: string;
}

export interface Module {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
}
