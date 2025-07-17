import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DealStructureItem } from '@/types/application';

type RequestedDealFormValues = {
  termLength: string;
  mileageAllowance?: string;
  downPayment: string;
};

interface EditRequestedDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RequestedDealFormValues) => void;
  currentData: DealStructureItem[];
  applicationType?: 'Lease' | 'Loan';
}

const EditRequestedDealDialog: React.FC<EditRequestedDealDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentData,
  applicationType = 'Lease'
}) => {
  const getFieldValue = (fieldName: string) => {
    const item = currentData.find(item => 
      item.name.toLowerCase().includes(fieldName.toLowerCase())
    );
    return item?.value || '';
  };

  const defaultValues: RequestedDealFormValues = {
    termLength: getFieldValue('term'),
    mileageAllowance: applicationType === 'Lease' ? getFieldValue('mileage') : undefined,
    downPayment: getFieldValue('down') || getFieldValue('payment')
  };

  const { register, handleSubmit, reset } = useForm<RequestedDealFormValues>({
    defaultValues
  });

  const onSubmit = (data: RequestedDealFormValues) => {
    onSave(data);
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Requested Deal Parameters</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="termLength">Term Length (months)</Label>
            <Input
              id="termLength"
              {...register('termLength', { required: true })}
              placeholder="36"
            />
          </div>

          {applicationType === 'Lease' && (
            <div>
              <Label htmlFor="mileageAllowance">Mileage Allowance (per year)</Label>
              <Input
                id="mileageAllowance"
                {...register('mileageAllowance')}
                placeholder="12,000"
              />
            </div>
          )}

          <div>
            <Label htmlFor="downPayment">
              {applicationType === 'Lease' ? 'Due at Signing' : 'Down Payment'}
            </Label>
            <Input
              id="downPayment"
              {...register('downPayment', { required: true })}
              placeholder="$2,500"
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestedDealDialog;