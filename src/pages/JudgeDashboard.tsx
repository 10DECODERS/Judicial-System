import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { mockTranscriptionRecords } from '@/lib/transcriptionUtils';
import { AIAssistant } from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, BookOpen, Clock, CheckCircle, FileText, Users, Calendar, TrendingUp, AlertTriangle, Scale, ChevronRight } from 'lucide-react';
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
    <div className="p-8 animate-fade-in min-h-screen max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-slate-800 tracking-tight">Judge Dashboard</h1>
          <div className="flex items-center text-sm font-medium gap-2">
            <span className="text-slate-500 font-semibold">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white border-none shadow-sm ring-1 ring-slate-200/50 text-slate-600 font-medium rounded-full">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-xl hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Cases</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">24</span>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">Total</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-xl hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Hearings</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">8</span>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-xl hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Urgent Matters</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">3</span>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-none">Action Req</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-xl hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Research Queries</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">12</span>
                <Badge variant="secondary" className="bg-violet-50 text-violet-700 hover:bg-violet-100 border-none">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Today's Schedule</h3>
        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">9:00 AM - Criminal Trial</p>
                    <p className="text-xs text-slate-500 font-medium">Case #2025-CR-023 • Courtroom 3A</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-emerald-50/50 hover:bg-emerald-50 transition-colors rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">11:00 AM - Motion Hearing</p>
                    <p className="text-xs text-slate-500 font-medium">Case #2025-CV-045 • Completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-amber-50/50 hover:bg-amber-50 transition-colors rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">2:00 PM - Emergency Hearing</p>
                    <p className="text-xs text-slate-500 font-medium">Case #2025-EM-012 • Urgent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-violet-50/50 hover:bg-violet-50 transition-colors rounded-xl">
                  <FileText className="w-5 h-5 text-violet-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">4:00 PM - Case Review</p>
                    <p className="text-xs text-slate-500 font-medium">Case #2025-CV-067 • Pending Decision</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4 bg-white border-b border-slate-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              Recent Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {mockTranscriptionRecords.slice(0, 3).map((record, index) => (
                <div key={record.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all duration-200 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 font-bold text-xs group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                      {record.caseTitle.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 group-hover:text-blue-700 transition-colors">{record.caseTitle}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Case #{record.caseNumber}</p>
                    </div>
                  </div>
                  <Badge className={`${index === 0 ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" :
                    index === 1 ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100" :
                      "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                    } border-none shadow-none font-semibold px-2.5`}>
                    {index === 0 ? "Active" : index === 1 ? "In Progress" : "Review"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4 bg-white border-b border-slate-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Users className="w-5 h-5 text-rose-600" />
              </div>
              Court Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Cases Resolved This Month</span>
                  <span className="font-bold text-slate-900">18/24</span>
                </div>
                <Progress value={75} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600 rounded-full" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Average Case Duration</span>
                  <span className="font-bold text-slate-900">45 days</span>
                </div>
                <Progress value={60} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-600 rounded-full" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Research Accuracy Rate</span>
                  <span className="font-bold text-slate-900">94%</span>
                </div>
                <Progress value={94} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-violet-400 [&>div]:to-violet-600 rounded-full" />
              </div>
              <div className="pt-3 border-t border-slate-100 mt-1">
                <p className="text-xs text-slate-500 mb-2 font-medium flex items-center gap-2">
                  Court Efficiency Score
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-200 text-emerald-700 bg-emerald-50">Top 10%</Badge>
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 h-full rounded-full animate-pulse-slow" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 min-w-[32px]">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Judicial Advisory Notice */}
      <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden mb-8 border-l-4 border-l-amber-500">
        <CardHeader className="pb-4 bg-white border-b border-slate-50">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            Judicial Advisory Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
            <p className="text-base text-slate-700 leading-relaxed">
              <strong className="font-bold text-amber-900">Advisory Only:</strong> This AI-powered legal research assistant provides search results, case summaries, and analytical insights for informational purposes only. All research findings must be verified by qualified legal professionals, reviewed for current applicability to specific facts and jurisdictions, and cross-referenced with primary legal sources before any judicial application or decision-making. The automated analysis and recommendations are not a substitute for professional legal judgment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgeDashboard;
