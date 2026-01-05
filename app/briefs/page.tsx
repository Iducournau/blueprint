'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BriefCard } from '@/components/briefs/BriefCard';
import { Brief, BriefStatus, BRIEF_STATUS_CONFIG } from '@/lib/types';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Briefs</h1>
              <p className="text-sm text-gray-500 mt-1">
                Les problèmes à analyser
              </p>
            </div>
            <Button onClick={() => router.push('/briefs/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau brief
            </Button>
          </div>
        </div>
      </header>

      {/* Filtres */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
          <TabsList>
            <TabsTrigger value="all">
              Tous ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="pending_analysis">
              En attente ({counts.pending_analysis})
            </TabsTrigger>
            <TabsTrigger value="analyzing">
              En analyse ({counts.analyzing})
            </TabsTrigger>
            <TabsTrigger value="proposals_ready">
              Propositions ({counts.proposals_ready})
            </TabsTrigger>
            <TabsTrigger value="validated">
              Validés ({counts.validated})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Liste des briefs */}
      <main className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Chargement...</div>
          </div>
        ) : filteredBriefs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
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
      </main>
    </div>
  );
}
