
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddRuleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (rule: any) => void;
}

const AddRuleModal = ({ open, onClose, onSave }: AddRuleModalProps) => {
  const [formData, setFormData] = useState({
    id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    priority: 1,
    minCreditScore: 0,
    maxCreditScore: 0,
    minIncome: 0,
    maxIncome: 0,
    minAge: 0,
    maxAge: 0,
    minPTI: 0,
    maxPTI: 0,
    minDTI: 0,
    maxDTI: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('min') || name.includes('max') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">Profile ID</Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minCreditScore">Min Credit Score</Label>
              <Input
                id="minCreditScore"
                name="minCreditScore"
                type="number"
                value={formData.minCreditScore}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCreditScore">Max Credit Score</Label>
              <Input
                id="maxCreditScore"
                name="maxCreditScore"
                type="number"
                value={formData.maxCreditScore}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minIncome">Min Income</Label>
              <Input
                id="minIncome"
                name="minIncome"
                type="number"
                value={formData.minIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxIncome">Max Income</Label>
              <Input
                id="maxIncome"
                name="maxIncome"
                type="number"
                value={formData.maxIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAge">Min Age</Label>
              <Input
                id="minAge"
                name="minAge"
                type="number"
                value={formData.minAge}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAge">Max Age</Label>
              <Input
                id="maxAge"
                name="maxAge"
                type="number"
                value={formData.maxAge}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPTI">Min PTI (%)</Label>
              <Input
                id="minPTI"
                name="minPTI"
                type="number"
                value={formData.minPTI}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPTI">Max PTI (%)</Label>
              <Input
                id="maxPTI"
                name="maxPTI"
                type="number"
                value={formData.maxPTI}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minDTI">Min DTI (%)</Label>
              <Input
                id="minDTI"
                name="minDTI"
                type="number"
                value={formData.minDTI}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDTI">Max DTI (%)</Label>
              <Input
                id="maxDTI"
                name="maxDTI"
                type="number"
                value={formData.maxDTI}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRuleModal;
