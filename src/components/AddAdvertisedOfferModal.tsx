
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddAdvertisedOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddAdvertisedOfferModal = ({
  isOpen,
  onClose,
  onSave,
}: AddAdvertisedOfferModalProps) => {
  const [formData, setFormData] = useState({
    bulletinPricing: "",
    disclosure: "",
    loanAmountPer10k: "",
    totalCostOfCredit: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      bulletinPricing: "",
      disclosure: "",
      loanAmountPer10k: "",
      totalCostOfCredit: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Advertised Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="bulletinPricing">Bulletin Pricing</Label>
            <Input
              id="bulletinPricing"
              name="bulletinPricing"
              value={formData.bulletinPricing}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="disclosure">Disclosure</Label>
            <Textarea
              id="disclosure"
              name="disclosure"
              value={formData.disclosure}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="loanAmountPer10k">Loan Amount per $10,000</Label>
            <Input
              id="loanAmountPer10k"
              name="loanAmountPer10k"
              value={formData.loanAmountPer10k}
              onChange={handleChange}
              placeholder="e.g. $186.43/month"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="totalCostOfCredit">Total Cost of Credit</Label>
            <Input
              id="totalCostOfCredit"
              name="totalCostOfCredit"
              value={formData.totalCostOfCredit}
              onChange={handleChange}
              placeholder="e.g. $1,345.80"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdvertisedOfferModal;
