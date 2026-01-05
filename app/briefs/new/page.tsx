'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BriefForm } from '@/components/briefs/BriefForm';
import { BriefInsert } from '@/lib/types';
import TeamSelector from '@/components/briefs/TeamSelector';

export default function NewBriefPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affectedUsers, setAffectedUsers] = useState<string[]>([])

  async function handleSubmit(data: BriefInsert) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Récupérer l'utilisateur courant
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Vous devez être connecté pour soumettre un brief.');
        setIsSubmitting(false);
        return;
      }

      // Insérer le brief avec la nouvelle structure
      const { data: brief, error: insertError } = await supabase
        .from('briefs')
        .insert({
          name: data.name,
          situation: data.situation,
          consequences: data.consequences,
          affected_teams: data.affected_teams,
          outcome_type: data.outcome_type,
          outcome_description: data.outcome_description,
          constraints: data.constraints,
          resources: data.resources,
          status: 'pending_analysis',
          created_by: user.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur insertion:', insertError);
        setError('Une erreur est survenue lors de la création du brief.');
        setIsSubmitting(false);
        return;
      }

      // Rediriger vers la page du brief
      router.push(`/briefs/${brief.id}`);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue est survenue.');
      setIsSubmitting(false);
    }
  }

  return (
    <BriefForm 
      onSubmit={handleSubmit}
      onCancel={() => router.push('/briefs')}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
