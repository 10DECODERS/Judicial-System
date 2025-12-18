import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mic,
  PlayCircle,
  StopCircle,
  PauseCircle,
  Square,
  Download,
  Save,
  Clock,
  AlertCircle,
  CheckCircle,
  Globe,
  Volume2,
  VolumeX,
  Trash2,
  Eye,
  ChevronRight,
  Upload,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mockTranscriptionRecords,
  translations,
  getTranslation,
  legalKeywords,
  speakerColors
} from '@/lib/transcriptionUtils';

// Types for transcription data
interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: 'Judge' | 'Clerk' | 'Lawyer' | 'Witness';
  text: string;
  confidence: number;
  language: string;
  originalText?: string;
}

interface TranslationEntry {
  original: string;
  translated: string;
  targetLanguage: string;
}



// Mock data for live transcription
const mockTranscriptData: TranscriptEntry[] = [
  {
    id: '1',
    timestamp: '09:15:23',
    speaker: 'Judge',
    text: 'The court is now in session. Please be seated.',
    confidence: 95,
    language: 'en'
  },
  {
    id: '2',
    timestamp: '09:15:45',
    speaker: 'Lawyer',
    text: 'Your Honor, we wish to present evidence regarding the contract signed on January 15th, 2024.',
    confidence: 92,
    language: 'en'
  },
  {
    id: '3',
    timestamp: '09:16:30',
    speaker: 'Judge',
    text: 'Proceed. Has the defense been provided with a copy of this evidence?',
    confidence: 98,
    language: 'en'
  },
  {
    id: '4',
    timestamp: '09:16:50',
    speaker: 'Lawyer',
    text: 'Yes, Your Honor. We received it during discovery. We have objections to its admissibility.',
    confidence: 94,
    language: 'en'
  },
  {
    id: '5',
    timestamp: '09:17:15',
    speaker: 'Judge',
    text: 'State your objection for the record.',
    confidence: 96,
    language: 'en'
  }
];



