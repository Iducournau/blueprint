'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreHorizontal, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Feedback, FeedbackStatus, FEEDBACK_CATEGORIES, FEEDBACK_COLUMNS } from '@/lib/feedback-types';

interface FeedbackCardProps {
  feedback: Feedback;
  onStatusChange: (id: string, newStatus: FeedbackStatus) => void;
  onDelete: (id: string) => void;
}

export function FeedbackCard({ feedback, onStatusChange, onDelete }: FeedbackCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const categoryInfo = FEEDBACK_CATEGORIES.find((c) => c.value === feedback.category);
  const currentColumnIndex = FEEDBACK_COLUMNS.findIndex((c) => c.id === feedback.status);
  
  const canMoveLeft = currentColumnIndex > 0;
  const canMoveRight = currentColumnIndex < FEEDBACK_COLUMNS.length - 1;

  const moveLeft = () => {
    if (canMoveLeft) {
      onStatusChange(feedback.id, FEEDBACK_COLUMNS[currentColumnIndex - 1].id);
    }
  };

  const moveRight = () => {
    if (canMoveRight) {
      onStatusChange(feedback.id, FEEDBACK_COLUMNS[currentColumnIndex + 1].id);
    }
  };

  const handleDelete = () => {
    onDelete(feedback.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium leading-tight line-clamp-2">{feedback.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canMoveLeft && (
                  <DropdownMenuItem onClick={moveLeft}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Déplacer vers {FEEDBACK_COLUMNS[currentColumnIndex - 1].label}
                  </DropdownMenuItem>
                )}
                {canMoveRight && (
                  <DropdownMenuItem onClick={moveRight}>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Déplacer vers {FEEDBACK_COLUMNS[currentColumnIndex + 1].label}
                  </DropdownMenuItem>
                )}
                {(canMoveLeft || canMoveRight) && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {feedback.description && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
              {feedback.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {categoryInfo?.label || feedback.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(feedback.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce feedback ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le feedback "{feedback.title}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
