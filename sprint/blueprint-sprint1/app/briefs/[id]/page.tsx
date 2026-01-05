'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  AlertCircle,
  Clock,
  FileText,
  Lightbulb,
  Target,
  MessageSquare
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
  BRIEF_STATUS_CONFIG, 
  URGENCY_CONFIG,
  AFFECTED_USERS_OPTIONS,
  BriefUrgency
} from '@/lib/brief-types';

export default function BriefDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  
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

  const statusConfig = BRIEF_STATUS_CONFIG[brief.status as BriefStatus];
  const urgencyConfig = URGENCY_CONFIG[brief.urgency as BriefUrgency];
  const affectedLabels = brief.affected_users
    ?.map(u => AFFECTED_USERS_OPTIONS.find(o => o.value === u)?.label)
    .filter(Boolean);

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
        {/* Titre + Statut */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-semibold text-gray-900">{brief.name}</h1>
            <div className="flex items-center gap-2">
              {brief.urgency !== 'normal' && (
                <StatusBadge
                  label={urgencyConfig.label}
                  color={urgencyConfig.color}
                  bgColor={urgencyConfig.bgColor}
                  icon={brief.urgency === 'high' || brief.urgency === 'critical' ? AlertCircle : undefined}
                  size="md"
                />
              )}
            </div>
          </div>
          
          {/* Sélecteur de statut */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Statut :</span>
            <Select 
              value={brief.status} 
              onValueChange={(v) => updateStatus(v as BriefStatus)}
              disabled={updating}
            >
              <SelectTrigger className="w-[220px]">
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
        </div>

        <div className="grid gap-6">
          {/* Problème */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                Problème à résoudre
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brief.problem ? (
                <p className="text-gray-700 whitespace-pre-wrap">{brief.problem}</p>
              ) : (
                <p className="text-gray-400 italic">Non renseigné</p>
              )}
            </CardContent>
          </Card>

          {/* Personnes impactées */}
          {affectedLabels && affectedLabels.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Personnes impactées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {affectedLabels.map((label, i) => (
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

          {/* Impact */}
          {brief.impact && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  Impact actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{brief.impact}</p>
              </CardContent>
            </Card>
          )}

          {/* Contraintes */}
          {brief.constraints && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Contraintes connues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{brief.constraints}</p>
              </CardContent>
            </Card>
          )}

          {/* Idée initiale */}
          {brief.initial_idea && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-gray-500" />
                  Idée initiale du demandeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{brief.initial_idea}</p>
              </CardContent>
            </Card>
          )}

          {/* Contexte */}
          {brief.context && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  Contexte additionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{brief.context}</p>
              </CardContent>
            </Card>
          )}

          {/* Section Propositions (Sprint 2) */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gray-500" />
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
