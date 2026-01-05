'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackRow } from '@/components/feedback/FeedbackRow';
import { Feedback, FeedbackStatus, FEEDBACK_COLUMNS } from '@/lib/feedback-types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabFilter = 'all' | FeedbackStatus;

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  // Charger les feedbacks
  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  // Changer le statut d'un feedback
  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      );

      toast.success('Statut mis à jour');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Supprimer un feedback
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      toast.success('Feedback supprimé');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Charger au montage
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Écouter les changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('feedbacks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedbacks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFeedbacks((prev) => [payload.new as Feedback, ...prev]);
            toast.info('Nouveau feedback reçu !');
          } else if (payload.eventType === 'UPDATE') {
            setFeedbacks((prev) =>
              prev.map((f) =>
                f.id === payload.new.id ? (payload.new as Feedback) : f
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setFeedbacks((prev) =>
              prev.filter((f) => f.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtrer les feedbacks selon le tab actif
  const filteredFeedbacks = activeTab === 'all' 
    ? feedbacks 
    : feedbacks.filter((f) => f.status === activeTab);

  // Compter par statut
  const getCounts = (status: FeedbackStatus) => 
    feedbacks.filter((f) => f.status === status).length;

  // Définir les tabs
  const tabs: { id: TabFilter; label: string; count: number }[] = [
    { id: 'all', label: 'Tous', count: feedbacks.length },
    ...FEEDBACK_COLUMNS.map((col) => ({
      id: col.id as TabFilter,
      label: col.label,
      count: getCounts(col.id),
    })),
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-dm-serif text-3xl text-foreground">Feedbacks</h1>
          <p className="text-muted-foreground mt-1">
            {feedbacks.length} feedback{feedbacks.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button variant="outline" onClick={loadFeedbacks} disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Actualiser
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex gap-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-2 px-2 py-0.5 rounded-full text-xs",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tableau */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun feedback {activeTab !== 'all' && 'dans cette catégorie'}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Titre</th>
                <th className="p-4 font-medium">Auteur</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <FeedbackRow
                  key={feedback.id}
                  feedback={feedback}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}