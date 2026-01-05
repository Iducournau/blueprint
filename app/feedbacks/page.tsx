'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackKanban } from '@/components/feedback';
import { Feedback, FeedbackStatus } from '@/lib/feedback-types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Mettre à jour localement
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

      // Retirer de la liste locale
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

  // Écouter les nouveaux feedbacks en temps réel
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

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-3xl font-semibold">Feedbacks</h1>
            <p className="text-muted-foreground">
              {feedbacks.length} feedback{feedbacks.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={loadFeedbacks} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Kanban */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <FeedbackKanban
          feedbacks={feedbacks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}