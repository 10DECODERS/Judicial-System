import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Download,
  Printer,
  Search,
  Bookmark,
  BookmarkCheck,
  Clock,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Globe,
  StickyNote,
  Eye,
  Share,
  Activity,
  Scale
} from 'lucide-react';
import {
  mockTranscriptionRecords,
  getLanguageDisplayName,
  speakerColors as importedSpeakerColors,
  legalKeywords as importedLegalKeywords,
  highlightLegalKeywords,
  translations,
  getTranslation
} from '@/lib/transcriptionUtils';

// Types for detailed transcript view
interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: 'Judge' | 'Clerk' | 'Lawyer' | 'Witness';
  text: string;
  confidence: number;
  isBookmarked?: boolean;
}

interface CaseMetadata {
  caseNumber: string;
  caseTitle: string;
  hearingDate: string;
  judgeName: string;
  clerkName: string;
  duration: string;
  language: string;
  status: 'completed' | 'processing' | 'failed';
}

// Mock data for demonstration
const mockCaseMetadata: CaseMetadata = {
  caseNumber: '2025-CR-023',
  caseTitle: 'State vs. Johnson - Detailed Review',
  hearingDate: '2025-01-15',
  judgeName: 'Hon. Martinez',
  clerkName: 'Sarah Williams',
  duration: '02:15:30',
  language: 'English',
  status: 'completed'
};

const getMockTranscriptEntries = (language: string = 'en'): TranscriptEntry[] => {
  const baseEntries = [
    {
      id: '1',
      timestamp: '09:15:23',
      speaker: 'Judge',
      text: 'The court is now in session. Please be seated.',
      confidence: 95,
      isBookmarked: false
    },
    {
      id: '2',
      timestamp: '09:15:45',
      speaker: 'Lawyer',
      text: 'Your Honor, we wish to present evidence regarding the contract signed on January 15th, 2024.',
      confidence: 92,
      isBookmarked: true
    },
    {
      id: '3',
      timestamp: '09:16:30',
      speaker: 'Judge',
      text: 'Proceed. Has the defense been provided with a copy of this evidence?',
      confidence: 98,
      isBookmarked: false
    },
    {
      id: '4',
      timestamp: '09:16:50',
      speaker: 'Lawyer',
      text: 'Yes, Your Honor. We received it during discovery. We have objections to its admissibility.',
      confidence: 94,
      isBookmarked: true
    },
    {
      id: '5',
      timestamp: '09:17:15',
      speaker: 'Judge',
      text: 'State your objection for the record.',
      confidence: 96,
      isBookmarked: false
    },
    {
      id: '6',
      timestamp: '09:17:35',
      speaker: 'Lawyer',
      text: 'Your Honor, this document lacks proper authentication. There is no witness testimony establishing chain of custody, and its probative value is substantially outweighed by the danger of unfair prejudice.',
      confidence: 91,
      isBookmarked: false
    },
    {
      id: '7',
      timestamp: '09:18:10',
      speaker: 'Lawyer',
      text: 'Your Honor, we can call a witness to authenticate this document if required by the court.',
      confidence: 93,
      isBookmarked: false
    },
    {
      id: '8',
      timestamp: '09:18:45',
      speaker: 'Judge',
      text: 'I will allow it subject to proper authentication. Please call your witness to establish foundation.',
      confidence: 97,
      isBookmarked: true
    },
    {
      id: '9',
      timestamp: '09:19:20',
      speaker: 'Witness',
      text: 'I solemnly swear to tell the truth, the whole truth, and nothing but the truth.',
      confidence: 99,
      isBookmarked: false
    },
    {
      id: '10',
      timestamp: '09:19:45',
      speaker: 'Lawyer',
      text: 'Please state your name and occupation for the record.',
      confidence: 95,
      isBookmarked: false
    },
    {
      id: '11',
      timestamp: '09:20:10',
      speaker: 'Witness',
      text: 'My name is Dr. Emily Rodriguez. I am a forensic document examiner with 15 years of experience in the field.',
      confidence: 96,
      isBookmarked: false
    },
    {
      id: '12',
      timestamp: '09:20:50',
      speaker: 'Clerk',
      text: 'The witness has been sworn in and the testimony will be recorded for the official court record.',
      confidence: 98,
      isBookmarked: false
    }
  ];

  // Apply translations based on language
  return baseEntries.map(entry => ({
    ...entry,
    text: getTranslation(entry.text, language) || entry.text,
    speaker: entry.speaker as 'Judge' | 'Clerk' | 'Lawyer' | 'Witness',
    language: language
  }));
};

const mockTranscriptEntries: TranscriptEntry[] = getMockTranscriptEntries('en');

const speakerColors = {
  Judge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
  Clerk: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
  Lawyer: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800',
  Witness: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800'
};

const legalKeywords = ['objection', 'sustained', 'witness', 'adjourned', 'evidence', 'testimony', 'discovery', 'admissible', 'authentication', 'foundation'];

const TranscriptDetailView = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(mockTranscriptEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [record, setRecord] = useState<any>(null);
  const [privateNotes, setPrivateNotes] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [caseMetadata, setCaseMetadata] = useState<CaseMetadata | null>(null);

  useEffect(() => {
    console.log('🚀 Initializing transcript detail view for record:', recordId);
    console.log('📍 Navigation state:', location.state);

    // Load data from localStorage and mock data
    const savedRecords = localStorage.getItem('transcriptionRecords');
    let allRecords = [...mockTranscriptionRecords];

    if (savedRecords) {
      allRecords = [...allRecords, ...JSON.parse(savedRecords)];
    }

    // Find the record by ID
    const record = allRecords.find(r => r.id === recordId);
    if (record) {
      console.log('📄 Found record:', record.caseNumber, 'Language:', record.language);

      setRecord(record);

      // Get default language from navigation state or use record's language
      const defaultLanguage = (location.state as any)?.defaultLanguage || record.language || 'en';
      console.log('🌐 Default language:', defaultLanguage);

      setCaseMetadata({
        caseNumber: record.caseNumber,
        caseTitle: record.caseTitle,
        hearingDate: record.date,
        judgeName: 'Hon. Judge',
        clerkName: record.clerkName,
        duration: record.duration,
        language: getLanguageDisplayName(defaultLanguage),
        status: record.status as any
      });

      // Set the selected language AFTER setting the record to ensure translation works
      console.log('⚙️ Setting selected language to:', defaultLanguage);
      setSelectedLanguage(defaultLanguage);
    } else {
      console.log('❌ Record not found for ID:', recordId);
    }
  }, [recordId, location.state]);

  useEffect(() => {
    if (record) {
      console.log('🔄 Updating transcript for language:', selectedLanguage);
      console.log('📄 Record language:', record.language);
      console.log('📄 Record entries available:', record.entries?.length || 0);

      // If record has entries, use them; otherwise use mock entries as base
      let baseEntries = record.entries?.length > 0
        ? record.entries
        : getMockTranscriptEntries('en'); // Base entries are always in English

      console.log('📄 Using', baseEntries.length, 'base entries');

      // Apply language translation for display
      const translatedEntries = baseEntries.map(entry => {
        // Get the English base text (use originalText if available, otherwise assume entry.text is base English)
        const englishBaseText = entry.originalText || entry.text;
        const displayText = selectedLanguage === 'en' ? englishBaseText : getTranslation(englishBaseText, selectedLanguage) || englishBaseText;

        return {
          ...entry,
          text: displayText,
          speaker: entry.speaker as 'Judge' | 'Clerk' | 'Lawyer' | 'Witness',
          isBookmarked: entry.isBookmarked || false,
          language: selectedLanguage
        };
      });

      console.log('✅ Setting transcript with', translatedEntries.length, 'translated entries');
      setTranscript(translatedEntries);
    }
  }, [record, selectedLanguage]);

  // Filter transcript based on search
  const filteredTranscript = transcript.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = (entryId: string) => {
    setTranscript(prev => prev.map(entry =>
      entry.id === entryId
        ? { ...entry, isBookmarked: !entry.isBookmarked }
        : entry
    ));

    setBookmarks(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const highlightLegalKeywords = (text: string) => {
    let highlightedText = text;
    legalKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded text-yellow-900 dark:text-yellow-100">${keyword}</mark>`);
    });
    return highlightedText;
  };

  const handleDownload = (format: 'pdf' | 'txt') => {
    console.log(`Downloading transcript as ${format}`);
    // Here you would implement the actual download functionality
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Transcript - ${caseMetadata.caseTitle}`,
        text: `Court transcript for ${caseMetadata.caseNumber}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Top Navigation Bar with Breadcrumbs */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/judge/transcripts')}
            className="text-muted-foreground hover:text-foreground gap-2 pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Transcripts</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 h-8 text-xs">
              <Share className="w-3.5 h-3.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 h-8 text-xs">
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
            <Button variant="default" size="sm" onClick={() => handleDownload('pdf')} className="gap-2 h-8 text-xs bg-primary hover:bg-primary/90">
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-b from-card to-background px-8 pt-8 pb-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 text-xs">
                  {caseMetadata?.status === 'completed' ? 'Transcription Complete' : caseMetadata?.status || 'Processing'}
                </Badge>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Case #{caseMetadata?.caseNumber || 'Unknown'}
                </span>
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground tracking-tight mb-2">
                {caseMetadata?.caseTitle || 'Transcript Review'}
              </h1>
              <p className="text-muted-foreground text-lg">
                Official court record of proceedings held on {caseMetadata ? new Date(caseMetadata.hearingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date'}
              </p>
            </div>

            {/* Language Selector in Header */}
            <div className="bg-card border border-border rounded-lg p-1 flex items-center shadow-sm">
              <Globe className="w-4 h-4 text-muted-foreground ml-3 mr-2" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0 h-8 text-sm bg-transparent">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (Original)</SelectItem>
                  <SelectItem value="hi">Hindi (Translated)</SelectItem>
                  <SelectItem value="ar">Arabic (Translated)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/60 shadow-sm">
              <div className="p-2.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Presiding Judge</p>
                <p className="text-sm font-semibold text-foreground">{caseMetadata?.judgeName || 'Hon. Judge'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/60 shadow-sm">
              <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Duration</p>
                <p className="text-sm font-semibold text-foreground">{caseMetadata?.duration || '00:00:00'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/60 shadow-sm">
              <div className="p-2.5 rounded-md bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Record Type</p>
                <p className="text-sm font-semibold text-foreground">Official Transcript</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/60 shadow-sm">
              <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Confidence Score</p>
                <p className="text-sm font-semibold text-foreground">98.5% Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-8">

          {/* Left Column: Transcript Paper */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Transcript Record</h2>
                <Badge variant="secondary" className="text-xs font-normal text-muted-foreground bg-muted/50 border-0">
                  {filteredTranscript.length} lines
                </Badge>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search in transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-background border-border"
                />
              </div>
            </div>

            {/* The Paper Component */}
            <div className="bg-white dark:bg-neutral-900 border border-border/40 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-xl overflow-hidden min-h-[800px]">
              {/* Paper Header/Watermark effect */}
              <div className="h-16 border-b border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 bg-gray-50/30 dark:bg-gray-900/30">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Official Court Record • {caseMetadata?.caseNumber}</span>
                <span className="text-xs font-mono text-gray-400">Page 1 of 1</span>
              </div>

              <div className="p-8 md:p-12 space-y-6">
                {filteredTranscript.map((entry) => (
                  <div key={entry.id} className="group relative pl-4 border-l-2 border-transparent hover:border-primary/20 transition-colors">
                    {/* Speaker Label */}
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${entry.speaker === 'Judge' ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-300' :
                        entry.speaker === 'Clerk' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                          entry.speaker === 'Lawyer' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                        {entry.speaker}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground/60">{entry.timestamp}</span>

                      {/* Action Buttons (visible on hover) */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleBookmark(entry.id)}>
                          {entry.isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>

                    {/* Text Content */}
                    <p className="text-base text-foreground/90 leading-relaxed pl-1"
                      dangerouslySetInnerHTML={{ __html: highlightLegalKeywords(entry.text) }}
                    />
                  </div>
                ))}

                {filteredTranscript.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No matches found in transcript</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Tools Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Quick Actions Card */}
            <Card className="court-card border-l-4 border-l-primary/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-primary" />
                  Bookmarked Moments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px] pr-4">
                  <div className="space-y-3">
                    {transcript.filter(e => e.isBookmarked).map(entry => (
                      <div key={entry.id}
                        className="p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => {
                          // Handle jump to timestamp
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase text-primary bg-primary/5 px-1.5 py-0.5 rounded">{entry.speaker}</span>
                          <span className="text-xs font-mono text-muted-foreground">{entry.timestamp}</span>
                        </div>
                        <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">"{entry.text}"</p>
                      </div>
                    ))}
                    {transcript.filter(e => e.isBookmarked).length === 0 && (
                      <div className="text-center py-8 px-4 border-2 border-dashed border-border/60 rounded-lg">
                        <p className="text-xs text-muted-foreground">No bookmarks yet. Click the bookmark icon next to any transcript line to save it here.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Legal Analysis Card */}
            <Card className="court-card border-l-4 border-l-violet-500/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-violet-600" />
                  Legal Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {legalKeywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/30">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Judge's Private Notes */}
            <Card className="court-card border-l-4 border-l-amber-500/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-600" />
                  Private Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Record your private observations here..."
                  className="min-h-[150px] resize-none bg-amber-50/30 border-amber-200/30 focus-visible:ring-amber-500/20 text-sm"
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDetailView;
