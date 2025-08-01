import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DealStructureItem } from '@/types/application';
import { usePresentedLender } from '@/utils/dealFinanceNavigation';
import { useParams } from 'react-router-dom';
import { generateStandardParams } from './utils/offerUtils';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';
import { Check, X } from 'lucide-react';

interface OfferParametersProps {
  items: DealStructureItem[];
  isCustomer?: boolean;
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  section?: 'requested' | 'approved' | 'customer';
  onViewFinancialSummary?: () => void;
  markAsPresented?: boolean;
  isEditMode?: boolean;
  onSaveEdit?: (updatedItems: DealStructureItem[]) => void;
  onCancelEdit?: () => void;
}

const OfferParameters: React.FC<OfferParametersProps> = ({
  items,
  isCustomer = false,
  applicationType = 'Lease',
  lenderName,
  section,
  onViewFinancialSummary,
  markAsPresented = false,
  isEditMode = false,
  onSaveEdit,
  onCancelEdit
}) => {
  const [editValues, setEditValues] = useState<{[key: string]: string}>({});
  
  const {
    id: applicationId
  } = useParams<{
    id: string;
  }>();
  const {
    navigateToFinancialSection: navigateToFinancialSummary,
    presentedLender
  } = useDealFinancialNavigation();
  
  // Define which fields are editable
  const editableFields = ['Term Length', 'Mileage Allowance', 'Down Payment'];
  
  // Check if a field is editable based on its label
  const isFieldEditable = (label: string) => {
    return editableFields.some(editableField => 
      label.toLowerCase().includes(editableField.toLowerCase()) ||
      (editableField === 'Term Length' && label.toLowerCase().includes('term')) ||
      (editableField === 'Mileage Allowance' && label.toLowerCase().includes('mileage')) ||
      (editableField === 'Down Payment' && (label.toLowerCase().includes('down') || label.toLowerCase().includes('due')))
    );
  };
  
  // Initialize edit values when entering edit mode
  useEffect(() => {
    if (isEditMode) {
      const standardParams = generateStandardParams(items, applicationType);
      const initialValues: {[key: string]: string} = {};
      standardParams.forEach(param => {
        if (isFieldEditable(param.label)) {
          // Extract numeric values from formatted strings
          let value = param.value;
          if (param.name.toLowerCase().includes('term')) {
            value = value.replace(' months', '').replace(',', '');
          } else if (param.name.toLowerCase().includes('mileage')) {
            value = value.replace(' miles/year', '').replace(',', '');
          } else if (param.name.toLowerCase().includes('down') || param.name.toLowerCase().includes('due')) {
            value = value.replace('$', '').replace(',', '');
          }
          initialValues[param.name] = value;
        }
      });
      setEditValues(initialValues);
    }
  }, [isEditMode, items, applicationType]);
  
  const handleInputChange = (paramName: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };
  
  const handleSave = () => {
    const updatedItems: DealStructureItem[] = [];
    const standardParams = generateStandardParams(items, applicationType);
    
    standardParams.forEach(param => {
      if (isFieldEditable(param.label) && editValues[param.name] !== undefined) {
        const newValue = editValues[param.name] || param.value;
        let formattedValue = newValue;
        
        // Format values back to original format
        if (param.name.toLowerCase().includes('term')) {
          formattedValue = `${newValue} months`;
        } else if (param.name.toLowerCase().includes('mileage')) {
          formattedValue = `${newValue} miles/year`;
        } else if (param.name.toLowerCase().includes('down') || param.name.toLowerCase().includes('due')) {
          formattedValue = `$${newValue}`;
        }
        
        updatedItems.push({
          name: param.name,
          label: param.label,
          value: formattedValue
        });
      } else {
        // Keep original value for non-editable fields
        updatedItems.push(param);
      }
    });
    
    if (onSaveEdit) {
      onSaveEdit(updatedItems);
    }
  };
  
  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };
  
  const handleViewFinancialSummary = () => {
    if (onViewFinancialSummary) {
      onViewFinancialSummary();
    } else if (lenderName && section && applicationId) {
      navigateToFinancialSummary(lenderName, section, { markAsPresented });
    }
  };

  // Check if this lender is the one presented to customer
  const isPresented = presentedLender === lenderName;
  
  // Generate standardized parameters that will always show all required fields
  const standardParams = generateStandardParams(items, applicationType);
  
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {standardParams.map((item, index) => (
          <div key={index} className="flex flex-col mb-2">
            <span className="text-gray-500">{item.label}</span>
            {isEditMode && isFieldEditable(item.label) ? (
              <Input
                value={editValues[item.name] || ''}
                onChange={(e) => handleInputChange(item.name, e.target.value)}
                className="text-sm h-8"
                placeholder={item.value}
              />
            ) : (
              <span className="font-medium">{item.value}</span>
            )}
          </div>
        ))}
      </div>
      
      {isEditMode && (
        <div className="flex gap-2 mt-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="h-7 px-2"
          >
            <Check className="h-3 w-3 mr-1" />
            Update Deal
          </Button>
        </div>
      )}
    </>
  );
};

export default OfferParameters;
