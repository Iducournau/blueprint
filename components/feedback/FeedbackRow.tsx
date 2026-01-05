'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreHorizontal, Trash2, ChevronRight, Eye } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetBody,  // ✅ AJOUT
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Feedback, FeedbackStatus, FEEDBACK_CATEGORIES, FEEDBACK_COLUMNS } from '@/lib/feedback-types';

interface FeedbackRowProps {
  feedback: Feedback;
  onStatusChange: (id: string, newStatus: FeedbackStatus) => void;
  onDelete: (id: string) => void;
}

export function FeedbackRow({ feedback, onStatusChange, onDelete }: FeedbackRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailSheet, setShowDetailSheet] = useState(false);

  const categoryInfo = FEEDBACK_CATEGORIES.find((c) => c.value === feedback.category);
  const statusInfo = FEEDBACK_COLUMNS.find((c) => c.id === feedback.status);

  const handleDelete = () => {
    onDelete(feedback.id);
    setShowDeleteDialog(false);
  };

  // Récupérer l'email de l'auteur (depuis le champ user_email ou profiles)
  const authorEmail = feedback.user_email || 'Utilisateur inconnu';
  const authorName = authorEmail.split('@')[0];

  return (
    <>
      {/* Ligne du tableau */}
      <tr 
        className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
        onClick={() => setShowDetailSheet(true)}
      >
        {/* Catégorie */}
        <td className="p-4">
          <Badge variant="secondary" className="text-xs font-normal">
            {categoryInfo?.label || feedback.category}
          </Badge>
        </td>

        {/* Titre */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium line-clamp-1">{feedback.title}</span>
            {feedback.description && (
              <Eye className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </td>

        {/* Auteur */}
        <td className="p-4 text-sm text-muted-foreground">
          {authorName}
        </td>

        {/* Date */}
        <td className="p-4 text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(feedback.created_at), {
            addSuffix: true,
            locale: fr,
          })}
        </td>

        {/* Actions */}
        <td className="p-4" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowDetailSheet(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Voir le détail
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {FEEDBACK_COLUMNS.filter(col => col.id !== feedback.status).map((col) => (
                <DropdownMenuItem 
                  key={col.id}
                  onClick={() => onStatusChange(feedback.id, col.id)}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Marquer {col.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Sheet de détail */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{categoryInfo?.label}</Badge>
              <Badge variant="outline">{statusInfo?.label}</Badge>
            </div>
            <SheetTitle className="text-xl">{feedback.title}</SheetTitle>
            <SheetDescription>
              Par {authorName} · {formatDistanceToNow(new Date(feedback.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </SheetDescription>
          </SheetHeader>

          {/* ✅ CHANGEMENT : SheetBody au lieu de div */}
          <SheetBody className="space-y-6">
            {/* Description */}
            {feedback.description ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm whitespace-pre-wrap">{feedback.description}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Pas de description</p>
            )}

            {/* Changer le statut */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Statut</h4>
              <Select
                value={feedback.status}
                onValueChange={(value) => onStatusChange(feedback.id, value as FeedbackStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_COLUMNS.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setShowDetailSheet(false);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>

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
