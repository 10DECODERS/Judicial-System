import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Printer, 
  MessageCircle,
  Send,
  X
} from 'lucide-react';

interface CaseData {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  relevance: number;
  summary: string;
  keyHoldings: string[];
  citations: {
    citedBy: number;
    cites: number;
  };
  relatedStatutes: string[];
}

const mockCaseData: CaseData = {
  id: '1',
  title: 'Smith v. Johnson',
  citation: '245 F.3d 789 (9th Cir. 2023)',
  court: 'Federal - 9th Circuit',
  date: 'March 12, 2023',
  relevance: 95,
  summary: 'The court held that contractual obligations remain enforceable even in cases of force majeure when the event was reasonably foreseeable... The court further elaborated on the principles governing contract interpretation, emphasizing the importance of examining extrinsic evidence when the contract language is ambiguous.',
  keyHoldings: [
    'Contractual obligations remain enforceable unless force majeure was unforeseeable',
    'Plain language interpretation is the primary method of contract analysis',
    'Burden of proof lies with the party seeking enforcement of non-standard terms'
  ],
  citations: {
    citedBy: 127,
    cites: 45
  },
  relatedStatutes: [
    'UCC § 2-615 - Excuse by Failure of Presupposed Conditions',
    'Restatement (Second) of Contracts § 261',
    'Cal. Civ. Code § 1511'
  ]
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData] = useState<CaseData>(mockCaseData);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `I'm your AI legal assistant for ${caseData.title}. Ask me anything about this case, its holdings, or related precedents.` 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: `Based on ${caseData.title}, ${input.toLowerCase().includes('holding') ? 'the key holding is that contractual obligations remain enforceable even in cases of force majeure when the event was reasonably foreseeable. This established an important precedent for contract law interpretation.' : input.toLowerCase().includes('citation') ? `this case has been cited by ${caseData.citations.citedBy} subsequent cases and cites ${caseData.citations.cites} cases itself, showing its significant influence in contract law jurisprudence.` : 'this case provides important guidance on contract interpretation and force majeure clauses. Would you like me to elaborate on any specific aspect?'}`
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="h-full bg-[hsl(var(--main-bg))] p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/judge/research')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-semibold text-headings mb-2">
              {caseData.title}
            </h1>
            <p className="text-lg text-body mb-2">{caseData.citation}</p>
            <div className="flex items-center gap-4 text-sm text-body">
              <span>{caseData.court}</span>
              <span>•</span>
              <span>{caseData.date}</span>
              <Badge className="ml-2 bg-accent/10 text-accent border-accent/20">
                Relevance: {caseData.relevance}%
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-borders">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmark
            </Button>
            <Button variant="outline" size="sm" className="border-borders">
              <Share2 className="w-4 h-4 mr-2" />
              Share to Clerk
            </Button>
            <Button variant="outline" size="sm" className="border-borders">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="court-card">
            <CardContent className="p-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="details">Case Details</TabsTrigger>
                  <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  <TabsTrigger value="statutes">Related Statutes</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-headings mb-3">Summary</h3>
                        <p className="text-sm text-body leading-relaxed">{caseData.summary}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-headings mb-3">Key Holdings</h3>
                        <ul className="space-y-2">
                          {caseData.keyHoldings.map((holding, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="text-accent mt-1">•</span>
                              <span className="text-sm text-body">{holding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-headings mb-3">Citations</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-[hsl(var(--main-bg))] border-borders">
                            <CardContent className="p-4">
                              <p className="text-2xl font-bold text-accent">{caseData.citations.citedBy}</p>
                              <p className="text-sm text-body">Cited by cases</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-[hsl(var(--main-bg))] border-borders">
                            <CardContent className="p-4">
                              <p className="text-2xl font-bold text-accent">{caseData.citations.cites}</p>
                              <p className="text-sm text-body">Cites cases</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="summary">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      <div className="bg-accent/5 border-l-4 border-accent p-4 rounded">
                        <p className="text-sm font-semibold text-accent mb-2">AI-Generated Summary</p>
                        <p className="text-sm text-body leading-relaxed">
                          This case establishes a critical precedent in contract law regarding force majeure clauses. 
                          The court's decision emphasizes foreseeability as a key factor in determining enforceability 
                          of contractual obligations during unexpected events. The ruling has significant implications 
                          for commercial disputes and has been widely cited in subsequent cases dealing with contract 
                          interpretation and performance excuses.
                        </p>
                      </div>
                      <p className="text-sm text-body leading-relaxed">{caseData.summary}</p>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="statutes">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                      {caseData.relatedStatutes.map((statute, idx) => (
                        <Card key={idx} className="border-borders hover:border-accent/50 transition-colors">
                          <CardContent className="p-4">
                            <p className="text-sm text-body font-medium">{statute}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Assistant */}
        <div className="col-span-1">
          <Card className="court-card h-[680px] flex flex-col">
            <div className="p-4 border-b border-borders bg-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-headings">AI Case Assistant</h3>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-accent text-white'
                          : 'bg-[hsl(var(--main-bg))] border border-borders'
                      }`}
                    >
                      <p className={`text-sm leading-relaxed ${message.role === 'assistant' ? 'text-body' : ''}`}>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-borders">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this case..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-[hsl(var(--search-bg))] border-borders"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-accent hover:bg-[hsl(var(--button-hover))] text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-body mt-2 text-center">
                AI responses are advisory only
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
