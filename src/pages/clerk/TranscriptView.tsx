import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  mockTranscriptionRecords,
  getTranslation,
  legalKeywords,
  speakerColors,
  getLanguageDisplayName,
  getDefaultTranscriptEntries
} from '@/lib/transcriptionUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Download,
  Printer,
  Search,
  Clock,
  User,
  FileText,
  CheckCircle,
  Share,
  Globe,
  Gavel,
  Activity,
  Bookmark
} from 'lucide-react';

const TranscriptView = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [transcript, setTranscript] = useState<any[]>([]);
  const [caseMetadata, setCaseMetadata] = useState<any>(null);

  useEffect(() => {
    const savedRecords = localStorage.getItem('transcriptionRecords');
    let allRecords = [...mockTranscriptionRecords];

    if (savedRecords) {
      allRecords = [...allRecords, ...JSON.parse(savedRecords)];
    }

    const record = allRecords.find(r => r.id === recordId);
    if (record) {
      setCaseMetadata(record);
      setTranscript(record.entries?.length > 0 ? record.entries : getDefaultTranscriptEntries(record.language || 'en'));
      setSelectedLanguage(record.language || 'en');
    } else {
      setTranscript(getDefaultTranscriptEntries('en'));
      setSelectedLanguage('en');
    }
  }, [recordId]);

  useEffect(() => {
    if (caseMetadata) {
      let baseEntries = caseMetadata.entries?.length > 0 ? caseMetadata.entries : getDefaultTranscriptEntries('en');
      const translatedEntries = baseEntries.map((entry: any) => {
        const englishBaseText = entry.originalText || entry.text;
        const displayText = selectedLanguage === 'en' ? englishBaseText : getTranslation(englishBaseText, selectedLanguage) || englishBaseText;
        return { ...entry, text: displayText, language: selectedLanguage };
      });
      setTranscript(translatedEntries);
    } else {
      const baseEntries = getDefaultTranscriptEntries('en');
      const translatedEntries = baseEntries.map(entry => ({
        ...entry,
        text: selectedLanguage === 'en' ? entry.text : getTranslation(entry.text, selectedLanguage) || entry.text,
        language: selectedLanguage
      }));
      setTranscript(translatedEntries);
    }
  }, [selectedLanguage, caseMetadata]);

  const filteredTranscript = transcript.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightLegalKeywords = (text: string) => {
    let highlightedText = text;
    // @ts-ignore
    legalKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-900/40 px-1 rounded text-yellow-900 dark:text-yellow-100 font-medium">${keyword}</mark>`);
    });
    return highlightedText;
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#F9F9FC] dark:bg-background p-6 animate-fade-in font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="text-muted-foreground hover:text-primary pl-0" onClick={() => navigate('/clerk/transcription')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transcripts
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-white">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="bg-white" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm" className="bg-[#0047BA] hover:bg-[#003da0] text-white shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md px-2 py-0.5 text-xs font-semibold">
              Transcription Complete
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              CASE #{caseMetadata?.caseNumber || '2025-CR-023'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2 tracking-tight">
            State vs. Ahmed Al-Mansoor
          </h1>
          <p className="text-sm text-gray-500">
            Official court record of proceedings held on {caseMetadata?.date ? new Date(caseMetadata.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Wednesday, January 15, 2025'}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">PRESIDING JUDGE</p>
              <p className="text-sm font-semibold text-gray-900">Hon. Sarah Cohen</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">DURATION</p>
              <p className="text-sm font-semibold text-gray-900">{caseMetadata?.duration || '02:15:30'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
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

        <Card className="border-none shadow-sm bg-white">
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
                {transcript.length} lines
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[800px] relative overflow-hidden">
            {/* Watermark / Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex justify-between items-center text-[10px] text-gray-400 font-mono tracking-widest uppercase mb-6">
              <span>Official Court Record • {caseMetadata?.caseNumber}</span>
              <span>Page 1 of 1</span>
            </div>

            <ScrollArea className="h-[750px] px-8 py-2">
              <div className="space-y-8 pb-12">
                {filteredTranscript.map((entry, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${speakerColors[entry.speaker]} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border-none`}>
                        {entry.speaker}
                      </Badge>
                      <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {entry.timestamp}
                      </span>
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
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Bookmarked Moments</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { time: '09:15:45', speaker: 'Lawyer', text: 'Your Honor, we wish to present evidence regarding...' },
                  { time: '09:16:50', speaker: 'Lawyer', text: 'Yes, Your Honor. We have objections to its admissibility...' }
                ].map((bookmark, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors cursor-pointer group border border-transparent hover:border-blue-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px] px-1.5 py-0 h-5 border-none font-bold">
                        {bookmark.speaker}
                      </Badge>
                      <span className="text-[10px] font-mono text-gray-400">{bookmark.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      "{bookmark.text}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legal Keywords */}
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Legal Keywords</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {['objection', 'sustained', 'witness', 'adjourned', 'evidence', 'testimony', 'discovery', 'admissible', 'authentication', 'foundation'].map((word) => (
                    <span key={word} className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 cursor-pointer transition-colors">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default TranscriptView;
