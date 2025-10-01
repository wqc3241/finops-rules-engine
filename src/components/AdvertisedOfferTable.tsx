import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAdvertisedOffers } from "@/hooks/useAdvertisedOffers";
import { AdvertisedOffer } from "@/types/advertisedOffer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AdvertisedOfferTableProps {
  onEdit?: (offer: AdvertisedOffer) => void;
}

const AdvertisedOfferTable = ({ onEdit }: AdvertisedOfferTableProps) => {
  const { offers, loading, deleteOffer } = useAdvertisedOffers();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => 
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === offers.length) {
      setSelectedItems([]);
    } else {
      const allIds = offers.map((item) => item.id);
      setSelectedItems(allIds);
    }
  };

  const handleEdit = (offer: AdvertisedOffer) => {
    if (onEdit) {
      onEdit(offer);
    }
  };

  const handleCopy = (offer: AdvertisedOffer) => {
    toast.info('Copy functionality coming soon');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      await deleteOffer(id);
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden border rounded-md">
      <Table className="min-w-full">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px] px-2">
              <Checkbox
                checked={selectedItems.length === offers.length && offers.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Offer Name</TableHead>
            <TableHead>Program Code</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>APR</TableHead>
            <TableHead>Monthly Payment</TableHead>
            <TableHead>Credit Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No advertised offers found. Create your first offer to get started.
              </TableCell>
            </TableRow>
          ) : (
            offers.map((offer) => (
              <TableRow key={offer.id} className="hover:bg-muted/50">
                <TableCell className="px-2">
                  <Checkbox
                    checked={selectedItems.includes(offer.id)}
                    onCheckedChange={() => handleSelectItem(offer.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{offer.offer_name}</TableCell>
                <TableCell>{offer.financial_program_code}</TableCell>
                <TableCell>{offer.order_type}</TableCell>
                <TableCell>{offer.term} months</TableCell>
                <TableCell>{offer.apr ? `${offer.apr}%` : 'N/A'}</TableCell>
                <TableCell>{offer.monthly_payment ? `$${offer.monthly_payment}` : 'N/A'}</TableCell>
                <TableCell>
                  {offer.credit_score_min && offer.credit_score_max 
                    ? `${offer.credit_score_min}-${offer.credit_score_max}`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={offer.is_active ? "default" : "secondary"}>
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(offer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleCopy(offer)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(offer.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdvertisedOfferTable;
