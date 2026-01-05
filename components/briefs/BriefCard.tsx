'use client';

import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Brief, 
  BriefStatus, 
  BriefPriority,
  BRIEF_STATUS_CONFIG, 
  PRIORITY_CONFIG,
  OUTCOME_CONFIG,
  OutcomeType,
} from '@/lib/types';
import { Clock, Users } from 'lucide-react';

interface BriefCardProps {
  brief: Brief;
  onClick?: () => void;
}

export function BriefCard({ brief, onClick }: BriefCardProps) {
  const statusConfig = BRIEF_STATUS_CONFIG[brief.status as BriefStatus];
  const priorityConfig = brief.priority ? PRIORITY_CONFIG[brief.priority as BriefPriority] : null;
  const outcomeConfig = brief.outcome_type ? OUTCOME_CONFIG[brief.outcome_type as OutcomeType] : null;

  // Compter les équipes (sans les pôles pour simplifier l'affichage)
  const teamCount = brief.affected_teams?.filter(t => !t.includes(':')).length || 0;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Titre */}
            <h3 className="font-semibold text-gray-900 truncate mb-1">
              {brief.name}
            </h3>

            {/* Situation (aperçu) */}
            {brief.situation && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {brief.situation}
              </p>
            )}

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {/* Date */}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(brief.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>

              {/* Équipes */}
              {teamCount > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {teamCount} équipe{teamCount > 1 ? 's' : ''}
                </span>
              )}

              {/* Outcome */}
              {outcomeConfig && (
                <span className="flex items-center gap-1">
                  {outcomeConfig.emoji}
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-2">
            <StatusBadge
              label={statusConfig.label}
              color={statusConfig.color}
              bgColor={statusConfig.bgColor}
            />
            
            {priorityConfig && (
              <span className="text-xs">
                {priorityConfig.emoji}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
