import { Routes, Route, useNavigate } from 'react-router-dom';
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
    <>
      <Routes>
        <Route path="/" element={<JudgeDashboardHome />} />
        <Route path="/transcripts" element={<TranscriptsPage />} />
        <Route path="/transcript-detail/:recordId" element={<TranscriptDetailView />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/case/:caseId" element={<CaseDetailPage />} />
        <Route path="/*" element={<div className="p-8 text-center text-muted-foreground">Module coming soon</div>} />
      </Routes>
      <AIAssistant />
    </>
  );
};

const JudgeDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-background to-muted/20 p-8 animate-fade-in">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
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
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
              <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Cases</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">24</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Pending Hearings</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">8</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Scheduled</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Urgent Matters</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">3</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Action Req</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Research Queries</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">12</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <h3 className="text-2xl font-display font-semibold mb-4 text-foreground">Today's Schedule</h3>
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

      {/* Judicial Advisory Notice */}
      <Card className="court-card border-l-amber-500/80 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 mb-8">
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
};

export default JudgeDashboard;
