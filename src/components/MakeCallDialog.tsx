import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import MakeCallForm from './MakeCallForm';
import { useMakeCallModal } from '@/hooks/useMakeCallModal';

export function MakeCallDialog() {
  const { isOpen, onClose } = useMakeCallModal();

  return (
    <Dialog open={isOpen} modal defaultOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-3xl mb-2 font-bold text-primary">
            Make a call
          </DialogTitle>
        </DialogHeader>
        <MakeCallForm />
        <DialogFooter>
          <DialogClose />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
