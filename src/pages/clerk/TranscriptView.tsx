import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Share,
  Languages
} from 'lucide-react';

// Mock transcription records for individual view (expand with more cases)
const mockTranscriptionRecords = [
  {
    id: '1',
    caseNumber: '2025-CR-023',
    caseTitle: 'State vs. Johnson',
    date: '2025-01-15',
    duration: '02:15:30',
    language: 'en',
    clerkName: 'Sarah Williams',
    status: 'completed',
    verification: 'approved',
    fileSize: '2.4 MB',
    entries: [
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
      }
    ]
  },
  {
    id: '2',
    caseNumber: '2025-CV-067',
    caseTitle: 'Smith Enterprises vs. Tech Corp',
    date: '2025-01-14',
    duration: '01:45:20',
    language: 'hi',
    clerkName: 'Michael Chen',
    status: 'completed',
    verification: 'pending',
    fileSize: '1.8 MB',
    entries: [
      {
        id: '3',
        timestamp: '10:30:15',
        speaker: 'Judge',
        text: 'अदालत अब सत्र में है। कृपया बैठें।',
        confidence: 93,
        language: 'hi'
      }
    ]
  },
  {
    id: '3',
    caseNumber: '2025-CR-019',
    caseTitle: 'People vs. Rodriguez',
    date: '2025-01-13',
    duration: '03:20:15',
    language: 'ar',
    clerkName: 'Priya Patel',
    status: 'completed',
    verification: 'approved',
    fileSize: '3.1 MB',
    entries: [
      {
        id: '4',
        timestamp: '14:20:10',
        speaker: 'Judge',
        text: 'المحكمة الآن في جلسة. يرجى الجلوس.',
        confidence: 91,
        language: 'ar'
      }
    ]
  }
];

// Default transcript entries (3-4 lines as requested)
const getDefaultTranscriptEntries = (lang: string) => {
  const defaultEntries = {
    'en': [
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
      }
    ],
    'hi': [
      {
        id: '1',
        timestamp: '09:15:23',
        speaker: 'Judge',
        text: 'अदालत अब सत्र में है। कृपया बैठें।',
        confidence: 95,
        language: 'hi'
      },
      {
        id: '2',
        timestamp: '09:15:45',
        speaker: 'Lawyer',
        text: 'युवर ऑनर्स, हम 15 जनवरी, 2024 को हस्ताक्षरित समझौते के संबंध में सबूत पेश करना चाहते हैं।',
        confidence: 92,
        language: 'hi'
      },
      {
        id: '3',
        timestamp: '09:16:30',
        speaker: 'Judge',
        text: 'आगे बढ़ें। क्या बचाव पक्ष को इस सबूत की एक प्रति प्रदान की गई है?',
        confidence: 98,
        language: 'hi'
      },
      {
        id: '4',
        timestamp: '09:16:50',
        speaker: 'Lawyer',
        text: 'हाँ, योर ऑनर्स। हमें खोज के दौरान यह प्राप्त हुआ। हमें इसकी स्वीकार्यता पर आपत्तियाँ हैं।',
        confidence: 94,
        language: 'hi'
      }
    ],
    'ar': [
      {
        id: '1',
        timestamp: '09:15:23',
        speaker: 'Judge',
        text: 'المحكمة الآن في جلسة. يرجى الجلوس.',
        confidence: 95,
        language: 'ar'
      },
      {
        id: '2',
        timestamp: '09:15:45',
        speaker: 'Lawyer',
        text: 'سيادتكم، نود تقديم أدلة تتعلق بالعقد الموقع في 15 يناير 2024.',
        confidence: 92,
        language: 'ar'
      },
      {
        id: '3',
        timestamp: '09:16:30',
        speaker: 'Judge',
        text: 'تابع. هل تم تقديم نسخة من هذا الدليل للدفاع؟',
        confidence: 98,
        language: 'ar'
      },
      {
        id: '4',
        timestamp: '09:16:50',
        speaker: 'Lawyer',
        text: 'نعم سيادتكم. وصلنا إليه أثناء الاكتشاف. لدينا اعتراضات على قابليته للقبول.',
        confidence: 94,
        language: 'ar'
      }
    ]
  };
  return defaultEntries[lang] || defaultEntries['en'];
};

// Translation maps for proper translations (matching TranscriptionControl.tsx)
const translations = {
  'ar': {
    'The court is now in session. Please be seated.': 'المحكمة الآن في جلسة. يرجى الجلوس.',
    'Your Honor, we wish to present evidence regarding the contract signed on January 15th, 2024.': 'سيادتكم، نود تقديم أدلة تتعلق بالعقد الموقع في 15 يناير 2024.',
    'Proceed. Has the defense been provided with a copy of this evidence?': 'تابع. هل تم تقديم نسخة من هذا الدليل للدفاع؟',
    'Yes, Your Honor. We received it during discovery. We have objections to its admissibility.': 'نعم سيادتكم. وصلنا إليه أثناء الاكتشاف. لدينا اعتراضات على قابليته للقبول.',
    'State your objection for the record.': 'أعلن اعتراضك للسجل.'
  },
  'hi': {
    'The court is now in session. Please be seated.': 'अदालत अब सत्र में है। कृपया बैठें।',
    'Your Honor, we wish to present evidence regarding the contract signed on January 15th, 2024.': 'युवर ऑनर्स, हम 15 जनवरी, 2024 को हस्ताक्षरित समझौते के संबंध में सबूत पेश करना चाहते हैं।',
    'Proceed. Has the defense been provided with a copy of this evidence?': 'आगे बढ़ें। क्या बचाव पक्ष को इस सबूत की एक प्रति प्रदान की गई है?',
    'Yes, Your Honor. We received it during discovery. We have objections to its admissibility.': 'हाँ, योर ऑनर्स। हमें खोज के दौरान यह प्राप्त हुआ। हमें इसकी स्वीकार्यता पर आपत्तियाँ हैं।',
    'State your objection for the record.': 'रिकॉर्ड के लिए अपनी आपत्ति बताएं।'
  }
};

