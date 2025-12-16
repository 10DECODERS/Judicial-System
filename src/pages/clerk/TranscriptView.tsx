import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  mockTranscriptionRecords,
  translations,
  getTranslation,
  legalKeywords,
  speakerColors,
  getLanguageDisplayName,
  getDefaultTranscriptEntries
} from '@/lib/transcriptionUtils';
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
    // @ts-ignore
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
