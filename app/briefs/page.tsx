'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BriefCard } from '@/components/briefs/BriefCard';
import { Brief, BriefStatus, BRIEF_STATUS_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | BriefStatus;

export default function BriefsPage() {
  const router = useRouter();
  
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    fetchBriefs();
  }, []);

  async function fetchBriefs() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des briefs:', error);
    } else {
      setBriefs(data || []);
    }
    
    setLoading(false);
  }

  // Filtrer les briefs selon le statut sélectionné
  const filteredBriefs = filter === 'all' 
    ? briefs 
    : briefs.filter(brief => brief.status === filter);

  // Compter les briefs par statut
  const counts = {
    all: briefs.length,
    pending_analysis: briefs.filter(b => b.status === 'pending_analysis').length,
    analyzing: briefs.filter(b => b.status === 'analyzing').length,
    proposals_ready: briefs.filter(b => b.status === 'proposals_ready').length,
    validated: briefs.filter(b => b.status === 'validated').length,
  };

  const tabs = [
    { value: 'all', label: 'Tous', count: counts.all },
    { value: 'pending_analysis', label: 'En attente', count: counts.pending_analysis },
    { value: 'analyzing', label: 'En analyse', count: counts.analyzing },
    { value: 'proposals_ready', label: 'Propositions', count: counts.proposals_ready },
    { value: 'validated', label: 'Validés', count: counts.validated },
  ];

  return (
    <div className="p-8">
      {/* Header avec titre et actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-dm-serif text-3xl text-foreground">Briefs</h1>
          <p className="text-muted-foreground mt-1">Les problèmes à analyser</p>
        </div>
        <Button onClick={() => router.push('/briefs/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau brief
        </Button>
      </div>

      {/* Tabs inline */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as FilterStatus)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              filter === tab.value
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            <span className={cn(
              'ml-2 px-1.5 py-0.5 rounded-full text-xs',
              filter === tab.value
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}>
              {tab.count}
            </span>
            {filter === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Liste des briefs */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      ) : filteredBriefs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {filter === 'all' 
              ? 'Aucun brief pour le moment' 
              : `Aucun brief "${BRIEF_STATUS_CONFIG[filter as BriefStatus]?.label}"`
            }
          </p>
          <Button variant="outline" onClick={() => router.push('/briefs/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Créer le premier brief
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBriefs.map((brief) => (
            <BriefCard 
              key={brief.id} 
              brief={brief} 
              onClick={() => router.push(`/briefs/${brief.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