const TranscriptionControl = () => {
  const location = useLocation();
  // ALL useState hooks must come FIRST and in SAME ORDER every time
  const [currentView, setCurrentView] = useState<'history' | 'live' | 'completed'>((location.state as any)?.view || 'history');
  const [savedTranscripts, setSavedTranscripts] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<TranscriptEntry['speaker']>('Judge');
  const [selectedLanguage, setSelectedLanguage] = useState('multiple');
  const [fixedTranscriptionLanguage, setFixedTranscriptionLanguage] = useState('');
  const [translation, setTranslation] = useState<TranslationEntry | null>(null);
  const [confidence, setConfidence] = useState(95);
  const [isMuted, setIsMuted] = useState(false);
  const [caseNumber, setCaseNumber] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [clerkFilter, setClerkFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout>();
  const transcriptRef = useRef<HTMLDivElement>(null);

  // ALL useEffect hooks must come AFTER useState and in SAME ORDER every time
  // Load saved transcripts from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('transcriptionRecords');
    if (savedRecords) {
      setSavedTranscripts(JSON.parse(savedRecords));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const [hours, minutes, seconds] = prev.split(':').map(Number);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;
          const newHours = Math.floor(totalSeconds / 3600);
          const newMinutes = Math.floor((totalSeconds % 3600) / 60);
          const newSeconds = totalSeconds % 60;
          return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, isPaused]);

  // Auto-scroll transcript with smooth behavior
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTo({
        top: transcriptRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcript]);

  // Transcript text should remain in fixed language - no dynamic updating

  // Simulate real-time transcription
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        if (mockTranscriptData.length > transcript.length) {
          const nextEntry = mockTranscriptData[transcript.length];
          // Use the fixed transcription language for the transcript text
          const transcriptText = fixedTranscriptionLanguage !== 'en' ? getTranslation(nextEntry.text, fixedTranscriptionLanguage) : nextEntry.text;
          const newEntry = { ...nextEntry, text: transcriptText, originalText: nextEntry.text };
          setTranscript(prev => [...prev, newEntry]);
          setCurrentSpeaker(nextEntry.speaker);
          setConfidence(nextEntry.confidence);

          // Show translation: original is in fixedTranscriptionLanguage, translated is in selectedLanguage
          if (selectedLanguage !== fixedTranscriptionLanguage) {
            const translatedToTarget = selectedLanguage !== 'en' ? getTranslation(nextEntry.text, selectedLanguage) : nextEntry.text;
            setTranslation({
              original: transcriptText,
              translated: translatedToTarget,
              targetLanguage: selectedLanguage
            });
          }
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused, transcript.length, fixedTranscriptionLanguage, selectedLanguage]);

  const startTranscription = () => {
    setFixedTranscriptionLanguage(selectedLanguage); // Lock in the language for transcription
    setIsRecording(true);
    setIsPaused(false);
    setCurrentTime('00:00:00');
    setTranscript([]);
    setTranslation(null);
  };

  const pauseTranscription = () => {
    setIsPaused(!isPaused);
  };

  const stopTranscription = () => {
    setIsRecording(false);
    setIsPaused(false);
    setCurrentView('completed');
  };

  const saveTranscript = () => {
    // Create new transcript record
    const newTranscriptRecord = {
      id: `new-${Date.now()}`,
      caseNumber: caseNumber,
      caseTitle: `${caseNumber} - Court Session`,
      date: new Date().toISOString().split('T')[0],
      duration: currentTime,
      language: selectedLanguage,
      clerkName: 'Current Clerk',
      status: 'completed',
      verification: 'approved',
      fileSize: `${Math.round(transcript.length * 0.5)} KB`,
      entries: transcript
    };

    // Save to localStorage
    const existingTranscripts = localStorage.getItem('transcriptionRecords');
    const transcripts = existingTranscripts ? JSON.parse(existingTranscripts) : [];
    transcripts.push(newTranscriptRecord);
    localStorage.setItem('transcriptionRecords', JSON.stringify(transcripts));

    // Update local state to reflect the saved transcript immediately
    setSavedTranscripts(transcripts);

    // Auto-save using case name as filename
    const filename = `${caseNumber}_transcript_${new Date().toISOString().split('T')[0]}.${selectedLanguage === 'en' ? 'txt' : selectedLanguage === 'hi' ? 'txt' : 'txt'}`;
    console.log(`Auto-saving transcript as: ${filename}`);
    console.log('Saved transcript to localStorage:', newTranscriptRecord);

    // Reset state and go back to history
    setTranscript([]);
    setCurrentTime('00:00:00');
    setCurrentView('history');
    toast({
      title: "Success",
      description: `Transcript saved successfully as ${filename}`
    });
  };

  const downloadTranscript = (format: 'pdf' | 'txt') => {
    // Here you would generate and download the file
    console.log(`Downloading transcript as ${format}`);
  };

  const highlightLegalKeywords = (text: string) => {
    let highlightedText = text;
    // @ts-ignore
    legalKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${keyword}</mark>`);
    });
    return highlightedText;
  };

  // History View (Default)
  if (currentView === 'history') {
    const allRecords = [...savedTranscripts, ...mockTranscriptionRecords];
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

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedRows(paginatedRecords.map(r => r.id));
      } else {
        setSelectedRows([]);
      }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
      if (checked) {
        setSelectedRows(prev => [...prev, id]);
      } else {
        setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      }
    };

    return (
      <div className="min-h-screen bg-background p-8 animate-fade-in max-w-[1600px] mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Transcription Control</h1>
            <div className="flex items-center text-sm font-medium gap-2">
              <Link to="/clerk" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold">Transcription Control</span>
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
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setCurrentView('live')}
              className="bg-[#0047BB] hover:bg-[#003da1] h-9 shadow-md font-bold px-5 rounded-lg text-white transition-all"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Live Transcription
            </Button>
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
                  <Clock className="w-6 h-6 text-purple-600" />
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

        {/* Search & Filter Bar (Outer) */}
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
        <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-2xl overflow-hidden">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-slate-50/30 border-b border-slate-100">
                    <TableHead className="w-[50px] pl-6 py-4">
                      <Checkbox
                        checked={paginatedRecords.length > 0 && selectedRows.length === paginatedRecords.length}
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
                    <TableHead className="w-[9%] text-center text-xs font-bold text-slate-500 uppercase tracking-tight py-4 whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record.id} className="group hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedRows.includes(record.id)}
                          onCheckedChange={(checked) => handleSelectRow(record.id, checked as boolean)}
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
                        <Badge variant="outline" className={cn(
                          "px-3 py-1 rounded-md text-[10px] border shadow-none uppercase tracking-wide",
                          record.language === 'en' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            record.language === 'hi' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              record.language === 'ar' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                        )}>
                          {record.language === 'en' ? 'English' : record.language === 'hi' ? 'हिंदी' : 'العربية'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium whitespace-nowrap">{record.clerkName}</TableCell>
                      <TableCell className="text-sm text-slate-500 font-medium">
                        {record.fileSize}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/clerk/transcript-view/${record.id}`)}
                            className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 h-8 w-8 text-muted-foreground hover:text-blue-600"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete the transcription record for case ${record.caseNumber}?`)) {
                                const existingRecords = localStorage.getItem('transcriptionRecords');
                                if (existingRecords) {
                                  const currentRecords = JSON.parse(existingRecords);
                                  const updatedRecords = currentRecords.filter((r: any) => r.id !== record.id);
                                  localStorage.setItem('transcriptionRecords', JSON.stringify(updatedRecords));
                                  setSavedTranscripts(updatedRecords);
                                }
                              }
                            }}
                            className="text-muted-foreground hover:text-destructive p-2 h-8 w-8"
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
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length}
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
      </div>

    );
  }

  // Live View - Ready to Start
  if (currentView === 'live' && !isRecording) {
    return (
      <div className="min-h-screen bg-background p-8 animate-fade-in max-w-[1600px] mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Live Transcription</h1>
            <div className="flex items-center text-sm font-medium gap-2">
              <Link to="/clerk" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link to="/clerk/transcription" className="text-primary hover:underline cursor-pointer" onClick={() => setCurrentView('history')}>Transcription Control</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold">Live Transcription</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white text-slate-600 font-medium px-4 shadow-sm"
              onClick={() => setCurrentView('history')}
            >
              Back to History
            </Button>
          </div>
        </div>

        {/* Start Transcription Card */}
        <Card className="court-card border-2 border-dashed border-border hover:border-accent transition-colors">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                <Mic className="w-12 h-12 text-slate-200" />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ready to Start Transcription</h2>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                  Begin recording courtroom proceedings with AI-powered real-time transcription,
                  speaker identification, and multilingual support.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Case Number:</label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-sm w-32"
                    placeholder="2025-CR-XXX"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Language:</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={startTranscription}
                size="lg"
                className="h-12 px-8 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!caseNumber.trim() || !selectedLanguage}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Transcription
              </Button>
              {(!caseNumber.trim() || !selectedLanguage) && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Please enter Case Number and select Language to start transcription.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Live Transcription
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-3 py-1 flex items-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </h1>
          <div className="flex items-center text-sm font-medium gap-2">
            <Link to="/clerk" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/clerk/transcription" className="text-primary hover:underline cursor-pointer" onClick={() => setCurrentView('history')}>Transcription Control</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">Recording: {caseNumber}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 bg-white shadow-sm text-slate-500" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Transcript Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mic className="w-4 h-4" />
                  Live Transcript
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Current Speaker:</span>
                  <Badge className={`${speakerColors[currentSpeaker]} px-2 py-0.5 text-xs border-none`}>
                    {currentSpeaker}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]" ref={transcriptRef}>
                <div className="space-y-4">
                  {transcript.map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 mb-1.5">
                        <Badge className={`${speakerColors[entry.speaker]} px-2 py-0.5 text-[10px] font-bold uppercase border-none`}>
                          {entry.speaker}
                        </Badge>
                        <span className="text-[10px] font-mono text-gray-400">
                          {entry.timestamp}
                        </span>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-[10px] text-gray-400">
                            {entry.confidence}% accurate
                          </span>
                        </div>
                      </div>
                      <p
                        className="text-sm leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: highlightLegalKeywords(entry.text)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={pauseTranscription}
                  variant="outline"
                  className="h-10 bg-white"
                >
                  <PauseCircle className="w-4 h-4 mr-2" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={stopTranscription}
                  className="h-10 bg-red-500 hover:bg-red-600 text-white"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">AI Confidence</span>
                  <span className="text-xs font-bold text-gray-900">{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-1.5 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

};

export default TranscriptionControl;
