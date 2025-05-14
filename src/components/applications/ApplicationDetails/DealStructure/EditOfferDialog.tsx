
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

type CustomerParamFormValues = {
  termLength: string;
  mileageAllowance?: string;
  downPayment: string;
  apr?: string;
};

interface EditOfferDialogProps {
  defaultValues: CustomerParamFormValues;
  onSubmit: (data: CustomerParamFormValues) => void;
  onCancel: () => void;
  applicationType?: 'Lease' | 'Loan';
}

const EditOfferDialog: React.FC<EditOfferDialogProps> = ({ 
  defaultValues, 
  onSubmit, 
  onCancel,
  applicationType = 'Lease'
}) => {
  const form = useForm<CustomerParamFormValues>({
    defaultValues
  });

  const isLoan = applicationType === 'Loan';

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Customer Parameters</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="termLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term Length (months)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          {!isLoan && (
            <FormField
              control={form.control}
              name="mileageAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage Allowance</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="downPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isLoan ? "Down Payment" : "CCR/Down Payment"}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {isLoan && (
            <FormField
              control={form.control}
              name="apr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>APR</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default EditOfferDialog;
