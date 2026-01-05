'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { BriefProposal, BriefProposalInsert, EffortLevel, EFFORT_CONFIG } from '@/lib/types';

interface ProposalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  briefId: string;
  proposal?: BriefProposal | null;
  onSubmit: (data: BriefProposalInsert) => Promise<void>;
}

export function ProposalForm({ 
  open, 
  onOpenChange, 
  briefId, 
  proposal, 
  onSubmit 
}: ProposalFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: '',
    effort: 'medium' as EffortLevel,
    pros: '',
    cons: '',
  });

  // Reset form when opening or when proposal changes
  useEffect(() => {
    if (open) {
      if (proposal) {
        setFormData({
          name: proposal.name || '',
          description: proposal.description || '',
          format: proposal.format || '',
          effort: proposal.effort || 'medium',
          pros: proposal.pros || '',
          cons: proposal.cons || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          format: '',
          effort: 'medium',
          pros: '',
          cons: '',
        });
      }
    }
  }, [open, proposal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    setLoading(true);
    
    await onSubmit({
      brief_id: briefId,
      name: formData.name,
      description: formData.description || null,
      format: formData.format || null,
      effort: formData.effort,
      pros: formData.pros || null,
      cons: formData.cons || null,
    });

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {proposal ? 'Modifier la proposition' : 'Nouvelle proposition'}
          </SheetTitle>
          <SheetDescription>
            Proposez une solution pour ce brief
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la proposition *</Label>
            <Input
              id="name"
              placeholder="Ex: Dashboard Analytics Webmarketing"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez la solution proposée..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Format / Type de livrable</Label>
            <Input
              id="format"
              placeholder="Ex: Module Hub, Landing Page, Dashboard..."
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            />
          </div>

          {/* Effort */}
          <div className="space-y-2">
            <Label>Niveau d'effort</Label>
            <Select 
              value={formData.effort} 
              onValueChange={(v) => setFormData({ ...formData, effort: v as EffortLevel })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(EFFORT_CONFIG) as [EffortLevel, typeof EFFORT_CONFIG[EffortLevel]][]).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    <span className={`${config.color}`}>● </span>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Avantages */}
          <div className="space-y-2">
            <Label htmlFor="pros">Avantages</Label>
            <Textarea
              id="pros"
              placeholder="Points forts de cette solution..."
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
              rows={2}
            />
          </div>

          {/* Limites */}
          <div className="space-y-2">
            <Label htmlFor="cons">Limites</Label>
            <Textarea
              id="cons"
              placeholder="Points de vigilance, compromis..."
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
              rows={2}
            />
          </div>

          <SheetFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? 'Enregistrement...' : (proposal ? 'Mettre à jour' : 'Ajouter')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
