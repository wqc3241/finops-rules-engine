import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Car, User, AlertCircle, Shield, Folder, Upload, Download, Eye, CheckCircle, Clock, XCircle, Calendar, Plus, Database, GitBranch, History } from 'lucide-react';
import { DocumentItem, DocumentCategory, DocumentItemStatus, DocumentCategoryInfo } from '@/types/application/documents';
import { cn } from '@/lib/utils';
import AddDocumentCategoryModal from './DocumentsView/AddDocumentCategoryModal';
import AddDocumentModal from './DocumentsView/AddDocumentModal';
import DocumentFileUploadModal from './DocumentsView/DocumentFileUploadModal';
import DocumentHistoryModal from './DocumentsView/DocumentHistoryModal';
import { useGenerateDocumentVersion } from '@/hooks/useDocumentVersions';
import { useDocuments, useSeedDocuments, DocumentWithCategory } from '@/hooks/useDocuments';
import { useDocumentCategories } from '@/hooks/useDocumentConfiguration';
import { useTeamPermissions } from '@/hooks/useTeamPermissions';
import { toast } from 'sonner';
interface DocumentsViewProps {
  applicationId: string;
}
const DocumentsView: React.FC<DocumentsViewProps> = ({
  applicationId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithCategory | null>(null);

  // Fetch data from Supabase
  const {
    data: documents = [],
    isLoading: documentsLoading,
    error: documentsError
  } = useDocuments(applicationId);
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useDocumentCategories();
  const seedDocuments = useSeedDocuments();
  const generateVersion = useGenerateDocumentVersion();
  const {
    canAddDocumentToCategory,
    canManageCategory,
    isLoading: permissionsLoading
  } = useTeamPermissions();

  // Filter categories based on user permissions
  const availableCategories = categories.filter(category => canAddDocumentToCategory(category.id));
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'submitted':
      case 'pending_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'not_submitted':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      await seedDocuments.mutateAsync({
        applicationIds: [applicationId]
      });
      toast.success('Documents seeded successfully for this application');
    } catch (error) {
      toast.error('Failed to seed documents');
    }
  };
  const handleAddCategory = () => {
    setShowAddCategoryModal(false);
    // The category will be added via the hook's mutation
  };
  const handleViewHistory = (document: DocumentWithCategory) => {
    setSelectedDocument(document);
    setShowHistoryModal(true);
  };
  const handleGenerateDocument = async (document: any) => {
    if (!document.document_type?.template_id) return;
    try {
      await generateVersion.mutateAsync({
        parentDocumentId: document.id,
        templateId: document.document_type.template_id
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Group documents by their root document (for version consolidation)
  const groupDocumentsByType = (docs: any[]) => {
    const grouped = new Map();
    docs.forEach(doc => {
      // Use parent_document_id if it exists, otherwise use the document's own id as the key
      const rootId = doc.parent_document_id || doc.id;
      const docTypeId = doc.document_type_id;
      const key = `${docTypeId}_${rootId}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(doc);
    });
    return grouped;
  };

  // Get the latest version and total count for each document type
  const getConsolidatedDocuments = (docs: any[]) => {
    const grouped = groupDocumentsByType(docs);
    const consolidated: any[] = [];
    grouped.forEach(versions => {
      // Sort by version number (highest first) or creation date
      const sortedVersions = versions.sort((a: any, b: any) => {
        if (a.version_number && b.version_number) {
          return b.version_number - a.version_number;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      const latestVersion = sortedVersions[0];
      const totalVersions = sortedVersions.length;

      // Add metadata about all versions
      consolidated.push({
        ...latestVersion,
        _totalVersions: totalVersions,
        _allVersions: sortedVersions,
        _rootDocumentId: latestVersion.parent_document_id || latestVersion.id
      });
    });
    return consolidated;
  };
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category?.name === selectedCategory;
    return matchesCategory;
  });
  const consolidatedDocuments = getConsolidatedDocuments(filteredDocuments);
  const getDocumentsByCategory = (categoryName: string) => {
    return documents.filter(doc => doc.category?.name === categoryName);
  };
  const getCategoryProgress = (categoryName: string) => {
    const categoryDocs = getDocumentsByCategory(categoryName);
    const requiredDocs = categoryDocs.filter(doc => doc.is_required);
    const completedDocs = requiredDocs.filter(doc => doc.status === 'approved');
    if (requiredDocs.length === 0) return 100;
    return completedDocs.length / requiredDocs.length * 100;
  };
  if (documentsError) {
    return <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading documents: {documentsError.message}</p>
        <Button onClick={handleSeedDocuments} disabled={seedDocuments.isPending}>
          <Database className="h-4 w-4 mr-2" />
          {seedDocuments.isPending ? 'Seeding...' : 'Seed Sample Documents'}
        </Button>
      </div>;
  }
  if (documentsLoading || categoriesLoading) {
    return <div className="text-center py-8">
        <p className="text-gray-600">Loading documents...</p>
      </div>;
  }
  return <div className="space-y-6">

      {/* Category Selection */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3">
          <h2 className="text-base font-semibold">Document Categories</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          <button onClick={() => setSelectedCategory('all')} className={cn("flex flex-col items-center p-3 rounded-lg border transition-all", selectedCategory === 'all' ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-border")}>
            <Folder className="h-4 w-4 mb-1" />
            <span className="text-xs font-medium">All Documents</span>
            <span className="text-xs opacity-70">({documents.length})</span>
          </button>
          {availableCategories.map(category => {
          const categoryDocs = getDocumentsByCategory(category.name);
          return <button key={category.id} onClick={() => setSelectedCategory(category.name)} className={cn("flex flex-col items-center p-3 rounded-lg border transition-all", selectedCategory === category.name ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-border")}>
                {getCategoryIcon(category.name)}
                <span className="text-xs font-medium mt-1">{category.name}</span>
                <span className="text-xs opacity-70">({categoryDocs.length})</span>
              </button>;
        })}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {selectedCategory === 'all' ? 'All Documents' : availableCategories.find(cat => cat.name === selectedCategory)?.name}
              </h3>
               <p className="text-sm text-muted-foreground">
                 {consolidatedDocuments.length} document{consolidatedDocuments.length !== 1 ? 's' : ''} 
                 {consolidatedDocuments.reduce((acc, doc) => acc + doc._totalVersions, 0) > consolidatedDocuments.length && ` (${consolidatedDocuments.reduce((acc, doc) => acc + doc._totalVersions, 0)} total versions)`}
               </p>
            </div>
            {(() => {
            const selectedCategoryData = availableCategories.find(cat => cat.name === selectedCategory);
            const canAddToThisCategory = selectedCategory === 'all' || selectedCategoryData && canAddDocumentToCategory(selectedCategoryData.id);
            return canAddToThisCategory ? <Button size="sm" onClick={() => setShowAddDocumentModal(true)} className="text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Document
                </Button> : <div className="text-xs text-muted-foreground px-3 py-2">
                  No permission to add documents
                </div>;
          })()}
          </div>
        </div>
        
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Document</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Customer Document</TableHead>
                <TableHead className="font-semibold">Required</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Uploaded</TableHead>
                <TableHead className="font-semibold">Expires</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consolidatedDocuments.map(document => <TableRow key={`${document.document_type_id}_${document._rootDocumentId}`} className="hover:bg-muted/30">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm cursor-pointer hover:text-primary underline-offset-4 hover:underline" onClick={() => handleViewHistory(document)} title="Click to view all versions">
                            {document.name}
                          </span>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            v{document.version_number || 1} of {document._totalVersions}
                          </Badge>
                          {document.is_generated && <GitBranch className="h-3 w-3 text-blue-600" />}
                          {document._totalVersions > 1 && <History className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        {document.file_name && <div className="text-xs text-muted-foreground">
                            {document.file_name} {document.file_size_mb && `(${document.file_size_mb} MB)`}
                          </div>}
                        {document.notes && <div className="text-xs text-muted-foreground mt-1 p-2 bg-muted/50 rounded-md max-w-xs">
                            {document.notes}
                          </div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{document.document_type?.name}</TableCell>
                  <TableCell>
                    <Badge variant={document.document_type?.is_internal_only === false ? "default" : "secondary"} className="text-xs">
                      {document.document_type?.is_internal_only === false ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {document.is_required ? <Badge variant="secondary" className="text-xs">Required</Badge> : <span className="text-xs text-muted-foreground">Optional</span>}
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
                    {document.uploaded_date ? <div>
                        <div className="font-medium">{document.uploaded_date}</div>
                        <div className="text-xs text-muted-foreground">by {document.uploaded_by}</div>
                      </div> : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-sm">
                    {document.expiration_date ? <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{document.expiration_date}</span>
                      </div> : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                   <TableCell className="text-right">
                     <div className="flex items-center gap-2 justify-end">
                       {/* Template Documents */}
                       {document.document_type?.template_id ? <>
                           {/* Generate/Regenerate Button */}
                           <Button size="sm" variant="default" className="text-xs" onClick={() => handleGenerateDocument(document)} disabled={generateVersion.isPending}>
                             <FileText className="h-3 w-3 mr-1" />
                             {document.generation_count > 1 ? 'Regenerate' : 'Generate'}
                           </Button>
                           
                           {/* View/Download for generated documents */}
                           {document.file_url && <>
                               <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open(document.file_url, '_blank')}>
                                 <Eye className="h-3 w-3 mr-1" />
                                 View
                               </Button>
                               <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                        const link = document.createElement('a');
                        link.href = document.file_url!;
                        link.download = document.file_name || document.name;
                        link.click();
                      }}>
                                 <Download className="h-3 w-3 mr-1" />
                                 Download
                               </Button>
                             </>}
                         </> : (/* Non-Template Documents */
                  <>
                           {/* Upload Button */}
                           {!document.file_url && <Button size="sm" className="text-xs" onClick={() => {
                      setSelectedDocument(document);
                      setShowUploadModal(true);
                    }}>
                               <Upload className="h-3 w-3 mr-1" />
                               Upload
                             </Button>}
                           
                           {/* View/Download for uploaded documents */}
                           {document.file_url && <>
                               <Button size="sm" className="text-xs" onClick={() => {
                        setSelectedDocument(document);
                        setShowUploadModal(true);
                      }}>
                                 <Upload className="h-3 w-3 mr-1" />
                                 Upload New
                               </Button>
                               <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open(document.file_url, '_blank')}>
                                 <Eye className="h-3 w-3 mr-1" />
                                 View
                               </Button>
                               <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                        const link = document.createElement('a');
                        link.href = document.file_url!;
                        link.download = document.file_name || document.name;
                        link.click();
                      }}>
                                 <Download className="h-3 w-3 mr-1" />
                                 Download
                               </Button>
                             </>}
                         </>)}
                       
                       {/* Version History Button (for all documents) */}
                       
                     </div>
                   </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddDocumentCategoryModal open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal} onAddCategory={handleAddCategory} />

      <AddDocumentModal open={showAddDocumentModal} onOpenChange={setShowAddDocumentModal} applicationId={applicationId} selectedCategory={selectedCategory === 'all' ? undefined : categories.find(cat => cat.name === selectedCategory)?.id} />

      {selectedDocument && <>
          <DocumentFileUploadModal open={showUploadModal} onOpenChange={setShowUploadModal} document={selectedDocument} applicationId={applicationId} />
          
          <DocumentHistoryModal open={showHistoryModal} onOpenChange={setShowHistoryModal} documentId={selectedDocument.id} documentName={selectedDocument.name} />
        </>}
    </div>;
};
export default DocumentsView;