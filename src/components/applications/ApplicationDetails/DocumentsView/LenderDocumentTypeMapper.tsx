import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin, AlertCircle } from 'lucide-react';
import { SelectedDocument } from './SendDocumentsToDTModal';
import { useLenderDocumentTypes } from '@/hooks/useLenderDocumentTypes';
import { cn } from '@/lib/utils';

interface LenderDocumentTypeMapperProps {
  selectedDocuments: SelectedDocument[];
  onMappingComplete: (mappedDocuments: SelectedDocument[]) => void;
}

export const LenderDocumentTypeMapper: React.FC<LenderDocumentTypeMapperProps> = ({
  selectedDocuments,
  onMappingComplete
}) => {
  const [mappedDocuments, setMappedDocuments] = useState<SelectedDocument[]>(selectedDocuments);
  const { data: lenderDocumentTypes = [], isLoading } = useLenderDocumentTypes();

  useEffect(() => {
    setMappedDocuments(selectedDocuments);
  }, [selectedDocuments]);

  const handleLenderTypeChange = (documentId: string, lenderDocumentType: string) => {
    const updated = mappedDocuments.map(doc => 
      doc.id === documentId 
        ? { ...doc, lenderDocumentType }
        : doc
    );
    setMappedDocuments(updated);
    onMappingComplete(updated);
  };

  const getAutoSuggestedMapping = (documentType: string, category: string) => {
    // Auto-suggest mappings based on common document types
    const mappings: Record<string, string> = {
      'Driver License': 'DRIVERS_LICENSE',
      'Credit Application': 'CREDIT_APPLICATION',
      'Insurance Declaration': 'INSURANCE_DECLARATION',
      'Purchase Order': 'PURCHASE_ORDER',
      'Trade-in Title': 'TRADE_IN_TITLE',
      'Vehicle Registration': 'VEHICLE_REGISTRATION',
      'Pay Stub': 'INCOME_VERIFICATION',
      'Bank Statement': 'BANK_STATEMENT',
      'W2 Form': 'TAX_DOCUMENT',
      'Employment Letter': 'EMPLOYMENT_VERIFICATION'
    };

    return mappings[documentType] || null;
  };

  const applySuggestedMappings = () => {
    const updated = mappedDocuments.map(doc => {
      if (!doc.lenderDocumentType) {
        const suggested = getAutoSuggestedMapping(doc.documentType, doc.category);
        if (suggested && lenderDocumentTypes.find(lt => lt.code === suggested)) {
          return { ...doc, lenderDocumentType: suggested };
        }
      }
      return doc;
    });
    setMappedDocuments(updated);
    onMappingComplete(updated);
  };

  const groupDocumentsByCategory = () => {
    return mappedDocuments.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, SelectedDocument[]>);
  };

  const unmappedCount = mappedDocuments.filter(doc => !doc.lenderDocumentType).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading lender document types...</p>
      </div>
    );
  }

  const groupedDocuments = groupDocumentsByCategory();

  return (
    <div className="space-y-6">
      {/* Summary and Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Document Mapping Summary
            </CardTitle>
            {unmappedCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {unmappedCount} unmapped
                </Badge>
                <button
                  onClick={applySuggestedMappings}
                  className="text-xs text-primary hover:underline"
                >
                  Apply Suggestions
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{mappedDocuments.length}</div>
              <div className="text-xs text-muted-foreground">Total Documents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {mappedDocuments.length - unmappedCount}
              </div>
              <div className="text-xs text-muted-foreground">Mapped</div>
            </div>
            <div>
              <div className={cn(
                "text-2xl font-bold",
                unmappedCount > 0 ? "text-red-600" : "text-green-600"
              )}>
                {unmappedCount}
              </div>
              <div className="text-xs text-muted-foreground">Unmapped</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Mapping */}
      {Object.entries(groupedDocuments).map(([category, docs]) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {docs.map(document => {
              const suggestedMapping = getAutoSuggestedMapping(document.documentType, document.category);
              const isMapped = !!document.lenderDocumentType;
              
              return (
                <div key={document.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{document.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {document.documentType}
                        </Badge>
                        {isMapped && (
                          <Badge variant="secondary" className="text-xs text-green-700 bg-green-100">
                            Mapped
                          </Badge>
                        )}
                      </div>
                      
                      {document.fileName && (
                        <p className="text-xs text-muted-foreground mb-3">
                          File: {document.fileName}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-xs">
                          <Select
                            value={document.lenderDocumentType || ''}
                            onValueChange={(value) => handleLenderTypeChange(document.id, value)}
                          >
                            <SelectTrigger className={cn(
                              "h-8 text-xs",
                              !document.lenderDocumentType && "border-red-200 bg-red-50"
                            )}>
                              <SelectValue placeholder="Select lender document type" />
                            </SelectTrigger>
                            <SelectContent>
                              {lenderDocumentTypes.map(type => (
                                <SelectItem key={type.code} value={type.code} className="text-xs">
                                  <div>
                                    <div className="font-medium">{type.name}</div>
                                    {type.description && (
                                      <div className="text-xs text-muted-foreground">{type.description}</div>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {suggestedMapping && !document.lenderDocumentType && (
                          <button
                            onClick={() => handleLenderTypeChange(document.id, suggestedMapping)}
                            className="text-xs text-primary hover:underline flex-shrink-0"
                          >
                            Use suggested: {lenderDocumentTypes.find(lt => lt.code === suggestedMapping)?.name}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};