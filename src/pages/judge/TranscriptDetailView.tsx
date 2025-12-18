import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  User,
  FileText,
  Globe,
  StickyNote,
  Share,
  Activity,
  Scale,
  Gavel
} from 'lucide-react';
import {
  mockTranscriptionRecords,
  getLanguageDisplayName,
  speakerColors as importedSpeakerColors,
  legalKeywords,
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

const TranscriptDetailView = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(mockTranscriptEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [record, setRecord] = useState<any>(null);
  const [privateNotes, setPrivateNotes] = useState('');
  const [caseMetadata, setCaseMetadata] = useState<CaseMetadata | null>(null);

  useEffect(() => {
    // Load data from localStorage and mock data
    const savedRecords = localStorage.getItem('transcriptionRecords');
    let allRecords = [...mockTranscriptionRecords];

    if (savedRecords) {
      allRecords = [...allRecords, ...JSON.parse(savedRecords)];
    }

    // Find the record by ID
    const record = allRecords.find(r => r.id === recordId);
    if (record) {
      setRecord(record);

      // Get default language from navigation state or use record's language
      const defaultLanguage = (location.state as any)?.defaultLanguage || record.language || 'en';

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

      setSelectedLanguage(defaultLanguage);
    }
  }, [recordId, location.state]);

  useEffect(() => {
    if (record) {
      // If record has entries, use them; otherwise use mock entries as base
      let baseEntries = record.entries?.length > 0
        ? record.entries
        : getMockTranscriptEntries('en');

      // Apply language translation for display
      const translatedEntries = baseEntries.map((entry: any) => {
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
  };

  const highlightLegalKeywords = (text: string) => {
    let highlightedText = text;
    // @ts-ignore
    legalKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-900/40 px-1 rounded text-yellow-900 dark:text-yellow-100 font-medium">${keyword}</mark>`);
    });
    return highlightedText;
  };

  const handleDownload = (format: 'pdf' | 'txt') => {
    console.log(`Downloading transcript as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Share logic
  };

  return (
    <div className="min-h-screen bg-[#F9F9FC] dark:bg-background px-8 py-2 animate-fade-in font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" className="text-muted-foreground hover:text-primary pl-0" onClick={() => navigate('/judge/transcripts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transcripts
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 shadow-sm transition-colors" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 shadow-sm transition-colors" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm" className="bg-[#0047BB] hover:bg-[#003da0] text-white shadow-sm transition-colors" onClick={() => handleDownload('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-5 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md px-2 py-0.5 text-xs font-semibold">
              {caseMetadata?.status === 'completed' ? 'Transcription Complete' : caseMetadata?.status || 'Processing'}
            </Badge>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-xs text-muted-foreground font-medium">Verified by AI</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2 tracking-tight">
            {caseMetadata?.caseTitle || 'Transcript Review'}
          </h1>
          <p className="text-sm text-gray-500">
            Official court record of proceedings held on {caseMetadata ? new Date(caseMetadata.hearingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40 bg-white border-gray-200">
              <Globe className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">PRESIDING JUDGE</p>
              <p className="text-sm font-semibold text-gray-900">{caseMetadata?.judgeName || 'Hon. Judge'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">DURATION</p>
              <p className="text-sm font-semibold text-gray-900">{caseMetadata?.duration || '00:00:00'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">RECORD TYPE</p>
              <p className="text-sm font-semibold text-gray-900">Official Transcript</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">CONFIDENCE SCORE</p>
              <p className="text-sm font-semibold text-gray-900">98.5% Accuracy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Transcript */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">Transcript Record</h2>
              <Badge variant="outline" className="text-gray-500 border-gray-200 font-normal">
                {filteredTranscript.length} lines
              </Badge>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in transcript..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md shadow-slate-200/50 border border-gray-100 h-[600px] relative overflow-hidden flex flex-col">
            {/* Watermark / Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex justify-between items-center text-[10px] text-gray-400 font-mono tracking-widest uppercase shrink-0">
              <span>Official Court Record • {caseMetadata?.caseNumber}</span>
              <span>Page 1 of 1</span>
            </div>

            <ScrollArea className="flex-1 px-8 py-2">
              <div className="space-y-8 pb-12">
                {filteredTranscript.map((entry, index) => (
                  <div key={index} className="group border-b border-slate-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${speakerColors[entry.speaker]} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border-none`}>
                        {entry.speaker}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toggleBookmark(entry.id)}>
                          {entry.isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />}
                        </Button>
                        <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {entry.timestamp}
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-[15px] leading-relaxed text-gray-700 font-medium"
                      dangerouslySetInnerHTML={{ __html: highlightLegalKeywords(entry.text) }}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">

          {/* Bookmarked Moments */}
          <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Bookmarked Moments</h3>
              </div>
              <div className="p-4 space-y-4">
                <ScrollArea className="h-[240px] pr-4">
                  <div className="space-y-3">
                    {transcript.filter(e => e.isBookmarked).map(entry => (
                      <div key={entry.id} className="bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors cursor-pointer group border border-transparent hover:border-blue-100">
                        <div className="flex justify-between items-center mb-1.5">
                          <Badge className={`${speakerColors[entry.speaker as keyof typeof speakerColors]} text-[10px] px-1.5 py-0 h-5 border-none font-bold`}>
                            {entry.speaker}
                          </Badge>
                          <span className="text-[10px] font-mono text-gray-400">{entry.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          "{entry.text}"
                        </p>
                      </div>
                    ))}
                    {transcript.filter(e => e.isBookmarked).length === 0 && (
                      <div className="text-center py-8 px-4 border-2 border-dashed border-gray-100 rounded-lg">
                        <p className="text-xs text-muted-foreground">No bookmarks yet. Click the bookmark icon next to any transcript line.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Legal Keywords */}
          <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Legal Keywords</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {legalKeywords.map((word) => (
                    <span key={word} className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 cursor-pointer transition-colors">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Judge's Private Notes */}
          <Card className="border-none shadow-md shadow-slate-200/50 bg-white">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Private Notes</h3>
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Record your private observations here..."
                  className="min-h-[150px] resize-none bg-amber-50/30 border-amber-200/30 focus-visible:ring-amber-500/20 text-sm mb-3"
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                    Save Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default TranscriptDetailView;
