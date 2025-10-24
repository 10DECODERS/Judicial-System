import { Routes, Route, useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { AIAssistant } from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, BookOpen, Clock, CheckCircle, FileText, Users, Calendar, TrendingUp, AlertTriangle, Scale } from 'lucide-react';
import TranscriptsPage from './judge/TranscriptsPage';
import TranscriptDetailView from './judge/TranscriptDetailView';
import ResearchPage from './judge/ResearchPage';
import CaseDetailPage from './judge/CaseDetailPage';

const JudgeDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-background flex-col">
      <TopBar />

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<JudgeDashboardHome />} />
          <Route path="/transcripts" element={<TranscriptsPage />} />
          <Route path="/transcript-detail/:recordId" element={<TranscriptDetailView />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/case/:caseId" element={<CaseDetailPage />} />
          <Route path="/*" element={<div className="p-8 text-center text-muted-foreground">Module coming soon</div>} />
        </Routes>
      </main>

      <AIAssistant />
    </div>
  );
};

const JudgeDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8 animate-fade-in">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2 tracking-tight">
              Judge Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">Welcome back, Your Honor. Here's your case overview for today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[hsl(var(--court-cream))] to-[hsl(var(--court-gray-light))] border-[hsl(var(--court-navy))]/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--court-navy))]">Active Cases</p>
                <p className="text-3xl font-bold text-[hsl(var(--court-navy))]">24</p>
              </div>
              <Scale className="w-8 h-8 text-[hsl(var(--accent))]" />
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-2 [&>div]:bg-[hsl(var(--accent))]" />
              <p className="text-xs text-[hsl(var(--court-navy))]/70 mt-2">18 completed this month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Pending Hearings</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">8</p>
              </div>
              <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-4">
              <Progress value={60} className="h-2" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Next hearing in 2 hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Urgent Matters</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-4">
              <Progress value={30} className="h-2" />
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Requires immediate attention</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Research Queries</p>
                <p className="text-3xl font-bold text-violet-900 dark:text-violet-100">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="mt-4">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-2">AI assistance available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quick Access Modules */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="court-card card-hover cursor-pointer border-l-[hsl(var(--accent))] group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/20" onClick={() => navigate('/judge/transcripts')}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Mic className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">Courtroom Transcription</CardTitle>
                    <CardDescription className="text-base">Live & translated records</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="flex-1">
                      <p className="text-base font-medium">Live Session Active</p>
                      <p className="text-sm text-muted-foreground">Case #2025-CR-023 - Criminal Trial</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">LIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] rounded-lg">
                    <div>
                      <p className="text-base font-medium">Recent Transcript</p>
                      <p className="text-sm text-muted-foreground">Case #2025-CV-067 - Civil Matter</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="court-card card-hover cursor-pointer border-l-violet-400 group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-violet-50/50 to-violet-100/30 dark:from-violet-950/20 dark:to-violet-900/20" onClick={() => navigate('/judge/research')}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <BookOpen className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">Legal Research Assistant</CardTitle>
                    <CardDescription className="text-base">AI-powered case law search</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-[hsl(var(--muted))] rounded-lg">
                    <p className="text-base font-medium mb-3">Recent Research</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">• Precedent for intellectual property</p>
                        <Badge variant="outline" className="text-xs">95% match</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">• Contract law statutes 2024</p>
                        <Badge variant="outline" className="text-xs">Updated</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">• Similar cases in 9th Circuit</p>
                        <Badge variant="outline" className="text-xs">12 found</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Today's Schedule */}
        <div>
          <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Today's Schedule</h3>
          <Card className="bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/20 dark:to-slate-900/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200/50">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">9:00 AM - Criminal Trial</p>
                    <p className="text-xs text-muted-foreground">Case #2025-CR-023 - Courtroom 3A</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">11:00 AM - Motion Hearing</p>
                    <p className="text-xs text-muted-foreground">Case #2025-CV-045 - Completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200/50">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">2:00 PM - Emergency Hearing</p>
                    <p className="text-xs text-muted-foreground">Case #2025-EM-012 - Urgent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-violet-50 dark:bg-violet-950/50 rounded-lg border border-violet-200/50">
                  <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">4:00 PM - Case Review</p>
                    <p className="text-xs text-muted-foreground">Case #2025-CV-067 - Pending Decision</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Cases & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Recent Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <div>
                  <p className="font-medium">Smith vs. Johnson</p>
                  <p className="text-sm text-muted-foreground">Civil Case #2025-CV-067</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <div>
                  <p className="font-medium">State vs. Williams</p>
                  <p className="text-sm text-muted-foreground">Criminal Case #2025-CR-023</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <div>
                  <p className="font-medium">Davis Family Trust</p>
                  <p className="text-sm text-muted-foreground">Estate Case #2025-ES-012</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Review</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50/50 to-rose-100/30 dark:from-rose-950/20 dark:to-rose-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Court Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Cases Resolved This Month</span>
                  <span className="font-medium">18/24</span>
                </div>
                <Progress value={75} className="h-2 [&>div]:bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Case Duration</span>
                  <span className="font-medium">45 days</span>
                </div>
                <Progress value={60} className="h-2 [&>div]:bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Research Accuracy Rate</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2 [&>div]:bg-violet-500" />
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Court Efficiency Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[hsl(var(--muted))] rounded-full h-3">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Advisory Notice */}
      <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-2xl">
            <span className="text-3xl">⚖️</span>
            AI Advisory Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-8">
            <p className="text-lg text-yellow-900 dark:text-yellow-100 leading-relaxed">
              <strong className="font-semibold text-xl">Advisory Only:</strong> All AI-generated content, research suggestions, and case analysis are provided as advisory tools only.
              Final decisions remain with the presiding judge based on law, evidence, and judicial discretion. AI assistance should supplement, not replace, judicial judgment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgeDashboard;
