'use client';

import { Feedback, FeedbackStatus, FEEDBACK_COLUMNS } from '@/lib/feedback-types';
import { FeedbackCard } from './FeedbackCard';

interface FeedbackKanbanProps {
  feedbacks: Feedback[];
  onStatusChange: (id: string, newStatus: FeedbackStatus) => void;
  onDelete: (id: string) => void;
}

export function FeedbackKanban({ feedbacks, onStatusChange, onDelete }: FeedbackKanbanProps) {
  const getFeedbacksByStatus = (status: FeedbackStatus) => {
    return feedbacks.filter((f) => f.status === status);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {FEEDBACK_COLUMNS.map((column) => {
        const columnFeedbacks = getFeedbacksByStatus(column.id);
        
        return (
          <div key={column.id} className="flex flex-col">
            {/* Header de colonne */}
            <div className={`mb-4 rounded-lg border-2 p-3 ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.label}</h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-sm font-medium">
                  {columnFeedbacks.length}
                </span>
              </div>
            </div>

            {/* Liste des feedbacks */}
            <div className="flex flex-col gap-3">
              {columnFeedbacks.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
                  Aucun feedback
                </div>
              ) : (
                columnFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
