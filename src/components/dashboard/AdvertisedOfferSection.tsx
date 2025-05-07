
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdvertisedOfferTable from "../AdvertisedOfferTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdvertisedOfferSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
}

const AdvertisedOfferSection = ({ 
  title, 
  showAddModal = false, 
  setShowAddModal = () => {} 
}: AdvertisedOfferSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localShowAddModal, setLocalShowAddModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    name: "",
    offerType: "",
    amount: ""
  });
  
  // Use either the prop or local state
  const effectiveShowAddModal = showAddModal || localShowAddModal;
  const effectiveSetShowAddModal = (show: boolean) => {
    setShowAddModal(show);
    setLocalShowAddModal(show);
  };
  
  const handleAddClick = () => {
    effectiveSetShowAddModal(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New advertised offer added: ${newOffer.name}`);
    setNewOffer({ name: "", offerType: "", amount: "" });
    effectiveSetShowAddModal(false);
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <AdvertisedOfferTable />}
      
      <Dialog open={effectiveShowAddModal} onOpenChange={effectiveSetShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Advertised Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newOffer.name}
                  onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="offerType" className="text-right">Offer Type</Label>
                <Input
                  id="offerType"
                  value={newOffer.offerType}
                  onChange={(e) => setNewOffer({...newOffer, offerType: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newOffer.amount}
                  onChange={(e) => setNewOffer({...newOffer, amount: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Offer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvertisedOfferSection;
