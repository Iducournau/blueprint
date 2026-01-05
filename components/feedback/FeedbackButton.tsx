'use client';

import { useState } from 'react';
import { MessageSquarePlus, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { FEEDBACK_CATEGORIES, FeedbackCategory } from '@/lib/feedback-types';
import { toast } from 'sonner';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('autre');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('autre');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Tu dois être connecté pour soumettre un feedback');
        return;
      }

      // Insérer le feedback
      const { data: feedback, error } = await supabase
        .from('feedbacks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Envoyer l'email de notification
      await fetch('/api/feedback-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: feedback.id,
          title: feedback.title,
          description: feedback.description,
          category: feedback.category,
          userEmail: user.email,
        }),
      });

      toast.success('Feedback envoyé ! Merci 🙏');
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi du feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Envoyer un feedback"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              Envoyer un feedback
            </DialogTitle>
            <DialogDescription>
              Partage tes retours, bugs ou idées d'amélioration.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                placeholder="Résume ton feedback en une phrase"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as FeedbackCategory)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Donne plus de détails si nécessaire..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}