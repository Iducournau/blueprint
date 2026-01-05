'use client';

import { Check, Edit, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BriefProposal, EFFORT_CONFIG } from '@/lib/types';

interface ProposalCardProps {
  proposal: BriefProposal;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function ProposalCard({ 
  proposal, 
  onSelect, 
  onEdit, 
  onDelete,
  disabled = false 
}: ProposalCardProps) {
  const effortConfig = EFFORT_CONFIG[proposal.effort];

  return (
    <Card className={`relative transition-all ${
      proposal.is_selected 
        ? 'ring-2 ring-green-500 bg-green-50/50' 
        : 'hover:shadow-md'
    }`}>
      {/* Badge sélectionné */}
      {proposal.is_selected && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
      )}

      <CardContent className="p-5">
        {/* Header : Nom + Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{proposal.name}</h3>
            {proposal.format && (
              <span className="text-sm text-gray-500">{proposal.format}</span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 ml-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onEdit}
              disabled={disabled}
            >
              <Edit className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onDelete}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {proposal.description && (
          <p className="text-sm text-gray-600 mb-4">{proposal.description}</p>
        )}

        {/* Effort */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Effort :</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded ${effortConfig.bgColor} ${effortConfig.color}`}>
            {effortConfig.label}
          </span>
        </div>

        {/* Avantages / Limites */}
        <div className="grid md:grid-cols-2 gap-4">
          {proposal.pros && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-green-600">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase">Avantages</span>
              </div>
              <p className="text-sm text-gray-600">{proposal.pros}</p>
            </div>
          )}
          {proposal.cons && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-orange-600">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase">Limites</span>
              </div>
              <p className="text-sm text-gray-600">{proposal.cons}</p>
            </div>
          )}
        </div>

        {/* Raison du choix si sélectionné */}
        {proposal.is_selected && proposal.selection_reason && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-green-700">
              <span className="font-medium">Raison du choix :</span> {proposal.selection_reason}
            </p>
          </div>
        )}

        {/* Bouton sélectionner */}
        {!proposal.is_selected && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onSelect}
              disabled={disabled}
            >
              <Check className="w-4 h-4 mr-2" />
              Sélectionner cette solution
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
