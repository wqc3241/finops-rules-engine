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
  Calendar,
  Plus,
  Database
} from 'lucide-react';
import { DocumentItem, DocumentCategory, DocumentItemStatus, DocumentCategoryInfo } from '@/types/application/documents';
import { cn } from '@/lib/utils';
import AddDocumentCategoryModal from './DocumentsView/AddDocumentCategoryModal';
import AddDocumentModal from './DocumentsView/AddDocumentModal';
import { useDocuments, useSeedDocuments } from '@/hooks/useDocuments';
import { useDocumentCategories } from '@/hooks/useDocumentConfiguration';
import { toast } from 'sonner';

interface DocumentsViewProps {
  applicationId: string;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ applicationId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  
  // Fetch data from Supabase
  const { data: documents = [], isLoading: documentsLoading, error: documentsError } = useDocuments(applicationId);
  const { data: categories = [], isLoading: categoriesLoading } = useDocumentCategories();
  const seedDocuments = useSeedDocuments();

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  const getCategoryIcon = (category: string | undefined) => {
    // For custom categories, try to use the stored icon
    const categoryInfo = categories.find(cat => cat.name === category || cat.id === category);
    if (categoryInfo) {
      const iconMap = {
        'FileText': FileText,
        'Car': Car,
        'User': User,
        'AlertCircle': AlertCircle,
        'Shield': Shield,
        'Folder': Folder,
        'Plus': Plus
      };
      const IconComponent = iconMap[categoryInfo.icon as keyof typeof iconMap] || Folder;
      return <IconComponent className="h-4 w-4" />;
    }
    
    return <Folder className="h-4 w-4" />;
  };

  const handleSeedDocuments = async () => {
    try {
      await seedDocuments.mutateAsync({ applicationIds: [applicationId] });
      toast.success('Documents seeded successfully for this application');
    } catch (error) {
      toast.error('Failed to seed documents');
    }
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(false);
    // The category will be added via the hook's mutation
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category?.name === selectedCategory;
    return matchesCategory;
  });

  const getDocumentsByCategory = (categoryName: string) => {
    return documents.filter(doc => doc.category?.name === categoryName);
  };

  const getCategoryProgress = (categoryName: string) => {
    const categoryDocs = getDocumentsByCategory(categoryName);
    const requiredDocs = categoryDocs.filter(doc => doc.is_required);
    const completedDocs = requiredDocs.filter(doc => doc.status === 'approved');
    
    if (requiredDocs.length === 0) return 100;
    return (completedDocs.length / requiredDocs.length) * 100;
  };

  if (documentsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading documents: {documentsError.message}</p>
        <Button onClick={handleSeedDocuments} disabled={seedDocuments.isPending}>
          <Database className="h-4 w-4 mr-2" />
          {seedDocuments.isPending ? 'Seeding...' : 'Seed Sample Documents'}
        </Button>
      </div>
    );
  }

  if (documentsLoading || categoriesLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Category Selection */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3">
          <h2 className="text-base font-semibold">Document Categories</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border transition-all",
              selectedCategory === 'all' 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background hover:bg-muted border-border"
            )}
          >
            <Folder className="h-4 w-4 mb-1" />
            <span className="text-xs font-medium">All Documents</span>
            <span className="text-xs opacity-70">({documents.length})</span>
          </button>
          {categories.map(category => {
            const categoryDocs = getDocumentsByCategory(category.name);
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border transition-all",
                  selectedCategory === category.name 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                {getCategoryIcon(category.name)}
                <span className="text-xs font-medium mt-1">{category.name}</span>
                <span className="text-xs opacity-70">({categoryDocs.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {selectedCategory === 'all' ? 'All Documents' : 
                 categories.find(cat => cat.name === selectedCategory)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowAddDocumentModal(true)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Document
            </Button>
          </div>
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
                        {getCategoryIcon(document.category?.name)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{document.name}</div>
                        {document.file_name && (
                          <div className="text-xs text-muted-foreground">
                            {document.file_name} {document.file_size_mb && `(${document.file_size_mb} MB)`}
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
                  <TableCell className="text-sm text-muted-foreground">{document.document_type?.name}</TableCell>
                  <TableCell>
                    {document.is_required ? (
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
                    {document.uploaded_date ? (
                      <div>
                        <div className="font-medium">{document.uploaded_date}</div>
                        <div className="text-xs text-muted-foreground">by {document.uploaded_by}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {document.expiration_date ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{document.expiration_date}</span>
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
                          {document.file_url && (
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

      <AddDocumentCategoryModal
        open={showAddCategoryModal}
        onOpenChange={setShowAddCategoryModal}
        onAddCategory={handleAddCategory}
      />

      <AddDocumentModal
        open={showAddDocumentModal}
        onOpenChange={setShowAddDocumentModal}
        applicationId={applicationId}
        selectedCategory={selectedCategory === 'all' ? undefined : 
          categories.find(cat => cat.name === selectedCategory)?.id}
      />
    </div>
  );
};

export default DocumentsView;