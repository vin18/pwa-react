import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useEditHistory } from '@/hooks/useEditCallHistory';
import EditDialogForm from './EditDialogForm';

export function EditCallerInfoDialog({ setCalls }) {
  const { isOpen, onClose, data: clientDetailsData } = useEditHistory();
  console.log('clientDetailsData', clientDetailsData);
  if (!clientDetailsData?.data) return null;

  return (
    <Dialog open={isOpen} modal defaultOpen={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-3xl mb-2 font-bold text-primary">
            Edit Details for {clientDetailsData.data.clientid}
          </DialogTitle>
        </DialogHeader>
        <EditDialogForm
          clientDetailsData={clientDetailsData.data}
          setCalls={setCalls}
        />
        <DialogFooter>
          <DialogClose />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
