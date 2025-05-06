
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
import { Textarea } from "@/components/ui/textarea";

interface AddAdvertisedOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddAdvertisedOfferModal = ({ isOpen, onClose, onSave }: AddAdvertisedOfferModalProps) => {
  const [formData, setFormData] = useState({
    bulletinPricing: "",
    disclosure: "",
    loanAmountPer10k: "",
    totalCostOfCredit: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      bulletinPricing: "",
      disclosure: "",
      loanAmountPer10k: "",
      totalCostOfCredit: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Advertised Offer</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new advertised offer.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bulletinPricing">Bulletin Pricing</Label>
              <Input
                id="bulletinPricing"
                name="bulletinPricing"
                value={formData.bulletinPricing}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="disclosure">Disclosure</Label>
              <Textarea
                id="disclosure"
                name="disclosure"
                value={formData.disclosure}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="loanAmountPer10k">Loan Amount per $10000</Label>
                <Input
                  id="loanAmountPer10k"
                  name="loanAmountPer10k"
                  value={formData.loanAmountPer10k}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="totalCostOfCredit">Loan Total Cost of Credit</Label>
                <Input
                  id="totalCostOfCredit"
                  name="totalCostOfCredit"
                  value={formData.totalCostOfCredit}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Offer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdvertisedOfferModal;
