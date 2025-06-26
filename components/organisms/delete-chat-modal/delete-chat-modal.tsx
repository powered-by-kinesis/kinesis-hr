import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteChat: (id: number) => void;
  id: number;
  isDeleteLoading: boolean;
}

export function DeleteChatModal({
  isOpen,
  onOpenChange,
  onDeleteChat,
  id,
  isDeleteLoading,
}: DeleteChatModalProps) {
  const handleDeleteChat = () => {
    onDeleteChat(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-4">
          <Button
            className="cursor-pointer bg-card"
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isDeleteLoading}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={handleDeleteChat}
            disabled={isDeleteLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
