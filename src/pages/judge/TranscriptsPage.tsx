import { useState, useEffect } from 'react';
import { Play, Pause, Search, Download, Bookmark, Globe, StickyNote, Clock, Eye, User, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AIAssistant } from '@/components/AIAssistant';
import { useNavigate } from 'react-router-dom';
import {
  mockTranscriptionRecords,
  getLanguageDisplayName,
  speakerColors,
  legalKeywords,
  highlightLegalKeywords
} from '@/lib/transcriptionUtils';

export default function TranscriptsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('multiple');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Load saved transcripts from localStorage
  const [savedTranscripts, setSavedTranscripts] = useState<any[]>([]);
  useEffect(() => {
    const savedRecords = localStorage.getItem('transcriptionRecords');
    if (savedRecords) {
      setSavedTranscripts(JSON.parse(savedRecords));
    }
  }, []);

  const allRecords = [...mockTranscriptionRecords, ...savedTranscripts]
    .filter(record => ['en', 'hi', 'ar'].includes(record.language));
  const filteredRecords = allRecords
    .filter(record => selectedLanguage === 'multiple' || record.language === selectedLanguage)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handleViewTranscript = (recordId: string) => {
    // Find the record to get its language
    const record = allRecords.find(r => r.id === recordId);
    if (record) {
      // Navigate with language as state parameter
      navigate(`/judge/transcript-detail/${recordId}`, {
        state: { defaultLanguage: record.language }
      });
    } else {
      navigate(`/judge/transcript-detail/${recordId}`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedRecords.map(r => r.id);
      setSelectedRecordIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedRecords.map(r => r.id);
      setSelectedRecordIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedRecordIds(prev => [...prev, id]);
    } else {
      setSelectedRecordIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const isAllPageSelected = paginatedRecords.length > 0 && paginatedRecords.every(r => selectedRecordIds.includes(r.id));
  const isPageIndeterminate = paginatedRecords.some(r => selectedRecordIds.includes(r.id)) && !isAllPageSelected;

  return (
    <div className="h-full bg-background p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-1 tracking-tight">Courtroom Transcripts</h1>
            <p className="text-sm text-muted-foreground">View and review completed courtroom transcription records</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[180px] border-borders">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue>
                  {selectedLanguage === 'multiple' ? 'Multiple Languages' :
                    selectedLanguage === 'en' ? 'English' :
                      selectedLanguage === 'hi' ? 'हिंदी' :
                        selectedLanguage === 'ar' ? 'العربية' : 'Multiple Languages'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple">Multiple Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="court-card hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{allRecords.length}</p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-xl hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-headings">
                  {new Set(allRecords.map(r => r.language)).size}
                </p>
                <p className="text-xs text-muted-foreground">Languages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="court-card hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-headings">
                  {new Set(allRecords.map(r => r.clerkName)).size}
                </p>
                <p className="text-xs text-muted-foreground">Court Clerks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="court-card hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-headings">
                  {Math.round(allRecords.reduce((acc, r) => acc + parseInt(r.duration.split(':')[0]) * 60 + parseInt(r.duration.split(':')[1]), 0) / 60)}h
                </p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcription Records Table */}
      <Card className="bg-card border border-border shadow-sm rounded-xl mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-foreground">Transcription Records</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {selectedLanguage === 'multiple' ? allRecords.length : allRecords.filter(record => record.language === selectedLanguage).length} of {allRecords.length} total records
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-borders overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllPageSelected || (isPageIndeterminate ? "indeterminate" : false)}
                      onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                    />
                  </TableHead>
                  <TableHead className="w-[13%] text-xs font-semibold text-muted-foreground">Case Number</TableHead>
                  <TableHead className="w-[19%] text-xs font-semibold text-muted-foreground">Case Title</TableHead>
                  <TableHead className="w-[11%] text-xs font-semibold text-muted-foreground">Date</TableHead>
                  <TableHead className="w-[11%] text-xs font-semibold text-muted-foreground">Duration</TableHead>
                  <TableHead className="w-[13%] text-xs font-semibold text-muted-foreground">Language</TableHead>
                  <TableHead className="w-[13%] text-xs font-semibold text-muted-foreground">Clerk</TableHead>
                  <TableHead className="w-[11%] text-xs font-semibold text-muted-foreground">File Size</TableHead>
                  <TableHead className="w-[9%] text-center text-xs font-semibold text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    className="hover:bg-accent/5 transition-colors border-b last:border-0 border-border"
                    data-state={selectedRecordIds.includes(record.id) ? "selected" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRecordIds.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectOne(checked as boolean, record.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-[#0047BA] dark:text-blue-400">{record.caseNumber}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground" title={record.caseTitle}>
                        {record.caseTitle}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {record.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        record.language === 'en' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          record.language === 'hi' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            record.language === 'ar' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                      }>
                        {record.language === 'en' ? 'English' :
                          record.language === 'hi' ? 'हिंदी' :
                            record.language === 'ar' ? 'العربية' : 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.clerkName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {record.fileSize}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewTranscript(record.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (page === currentPage - 2 && page > 1) ||
                      (page === currentPage + 2 && page < totalPages)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
              </p>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Read-Only Notice */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            <strong className="text-primary">Judge Access Notice:</strong> You have read-only access to view and review transcription records. Any official transcription work must be performed by court clerks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
