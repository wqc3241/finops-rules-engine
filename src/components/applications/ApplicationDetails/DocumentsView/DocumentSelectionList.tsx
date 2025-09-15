import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Car, 
  User, 
  AlertCircle, 
  Shield, 
  Folder,
  CheckCircle,
  Clock,
  XCircle,
  Calendar
} from 'lucide-react';
import { DocumentWithCategory } from '@/hooks/useDocuments';
import { SelectedDocument } from './SendDocumentsToDTModal';
import { cn } from '@/lib/utils';

interface DocumentSelectionListProps {
  documents: DocumentWithCategory[];
  selectedDocuments: SelectedDocument[];
  onSelectionChange: (selected: SelectedDocument[]) => void;
}

export const DocumentSelectionList: React.FC<DocumentSelectionListProps> = ({
  documents,
  selectedDocuments,
  onSelectionChange
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Initialize selected documents from props
  useEffect(() => {
    const selectedIds = new Set(selectedDocuments.map(doc => doc.id));
    setSelected(selectedIds);
  }, [selectedDocuments]);

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Order Documents': FileText,
      'Registration Documents': Car,
      'Customer Documents': User,
      'Stipulation Documents': AlertCircle,
      'Compliance Documents': Shield,
      'Supporting Documents': Folder
    };
    const IconComponent = iconMap[categoryName] || Folder;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'submitted': 
      case 'pending_review': return <Clock className="h-3 w-3 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-3 w-3 text-red-600" />;
      case 'expired': return <Calendar className="h-3 w-3 text-orange-600" />;
      default: return <AlertCircle className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    const categoryName = doc.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(doc);
    return acc;
  }, {} as Record<string, DocumentWithCategory[]>);

  const handleDocumentToggle = (document: DocumentWithCategory, checked: boolean) => {
    const newSelected = new Set(selected);
    
    if (checked) {
      newSelected.add(document.id);
    } else {
      newSelected.delete(document.id);
    }
    
    setSelected(newSelected);
    updateSelectedDocuments(newSelected);
  };

  const handleCategoryToggle = (categoryDocs: DocumentWithCategory[], checked: boolean) => {
    const newSelected = new Set(selected);
    
    categoryDocs.forEach(doc => {
      if (checked) {
        newSelected.add(doc.id);
      } else {
        newSelected.delete(doc.id);
      }
    });
    
    setSelected(newSelected);
    updateSelectedDocuments(newSelected);
  };

  const updateSelectedDocuments = (selectedIds: Set<string>) => {
    const selectedDocs: SelectedDocument[] = documents
      .filter(doc => selectedIds.has(doc.id))
      .map(doc => ({
        id: doc.id,
        name: doc.name,
        category: doc.category?.name || 'Uncategorized',
        documentType: doc.document_type?.name || 'Unknown',
        fileUrl: doc.file_url,
        fileName: doc.file_name
      }));
    
    onSelectionChange(selectedDocs);
  };

  const isCategorySelected = (categoryDocs: DocumentWithCategory[]) => {
    return categoryDocs.every(doc => selected.has(doc.id));
  };

  const isCategoryPartiallySelected = (categoryDocs: DocumentWithCategory[]) => {
    const selectedInCategory = categoryDocs.filter(doc => selected.has(doc.id));
    return selectedInCategory.length > 0 && selectedInCategory.length < categoryDocs.length;
  };

  return (
    <div className="space-y-4">
      {Object.entries(documentsByCategory).map(([categoryName, categoryDocs]) => {
        const isFullySelected = isCategorySelected(categoryDocs);
        const isPartiallySelected = isCategoryPartiallySelected(categoryDocs);
        const selectedCount = categoryDocs.filter(doc => selected.has(doc.id)).length;

        return (
          <Card key={categoryName} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Category Header */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isFullySelected}
                      onCheckedChange={(checked) => handleCategoryToggle(categoryDocs, !!checked)}
                      className={cn(
                        isPartiallySelected && !isFullySelected && "data-[state=unchecked]:bg-primary/20"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(categoryName)}
                      <h3 className="font-medium">{categoryName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedCount} of {categoryDocs.length} selected
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Documents in Category */}
              <div className="divide-y">
                {categoryDocs.map(document => {
                  const isSelected = selected.has(document.id);
                  
                  return (
                    <div 
                      key={document.id} 
                      className={cn(
                        "p-4 hover:bg-muted/50 transition-colors",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleDocumentToggle(document, !!checked)}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate">{document.name}</h4>
                                {document.is_required && (
                                  <Badge variant="secondary" className="text-xs">Required</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Type: {document.document_type?.name || 'Unknown'}</span>
                                {document.file_name && (
                                  <span>File: {document.file_name}</span>
                                )}
                                {document.file_size_mb && (
                                  <span>Size: {document.file_size_mb} MB</span>
                                )}
                              </div>
                              
                              {document.notes && (
                                <p className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded-md max-w-md">
                                  {document.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {getStatusIcon(document.status)}
                              <Badge variant="outline" className={`text-xs ${getStatusColor(document.status)}`}>
                                {document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {Object.keys(documentsByCategory).length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No documents found for this application.</p>
        </div>
      )}
    </div>
  );
};