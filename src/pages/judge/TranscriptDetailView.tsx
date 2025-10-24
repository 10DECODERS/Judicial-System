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
  Share
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
    <div className="h-full bg-[hsl(var(--main-bg))] p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/judge/transcripts')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transcripts
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div className="flex items-start gap-3">
              <div>
                <h1 className="text-3xl font-display font-semibold text-headings mb-1">
                  {caseMetadata?.caseTitle || 'Transcript Review'}
                </h1>
                <p className="text-sm text-body">
                  Case {caseMetadata?.caseNumber || 'Unknown'} • {caseMetadata ? new Date(caseMetadata.hearingDate).toLocaleDateString() : 'Unknown Date'}
                </p>
              </div>
              <Badge className="status-submitted whitespace-nowrap mt-1">
                Completed
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px] border-borders">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language">
                {selectedLanguage === 'en' ? 'English' :
                 selectedLanguage === 'hi' ? 'हिंदी' :
                 selectedLanguage === 'ar' ? 'العربية' : 'Select Language'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 border-borders">
            <Share className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 border-borders">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')} className="gap-2 border-borders">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Case Metadata */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-accent/5 border border-borders rounded-lg mt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-headings truncate max-w-[180px]" title={caseMetadata?.caseTitle}>
                {caseMetadata?.caseTitle || 'Unknown Case'}
              </p>
              <p className="text-xs text-body">Case Title</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-headings">
                {caseMetadata ? new Date(caseMetadata.hearingDate).toLocaleDateString() : 'Unknown Date'}
              </p>
              <p className="text-xs text-body">Hearing Date</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-headings">{caseMetadata?.duration || 'Unknown'}</p>
              <p className="text-xs text-body">Duration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Globe className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-headings">{getLanguageDisplayName(selectedLanguage)}</p>
              <p className="text-xs text-body">Language</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Transcript Area */}
        <div className="col-span-2">
          <Card className="court-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-headings">Full Transcript</h2>
                  <p className="text-sm text-body">Courtroom proceedings</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-body" />
                    <Input
                      placeholder="Search transcript..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64 bg-[hsl(var(--search-bg))] border-borders"
                    />
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {filteredTranscript.length} / {transcript.length}
                  </Badge>
                </div>
              </div>

              {/* Document Paper Container */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-3 rounded-lg overflow-y-auto max-h-[calc(100vh-230px)]">
                {/* Paper Document */}
                <div className="bg-white shadow-lg rounded-sm border border-gray-200 mx-auto max-w-[210mm] p-8 animate-fade-in">
                  <div className="space-y-4">
                    {filteredTranscript.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-gray-50/50 rounded-lg border border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-2 min-w-[140px]">
                            <Badge variant="outline" className={`whitespace-nowrap ${
                              entry.speaker === 'Judge' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              entry.speaker === 'Clerk' ? 'bg-green-50 text-green-700 border-green-200' :
                              entry.speaker === 'Lawyer' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {entry.speaker}
                            </Badge>
                            <span className="text-xs font-mono text-body">
                              {entry.timestamp}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-accent/10"
                                onClick={() => toggleBookmark(entry.id)}
                              >
                                {entry.isBookmarked ? (
                                  <BookmarkCheck className="w-3 h-3 text-amber-500" />
                                ) : (
                                  <Bookmark className="w-3 h-3" />
                                )}
                              </Button>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-xs text-body">
                                  {entry.confidence}% accurate
                                </span>
                              </div>
                            </div>
                            <p
                              className="text-sm leading-relaxed text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: highlightLegalKeywords(entry.text)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <div className="space-y-4 sticky top-6">
            {/* Bookmarks */}
            <Card className="court-card">
              <div className="p-4 border-b border-borders bg-accent/5">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-headings text-sm">Bookmarks</h3>
                  <Badge variant="outline" className="ml-auto text-xs">{bookmarks.length}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <ScrollArea className="max-h-[200px]">
                  <div className="space-y-2">
                    {transcript
                      .filter(entry => entry.isBookmarked)
                      .map((entry) => (
                        <div key={entry.id} className="flex items-start justify-between p-2 rounded-lg hover:bg-accent/5 cursor-pointer transition-colors border border-borders">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-headings">
                              {entry.text.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-body">{entry.timestamp}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 text-xs ml-2 shrink-0 hover:bg-accent/10">
                            Jump
                          </Button>
                        </div>
                      ))}
                    {bookmarks.length === 0 && (
                      <p className="text-xs text-body text-center py-6">
                        No bookmarks yet. Click the bookmark icon next to any entry.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Legal Keywords */}
            <Card className="court-card">
              <div className="p-4 border-b border-borders bg-accent/5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-headings text-sm">Legal Keywords</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {legalKeywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs bg-accent/5 border-accent/20">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Private Notes */}
            <Card className="court-card">
              <div className="p-4 border-b border-borders bg-accent/5">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-headings text-sm">Judge's Notes</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <Textarea
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Add private notes for this transcript (visible only to you)..."
                  className="min-h-[180px] text-sm bg-[hsl(var(--search-bg))] border-borders"
                />
                <Button size="sm" className="w-full mt-3 bg-accent hover:bg-[hsl(var(--button-hover))] text-white">
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {/* Translation Notice */}
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <p className="text-xs text-body">
                  <strong className="text-accent">Translation Notice:</strong> This transcript has been reviewed and approved by the presiding judge. All legal terminology has been verified for accuracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDetailView;
