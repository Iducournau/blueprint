'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Link as LinkIcon,
  FileText,
  AlertCircle,
  DollarSign,
  Calendar,
  Ban,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Brief, 
  BriefStatus,
  BriefPriority,
  BRIEF_STATUS_CONFIG, 
  PRIORITY_CONFIG,
  OUTCOME_CONFIG,
  AFFECTED_TEAMS_OPTIONS,
  DEADLINE_CONFIG,
  BUDGET_CONFIG,
  OutcomeType,
  ConstraintDeadline,
  ConstraintBudget,
} from '@/lib/types';

export default function BriefDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const briefId = params.id as string;

  useEffect(() => {
    if (briefId) {
      fetchBrief();
    }
  }, [briefId]);

  async function fetchBrief() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', briefId)
      .single();

    if (error) {
      console.error('Erreur:', error);
      router.push('/briefs');
    } else {
      setBrief(data);
    }
    
    setLoading(false);
  }

  async function updateStatus(newStatus: BriefStatus) {
    if (!brief) return;
    
    setUpdating(true);
    
    const { error } = await supabase
      .from('briefs')
      .update({ status: newStatus })
      .eq('id', brief.id);

    if (!error) {
      setBrief({ ...brief, status: newStatus });
    }
    
    setUpdating(false);
  }

  async function updatePriority(newPriority: BriefPriority) {
    if (!brief) return;
    
    setUpdating(true);
    
    const { error } = await supabase
      .from('briefs')
      .update({ priority: newPriority })
      .eq('id', brief.id);

    if (!error) {
      setBrief({ ...brief, priority: newPriority });
    }
    
    setUpdating(false);
  }

  async function deleteBrief() {
    if (!brief) return;
    
    const { error } = await supabase
      .from('briefs')
      .delete()
      .eq('id', brief.id);

    if (!error) {
      router.push('/briefs');
    }
  }

  // Formater les équipes pour l'affichage
  function formatTeams(teams: string[]) {
    if (!teams || teams.length === 0) return [];
    
    return teams.map(t => {
      if (t.includes(':')) {
        const [parent, pole] = t.split(':');
        const parentOption = AFFECTED_TEAMS_OPTIONS.find(o => o.value === parent);
        const poleOption = parentOption?.poles?.find(p => p.value === t);
        return poleOption?.label || t;
      }
      return AFFECTED_TEAMS_OPTIONS.find(o => o.value === t)?.label || t;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!brief) {
    return null;
  }

  const outcomeConfig = brief.outcome_type ? OUTCOME_CONFIG[brief.outcome_type as OutcomeType] : null;
  const formattedTeams = formatTeams(brief.affected_teams || []);
  const constraints = brief.constraints as Record<string, string> | null;
  const resources = brief.resources as Array<{ type: string; url?: string; content?: string; description?: string }> | null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/briefs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux briefs
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer ce brief ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Le brief "{brief.name}" sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteBrief} className="bg-red-600 hover:bg-red-700">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Titre + Contrôles */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{brief.name}</h1>
          
          {/* Statut + Priorité */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Statut :</span>
              <Select 
                value={brief.status} 
                onValueChange={(v) => updateStatus(v as BriefStatus)}
                disabled={updating}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BRIEF_STATUS_CONFIG).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <span className={config.color}>{config.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Priorité :</span>
              <Select 
                value={brief.priority || ''} 
                onValueChange={(v) => updatePriority(v as BriefPriority)}
                disabled={updating}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="À définir" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.emoji} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Situation actuelle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                Situation actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brief.situation ? (
                <p className="text-gray-700 whitespace-pre-wrap">{brief.situation}</p>
              ) : (
                <p className="text-gray-400 italic">Non renseigné</p>
              )}
            </CardContent>
          </Card>

          {/* Conséquences */}
          {brief.consequences && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  Conséquences si on ne fait rien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{brief.consequences}</p>
              </CardContent>
            </Card>
          )}

          {/* Équipes impactées */}
          {formattedTeams.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Équipes impactées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formattedTeams.map((label, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Objectif attendu */}
          {outcomeConfig && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  Objectif attendu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{outcomeConfig.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900">{outcomeConfig.label}</p>
                    {brief.outcome_description && (
                      <p className="text-gray-600 mt-1">{brief.outcome_description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contraintes */}
          {constraints && Object.keys(constraints).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  Contraintes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {constraints.deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Délai :</span>
                      <span className="text-sm font-medium">
                        {DEADLINE_CONFIG[constraints.deadline as ConstraintDeadline]?.label}
                      </span>
                    </div>
                  )}
                  {constraints.budget && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Budget :</span>
                      <span className="text-sm font-medium">
                        {BUDGET_CONFIG[constraints.budget as ConstraintBudget]?.label}
                      </span>
                    </div>
                  )}
                  {constraints.tool && (
                    <div className="flex items-start gap-3">
                      <MoreHorizontal className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Outil imposé :</span>
                      <span className="text-sm">{constraints.tool}</span>
                    </div>
                  )}
                  {constraints.out_of_scope && (
                    <div className="flex items-start gap-3">
                      <Ban className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Hors périmètre :</span>
                      <span className="text-sm">{constraints.out_of_scope}</span>
                    </div>
                  )}
                  {constraints.already_tried && (
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Déjà tenté :</span>
                      <span className="text-sm">{constraints.already_tried}</span>
                    </div>
                  )}
                  {constraints.other && (
                    <div className="flex items-start gap-3">
                      <MoreHorizontal className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Autre :</span>
                      <span className="text-sm">{constraints.other}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ressources */}
          {resources && resources.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Ressources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {resource.type === 'link' ? (
                        <>
                          <LinkIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              {resource.url}
                            </a>
                            {resource.description && (
                              <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-700">{resource.content}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Propositions (Sprint 2) */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                Propositions de solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Aucune proposition pour le moment</p>
                <p className="text-sm text-gray-400">
                  Les propositions seront ajoutées après analyse du brief
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métadonnées */}
        <div className="mt-8 pt-6 border-t text-sm text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Créé le {new Date(brief.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </main>
    </div>
  );
}
