'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronRight, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Brief, 
  BRIEF_STATUS_CONFIG, 
  URGENCY_CONFIG,
  BriefStatus,
  BriefUrgency 
} from '@/lib/brief-types';

interface BriefCardProps {
  brief: Brief;
  onClick?: () => void;
}

export function BriefCard({ brief, onClick }: BriefCardProps) {
  const statusConfig = BRIEF_STATUS_CONFIG[brief.status as BriefStatus];
  const urgencyConfig = URGENCY_CONFIG[brief.urgency as BriefUrgency];
  
  const timeAgo = formatDistanceToNow(new Date(brief.created_at), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Titre + badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-medium text-gray-900 truncate">
                {brief.name}
              </h3>
              <StatusBadge
                label={statusConfig.label}
                color={statusConfig.color}
                bgColor={statusConfig.bgColor}
              />
              {brief.urgency !== 'normal' && (
                <StatusBadge
                  label={urgencyConfig.label}
                  color={urgencyConfig.color}
                  bgColor={urgencyConfig.bgColor}
                  icon={brief.urgency === 'high' || brief.urgency === 'critical' ? AlertCircle : undefined}
                />
              )}
            </div>

            {/* Description du problème (tronquée) */}
            {brief.problem && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {brief.problem}
              </p>
            )}

            {/* Métadonnées */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{timeAgo}</span>
              {brief.affected_users && brief.affected_users.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {brief.affected_users.length} groupe{brief.affected_users.length > 1 ? 's' : ''} impacté{brief.affected_users.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Flèche */}
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
