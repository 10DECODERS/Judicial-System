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
import UserManagement from './admin/UserManagement';
import UserRoles from './admin/UserRoles';
import AuditLog from './admin/AuditLog';
import { mockTranscriptionRecords } from '@/lib/transcriptionUtils';

const ClerkDashboard = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ClerkDashboardHome />} />
        <Route path="/transcription" element={<TranscriptionControl />} />
        <Route path="/transcription-records" element={<TranscriptionRecords />} />
        <Route path="/transcript-view/:recordId" element={<TranscriptView />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<UserRoles />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/*" element={<div className="p-8 text-center text-muted-foreground">Module coming soon</div>} />
      </Routes>
      <AIAssistant />
    </>
  );
};

const ClerkDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 animate-fade-in">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2 tracking-tight">
              Clerk's Office
            </h1>
            <p className="text-sm text-muted-foreground">Court transcription management and record keeping system.</p>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Sessions</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">3</span>
                <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-none">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Completed Today</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">12</span>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">Transcripts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">5</span>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-none">Queued</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Success Rate</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900">96%</span>
                <Badge variant="secondary" className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-none">Target 95%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Access Modules */}
        <div className="h-full">
          <Card
            className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer group"
            onClick={() => navigate('/clerk/transcription', { state: { view: 'live' } })}
          >
            <CardHeader className="pb-4 bg-white border-b border-slate-50">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800 group-hover:text-[#0047BB] transition-colors">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <Mic className="w-5 h-5 text-slate-500 group-hover:text-[#0047BB] transition-colors" />
                </div>
                Transcription Control
              </CardTitle>
              <CardDescription className="text-base ml-[52px]">Manage courtroom transcription</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mic className="w-5 h-5 text-[#0047BB]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900">Start New Transcription</p>
                    <p className="text-sm text-slate-500">Begin recording courtroom proceedings</p>
                  </div>
                  <Badge className="bg-[#0047BB] hover:bg-[#003da1] text-white">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions */}
        <div className="h-full">
          <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-4 bg-white border-b border-slate-50">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-500" />
                </div>
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">Courtroom 3A - Criminal Trial</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Case #2025-CR-023 • Started 2h 15m ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 hover:border-cyan-200 transition-colors">
                  <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full mt-2 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">Courtroom 2B - Civil Hearing</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Case #2025-CV-045 • Started 45m ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-700">Courtroom 1A - Standby</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Next case scheduled for 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Records & Courtroom Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-white border-b border-slate-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <div className="p-2 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-slate-500" />
              </div>
              Recent Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {mockTranscriptionRecords.slice(0, 3).map((record, index) => (
                <div key={record.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-50 group-hover:text-[#0047BB] transition-colors">
                      {record.caseTitle.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{record.caseTitle}</p>
                      <p className="text-xs text-[#0047BB] font-medium mt-0.5">Case #{record.caseNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${index === 0 ? 'bg-emerald-100 text-emerald-800' :
                      index === 1 ? 'bg-cyan-100 text-cyan-800' :
                        'bg-amber-100 text-amber-800'
                      } mb-1 border-none shadow-none`}>
                      {index === 0 ? 'Complete' : index === 1 ? 'Processing' : 'Review'}
                    </Badge>
                    <p className="text-xs text-slate-400 font-medium">
                      {index === 0 ? record.duration : index === 1 ? 'Est. 30m' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-white border-b border-slate-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Users className="w-5 h-5 text-slate-500" />
              </div>
              Courtroom Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm font-bold text-slate-700">Courtroom 1A</span>
                <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">Standby</Badge>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm font-bold text-slate-900">Courtroom 2B</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm font-bold text-slate-900">Courtroom 3A</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm font-bold text-slate-700">Courtroom 4B</span>
                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none shadow-none">Maintenance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Judicial Advisory Notice */}
      {/* Judicial Advisory Notice */}
      <Card className="bg-white border-none shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden mb-8 border-l-4 border-l-amber-500">
        <CardHeader className="pb-4 bg-white border-b border-slate-50">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            Judicial Advisory Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
            <p className="text-base text-slate-700 leading-relaxed">
              <strong className="font-bold text-amber-700">Advisory Only:</strong> This AI-powered transcription and record management system provides automated drafts for efficiency. All transcripts must be certified by an official court reporter and reviewed for accuracy against the official audio record before becoming part of the permanent judicial record. Automated outputs are tools to assist, not replace, certified verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkDashboard;
