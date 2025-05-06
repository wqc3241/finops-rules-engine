
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
import { Checkbox } from "@/components/ui/checkbox";

interface AddPricingRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddPricingRuleModal = ({ isOpen, onClose, onSave }: AddPricingRuleModalProps) => {
  const [formData, setFormData] = useState({
    bulletinId: "",
    programName: "",
    pricingConfig: "",
    pricingType: "",
    advertised: false,
    pricingValue: "",
    lenderList: "",
    geoCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      advertised: checked,
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
      bulletinId: "",
      programName: "",
      pricingConfig: "",
      pricingType: "",
      advertised: false,
      pricingValue: "",
      lenderList: "",
      geoCode: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Bulletin Pricing Rule</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new bulletin pricing rule.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bulletinId">Bulletin ID</Label>
                <Input
                  id="bulletinId"
                  name="bulletinId"
                  value={formData.bulletinId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="programName">Financial Program</Label>
                <Input
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="pricingConfig">Pricing Config</Label>
                <Input
                  id="pricingConfig"
                  name="pricingConfig"
                  value={formData.pricingConfig}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="pricingType">Pricing Type</Label>
                <Input
                  id="pricingType"
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="pricingValue">Pricing Value</Label>
                <Input
                  id="pricingValue"
                  name="pricingValue"
                  value={formData.pricingValue}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lenderList">Lender List</Label>
                <Input
                  id="lenderList"
                  name="lenderList"
                  value={formData.lenderList}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="geoCode">Geo Code</Label>
                <Input
                  id="geoCode"
                  name="geoCode"
                  value={formData.geoCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-end space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="advertised"
                    checked={formData.advertised}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="advertised">Advertised</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPricingRuleModal;
