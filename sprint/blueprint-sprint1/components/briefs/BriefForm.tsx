'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BriefInsert, 
  BriefUrgency, 
  AFFECTED_USERS_OPTIONS 
} from '@/lib/brief-types';

interface BriefFormProps {
  onSubmit: (data: BriefInsert) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

// Structure des données du formulaire
interface FormData {
  name: string;
  problem: string;
  affected_users: string[];
  impact: string;
  constraints: string;
  initial_idea: string;
  urgency: BriefUrgency;
  context: string;
}

const TOTAL_STEPS = 10;

export function BriefForm({ onSubmit, onCancel, isSubmitting, error }: BriefFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    problem: '',
    affected_users: [],
    impact: '',
    constraints: '',
    initial_idea: '',
    urgency: 'normal',
    context: '',
  });

  const progress = (step / TOTAL_STEPS) * 100;

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  function handleSubmit() {
    onSubmit({
      name: formData.name,
      problem: formData.problem || null,
      affected_users: formData.affected_users,
      impact: formData.impact || null,
      constraints: formData.constraints || null,
      initial_idea: formData.initial_idea || null,
      urgency: formData.urgency,
      context: formData.context || null,
    });
  }

  function toggleAffectedUser(value: string) {
    const current = formData.affected_users;
    if (current.includes(value)) {
      updateField('affected_users', current.filter(u => u !== value));
    } else {
      updateField('affected_users', [...current, value]);
    }
  }

  // Déterminer si on peut passer à l'étape suivante
  function canProceed(): boolean {
    switch (step) {
      case 2: return formData.name.trim().length > 0;
      default: return true;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <div className="text-sm text-gray-500">
            Étape {step} sur {TOTAL_STEPS}
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <Progress value={progress} className="h-1" />
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            {/* Écran 1 : Intro */}
            {step === 1 && (
              <StepContent
                title="Bienvenue 👋"
                subtitle="Tu as identifié un problème à résoudre ? C'est le bon endroit."
              >
                <p className="text-gray-600 mb-6">
                  Ce formulaire va te guider pour décrire ton besoin en quelques minutes.
                  L'objectif : nous aider à comprendre le problème, pas la solution.
                </p>
                <p className="text-gray-500 text-sm">
                  Aucun champ n'est obligatoire. Réponds simplement à ce que tu sais.
                </p>
              </StepContent>
            )}

            {/* Écran 2 : Nom du brief */}
            {step === 2 && (
              <StepContent
                title="Donne un nom à cette demande"
                subtitle="Un titre court pour identifier ce brief"
              >
                <Input
                  placeholder="Ex: Tableau de bord SEO, Automatisation des rapports..."
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </StepContent>
            )}

            {/* Écran 3 : Problème */}
            {step === 3 && (
              <StepContent
                title="Quel problème cherches-tu à résoudre ?"
                subtitle="Décris la situation actuelle et ce qui ne fonctionne pas"
              >
                <Textarea
                  placeholder="Ex: Aujourd'hui, notre équipe passe 3h par semaine à compiler manuellement les données SEO depuis 5 outils différents..."
                  value={formData.problem}
                  onChange={(e) => updateField('problem', e.target.value)}
                  className="min-h-[150px]"
                  autoFocus
                />
              </StepContent>
            )}

            {/* Écran 4 : Qui est impacté */}
            {step === 4 && (
              <StepContent
                title="Qui souffre de ce problème ?"
                subtitle="Sélectionne les personnes ou équipes impactées"
              >
                <div className="grid grid-cols-2 gap-3">
                  {AFFECTED_USERS_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.affected_users.includes(option.value)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        checked={formData.affected_users.includes(option.value)}
                        onCheckedChange={() => toggleAffectedUser(option.value)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </StepContent>
            )}

            {/* Écran 5 : Impact */}
            {step === 5 && (
              <StepContent
                title="Quel est l'impact aujourd'hui ?"
                subtitle="Temps perdu, erreurs, frustrations, coûts..."
              >
                <Textarea
                  placeholder="Ex: Perte de temps estimée à 4h/semaine par personne. Les décisions sont parfois prises sur des données incomplètes..."
                  value={formData.impact}
                  onChange={(e) => updateField('impact', e.target.value)}
                  className="min-h-[150px]"
                  autoFocus
                />
              </StepContent>
            )}

            {/* Écran 6 : Contraintes */}
            {step === 6 && (
              <StepContent
                title="Y a-t-il des contraintes à connaître ?"
                subtitle="Budget, délais, outils imposés, règles métier..."
                optional
              >
                <Textarea
                  placeholder="Ex: Doit fonctionner avec nos outils actuels (Semrush, GA4). Budget limité à 0€ pour les outils..."
                  value={formData.constraints}
                  onChange={(e) => updateField('constraints', e.target.value)}
                  className="min-h-[120px]"
                  autoFocus
                />
              </StepContent>
            )}

            {/* Écran 7 : Idée en tête */}
            {step === 7 && (
              <StepContent
                title="Tu as peut-être déjà une idée ?"
                subtitle="Si tu imagines une solution, partage-la ici"
                optional
              >
                <Textarea
                  placeholder="Ex: Je pensais à un dashboard qui agrège toutes les données au même endroit..."
                  value={formData.initial_idea}
                  onChange={(e) => updateField('initial_idea', e.target.value)}
                  className="min-h-[120px]"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  Note : cette idée sera prise en compte, mais d'autres solutions pourront être proposées.
                </p>
              </StepContent>
            )}

            {/* Écran 8 : Urgence */}
            {step === 8 && (
              <StepContent
                title="C'est urgent ?"
                subtitle="Aide-nous à prioriser"
              >
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(v) => updateField('urgency', v as BriefUrgency)}
                  className="space-y-3"
                >
                  {[
                    { value: 'low', label: 'Pas pressé', description: 'Peut attendre quelques semaines' },
                    { value: 'normal', label: 'Normal', description: 'À traiter dans les prochaines semaines' },
                    { value: 'high', label: 'Urgent', description: 'Besoin d\'une réponse rapide' },
                    { value: 'critical', label: 'Critique', description: 'Bloque une activité importante' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.urgency === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value={option.value} className="mt-0.5" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </StepContent>
            )}

            {/* Écran 9 : Contexte */}
            {step === 9 && (
              <StepContent
                title="Autre chose qu'on devrait savoir ?"
                subtitle="Contexte, historique, tentatives précédentes..."
                optional
              >
                <Textarea
                  placeholder="Ex: On avait essayé un outil similaire l'année dernière mais c'était trop complexe..."
                  value={formData.context}
                  onChange={(e) => updateField('context', e.target.value)}
                  className="min-h-[120px]"
                  autoFocus
                />
              </StepContent>
            )}

            {/* Écran 10 : Récap */}
            {step === 10 && (
              <StepContent
                title="Récapitulatif"
                subtitle="Vérifie que tout est correct avant d'envoyer"
              >
                <div className="space-y-4 text-sm">
                  <RecapItem label="Nom" value={formData.name} />
                  <RecapItem label="Problème" value={formData.problem} />
                  <RecapItem 
                    label="Impactés" 
                    value={formData.affected_users.length > 0 
                      ? formData.affected_users
                          .map(u => AFFECTED_USERS_OPTIONS.find(o => o.value === u)?.label)
                          .join(', ')
                      : undefined
                    } 
                  />
                  <RecapItem label="Impact" value={formData.impact} />
                  <RecapItem label="Contraintes" value={formData.constraints} />
                  <RecapItem label="Idée initiale" value={formData.initial_idea} />
                  <RecapItem 
                    label="Urgence" 
                    value={{
                      low: 'Pas pressé',
                      normal: 'Normal',
                      high: 'Urgent',
                      critical: 'Critique',
                    }[formData.urgency]} 
                  />
                  <RecapItem label="Contexte" value={formData.context} />
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </StepContent>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              {step < TOTAL_STEPS ? (
                <div className="flex gap-2">
                  {/* Bouton "Passer" pour les champs optionnels */}
                  {[6, 7, 9].includes(step) && (
                    <Button variant="ghost" onClick={nextStep}>
                      Passer
                    </Button>
                  )}
                  <Button onClick={nextStep} disabled={!canProceed()}>
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      Soumettre le brief
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Composant pour le contenu d'une étape
function StepContent({ 
  title, 
  subtitle, 
  optional,
  children 
}: { 
  title: string; 
  subtitle: string; 
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">
        {subtitle}
        {optional && <span className="text-gray-400 ml-1">(optionnel)</span>}
      </p>
      {children}
    </div>
  );
}

// Composant pour une ligne du récap
function RecapItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-28 flex-shrink-0 font-medium text-gray-700">{label}</div>
      <div className="text-gray-600 flex-1">
        {value || <span className="text-gray-400 italic">Non renseigné</span>}
      </div>
    </div>
  );
}
