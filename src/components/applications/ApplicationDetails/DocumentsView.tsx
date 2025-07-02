import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Car, 
  User, 
  AlertCircle, 
  Shield, 
  Folder,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar
} from 'lucide-react';
import { DocumentItem, DocumentCategory, DocumentItemStatus } from '@/types/application/documents';
import { mockDocuments, documentCategories } from '@/data/mock/documents';
import { cn } from '@/lib/utils';

interface DocumentsViewProps {
  applicationId: string;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ applicationId }) => {
  const [documents] = useState<DocumentItem[]>(mockDocuments);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');

  const getStatusIcon = (status: DocumentItemStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'submitted': 
      case 'pending_review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'expired': return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'not_submitted': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DocumentItemStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not_submitted': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'order': return <FileText className="h-4 w-4" />;
      case 'registration': return <Car className="h-4 w-4" />;
      case 'customer': return <User className="h-4 w-4" />;
      case 'stipulation': return <AlertCircle className="h-4 w-4" />;
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'supporting': return <Folder className="h-4 w-4" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesCategory;
  });

  const getDocumentsByCategory = (category: DocumentCategory) => {
    return documents.filter(doc => doc.category === category);
  };

  const getCategoryProgress = (category: DocumentCategory) => {
    const categoryDocs = getDocumentsByCategory(category);
    const requiredDocs = categoryDocs.filter(doc => doc.isRequired);
    const completedDocs = requiredDocs.filter(doc => doc.status === 'approved');
    
    if (requiredDocs.length === 0) return 100;
    return (completedDocs.length / requiredDocs.length) * 100;
  };

  return (
    <div className="space-y-6">


      {/* Category Selection */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Document Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg border transition-all",
              selectedCategory === 'all' 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background hover:bg-muted border-border"
            )}
          >
            <Folder className="h-5 w-5 mb-2" />
            <span className="text-sm font-medium">All Documents</span>
            <span className="text-xs opacity-70">({filteredDocuments.length})</span>
          </button>
          {documentCategories.map(category => {
            const categoryDocs = getDocumentsByCategory(category.id);
            const progress = getCategoryProgress(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border transition-all",
                  selectedCategory === category.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                {getCategoryIcon(category.id)}
                <span className="text-sm font-medium mt-2">{category.label}</span>
                <span className="text-xs opacity-70">({categoryDocs.length})</span>
                {progress < 100 && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {Math.round(progress)}%
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            {selectedCategory === 'all' ? 'All Documents' : 
             documentCategories.find(cat => cat.id === selectedCategory)?.label}
          </h3>
          <p className="text-sm text-muted-foreground">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Document</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Required</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Uploaded</TableHead>
                <TableHead className="font-semibold">Expires</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map(document => (
                <TableRow key={document.id} className="hover:bg-muted/30">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {getCategoryIcon(document.category)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{document.name}</div>
                        {document.fileName && (
                          <div className="text-xs text-muted-foreground">
                            {document.fileName} {document.fileSize && `(${document.fileSize})`}
                          </div>
                        )}
                        {document.notes && (
                          <div className="text-xs text-muted-foreground mt-1 p-2 bg-muted/50 rounded-md max-w-xs">
                            {document.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{document.type}</TableCell>
                  <TableCell>
                    {document.isRequired ? (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Optional</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(document.status)}
                      <Badge variant="outline" className={`text-xs ${getStatusColor(document.status)}`}>
                        {document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {document.uploadedDate ? (
                      <div>
                        <div className="font-medium">{document.uploadedDate}</div>
                        <div className="text-xs text-muted-foreground">by {document.uploadedBy}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {document.expirationDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{document.expirationDate}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {document.status === 'not_submitted' ? (
                        <Button size="sm" className="text-xs">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      ) : (
                        <>
                          {document.fileUrl && (
                            <>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsView;