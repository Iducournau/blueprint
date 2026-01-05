'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Plus, 
  Trash2,
  Check,
  Lightbulb,
  Link as LinkIcon,
  FileText
} from 'lucide-react';
import {
  BriefInsert,
  OutcomeType,
  BriefConstraints,
  BriefResource,
  ConstraintType,
  ResourceType,
  ConstraintDeadline,
  ConstraintBudget,
  OUTCOME_CONFIG,
  CONSTRAINT_TYPES,
  RESOURCE_TYPES,
  DEADLINE_CONFIG,
  BUDGET_CONFIG,
} from '@/lib/types';
import TeamSelector from '@/components/briefs/TeamSelector';

// =============================================
// Types internes
// =============================================

interface BriefFormProps {
  onSubmit: (data: BriefInsert) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

interface FormData {
  name: string;
  situation: string;
  consequences: string;
  affected_teams: string[];
  outcome_type: OutcomeType | '';
  outcome_description: string;
  constraints: BriefConstraints;
  resources: BriefResource[];
}

// =============================================
// Liste des équipes pour le récap
// =============================================

const TEAMS_LIST = [
  { value: 'apprenants', label: 'Apprenants' },
  { value: 'coachs', label: 'Coachs' },
  { value: 'cm', label: 'CM' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'conseillers', label: "Conseillers d'Admissions" },
  { value: 'developpeurs', label: 'Développeurs' },
  { value: 'direction', label: 'Direction' },
  { value: 'integrateurs', label: 'Intégrateurs' },
  { value: 'it', label: 'IT' },
  { value: 'pedagogique', label: 'Pédagogique' },
  { value: 'plateforme', label: 'Plateforme' },
  { value: 'produit', label: 'Produit' },
  { value: 'recouvrement', label: 'Recouvrement' },
  { value: 'sea', label: 'SEA' },
  { value: 'seo', label: 'SEO' },
  { value: 'ux', label: 'UX' },
  { value: 'webmarketing', label: 'Webmarketing' },
];

// =============================================
// Composant RecapItem pour la sidebar
// =============================================

function RecapItem({ 
  label, 
  value, 
  stepNumber, 
  isEmpty, 
  currentStep, 
  onNavigate 
}: { 
  label: string;
  value: string;
  stepNumber: number;
  isEmpty: boolean;
  currentStep: number;
  onNavigate: (step: number) => void;
}) {
  const isCurrentStep = currentStep === stepNumber;
  const isFilled = !isEmpty;
  
  return (
    <button
      onClick={() => onNavigate(stepNumber)}
      className={`w-full text-left p-2.5 rounded-lg transition-all ${
        isCurrentStep 
          ? 'bg-primary/10 border border-primary/30' 
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className={`text-xs font-medium uppercase tracking-wide ${
          isCurrentStep ? 'text-primary' : 'text-gray-400'
        }`}>
          {label}
        </span>
        {isFilled && !isCurrentStep && (
          <Check className="w-3.5 h-3.5 text-green-500" />
        )}
      </div>
      <div className={`text-sm leading-snug ${isFilled ? 'text-gray-700' : 'text-gray-300'}`}>
        {isFilled ? (
          <span className="line-clamp-2">{value}</span>
        ) : (
          '—'
        )}
      </div>
    </button>
  );
}

// =============================================
// Composant principal
// =============================================

export function BriefForm({ onSubmit, onCancel, isSubmitting, error }: BriefFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    situation: '',
    consequences: '',
    affected_teams: [],
    outcome_type: '',
    outcome_description: '',
    constraints: {},
    resources: [],
  });

  // États pour les contraintes et ressources en cours d'ajout
  const [showConstraintPicker, setShowConstraintPicker] = useState(false);
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [activeConstraints, setActiveConstraints] = useState<ConstraintType[]>([]);

  const totalSteps = 9;

  // Navigation
  const goNext = () => setStep(Math.min(step + 1, totalSteps));
  const goBack = () => setStep(Math.max(step - 1, 1));
  const goToStep = (s: number) => setStep(s);

  // Mise à jour du formulaire
  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Gestion des contraintes
  const addConstraint = (type: ConstraintType) => {
    if (!activeConstraints.includes(type)) {
      setActiveConstraints([...activeConstraints, type]);
    }
    setShowConstraintPicker(false);
  };

  const removeConstraint = (type: ConstraintType) => {
    setActiveConstraints(activeConstraints.filter(c => c !== type));
    const newConstraints = { ...formData.constraints };
    delete newConstraints[type as keyof BriefConstraints];
    updateForm('constraints', newConstraints);
  };

  const updateConstraint = <K extends keyof BriefConstraints>(key: K, value: BriefConstraints[K]) => {
    updateForm('constraints', { ...formData.constraints, [key]: value });
  };

  // Gestion des ressources
  const addResource = (type: ResourceType) => {
    const newResource: BriefResource = { type };
    updateForm('resources', [...formData.resources, newResource]);
    setShowResourcePicker(false);
  };

  const removeResource = (index: number) => {
    const newResources = formData.resources.filter((_, i) => i !== index);
    updateForm('resources', newResources);
  };

  const updateResource = (index: number, updates: Partial<BriefResource>) => {
    const newResources = formData.resources.map((r, i) => 
      i === index ? { ...r, ...updates } : r
    );
    updateForm('resources', newResources);
  };

  // Soumission
  const handleSubmit = async () => {
    const data: BriefInsert = {
      name: formData.name,
      situation: formData.situation || null,
      consequences: formData.consequences || null,
      affected_teams: formData.affected_teams,
      outcome_type: formData.outcome_type || null,
      outcome_description: formData.outcome_description || null,
      constraints: Object.keys(formData.constraints).length > 0 ? formData.constraints : null,
      resources: formData.resources.length > 0 ? formData.resources : null,
    };
    await onSubmit(data);
  };

  // Formatage pour le récap
  const formatTeams = () => {
    return formData.affected_teams
      .map(value => TEAMS_LIST.find(t => t.value === value)?.label || value)
      .join(', ');
  };

  const formatOutcome = () => {
    if (!formData.outcome_type) return '';
    const config = OUTCOME_CONFIG[formData.outcome_type as OutcomeType];
    if (formData.outcome_description) {
      return `${config?.emoji} ${formData.outcome_description}`;
    }
    return `${config?.emoji} ${config?.label}`;
  };

  const formatConstraints = () => {
    const parts: string[] = [];
    if (formData.constraints.deadline) {
      parts.push(`⏰ ${DEADLINE_CONFIG[formData.constraints.deadline]?.label}`);
    }
    if (formData.constraints.budget) {
      parts.push(`💰 ${BUDGET_CONFIG[formData.constraints.budget]?.label}`);
    }
    if (formData.constraints.tool) {
      parts.push(`🔧 ${formData.constraints.tool}`);
    }
    if (formData.constraints.other) {
      parts.push(formData.constraints.other);
    }
    return parts.join(' • ') || '';
  };

  const formatResources = () => {
    if (formData.resources.length === 0) return '';
    return `${formData.resources.length} ressource${formData.resources.length > 1 ? 's' : ''}`;
  };

  // Calcul de la progression
  const filledCount = [
    formData.name,
    formData.situation,
    formData.consequences,
    formData.affected_teams.length > 0,
    formData.outcome_type,
  ].filter(Boolean).length;

  // =============================================
  // Rendu des étapes
  // =============================================

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContainer>
            <div className="text-center space-y-6">
              <div className="text-6xl">👋</div>
              <h2 className="text-2xl font-semibold text-gray-900">Bienvenue</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Tu vas décrire un problème à résoudre.<br />
                Pas besoin de proposer une solution — c'est notre job.
              </p>
              <Button size="lg" onClick={goNext} className="mt-4">
                C'est parti
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="Donne un nom à cette demande"
            helper="Un titre court qui résume le sujet"
          >
            <Input
              value={formData.name}
              onChange={(e) => updateForm('name', e.target.value)}
              placeholder="Ex: Suivi des prospects, Dashboard SEO..."
              className="text-lg"
              autoFocus
            />
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="Quelle est la situation actuelle ?"
            helper="Décris ce qui se passe aujourd'hui, concrètement."
          >
            <Textarea
              value={formData.situation}
              onChange={(e) => updateForm('situation', e.target.value)}
              placeholder="Ex: Les conseillers doivent jongler entre 3 outils pour retrouver les infos d'un prospect."
              className="min-h-[150px]"
              autoFocus
            />
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Lightbulb className="w-4 h-4" />
              Décris les faits, pas la solution souhaitée.
            </p>
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer
            title="Quelles sont les conséquences ?"
            helper="Qu'est-ce que ça provoque si on ne fait rien ?"
          >
            <Textarea
              value={formData.consequences}
              onChange={(e) => updateForm('consequences', e.target.value)}
              placeholder="Ex: Perte de temps, erreurs de suivi, prospects mal relancés, frustration de l'équipe."
              className="min-h-[150px]"
              autoFocus
            />
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer
            title="Qui est impacté par ce problème ?"
            helper="Sélectionne les équipes ou pôles concernés."
          >
            <TeamSelector
              value={formData.affected_teams}
              onChange={(teams) => updateForm('affected_teams', teams)}
            />
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer
            title="Si ce problème était résolu, qu'est-ce qui changerait ?"
          >
            <div className="space-y-4">
              <Select
                value={formData.outcome_type}
                onValueChange={(v) => updateForm('outcome_type', v as OutcomeType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type de résultat..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OUTCOME_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.emoji} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.outcome_type && (
                <Textarea
                  value={formData.outcome_description}
                  onChange={(e) => updateForm('outcome_description', e.target.value)}
                  placeholder={OUTCOME_CONFIG[formData.outcome_type as OutcomeType]?.placeholder}
                  className="min-h-[100px]"
                />
              )}

              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Pas besoin de chiffrer précisément, une direction suffit.
              </p>
            </div>
          </StepContainer>
        );

      case 7:
        return (
          <StepContainer
            title="Y a-t-il des contraintes à connaître ?"
            helper="Ajoute uniquement ce qui est pertinent."
          >
            <div className="space-y-4">
              {/* Contraintes ajoutées */}
              {activeConstraints.map((type) => (
                <ConstraintCard
                  key={type}
                  type={type}
                  value={formData.constraints}
                  onChange={updateConstraint}
                  onRemove={() => removeConstraint(type)}
                />
              ))}

              {/* Bouton ajouter */}
              {!showConstraintPicker ? (
                <Button
                  variant="outline"
                  onClick={() => setShowConstraintPicker(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une contrainte
                </Button>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">Quel type de contrainte ?</span>
                      <button onClick={() => setShowConstraintPicker(false)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {CONSTRAINT_TYPES
                        .filter(c => !activeConstraints.includes(c.value))
                        .map((constraint) => (
                          <button
                            key={constraint.value}
                            onClick={() => addConstraint(constraint.value)}
                            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                          >
                            <span>{constraint.emoji}</span>
                            <span className="text-sm">{constraint.label}</span>
                          </button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </StepContainer>
        );

      case 8:
        return (
          <StepContainer
            title="As-tu des ressources à partager ?"
            helper="Tout ce qui peut aider à comprendre le contexte : document, lien, maquette, exemple..."
          >
            <div className="space-y-4">
              {/* Ressources ajoutées */}
              {formData.resources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  resource={resource}
                  onChange={(updates) => updateResource(index, updates)}
                  onRemove={() => removeResource(index)}
                />
              ))}

              {/* Bouton ajouter */}
              {!showResourcePicker ? (
                <Button
                  variant="outline"
                  onClick={() => setShowResourcePicker(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une ressource
                </Button>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">Quel type de ressource ?</span>
                      <button onClick={() => setShowResourcePicker(false)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {RESOURCE_TYPES.map((resource) => (
                        <button
                          key={resource.value}
                          onClick={() => addResource(resource.value)}
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                          <span>{resource.emoji}</span>
                          <span className="text-sm">{resource.label}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </StepContainer>
        );

      case 9:
        return (
          <StepContainer title="Récap de ton brief">
            <div className="space-y-6">
              {/* Nom */}
              <RecapSection 
                label="Nom" 
                value={formData.name} 
                onEdit={() => goToStep(2)} 
              />

              {/* Problème */}
              <RecapSection 
                label="Situation actuelle" 
                value={formData.situation} 
                onEdit={() => goToStep(3)} 
              />

              {/* Conséquences */}
              <RecapSection 
                label="Conséquences" 
                value={formData.consequences} 
                onEdit={() => goToStep(4)} 
              />

              {/* Équipes */}
              <RecapSection 
                label="Équipes impactées" 
                value={formatTeams()} 
                onEdit={() => goToStep(5)} 
              />

              {/* Objectif */}
              {formData.outcome_type && (
                <RecapSection 
                  label="Objectif attendu" 
                  value={
                    <span>
                      {OUTCOME_CONFIG[formData.outcome_type as OutcomeType]?.emoji}{' '}
                      {formData.outcome_description || OUTCOME_CONFIG[formData.outcome_type as OutcomeType]?.label}
                    </span>
                  } 
                  onEdit={() => goToStep(6)} 
                />
              )}

              {/* Contraintes */}
              {Object.keys(formData.constraints).length > 0 && (
                <RecapSection 
                  label="Contraintes" 
                  value={
                    <ul className="list-disc list-inside text-sm">
                      {formData.constraints.deadline && (
                        <li>Délai : {DEADLINE_CONFIG[formData.constraints.deadline]?.label}</li>
                      )}
                      {formData.constraints.budget && (
                        <li>Budget : {BUDGET_CONFIG[formData.constraints.budget]?.label}</li>
                      )}
                      {formData.constraints.tool && (
                        <li>Outil : {formData.constraints.tool}</li>
                      )}
                      {formData.constraints.out_of_scope && (
                        <li>Hors périmètre : {formData.constraints.out_of_scope}</li>
                      )}
                      {formData.constraints.already_tried && (
                        <li>Déjà tenté : {formData.constraints.already_tried}</li>
                      )}
                      {formData.constraints.other && (
                        <li>Autre : {formData.constraints.other}</li>
                      )}
                    </ul>
                  } 
                  onEdit={() => goToStep(7)} 
                />
              )}

              {/* Ressources */}
              {formData.resources.length > 0 && (
                <RecapSection 
                  label="Ressources" 
                  value={
                    <ul className="list-disc list-inside text-sm">
                      {formData.resources.map((r, i) => (
                        <li key={i}>
                          {r.type === 'link' ? `🔗 ${r.url}` : `📝 ${r.content?.substring(0, 50)}...`}
                        </li>
                      ))}
                    </ul>
                  } 
                  onEdit={() => goToStep(8)} 
                />
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-center text-gray-600 mb-4">Ça te semble correct ?</p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={goBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.name}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Envoi...' : 'Envoyer le brief'}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  // =============================================
  // Sidebar Récap
  // =============================================

  const renderSidebar = () => {
    // Masquer sur écran 1 (bienvenue) et écran 9 (récap final)
    if (step === 1 || step === 9) return null;

    return (
      <div className="w-72 shrink-0 hidden lg:block">
        <div className="bg-white rounded-xl border p-4 sticky top-24 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            📋 Ton brief
          </h3>
          
          <div className="space-y-1">
            <RecapItem
              label="Nom"
              value={formData.name}
              stepNumber={2}
              isEmpty={!formData.name}
              currentStep={step}
              onNavigate={goToStep}
            />
            
            <RecapItem
              label="Situation"
              value={formData.situation}
              stepNumber={3}
              isEmpty={!formData.situation}
              currentStep={step}
              onNavigate={goToStep}
            />
            
            <RecapItem
              label="Conséquences"
              value={formData.consequences}
              stepNumber={4}
              isEmpty={!formData.consequences}
              currentStep={step}
              onNavigate={goToStep}
            />
            
            <RecapItem
              label="Équipes"
              value={formatTeams()}
              stepNumber={5}
              isEmpty={formData.affected_teams.length === 0}
              currentStep={step}
              onNavigate={goToStep}
            />
            
            <RecapItem
              label="Objectif"
              value={formatOutcome()}
              stepNumber={6}
              isEmpty={!formData.outcome_type}
              currentStep={step}
              onNavigate={goToStep}
            />
            
            <RecapItem
              label="Contraintes"
              value={formatConstraints()}
              stepNumber={7}
              isEmpty={Object.keys(formData.constraints).length === 0}
              currentStep={step}
              onNavigate={goToStep}
            />
            
            <RecapItem
              label="Ressources"
              value={formatResources()}
              stepNumber={8}
              isEmpty={formData.resources.length === 0}
              currentStep={step}
              onNavigate={goToStep}
            />
          </div>

          {/* Barre de progression */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Complété</span>
              <span className="font-medium">{filledCount}/5</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(filledCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =============================================
  // Rendu principal
  // =============================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Progress */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i + 1 === step 
                    ? 'bg-primary' 
                    : i + 1 < step 
                      ? 'bg-primary/40' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <span className="text-sm text-gray-500">
            {step}/{totalSteps}
          </span>
        </div>
      </header>

      {/* Contenu avec layout 2 colonnes */}
      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-5xl flex gap-8">
          {/* Zone formulaire (gauche) */}
          <div className="flex-1 flex items-start justify-center pt-8">
            <div className="w-full max-w-xl">
              {renderStep()}
            </div>
          </div>

          {/* Sidebar récap (droite) - masquée sur mobile */}
          {renderSidebar()}
        </div>
      </main>

      {/* Footer navigation (sauf écran 1 et 9) */}
      {step > 1 && step < 9 && (
        <footer className="bg-white border-t">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={goBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {(step === 7 || step === 8) && (
                <Button variant="ghost" onClick={goNext}>
                  Passer
                </Button>
              )}
              <Button 
                onClick={goNext}
                disabled={step === 2 && !formData.name}
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// =============================================
// Sous-composants
// =============================================

function StepContainer({ 
  title, 
  helper, 
  children 
}: { 
  title?: string; 
  helper?: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {helper && <p className="text-gray-500 text-sm">{helper}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function RecapSection({ 
  label, 
  value, 
  onEdit 
}: { 
  label: string; 
  value: React.ReactNode; 
  onEdit: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <button 
          onClick={onEdit}
          className="text-sm text-primary hover:underline"
        >
          Modifier
        </button>
      </div>
      <div className="text-gray-900">
        {value || <span className="text-gray-400 italic">Non renseigné</span>}
      </div>
    </div>
  );
}

function ConstraintCard({
  type,
  value,
  onChange,
  onRemove,
}: {
  type: ConstraintType;
  value: BriefConstraints;
  onChange: <K extends keyof BriefConstraints>(key: K, value: BriefConstraints[K]) => void;
  onRemove: () => void;
}) {
  const config = CONSTRAINT_TYPES.find(c => c.value === type);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium flex items-center gap-2">
            {config?.emoji} {config?.label}
          </span>
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {type === 'deadline' && (
          <div className="space-y-2">
            {Object.entries(DEADLINE_CONFIG).map(([key, conf]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deadline"
                  checked={value.deadline === key}
                  onChange={() => onChange('deadline', key as ConstraintDeadline)}
                  className="text-primary"
                />
                <span className="text-sm">{conf.label}</span>
              </label>
            ))}
          </div>
        )}

        {type === 'budget' && (
          <div className="space-y-2">
            {Object.entries(BUDGET_CONFIG).map(([key, conf]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="budget"
                  checked={value.budget === key}
                  onChange={() => onChange('budget', key as ConstraintBudget)}
                  className="text-primary"
                />
                <span className="text-sm">{conf.label}</span>
              </label>
            ))}
          </div>
        )}

        {type === 'tool' && (
          <Input
            value={value.tool || ''}
            onChange={(e) => onChange('tool', e.target.value)}
            placeholder="Doit fonctionner avec..."
          />
        )}

        {type === 'out_of_scope' && (
          <Input
            value={value.out_of_scope || ''}
            onChange={(e) => onChange('out_of_scope', e.target.value)}
            placeholder="On ne veut surtout pas..."
          />
        )}

        {type === 'already_tried' && (
          <Input
            value={value.already_tried || ''}
            onChange={(e) => onChange('already_tried', e.target.value)}
            placeholder="On a essayé... ça n'a pas marché parce que..."
          />
        )}

        {type === 'other' && (
          <Textarea
            value={value.other || ''}
            onChange={(e) => onChange('other', e.target.value)}
            placeholder="Autre contrainte à connaître..."
            className="min-h-[80px]"
          />
        )}
      </CardContent>
    </Card>
  );
}

function ResourceCard({
  resource,
  onChange,
  onRemove,
}: {
  resource: BriefResource;
  onChange: (updates: Partial<BriefResource>) => void;
  onRemove: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium flex items-center gap-2">
            {resource.type === 'link' ? (
              <>
                <LinkIcon className="w-4 h-4" /> Lien
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" /> Note
              </>
            )}
          </span>
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {resource.type === 'link' && (
          <div className="space-y-3">
            <Input
              value={resource.url || ''}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://..."
            />
            <Input
              value={resource.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Description (optionnel)"
            />
          </div>
        )}

        {resource.type === 'note' && (
          <Textarea
            value={resource.content || ''}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Ta note..."
            className="min-h-[100px]"
          />
        )}
      </CardContent>
    </Card>
  );
}
