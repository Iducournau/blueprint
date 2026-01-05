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
  MoreHorizontal,
  Plus,
  Lightbulb,
  Rocket
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
import { ProposalCard } from '@/components/briefs/ProposalCard';
import { ProposalForm } from '@/components/briefs/ProposalForm';
import { SelectProposalDialog } from '@/components/briefs/SelectProposalDialog';
import { 
  Brief,
  BriefProposal,
  BriefProposalInsert,
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
  const [proposals, setProposals] = useState<BriefProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [editingProposal, setEditingProposal] = useState<BriefProposal | null>(null);
  const [selectingProposal, setSelectingProposal] = useState<BriefProposal | null>(null);
  const [showSelectDialog, setShowSelectDialog] = useState(false);
  const [converting, setConverting] = useState(false);

  const briefId = params.id as string;

  useEffect(() => {
    if (briefId) {
      fetchBrief();
      fetchProposals();
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

  async function fetchProposals() {
    const { data, error } = await supabase
      .from('brief_proposals')
      .select('*')
      .eq('brief_id', briefId)
      .order('created_at', { ascending: true });

    if (!error) {
      setProposals(data || []);
    }
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

  // === PROPOSITIONS ===

  async function handleAddProposal(data: BriefProposalInsert) {
    const { error } = await supabase
      .from('brief_proposals')
      .insert(data);

    if (!error) {
      fetchProposals();
      // Passer le statut en "analyzing" si c'est la première proposition
      if (brief?.status === 'pending_analysis') {
        updateStatus('analyzing');
      }
    }
  }

  async function handleUpdateProposal(data: BriefProposalInsert) {
    if (!editingProposal) return;

    const { error } = await supabase
      .from('brief_proposals')
      .update({
        name: data.name,
        description: data.description,
        format: data.format,
        effort: data.effort,
        pros: data.pros,
        cons: data.cons,
      })
      .eq('id', editingProposal.id);

    if (!error) {
      fetchProposals();
    }
    setEditingProposal(null);
  }

  async function handleDeleteProposal(id: string) {
    if (!confirm('Supprimer cette proposition ?')) return;

    const { error } = await supabase
      .from('brief_proposals')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchProposals();
    }
  }

  async function handleSelectProposal(reason: string) {
    if (!selectingProposal) return;

    // Désélectionner toutes les autres propositions
    await supabase
      .from('brief_proposals')
      .update({ is_selected: false, selection_reason: null })
      .eq('brief_id', briefId);

    // Sélectionner celle-ci
    const { error } = await supabase
      .from('brief_proposals')
      .update({ 
        is_selected: true, 
        selection_reason: reason || null 
      })
      .eq('id', selectingProposal.id);

    if (!error) {
      // Mettre à jour le statut du brief
      updateStatus('proposals_ready');
      fetchProposals();
    }
    setSelectingProposal(null);
  }

  // === CONVERSION EN PROJET ===

  async function handleConvertToProject() {
    if (!brief) return;

    const selectedProposal = proposals.find(p => p.is_selected);
    if (!selectedProposal) return;

    setConverting(true);

    // Récupérer l'utilisateur
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setConverting(false);
      return;
    }

    // Créer le projet
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name: selectedProposal.name,
        description: selectedProposal.description || brief.situation,
        type: 'outil', // Par défaut, à adapter
        has_modules: false,
        status: 'cadrage',
        brief_id: brief.id,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (!error && project) {
      // Mettre à jour le statut du brief
      await supabase
        .from('briefs')
        .update({ status: 'validated' })
        .eq('id', brief.id);

      // Rediriger vers le projet
      router.push(`/project/${project.id}`);
    }

    setConverting(false);
  }

  // Formater les équipes pour l'affichage
  function formatTeams(teams: string[]) {
    if (!teams || teams.length === 0) return [];
    
    return teams.map(t => {
      if (t.includes(':')) {
        const [parent] = t.split(':');
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
  const selectedProposal = proposals.find(p => p.is_selected);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-16 z-10">
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
                  {(Object.entries(BRIEF_STATUS_CONFIG) as [BriefStatus, typeof BRIEF_STATUS_CONFIG[BriefStatus]][]).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <span className={`inline-flex items-center gap-2 ${config.color}`}>
                        {config.label}
                      </span>
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
                  <SelectValue placeholder="Non définie" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PRIORITY_CONFIG) as [BriefPriority, typeof PRIORITY_CONFIG[BriefPriority]][]).map(([value, config]) => (
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

          {/* ====== SECTION PROPOSITIONS ====== */}
          <Card className={selectedProposal ? 'border-green-200 bg-green-50/30' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-gray-500" />
                  Propositions de solutions
                  {proposals.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      ({proposals.length})
                    </span>
                  )}
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setEditingProposal(null);
                    setShowProposalForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {proposals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Lightbulb className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <p className="mb-2">Aucune proposition pour le moment</p>
                  <p className="text-sm text-gray-400">
                    Ajoutez des propositions de solutions après analyse du brief
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onSelect={() => {
                        setSelectingProposal(proposal);
                        setShowSelectDialog(true);
                      }}
                      onEdit={() => {
                        setEditingProposal(proposal);
                        setShowProposalForm(true);
                      }}
                      onDelete={() => handleDeleteProposal(proposal.id)}
                      disabled={brief.status === 'validated'}
                    />
                  ))}
                </div>
              )}

              {/* Bouton Convertir en projet */}
              {selectedProposal && brief.status !== 'validated' && (
                <div className="mt-6 pt-6 border-t border-green-200">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleConvertToProject}
                    disabled={converting}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    {converting ? 'Conversion en cours...' : 'Convertir en projet'}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    La proposition "{selectedProposal.name}" sera convertie en projet
                  </p>
                </div>
              )}
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

      {/* Form Proposition */}
      <ProposalForm
        open={showProposalForm}
        onOpenChange={setShowProposalForm}
        briefId={briefId}
        proposal={editingProposal}
        onSubmit={editingProposal ? handleUpdateProposal : handleAddProposal}
      />

      {/* Dialog Sélection */}
      <SelectProposalDialog
        open={showSelectDialog}
        onOpenChange={setShowSelectDialog}
        proposal={selectingProposal}
        onConfirm={handleSelectProposal}
      />
    </div>
  );
}