const getTranslation = (text: string, lang: string) => {
  return translations[lang]?.[text] || text;
};

const legalKeywords = ['objection', 'sustained', 'witness', 'adjourned', 'evidence', 'testimony', 'discovery', 'admissible',];

const speakerColors = {
  Judge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
  Clerk: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
  Lawyer: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-green-950 dark:text-purple-200 dark:border-purple-800',
  Witness: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800'
};

const TranscriptView = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Changed from selectedTranslation
  const [transcript, setTranscript] = useState<any[]>([]);
  const [caseMetadata, setCaseMetadata] = useState<any>(null);

  useEffect(() => {
    // First check localStorage for saved transcripts
    const savedRecords = localStorage.getItem('transcriptionRecords');
    let allRecords = [...mockTranscriptionRecords];

    if (savedRecords) {
      allRecords = [...allRecords, ...JSON.parse(savedRecords)];
    }

    // Find the record by ID
    const record = allRecords.find(r => r.id === recordId);
    if (record) {
      setCaseMetadata(record);
      // Show default entries if no entries exist
      setTranscript(record.entries?.length > 0 ? record.entries : getDefaultTranscriptEntries(record.language || 'en'));
      setSelectedLanguage(record.language || 'en');
    } else {
      // If no record found, show default English transcript
      setTranscript(getDefaultTranscriptEntries('en'));
      setSelectedLanguage('en');
    }
  }, [recordId]);

  // Update transcript when language changes
  useEffect(() => {
    if (caseMetadata) {
      let baseEntries = caseMetadata.entries?.length > 0 ? caseMetadata.entries : getDefaultTranscriptEntries('en');

      // Ensure all entries have English base text and translate to selected language
      const translatedEntries = baseEntries.map(entry => {
        // Get the original English text (use originalText if available, otherwise assume entry.text is base English)
        const englishBaseText = entry.originalText || entry.text;
        const displayText = selectedLanguage === 'en' ? englishBaseText : getTranslation(englishBaseText, selectedLanguage) || englishBaseText;

        return {
          ...entry,
          text: displayText,
          language: selectedLanguage
        };
      });
      setTranscript(translatedEntries);
    } else {
      // Handle fallback case
      const baseEntries = getDefaultTranscriptEntries('en');
      const translatedEntries = baseEntries.map(entry => ({
        ...entry,
        text: selectedLanguage === 'en' ? entry.text : getTranslation(entry.text, selectedLanguage) || entry.text,
        language: selectedLanguage
      }));
      setTranscript(translatedEntries);
    }
  }, [selectedLanguage, caseMetadata]);

  // Filter transcript based on search
  const filteredTranscript = transcript.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightLegalKeywords = (text: string) => {
    let highlightedText = text;
    legalKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded text-yellow-900 dark:text-yellow-100">${keyword}</mark>`);
    });
    return highlightedText;
  };

  const handleDownload = (format: 'pdf' | 'txt') => {
    console.log(`Downloading transcript ${recordId} as ${format}`);
    // Here you would implement the actual download functionality
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Transcript - ${caseMetadata?.caseTitle}`,
        text: `Court transcript for ${caseMetadata?.caseNumber}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'ar': return 'العربية';
      case 'hi': return 'हिंदी';
      default: return lang.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-left mb-8">
        <div className="absolute inset-0 justice-pattern -z-10 opacity-30" />
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/clerk/transcription')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">
          Transcript Details
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Case {caseMetadata?.caseNumber || 'Default'} • {caseMetadata?.date ? new Date(caseMetadata.date).toLocaleDateString() : 'Recent'}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-sm">
            {getLanguageDisplayName(selectedLanguage)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Case Metadata Card */}
      <Card className="court-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Case Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Case Title</Label>
              <p className="text-sm font-medium text-foreground">{caseMetadata?.caseTitle || 'Default Court Session'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{caseMetadata?.date ? new Date(caseMetadata.date).toLocaleDateString() : 'Recent Session'}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{caseMetadata?.duration || 'Variable'}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Clerk Name</Label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{caseMetadata?.clerkName || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Card */}
      <Card className="court-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-accent" />
              Full Transcript
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-border rounded-md bg-background text-sm w-64"
                />
              </div>
              <Badge variant="outline">
                {filteredTranscript.length} of {transcript.length} entries
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredTranscript.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={speakerColors[entry.speaker]}>
                      {entry.speaker}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
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

            {transcript.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transcript entries available.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptView;
