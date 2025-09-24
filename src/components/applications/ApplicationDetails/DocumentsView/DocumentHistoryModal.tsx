import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  User, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  GitBranch
} from 'lucide-react';
import { useDocumentVersions, DocumentVersion } from '@/hooks/useDocumentVersions';
import { formatDistanceToNow } from 'date-fns';

interface DocumentHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentName: string;
}

const DocumentHistoryModal: React.FC<DocumentHistoryModalProps> = ({
  open,
  onOpenChange,
  documentId,
  documentName,
}) => {
  const { data: versions = [], isLoading } = useDocumentVersions(documentId);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'generated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVersionIcon = (version: DocumentVersion) => {
    if (version.is_generated) {
      return <GitBranch className="h-4 w-4 text-blue-600" />;
    }
    return <FileText className="h-4 w-4 text-gray-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Document Version History
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{documentName}</p>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No version history found for this document
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
                        {getVersionIcon(version)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Version {version.version_number}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="default" className="text-xs">
                                Latest
                              </Badge>
                            )}
                            {version.is_generated && (
                              <Badge variant="secondary" className="text-xs">
                                Generated
                              </Badge>
                            )}
                          </div>
                          
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(version.status)}`}
                          >
                            {version.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-medium">{version.name}</p>
                          {version.document_type?.name && (
                            <p className="text-muted-foreground text-xs">
                              Type: {version.document_type.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{version.uploaded_by || 'System'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(version.created_at), { 
                                addSuffix: true 
                              })}
                            </span>
                          </div>
                          {version.file_name && (
                            <div className="text-xs">
                              File: {version.file_name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                          {version.file_url && (
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
                          {version.is_generated && version.document_type?.template_id && (
                            <Badge variant="secondary" className="text-xs">
                              Generated from Template {version.document_type.template_id}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentHistoryModal;