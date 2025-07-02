import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
  Search,
  Filter,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentItemStatus | 'all'>('all');

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
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesCategory && matchesSearch && matchesStatus;
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

  const getOverallProgress = () => {
    const requiredDocs = documents.filter(doc => doc.isRequired);
    const completedDocs = requiredDocs.filter(doc => doc.status === 'approved');
    
    if (requiredDocs.length === 0) return 100;
    return (completedDocs.length / requiredDocs.length) * 100;
  };

  const DocumentCard: React.FC<{ document: DocumentItem }> = ({ document }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {getCategoryIcon(document.category)}
            <div className="flex-1">
              <h4 className="font-medium text-sm">{document.name}</h4>
              <p className="text-xs text-muted-foreground">{document.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(document.status)}
            <Badge variant="outline" className={`text-xs ${getStatusColor(document.status)}`}>
              {document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </div>

        {document.fileName && (
          <div className="text-xs text-muted-foreground mb-2">
            <span>{document.fileName}</span>
            {document.fileSize && <span className="ml-2">({document.fileSize})</span>}
          </div>
        )}

        {document.uploadedDate && (
          <div className="text-xs text-muted-foreground mb-2">
            Uploaded: {document.uploadedDate} by {document.uploadedBy}
          </div>
        )}

        {document.expirationDate && (
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Expires: {document.expirationDate}
          </div>
        )}

        {document.notes && (
          <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded">
            {document.notes}
          </div>
        )}

        <div className="flex items-center gap-2">
          {document.status === 'not_submitted' ? (
            <Button size="sm" variant="outline" className="text-xs">
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
          {document.isRequired && (
            <Badge variant="secondary" className="text-xs">Required</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant={statusFilter !== 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'pending_review' : 'all')}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {statusFilter === 'all' ? 'All Status' : 'Filtered'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as DocumentCategory | 'all')} className="relative">
        <div className="sticky top-0 bg-background z-10 pb-4">
          <TabsList className="w-full justify-start flex-wrap gap-1">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Folder className="h-4 w-4" />
              All Documents ({filteredDocuments.length})
            </TabsTrigger>
            {documentCategories.map(category => {
              const categoryDocs = getDocumentsByCategory(category.id);
              const progress = getCategoryProgress(category.id);
              
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  {getCategoryIcon(category.id)}
                  {category.label} ({categoryDocs.length})
                  {progress < 100 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {Math.round(progress)}%
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(document => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(document.category)}
                        <div>
                          <div className="font-medium">{document.name}</div>
                          {document.fileName && (
                            <div className="text-xs text-muted-foreground">
                              {document.fileName} {document.fileSize && `(${document.fileSize})`}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{document.type}</TableCell>
                    <TableCell>
                      {document.isRequired && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
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
                    <TableCell className="text-xs text-muted-foreground">
                      {document.uploadedDate ? (
                        <div>
                          <div>{document.uploadedDate}</div>
                          <div>by {document.uploadedBy}</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {document.expirationDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {document.expirationDate}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {document.status === 'not_submitted' ? (
                          <Button size="sm" variant="outline" className="text-xs">
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
                      {document.notes && (
                        <div className="text-xs text-muted-foreground mt-1 p-1 bg-muted/30 rounded text-left">
                          {document.notes}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {documentCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDocumentsByCategory(category.id).map(document => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(document.category)}
                          <div>
                            <div className="font-medium">{document.name}</div>
                            {document.fileName && (
                              <div className="text-xs text-muted-foreground">
                                {document.fileName} {document.fileSize && `(${document.fileSize})`}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{document.type}</TableCell>
                      <TableCell>
                        {document.isRequired && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
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
                      <TableCell className="text-xs text-muted-foreground">
                        {document.uploadedDate ? (
                          <div>
                            <div>{document.uploadedDate}</div>
                            <div>by {document.uploadedBy}</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {document.expirationDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {document.expirationDate}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {document.status === 'not_submitted' ? (
                            <Button size="sm" variant="outline" className="text-xs">
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
                        {document.notes && (
                          <div className="text-xs text-muted-foreground mt-1 p-1 bg-muted/30 rounded text-left">
                            {document.notes}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentsView;