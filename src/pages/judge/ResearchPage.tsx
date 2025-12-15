import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, FileText, BookOpen, Calendar, Filter, ChevronRight, Star, Clock, TrendingUp, Users, MapPin, MessageCircle, X, Send, Download, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for comprehensive legal research
// Mock data for comprehensive legal research - ONLY THE SPECIFIED DOCUMENT
const caseLawData = [
  {
    id: 1,
    title: 'A15 v B15, Recognition and Enforcement of ICC Arbitration Award',
    citation: 'A15 v B15 [2024] ADGMCFI 0012',
    date: '2024-08-05',
    jurisdiction: 'Abu Dhabi Global Market',
    court: 'Abu Dhabi Global Market Courts First Instance',
    judges: ['Justice Sir Andrew Smith'],
    summary: 'Judgment concerning the recognition and enforcement of an international arbitration award under the ADGM Arbitration Regulations. The Court determined that the seat of arbitration was Dubai rather than ADGM, rejecting jurisdiction under section 60(1)(a) but finding jurisdiction under section 60(1)(c) and adjourning proceedings pending appeals in Dubai Courts.',
    keyHoldings: [
      'Seat of arbitration determined by parties\' agreement and ICC Terms of Reference to be Dubai, not ADGM',
      'ADGM Courts have jurisdiction under section 60(1)(c) of Arbitration Regulations for international awards',
      'Application for recognition and enforcement adjourned under section 62(2) pending resolution of appeals in Dubai Courts',
      'Estoppel does not bar reconsideration of arbitration seat determination'
    ],
    topic: 'Arbitration Law',
    relevance: 'High',
    keywords: ['arbitral award', 'recognition and enforcement', 'ICC arbitration', 'seat of arbitration', 'ADGM Arbitration Regulations', 'jurisdiction', 'international arbitration', 'arbitration agreement', 'federal arbitration law', 'dubai jurisdiction', 'uAE arbitration', 'precautionary attachment'],
    similarCases: [],
    referencedStatutes: ['Abu Dhabi Law No. (4) of 2013', 'UAE Federal Arbitration Law No. (6) of 2018', 'ADGM Arbitration Regulations 2015'],
    documentPath: '/casedocuments/ADGMCFI-2024-073- Judgment ANONYMISED SEALED.pdf'
  }
];

const statuteData = [
  {
    id: 1,
    title: 'Property Code § 1245.010 - Business Property Acquisition',
    section: 'California Property Code',
    effectiveDate: '2023-01-01',
    summary: 'Statutory framework governing acquisition of business properties for public use. Establishes compensation standards and procedural requirements for eminent domain proceedings.',
    keyProvisions: [
      'Fair market value compensation required',
      'Business good will must be considered',
      'Preliminary appraisal mandatory'
    ],
    relatedCases: [1, 2],
    keywords: ['eminent domain', 'compensation', 'property acquisition'],
    amendments: ['2023 Amendment - Enhanced compensation calculations']
  },
  {
    id: 2,
    title: 'Contract Code § 1688 - Remedies for Breach',
    section: 'California Civil Code',
    effectiveDate: '2022-07-01',
    summary: 'Prescribes available remedies when contracts are breached, including monetary damages, specific performance, and rescission. Sets limitations on liquidated damage clauses.',
    keyProvisions: [
      'Market value damages for goods',
      'Benefit of bargain for services',
      'Agreement can limit consequential damages if reasonable'
    ],
    relatedCases: [2, 3],
    keywords: ['breach remedies', 'damages', 'liquidated damages'],
    amendments: ['2022 Amendment - Clarified service contract damages']
  },
  {
    id: 3,
    title: 'Criminal Procedure Code § 1001 - Miranda Rights',
    section: 'California Penal Code',
    effectiveDate: '2021-01-01',
    summary: 'Governs provision of Miranda warnings to suspects in custody. Establishes timing requirements and documentation standards for law enforcement interviews.',
    keyProvisions: [
      'Counsel must be offered when interrogation begins',
      'Evidence obtained without warning generally inadmissible',
      'Waiver must be knowing, intelligent, and voluntary'
    ],
    relatedCases: [3],
    keywords: ['Miranda warning', 'custody', 'interrogation', 'confessions'],
    amendments: ['None since effective date']
  }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function LegalResearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [currentResults, setCurrentResults] = useState<any[]>([]);
  const [statuteResults, setStatuteResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('case-law');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCases, setSelectedCases] = useState<number[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI legal assistant. Ask me questions about the selected case for analysis.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Filter cases based on search and filters only if there's a search query
    let filteredCases = [];
    let filteredStatutes = [];

    if (searchQuery.trim()) {
      // If search query exists, filter the full data
      const query = searchQuery.toLowerCase();
      filteredCases = caseLawData.filter(caseItem =>
        caseItem.title.toLowerCase().includes(query) ||
        caseItem.summary.toLowerCase().includes(query) ||
        caseItem.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
      filteredStatutes = statuteData.filter(statute =>
        statute.title.toLowerCase().includes(query) ||
        statute.summary.toLowerCase().includes(query) ||
        statute.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );

      // Apply jurisdiction filter
      if (jurisdictionFilter !== 'all') {
        filteredCases = filteredCases.filter(caseItem =>
          caseItem.jurisdiction.toLowerCase().includes(jurisdictionFilter.toLowerCase())
        );
      }

      // Apply topic filter
      if (topicFilter !== 'all') {
        filteredCases = filteredCases.filter(caseItem =>
          caseItem.topic.toLowerCase().includes(topicFilter.toLowerCase())
        );
        filteredStatutes = filteredStatutes.filter(statute =>
          statute.keywords.some(keyword => keyword.toLowerCase().includes(topicFilter.toLowerCase()))
        );
      }
    }

    // If no cases match the search, show 3-4 dummy results all pointing to the ADGMCFI document
    if (filteredCases.length === 0 && searchQuery.trim()) {
      filteredCases = [
        {
          id: 100,
          title: 'A15 v B15 - ICC Arbitration Award Recognition',
          citation: 'A15 v B15 [2024] ADGMCFI 0012',
          date: '2024-08-05',
          jurisdiction: 'Abu Dhabi Global Market',
          court: 'ADGM Courts First Instance',
          judges: ['Justice Sir Andrew Smith'],
          summary: 'Comprehensive judgment on arbitration award recognition and enforcement under ADGM Regulations, addressing jurisdiction challenges and seat determination.',
          keyHoldings: [
            'ICC Terms of Reference established seat in Dubai',
            'Parties agreement controls jurisdiction determination',
            'Cross-challenge proceedings in Dubai Courts'
          ],
          topic: 'Arbitration Law',
          relevance: 'High',
          keywords: ['arbitration', 'award recognition', 'enforcement', 'jurisdiction'],
          similarCases: [],
          referencedStatutes: ['ADGM Arbitration Regulations 2015', 'UAE Federal Arbitration Law'],
          documentPath: '/casedocuments/ADGMCFI-2024-073- Judgment ANONYMISED SEALED.pdf'
        },
        {
          id: 101,
          title: 'International Arbitration Enforcement - UAE Framework',
          citation: 'A15 v B15 [2024] ADGMCFI 0012',
          date: '2024-08-05',
          jurisdiction: 'Abu Dhabi Global Market',
          court: 'ADGM Courts First Instance',
          judges: ['Justice Sir Andrew Smith'],
          summary: 'Detailed analysis of enforcement mechanisms for ICC arbitration awards within the UAE legal framework and ADGM jurisdiction.',
          keyHoldings: [
            'Section 60(1)(c) provides broad enforcement jurisdiction',
            'UAE Federal Arbitration Law governs arbitration procedures',
            'Court can adjourn pending foreign court determinations'
          ],
          topic: 'Arbitration Law',
          relevance: 'High',
          keywords: ['enforcement', 'international arbitration', 'UAE law', 'ICC Rules'],
          similarCases: [],
          referencedStatutes: ['UAE Federal Arbitration Law No. (6) of 2018', 'ADGM Founding Law'],
          documentPath: '/casedocuments/ADGMCFI-2024-073- Judgment ANONYMISED SEALED.pdf'
        },
        {
          id: 102,
          title: 'Seat of Arbitration - Dubai vs ADGM Jurisdiction',
          citation: 'A15 v B15 [2024] ADGMCFI 0012',
          date: '2024-08-05',
          jurisdiction: 'Abu Dhabi Global Market',
          court: 'ADGM Courts First Instance',
          judges: ['Justice Sir Andrew Smith'],
          summary: 'Important ruling on determining the legal seat of arbitration and jurisdiction between Dubai civil courts and ADGM common law courts.',
          keyHoldings: [
            'IRC Terms of Reference establishedμφωνα seat in Dubai',
            'Parties agreement controls jurisdiction determination',
            'Cross-challenge proceedings in Dubai Courts'
          ],
          topic: 'Arbitration Law',
          relevance: 'High',
          keywords: ['seat of arbitration', 'jurisdiction determination', 'Dubai courts', 'ADGM vs Dubai'],
          similarCases: [],
          referencedStatutes: ['ADGM Arbitration Regulations 2015', 'Federal Arbitration Law No. (6) of 2018'],
          documentPath: '/casedocuments/ADGMCFI-2024-073- Judgment ANONYMISED SEALED.pdf'
        },
        {
          id: 103,
          title: 'Precautionary Measures in Arbitration Disputes',
          citation: 'A15 v B15 [2024] ADGMCFI 0012',
          date: '2024-08-05',
          jurisdiction: 'Abu Dhabi Global Market',
          court: 'ADGM Courts First Instance',
          judges: ['Justice Sir Andrew Smith'],
          summary: 'Case examining jurisdiction for precautionary attachment orders and interim measures during arbitration proceedings.',
          keyHoldings: [
            'Article 18 of Federal Arbitration Law',
            'Umm Al Quwain Court earlier order challenged',
            'Jurisdiction for interim measures during arbitration'
          ],
          topic: 'Arbitration Law',
          relevance: 'High',
          keywords: ['precautionary measures', 'attachment orders', 'interim measures', 'arbitration proceedings'],
          similarCases: [],
          referencedStatutes: ['UAE Federal Arbitration Law No. (6) of 2018', 'ADGM Regulations'],
          documentPath: '/casedocuments/ADGMCFI-2024-073- Judgment ANONYMISED SEALED.pdf'
        }
      ];
    }

    setCurrentResults(filteredCases);
    setStatuteResults(filteredStatutes);
  }, [searchQuery, jurisdictionFilter, topicFilter]);

  const handleCaseSelect = (caseId: number) => {
    setSelectedCases(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleCaseClick = (caseItem: any) => {
    setSelectedCase(caseItem);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: chatInput }]);

    // Simulate AI response relevant to the selected case
    setTimeout(() => {
      let response = '';

      if (chatInput.toLowerCase().includes('property') || chatInput.toLowerCase().includes('eminent domain')) {
        response = `Regarding property law and eminent domain in ${selectedCase.title}, the court established that property owners must receive fair market value plus damages, and government must prove public necessity beyond reasonable doubt. This impacts commercial property acquisitions significantly.`;
      } else if (chatInput.toLowerCase().includes('contract') || chatInput.toLowerCase().includes('breach')) {
        response = `For contract law issues in ${selectedCase.title}, the court clarified that consequential damages are available if reasonably foreseeable, and mitigation requirements apply to damage limitation clauses. This is particularly relevant for technology service agreements.`;
      } else if (chatInput.toLowerCase().includes('constitutional') || chatInput.toLowerCase().includes('due process')) {
        response = `In ${selectedCase.title}, the constitutional analysis focused on due process requirements for government actions, requiring advance notice and hearing before property seizures or custody determinations.`;
      } else if (chatInput.toLowerCase().includes('arbitration') || chatInput.toLowerCase().includes('award') || chatInput.toLowerCase().includes('enforcement')) {
        response = `Regarding arbitration law in ${selectedCase.title}, the court determined that the seat of arbitration was Dubai as agreed by the parties under the ICC Rules, falling under section 60(1)(c) of the ADGM Arbitration Regulations for recognition and enforcement. The application was adjourned pending resolution of appeals in Dubai Courts.`;
      } else {
        // Generic case-relevant response
        const keyHolding = selectedCase.keyHoldings[0] || 'the court\'s legal reasoning';
        response = `Based on your question about "${chatInput}", regarding ${selectedCase.title}: ${keyHolding}. This decision provides important precedent for similar cases in ${selectedCase.topic.toLowerCase()}.`;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response
        }
      ]);
    }, 1000);

    setChatInput('');
  };

  const handleBulkExport = () => {
    const selectedData = caseLawData.filter(caseItem => selectedCases.includes(caseItem.id));
    console.log('Exporting cases:', selectedData);
    // In a real app, this would generate a PDF or DOCX
  };

  const getBadgeColor = (relevance: string) => {
    switch (relevance) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBadgeColorByTopic = (topic: string) => {
    const colors: Record<string, string> = {
      'Property Law': 'bg-blue-100 text-blue-800 border-blue-200',
      'Contract Law': 'bg-purple-100 text-purple-800 border-purple-200',
      'Constitutional Law': 'bg-red-100 text-red-800 border-red-200',
      'Arbitration Law': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[topic] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-background p-8 animate-fade-in">
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedCase(null)}
            className="flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Search Results
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Document Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="court-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {selectedCase.title}
                </CardTitle>
                <CardDescription>{selectedCase.citation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <iframe
                      src={`${selectedCase.documentPath}#toolbar=1&navpanes=0&view=FitH`}
                      className="w-full h-[800px] border-0 rounded"
                      title="Case Document"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - AI Chat */}
          <div className="space-y-6">
            <Card className="court-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Legal Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about the selected case for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-[900px]">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2",
                            message.role === 'user'
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Ask about this case..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    className="flex-1 h-16"
                  />
                  <Button onClick={handleChatSend} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI responses are advisory only
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom - Search Results as Cards */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">Search Results</h3>
          <div className="space-y-6">
            {currentResults.map((caseItem) => (
              <Card
                key={caseItem.id}
                className={cn(
                  "court-card hover:shadow-lg transition-all cursor-pointer",
                  selectedCase.id === caseItem.id ? "ring-2 ring-accent" : ""
                )}
                onClick={() => handleCaseClick(caseItem)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-lg font-semibold text-foreground">
                          {caseItem.title}
                        </h4>
                        <Badge className={getBadgeColor(caseItem.relevance)}>
                          {caseItem.relevance} Relevance
                        </Badge>
                        <Badge className={getBadgeColorByTopic(caseItem.topic)}>
                          {caseItem.topic}
                        </Badge>
                      </div>

                      <p className="text-sm text-accent font-medium">
                        {caseItem.citation}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{caseItem.date}</span>
                        <span>•</span>
                        <span>{caseItem.jurisdiction}</span>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {caseItem.summary}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {caseItem.keywords.slice(0, 3).map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Judicial Advisory Notice */}
        <Card className="court-card border-l-amber-500/80 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 mt-8 mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-xl text-foreground">
              <Scale className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              Judicial Advisory Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-6">
              <p className="text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                <strong className="font-semibold text-amber-900 dark:text-amber-100">Advisory Only:</strong> This AI-powered legal research assistant provides search results, case summaries, and analytical insights for informational purposes only. All research findings must be verified by qualified legal professionals, reviewed for current applicability to specific facts and jurisdictions, and cross-referenced with primary legal sources before any judicial application or decision-making. The automated analysis and recommendations are not a substitute for professional legal judgment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      {/* Header */}
      <div className="text-left mb-8">
        <div className="absolute inset-0 justice-pattern -z-10 opacity-30" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
          Legal Research Assistant
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Advanced AI-powered legal research with comprehensive case law analysis and statutory references
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Search Controls */}
          <Card className="court-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="w-5 h-5" />
                Legal Database Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Terms</Label>
                <Input
                  id="search"
                  placeholder="Case name, statute, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Search Scope</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="case-law">Case Law Only</SelectItem>
                    <SelectItem value="statutes">Statutes Only</SelectItem>
                    <SelectItem value="judgments">Judgments Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full justify-start"
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>

              {showAdvancedFilters && (
                <div className="space-y-3 border-t pt-3">
                  <div className="space-y-2">
                    <Label>Jurisdiction</Label>
                    <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jurisdictions</SelectItem>
                        <SelectItem value="supreme">Supreme Court</SelectItem>
                        <SelectItem value="circuit">Circuit Courts</SelectItem>
                        <SelectItem value="california">California</SelectItem>
                        <SelectItem value="federal">Federal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Legal Topic</Label>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        <SelectItem value="property">Property Law</SelectItem>
                        <SelectItem value="contract">Contract Law</SelectItem>
                        <SelectItem value="constitutional">Constitutional Law</SelectItem>
                        <SelectItem value="arbitration">Arbitration Law</SelectItem>
                        <SelectItem value="criminal">Criminal Law</SelectItem>
                        <SelectItem value="civil">Civil Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => {
                  setSearchQuery('');
                  setJurisdictionFilter('all');
                  setTopicFilter('all');
                }}>
                  Clear
                </Button>
                <Button variant="outline" className="flex-1">
                  Save Search
                </Button>
              </div>

              {selectedCases.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedCases.length} case(s) selected
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleBulkExport}>
                    Export Selected Cases
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Research Analytics */}
          <Card className="court-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Research Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cases Found</span>
                  <span className="font-medium">{currentResults.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Relevance</span>
                  <span className="font-medium">{currentResults.filter(c => c.relevance === 'High').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Statutes</span>
                  <span className="font-medium">{statuteResults.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Search Time</span>
                  <span className="font-medium">0.8s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="court-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
                  <Calendar className="w-3 h-3 mr-2" />
                  <span className="text-xs">Cases from 2023-2024</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
                  <Users className="w-3 h-3 mr-2" />
                  <span className="text-xs">Precedent Analysis</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
                  <MapPin className="w-3 h-3 mr-2" />
                  <span className="text-xs">California Jurisdiction</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
                  <Clock className="w-3 h-3 mr-2" />
                  <span className="text-xs">Recent Amendments</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="case-law">Case Law ({currentResults.length})</TabsTrigger>
              <TabsTrigger value="statutes">Statutes ({statuteResults.length})</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="case-law" className="space-y-6 mt-6">
              {currentResults.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">Judicial Precedents</h2>
                      <p className="text-muted-foreground">Relevant court decisions and case law</p>
                    </div>
                  </div>

                  <ScrollArea className="h-[800px]">
                    <div className="space-y-4">
                      {currentResults.map((caseItem) => (
                        <Card
                          key={caseItem.id}
                          className="court-card hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => handleCaseClick(caseItem)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex items-center mt-1">
                                <Checkbox
                                  checked={selectedCases.includes(caseItem.id)}
                                  onCheckedChange={() => handleCaseSelect(caseItem.id)}
                                />
                                <FileText className="w-5 h-5 text-accent ml-3" />
                              </div>

                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <h3 className="text-lg font-semibold text-foreground">
                                        {caseItem.title}
                                      </h3>
                                      <div className="flex gap-2 flex-shrink-0">
                                        <Badge className={getBadgeColor(caseItem.relevance)}>
                                          {caseItem.relevance} Relevance
                                        </Badge>
                                        <Badge className={getBadgeColorByTopic(caseItem.topic)}>
                                          {caseItem.topic}
                                        </Badge>
                                      </div>
                                    </div>

                                    <p className="text-sm text-accent font-medium">
                                      {caseItem.citation}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span>{caseItem.jurisdiction}</span>
                                      <span>•</span>
                                      <span>{caseItem.court}</span>
                                      <span>•</span>
                                      <span>{new Date(caseItem.date).toLocaleDateString()}</span>
                                      <span>•</span>
                                      <span>{caseItem.judges.length} Judge{caseItem.judges.length > 1 ? 's' : ''}</span>
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed">
                                      {caseItem.summary}
                                    </p>

                                    {caseItem.keyHoldings.length > 0 && (
                                      <div>
                                        <p className="text-sm font-medium text-foreground mb-2">Key Holdings:</p>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                          {caseItem.keyHoldings.slice(0, 2).map((holding, idx) => (
                                            <li key={idx}>{holding}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <div className="flex flex-wrap gap-1">
                                      {caseItem.keywords.slice(0, 4).map((keyword, idx) => (
                                        <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                                          #{keyword}
                                        </span>
                                      ))}
                                      {caseItem.keywords.length > 4 && (
                                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                          +{caseItem.keywords.length - 4} more
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <ChevronRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button variant="outline" size="sm">
                                    View Full Case
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Similar Cases ({caseItem.similarCases.length})
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Cite Case
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Search className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">No search results</h3>
                  <p className="text-muted-foreground">
                    Enter a search query to find relevant legal precedents and statutes.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="statutes" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Statutory References</h2>
                  <p className="text-muted-foreground">Applicable laws and regulations</p>
                </div>
              </div>

              <ScrollArea className="h-[800px]">
                <div className="space-y-4">
                  {statuteResults.map((statute) => (
                    <Card key={statute.id} className="court-card">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <BookOpen className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {statute.title}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{statute.section}</span>
                                  <span>•</span>
                                  <span>Effective: {new Date(statute.effectiveDate).toLocaleDateString()}</span>
                                </div>

                                <p className="text-muted-foreground leading-relaxed">
                                  {statute.summary}
                                </p>

                                {statute.keyProvisions.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-2">Key Provisions:</p>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {statute.keyProvisions.map((provision, idx) => (
                                        <li key={idx}>{provision}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-1">
                                  {statute.keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm">
                                View Full Text
                              </Button>
                              <Button variant="outline" size="sm">
                                Related Cases ({statute.relatedCases.length})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6 mt-6">
              <Card className="court-card">
                <CardHeader>
                  <CardTitle>Legal Analysis & Insights</CardTitle>
                  <CardDescription>
                    AI-generated analysis of current legal trends and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Precedent Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Property Law Cases</span>
                              <span className="font-medium">35%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Contract Disputes</span>
                              <span className="font-medium">28%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Constitutional Issues</span>
                              <span className="font-medium">20%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Key Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">Rising Property Disputes</p>
                            <p className="text-xs text-blue-700">42% increase in eminent domain cases in commercial districts</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm font-medium text-purple-900">Contract Law Evolution</p>
                            <p className="text-xs text-purple-700">Courts increasingly favoring service contract flexibility</p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium text-red-900">Due Process Emphasis</p>
                            <p className="text-xs text-red-700">Heightened scrutiny on procedural fairness in administrative actions</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="text-base">Recommended Research Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Based on current case patterns and your jurisdiction:
                          </p>
                          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                            <li>Focus on recent eminent domain precedents due to increased commercial property disputes</li>
                            <li>Review service contract damage calculations for technology agreements</li>
                            <li>Monitor developments in due process requirements for government actions</li>
                            <li>Consider legislative amendments affecting property acquisition procedures</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Judicial Advisory Notice */}
      <Card className="court-card border-l-amber-500/80 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <Scale className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            Judicial Advisory Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-6">
            <p className="text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
              <strong className="font-semibold text-amber-900 dark:text-amber-100">Advisory Only:</strong> This AI-powered legal research assistant provides search results, case summaries, and analytical insights for informational purposes only. All research findings must be verified by qualified legal professionals, reviewed for current applicability to specific facts and jurisdictions, and cross-referenced with primary legal sources before any judicial application or decision-making. The automated analysis and recommendations are not a substitute for professional legal judgment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
