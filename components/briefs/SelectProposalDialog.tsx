'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BriefProposal } from '@/lib/types';

interface SelectProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: BriefProposal | null;
  onConfirm: (reason: string) => Promise<void>;
}

export function SelectProposalDialog({ 
  open, 
  onOpenChange, 
  proposal,
  onConfirm 
}: SelectProposalDialogProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(reason);
    setReason('');
    setLoading(false);
    onOpenChange(false);
  };

  if (!proposal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sélectionner cette solution ?</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de retenir la proposition "{proposal.name}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du choix (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Expliquez pourquoi cette solution a été retenue..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Cette information sera conservée pour traçabilité.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'En cours...' : 'Confirmer le choix'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
