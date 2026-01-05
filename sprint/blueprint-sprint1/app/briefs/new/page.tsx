'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BriefForm } from '@/components/briefs/BriefForm';
import { BriefInsert } from '@/lib/brief-types';

export default function NewBriefPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Insérer le brief
      const { data: brief, error: insertError } = await supabase
        .from('briefs')
        .insert({
          ...data,
          created_by: user.id,
          status: 'pending_analysis',
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
    <div className="min-h-screen bg-gray-50">
      <BriefForm 
        onSubmit={handleSubmit}
        onCancel={() => router.push('/briefs')}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
