import { Routes, Route, useNavigate } from 'react-router-dom';
import { AIAssistant } from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, FileText, Clock, CheckCircle, Users, Calendar, AlertTriangle, TrendingUp, Headphones, FileCheck } from 'lucide-react';
import TranscriptionControl from './clerk/TranscriptionControl';
import TranscriptionRecords from './clerk/TranscriptionRecords';
import TranscriptView from './clerk/TranscriptView';

const ClerkDashboard = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ClerkDashboardHome />} />
        <Route path="/transcription" element={<TranscriptionControl />} />
        <Route path="/transcription-records" element={<TranscriptionRecords />} />
        <Route path="/transcript-view/:recordId" element={<TranscriptView />} />
        <Route path="/*" element={<div className="p-8 text-center text-muted-foreground">Module coming soon</div>} />
      </Routes>
      <AIAssistant />
    </>
  );
};

const ClerkDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-background to-muted/20 p-8 animate-fade-in">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
              Clerk's Office
            </h1>
            <p className="text-lg text-muted-foreground">Court transcription management and record keeping system.</p>
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
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mb-3">
              <Headphones className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Sessions</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">3</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">Live</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
              <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Completed Today</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">12</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Transcripts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Pending Review</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">5</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Queued</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Success Rate</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">96%</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">Target 95%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Access Modules */}
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4 text-foreground">Quick Access</h2>
          <Card className="court-card card-hover cursor-pointer border-l-[hsl(var(--accent))] group hover:shadow-lg transition-all duration-300 bg-card" onClick={() => navigate('/clerk/transcription')}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Mic className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1">Transcription Control</CardTitle>
                  <CardDescription className="text-base">Manage courtroom transcription</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-teal-50 dark:bg-teal-950/50 rounded-lg border border-teal-200 dark:border-teal-800">
                  <Mic className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div className="flex-1">
                    <p className="text-base font-medium">Start New Transcription</p>
                    <p className="text-sm text-muted-foreground">Begin recording courtroom proceedings</p>
                  </div>
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">Ready</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full mt-3" variant="outline">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                  <Button className="w-full mt-3" variant="outline">
                    <Headphones className="w-4 h-4 mr-2" />
                    Monitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="text-2xl font-display font-semibold mb-4 text-foreground">Active Sessions</h3>
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Courtroom 3A - Criminal Trial</p>
                    <p className="text-xs text-muted-foreground">Case #2025-CR-023 • Started 2h 15m ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-950/50 rounded-lg border border-cyan-200/50">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Courtroom 2B - Civil Hearing</p>
                    <p className="text-xs text-muted-foreground">Case #2025-CV-045 • Started 45m ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200/50">
                  <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Courtroom 1A - Standby</p>
                    <p className="text-xs text-muted-foreground">Next case scheduled for 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Records & Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Recent Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <div>
                  <p className="font-medium">State vs. Williams</p>
                  <p className="text-sm text-muted-foreground">Criminal Case #2025-CR-023</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 mb-1">Complete</Badge>
                  <p className="text-xs text-muted-foreground">2h 15m</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <div>
                  <p className="font-medium">Smith vs. Johnson</p>
                  <p className="text-sm text-muted-foreground">Civil Case #2025-CV-067</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 mb-1">Processing</Badge>
                  <p className="text-xs text-muted-foreground">Est. 30m</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <div>
                  <p className="font-medium">Davis Family Trust</p>
                  <p className="text-sm text-muted-foreground">Estate Case #2025-ES-012</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 mb-1">Review</Badge>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Transcription Accuracy</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <Progress value={94} className="h-2 [&>div]:bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Processing Speed</span>
                  <span className="font-medium">2.3x real-time</span>
                </div>
                <Progress value={85} className="h-2 [&>div]:bg-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Audio Quality Score</span>
                  <span className="font-medium">8.7/10</span>
                </div>
                <Progress value={87} className="h-2 [&>div]:bg-violet-500" />
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Overall Performance</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[hsl(var(--muted))] rounded-full h-3">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">91%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-emerald-800 dark:text-emerald-200">All Systems Operational</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Last checked 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-950/50 rounded-lg border border-cyan-200/50">
                <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-cyan-800 dark:text-cyan-200">Scheduled Maintenance</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400">Sunday 2:00 AM - 4:00 AM EST</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              Courtroom Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg">
                <span className="text-sm font-medium">Courtroom 1A</span>
                <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200">Standby</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg">
                <span className="text-sm font-medium">Courtroom 2B</span>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg">
                <span className="text-sm font-medium">Courtroom 3A</span>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-lg">
                <span className="text-sm font-medium">Courtroom 4B</span>
                <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">Maintenance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Judicial Advisory Notice */}
      <Card className="court-card border-l-amber-500/80 bg-card mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            Judicial Advisory Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-6">
            <p className="text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
              <strong className="font-semibold text-amber-900 dark:text-amber-100">Advisory Only:</strong> This AI-powered transcription and record management system provides automated drafts for efficiency. All transcripts must be certified by an official court reporter and reviewed for accuracy against the official audio record before becoming part of the permanent judicial record. Automated outputs are tools to assist, not replace, certified verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkDashboard;
