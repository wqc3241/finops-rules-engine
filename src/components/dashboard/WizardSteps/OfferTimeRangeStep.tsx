import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { AdvertisedOfferWizardData } from '@/types/advertisedOffer';

interface OfferTimeRangeStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const OfferTimeRangeStep = ({ data, onUpdate }: OfferTimeRangeStepProps) => {
  const handleDateChange = (field: 'offer_start_date' | 'offer_end_date', value: string) => {
    onUpdate({ [field]: value });
  };

  const isEndDateValid = () => {
    if (!data.offer_start_date || !data.offer_end_date) return true;
    return new Date(data.offer_end_date) >= new Date(data.offer_start_date);
  };

  const calculateDuration = () => {
    if (!data.offer_start_date || !data.offer_end_date || !isEndDateValid()) return null;
    const start = new Date(data.offer_start_date);
    const end = new Date(data.offer_end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const duration = calculateDuration();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Calendar className="w-5 h-5" />
        <p>Define the time range for your advertised offers</p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="offer_start_date" className="text-base font-medium">
              Offer Start Date
            </Label>
            <Input
              id="offer_start_date"
              type="date"
              value={data.offer_start_date}
              onChange={(e) => handleDateChange('offer_start_date', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer_end_date" className="text-base font-medium">
              Offer End Date
            </Label>
            <Input
              id="offer_end_date"
              type="date"
              value={data.offer_end_date}
              onChange={(e) => handleDateChange('offer_end_date', e.target.value)}
              min={data.offer_start_date}
              className="w-full"
            />
            {!isEndDateValid() && (
              <p className="text-sm text-destructive">
                End date must be after start date
              </p>
            )}
          </div>
        </div>

        {duration !== null && isEndDateValid() && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Offer Duration</p>
            <p className="text-2xl font-bold text-primary">{duration} days</p>
          </div>
        )}
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Financial programs within this date range will be available for selection in the next step.</p>
      </div>
    </div>
  );
};

export default OfferTimeRangeStep;
