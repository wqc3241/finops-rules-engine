import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddPricingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddPricingConfigModal = ({ isOpen, onClose, onSave }: AddPricingConfigModalProps) => {
  const [formData, setFormData] = useState({
    pricing_rule_id: "",
    min_ltv: "",
    max_ltv: "",
    min_term: "",
    max_term: "",
    min_lease_mileage: "",
    max_lease_mileage: "",
    priority: "",
    mark_up_percent: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for database, converting empty strings to null for numeric fields
      const dataToInsert = {
        pricing_rule_id: formData.pricing_rule_id,
        min_ltv: formData.min_ltv ? parseFloat(formData.min_ltv) : null,
        max_ltv: formData.max_ltv ? parseFloat(formData.max_ltv) : null,
        min_term: formData.min_term ? parseInt(formData.min_term) : null,
        max_term: formData.max_term ? parseInt(formData.max_term) : null,
        min_lease_mileage: formData.min_lease_mileage ? parseInt(formData.min_lease_mileage) : null,
        max_lease_mileage: formData.max_lease_mileage ? parseInt(formData.max_lease_mileage) : null,
        priority: formData.priority ? parseInt(formData.priority) : null,
        "Mark Up Percent": formData.mark_up_percent ? parseFloat(formData.mark_up_percent) : null,
      };

      const { error } = await supabase
        .from('pricing_configs')
        .insert(dataToInsert);

      if (error) throw error;

      toast.success('Pricing configuration created successfully');
      resetForm();
      onClose();
      onSave(); // Refresh the data in parent component
    } catch (error) {
      console.error('Error creating pricing config:', error);
      toast.error('Failed to create pricing configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pricing_rule_id: "",
      min_ltv: "",
      max_ltv: "",
      min_term: "",
      max_term: "",
      min_lease_mileage: "",
      max_lease_mileage: "",
      priority: "",
      mark_up_percent: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Pricing Configuration</DialogTitle>
            <DialogDescription>
              Create a new pricing configuration with the specified parameters.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="pricing_rule_id">Pricing Rule ID *</Label>
                <Input
                  id="pricing_rule_id"
                  name="pricing_rule_id"
                  value={formData.pricing_rule_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  value={formData.priority}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_ltv">Min LTV</Label>
                <Input
                  id="min_ltv"
                  name="min_ltv"
                  type="number"
                  step="0.01"
                  value={formData.min_ltv}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_ltv">Max LTV</Label>
                <Input
                  id="max_ltv"
                  name="max_ltv"
                  type="number"
                  step="0.01"
                  value={formData.max_ltv}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_term">Min Term</Label>
                <Input
                  id="min_term"
                  name="min_term"
                  type="number"
                  value={formData.min_term}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_term">Max Term</Label>
                <Input
                  id="max_term"
                  name="max_term"
                  type="number"
                  value={formData.max_term}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_lease_mileage">Min Lease Mileage</Label>
                <Input
                  id="min_lease_mileage"
                  name="min_lease_mileage"
                  type="number"
                  value={formData.min_lease_mileage}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_lease_mileage">Max Lease Mileage</Label>
                <Input
                  id="max_lease_mileage"
                  name="max_lease_mileage"
                  type="number"
                  value={formData.max_lease_mileage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mark_up_percent">Mark Up Percent</Label>
              <Input
                id="mark_up_percent"
                name="mark_up_percent"
                type="number"
                step="0.01"
                value={formData.mark_up_percent}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Pricing Config'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPricingConfigModal;