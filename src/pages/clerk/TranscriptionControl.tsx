import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  // ALL useState hooks must come FIRST and in SAME ORDER every time
  const [currentView, setCurrentView] = useState<'history' | 'live' | 'completed'>('history');
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
  const [currentPage, setCurrentPage] = useState(1);
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
      .filter(record => selectedLanguage === 'multiple' || record.language === selectedLanguage)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="min-h-screen bg-background p-8 animate-fade-in">
        {/* Hero Header */}
        <div className="text-left mb-8">
          <div className="absolute inset-0 justice-pattern -z-10 opacity-30" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">
            Transcription Control
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Manage live and recorded courtroom transcriptions
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple">Multiple Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setCurrentView('live')}
                className="bg-primary hover:bg-primary/90"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Live Transcription
              </Button>
            </div>
          </div>

          {/* Transcription Records Table */}
          <Card className="court-card">
            <CardHeader>
              <CardTitle>Transcription Records</CardTitle>
              <CardDescription>
                {selectedLanguage === 'multiple' ? allRecords.length : allRecords.filter(record => record.language === selectedLanguage).length} of {allRecords.length} total records{selectedLanguage === 'multiple' ? ' in Multiple Languages' : selectedLanguage === 'en' ? ' in English' : selectedLanguage === 'hi' ? ' in Hindi' : ' in Arabic'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[13%]">Case Number</TableHead>
                      <TableHead className="w-[19%]">Case Title</TableHead>
                      <TableHead className="w-[11%]">Date</TableHead>
                      <TableHead className="w-[11%]">Duration</TableHead>
                      <TableHead className="w-[13%]">Language</TableHead>
                      <TableHead className="w-[13%]">Clerk</TableHead>
                      <TableHead className="w-[11%]">File Size</TableHead>
                      <TableHead className="w-[9%] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{record.caseNumber}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={record.caseTitle}>
                            {record.caseTitle}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {record.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            record.language === 'en' ? 'bg-blue-100 text-blue-800' :
                              record.language === 'hi' ? 'bg-orange-100 text-orange-800' :
                                record.language === 'ar' ? 'bg-green-100 text-green-800' :
                                  'bg-pink-100 text-pink-800'
                          }>
                            {record.language === 'en' ? 'English' : record.language === 'hi' ? 'हिंदी' : 'العربية'}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.clerkName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.fileSize}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/clerk/transcript-view/${record.id}`)}
                              className="p-2 h-8 w-8"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="p-2 h-8 w-8"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
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
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
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
        </div>
      </div>
    );
  }

  // Live View - Ready to Start
  if (currentView === 'live' && !isRecording) {
    return (
      <div className="min-h-screen bg-background p-8 animate-fade-in">
        {/* Hero Header */}
        <div className="text-left mb-8">
          <div className="absolute inset-0 justice-pattern -z-10 opacity-30" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">
            Live Transcription
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Ready to start recording courtroom proceedings
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {/* Back Button */}
          <div className="flex items-center justify-end mb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentView('history')}
            >
              Back to History
            </Button>
          </div>

          {/* Start Transcription Card */}
          <Card className="court-card border-2 border-dashed border-border hover:border-accent transition-colors">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Mic className="w-12 h-12 text-accent" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Ready to Start Transcription</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
                  className="h-16 px-12 text-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={!caseNumber.trim() || !selectedLanguage}
                >
                  <PlayCircle className="w-8 h-8 mr-3" />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-left mb-8">
        <div className="absolute inset-0 justice-pattern -z-10 opacity-30" />
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">
          Live Transcription
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Case {caseNumber} • Recording {currentTime}
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Status Bar */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Live Transcript Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="court-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Live Transcript
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current Speaker:</span>
                    <Badge className={speakerColors[currentSpeaker]}>
                      {currentSpeaker}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] md:h-[600px]" ref={transcriptRef}>
                  <div className="space-y-4">
                    {transcript.map((entry) => (
                      <div key={entry.id} className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-accent">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={speakerColors[entry.speaker]}>
                            {entry.speaker}
                          </Badge>
                          <span className="text-sm font-mono text-muted-foreground">
                            {entry.timestamp}
                          </span>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-muted-foreground">
                              {entry.confidence}% accurate
                            </span>
                          </div>
                        </div>
                        <p
                          className="text-sm leading-relaxed"
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

            {/* Translation Panel */}
            {/* {translation && (
              <Card className="court-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Live Translation ({selectedLanguage.toUpperCase()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">
                        {fixedTranscriptionLanguage === 'ar' ? 'Arabic' : fixedTranscriptionLanguage === 'hi' ? 'Hindi' : 'English'} to {selectedLanguage === 'ar' ? 'Arabic' : selectedLanguage === 'hi' ? 'Hindi' : 'English'}:
                      </p>
                      <p className="text-sm">{translation.original}</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-200">
                        Translated:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {translation.translated}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            <Card className="court-card">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={pauseTranscription}
                    variant={isPaused ? "default" : "outline"}
                    className="h-12"
                  >
                    <PauseCircle className="w-4 h-4 mr-2" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    onClick={stopTranscription}
                    variant="destructive"
                    className="h-12"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Confidence</span>
                    <span className="text-sm">{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-2" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
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

            {translation && (
              <Card className="court-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Live Translation ({selectedLanguage.toUpperCase()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">
                        {fixedTranscriptionLanguage === 'ar' ? 'Arabic' : fixedTranscriptionLanguage === 'hi' ? 'Hindi' : 'English'} to {selectedLanguage === 'ar' ? 'Arabic' : selectedLanguage === 'hi' ? 'Hindi' : 'English'}:
                      </p>
                      <p className="text-sm">{translation.original}</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-200">
                        Translated:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {translation.translated}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Panel */}
            {!isRecording && transcript.length > 0 && (
              <Card className="court-card border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-200">
                    Recording Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      <strong>Session Summary:</strong>
                    </p>
                    <div className="text-sm space-y-1">
                      <p>• Duration: {currentTime}</p>
                      {/* <p>• Total Entries: {transcript.length}</p> */}
                      <p>• Language: {selectedLanguage.toUpperCase()}</p>
                      <p>• Case: {caseNumber}</p>
                    </div>
                  </div>

                  <Button onClick={saveTranscript} className="w-full h-12">
                    <Save className="w-4 h-4 mr-2" />
                    Save Transcript ({caseNumber})
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionControl;
