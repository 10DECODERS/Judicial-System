import { useState, useEffect } from 'react';
import { Play, Pause, Search, Download, Bookmark, Globe, StickyNote, Clock, Eye, User, Pencil, Trash2, Filter } from 'lucide-react';
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

import { AIAssistant } from '@/components/AIAssistant';
import { useNavigate } from 'react-router-dom';
import {
  mockTranscriptionRecords,
  getLanguageDisplayName,
  speakerColors,
  legalKeywords,
  highlightLegalKeywords
} from '@/lib/transcriptionUtils';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function TranscriptsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('multiple');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clerkFilter, setClerkFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
    .filter(record => {
      const matchesLanguage = selectedLanguage === 'multiple' || record.language === selectedLanguage;
      const matchesSearch = record.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.clerkName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClerk = clerkFilter === 'all' || record.clerkName === clerkFilter;
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      return matchesLanguage && matchesSearch && matchesClerk && matchesStatus;
    })
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
    <div className="h-full bg-background p-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Courtroom Transcripts</h1>
          <div className="flex items-center text-sm font-medium gap-2">
            <Link to="/judge" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">Transcripts</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-fit min-w-[220px] h-9 border-none bg-slate-200/80 hover:bg-slate-300 text-[#0047BB] font-bold px-4 shadow-none transition-colors whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="border-slate-100">
              <SelectItem value="multiple">Multiple Languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
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

        <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
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

        <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
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

        <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
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

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0047BB] transition-colors" />
          <Input
            placeholder="Search transcriptions..."
            className="pl-10 h-10 bg-white border-slate-200 focus:ring-[#0047BB]/10 transition-all text-sm rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={clerkFilter} onValueChange={setClerkFilter}>
            <SelectTrigger className="w-48 h-10 bg-white border-slate-200 shadow-sm text-slate-600 font-medium">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                <SelectValue placeholder="All Clerks" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-slate-100">
              <SelectItem value="all">All Clerks</SelectItem>
              {Array.from(new Set(allRecords.map(r => r.clerkName))).map(clerk => (
                <SelectItem key={clerk} value={clerk}>{clerk}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-10 bg-white border-slate-200 shadow-sm text-slate-600 font-medium">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-slate-100">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transcription Records Table */}
      <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-2xl overflow-hidden mb-6">
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/30 border-b border-slate-100">
                  <TableHead className="w-[50px] pl-6 py-4">
                    <Checkbox
                      checked={isAllPageSelected || (isPageIndeterminate ? "indeterminate" : false)}
                      onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                      className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableHead>
                  <TableHead className="w-[13%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Case Number</TableHead>
                  <TableHead className="w-[19%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Case Title</TableHead>
                  <TableHead className="w-[11%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Date</TableHead>
                  <TableHead className="w-[11%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Duration</TableHead>
                  <TableHead className="w-[13%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Language</TableHead>
                  <TableHead className="w-[13%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Clerk</TableHead>
                  <TableHead className="w-[11%] text-xs font-bold text-slate-500 uppercase tracking-tight py-4">File Size</TableHead>
                  <TableHead className="w-[9%] text-center text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    className="group hover:bg-slate-50/50 border-b border-slate-50 transition-colors"
                    data-state={selectedRecordIds.includes(record.id) ? "selected" : undefined}
                  >
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedRecordIds.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectOne(checked as boolean, record.id)}
                        className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-[#0047BA] dark:text-blue-400 py-4">{record.caseNumber}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-slate-600 font-medium" title={record.caseTitle}>
                        {record.caseTitle}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Clock className="w-4 h-4" />
                        {record.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        `px-3 py-1 rounded-md text-[10px] border shadow-none uppercase tracking-wide ${record.language === 'en' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          record.language === 'hi' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            record.language === 'ar' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'}`
                      }>
                        {record.language === 'en' ? 'English' :
                          record.language === 'hi' ? 'हिंदी' :
                            record.language === 'ar' ? 'العربية' : 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">{record.clerkName}</TableCell>
                    <TableCell className="text-sm text-slate-500 font-medium">
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
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-none"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "secondary"}
                    className={`h-8 w-8 rounded-lg ${currentPage === page ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} p-0 text-xs font-bold border-none`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-none"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
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
