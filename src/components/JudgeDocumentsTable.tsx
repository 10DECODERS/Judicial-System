import React from 'react';
import { Edit, Eye, FileText, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDocuments } from '@/contexts/DocumentContext';

interface JudgeDocumentsTableProps {
  onEditDocument?: (documentId: string) => void;
  onViewDocument?: (documentId: string) => void;
  onCreateDocument?: () => void;
}

export const JudgeDocumentsTable: React.FC<JudgeDocumentsTableProps> = ({
  onEditDocument,
  onViewDocument,
  onCreateDocument
}) => {
  const { filteredDocuments, deleteDocument, setCurrentDocument } = useDocuments();

  const handleEditClick = (documentId: string) => {
    const document = filteredDocuments.find(doc => doc.id === documentId);
    if (document) {
      setCurrentDocument(document);
      onEditDocument?.(documentId);
    }
  };

  const handleViewClick = (documentId: string) => {
    onViewDocument?.(documentId);
  };

  const handleDeleteClick = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Review':
        return 'secondary';
      case 'Submitted':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Review':
        return 'status-submitted';
      case 'Submitted':
        return 'status-submitted';
      default:
        return 'status-draft';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Legal Documents
            </CardTitle>
            <CardDescription>
              Manage and review all legal documents and draftings
            </CardDescription>
          </div>
          {/* <Button onClick={onCreateDocument} className="gap-2">
            <Plus className="w-4 h-4" />
            New Case
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents found</p>
            <p className="text-sm">Create a new document to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {document.caseNumber}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={document.title}>
                        {document.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{document.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(document.status)}
                        className={getStatusBadgeClass(document.status)}
                      >
                        {document.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {document.lastEdited}
                    </TableCell>
                    <TableCell className="text-sm">
                      {document.createdBy}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClick(document.id)}
                          className="h-8 w-8 p-0"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(document.id)}
                          className="h-8 w-8 p-0"
                          title="Edit Document"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(document.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
