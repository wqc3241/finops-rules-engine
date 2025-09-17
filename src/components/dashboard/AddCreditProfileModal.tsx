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

interface AddCreditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddCreditProfileModal = ({ isOpen, onClose, onSave }: AddCreditProfileModalProps) => {
  const [formData, setFormData] = useState({
    profile_id: "",
    priority: "",
    min_credit_score: "",
    max_credit_score: "",
    min_income: "",
    max_income: "",
    min_age: "",
    max_age: "",
    min_pti: "",
    max_pti: "",
    min_dti: "",
    max_dti: "",
    employment_type: "",
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
        profile_id: formData.profile_id,
        priority: formData.priority ? parseInt(formData.priority) : null,
        min_credit_score: formData.min_credit_score ? parseInt(formData.min_credit_score) : null,
        max_credit_score: formData.max_credit_score ? parseInt(formData.max_credit_score) : null,
        min_income: formData.min_income ? parseFloat(formData.min_income) : null,
        max_income: formData.max_income ? parseFloat(formData.max_income) : null,
        min_age: formData.min_age ? parseInt(formData.min_age) : null,
        max_age: formData.max_age ? parseInt(formData.max_age) : null,
        min_pti: formData.min_pti ? parseFloat(formData.min_pti) : null,
        max_pti: formData.max_pti ? parseFloat(formData.max_pti) : null,
        min_dti: formData.min_dti ? parseFloat(formData.min_dti) : null,
        max_dti: formData.max_dti ? parseFloat(formData.max_dti) : null,
        employment_type: formData.employment_type || null,
      };

      const { error } = await supabase
        .from('credit_profiles')
        .insert(dataToInsert);

      if (error) throw error;

      toast.success('Credit profile created successfully');
      resetForm();
      onClose();
      onSave(); // Refresh the data in parent component
    } catch (error) {
      console.error('Error creating credit profile:', error);
      toast.error('Failed to create credit profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      profile_id: "",
      priority: "",
      min_credit_score: "",
      max_credit_score: "",
      min_income: "",
      max_income: "",
      min_age: "",
      max_age: "",
      min_pti: "",
      max_pti: "",
      min_dti: "",
      max_dti: "",
      employment_type: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Credit Profile</DialogTitle>
            <DialogDescription>
              Create a new credit profile with the specified criteria.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profile_id">Profile ID *</Label>
                <Input
                  id="profile_id"
                  name="profile_id"
                  value={formData.profile_id}
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
                <Label htmlFor="min_credit_score">Min Credit Score</Label>
                <Input
                  id="min_credit_score"
                  name="min_credit_score"
                  type="number"
                  value={formData.min_credit_score}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_credit_score">Max Credit Score</Label>
                <Input
                  id="max_credit_score"
                  name="max_credit_score"
                  type="number"
                  value={formData.max_credit_score}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_income">Min Income</Label>
                <Input
                  id="min_income"
                  name="min_income"
                  type="number"
                  step="0.01"
                  value={formData.min_income}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_income">Max Income</Label>
                <Input
                  id="max_income"
                  name="max_income"
                  type="number"
                  step="0.01"
                  value={formData.max_income}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_age">Min Age</Label>
                <Input
                  id="min_age"
                  name="min_age"
                  type="number"
                  value={formData.min_age}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_age">Max Age</Label>
                <Input
                  id="max_age"
                  name="max_age"
                  type="number"
                  value={formData.max_age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_pti">Min PTI</Label>
                <Input
                  id="min_pti"
                  name="min_pti"
                  type="number"
                  step="0.01"
                  value={formData.min_pti}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_pti">Max PTI</Label>
                <Input
                  id="max_pti"
                  name="max_pti"
                  type="number"
                  step="0.01"
                  value={formData.max_pti}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="min_dti">Min DTI</Label>
                <Input
                  id="min_dti"
                  name="min_dti"
                  type="number"
                  step="0.01"
                  value={formData.min_dti}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_dti">Max DTI</Label>
                <Input
                  id="max_dti"
                  name="max_dti"
                  type="number"
                  step="0.01"
                  value={formData.max_dti}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Input
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                placeholder="e.g., Full-time, Part-time, Self-employed"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Credit Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCreditProfileModal;