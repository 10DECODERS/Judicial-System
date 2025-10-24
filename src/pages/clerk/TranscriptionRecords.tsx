import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search,
  Download,
  Eye,
  Filter,
  Calendar,
  Clock,
  Globe,
  User,
  FileText,
  MoreHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types for transcript records
interface TranscriptRecord {
  id: string;
  caseNumber: string;
  caseTitle: string;
  date: string;
  duration: string;
  language: string;
  clerkName: string;
  status: 'completed' | 'processing' | 'failed';
  verification: 'pending' | 'approved' | 'rejected';
  fileSize: string;
  speakers: string[];
}

// Mock data for demonstration
const mockTranscriptRecords: TranscriptRecord[] = [
  {
    id: '1',
    caseNumber: '2025-CR-023',
    caseTitle: 'State vs. Johnson',
    date: '2025-01-15',
    duration: '02:15:30',
    language: 'English',
    clerkName: 'Sarah Williams',
    status: 'completed',
    verification: 'approved',
    fileSize: '2.4 MB',
    speakers: ['Judge Martinez', 'Defense Attorney', 'Prosecutor', 'Witness']
  },
  {
    id: '2',
    caseNumber: '2025-CV-067',
    caseTitle: 'Smith Enterprises vs. Tech Corp',
    date: '2025-01-14',
    duration: '01:45:20',
    language: 'English',
    clerkName: 'Michael Chen',
    status: 'completed',
    verification: 'pending',
    fileSize: '1.8 MB',
    speakers: ['Judge Williams', 'Plaintiff Attorney', 'Defense Attorney']
  },
  {
    id: '3',
    caseNumber: '2025-CR-019',
    caseTitle: 'People vs. Rodriguez',
    date: '2025-01-13',
    duration: '03:20:15',
    language: 'Hindi',
    clerkName: 'Priya Patel',
    status: 'processing',
    verification: 'pending',
    fileSize: '3.1 MB',
    speakers: ['Judge Kumar', 'Defense Attorney', 'Prosecutor', 'Witness']
  },
  {
    id: '4',
    caseNumber: '2025-CV-045',
    caseTitle: 'Brown Family Trust Dispute',
    date: '2025-01-12',
    duration: '01:30:45',
    language: 'Tamil',
    clerkName: 'Arun Kumar',
    status: 'completed',
    verification: 'rejected',
    fileSize: '1.5 MB',
    speakers: ['Judge Lakshmi', 'Family Attorney', 'Trust Attorney']
  },
  {
    id: '5',
    caseNumber: '2025-CR-088',
    caseTitle: 'State vs. Anderson',
    date: '2025-01-11',
    duration: '02:45:10',
    language: 'English',
    clerkName: 'Sarah Williams',
    status: 'failed',
    verification: 'pending',
    fileSize: '0 MB',
    speakers: []
  }
];

const statusColors = {
  completed: 'bg-green-100 text-green-800 border-green-300',
  processing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  failed: 'bg-red-100 text-red-800 border-red-300'
};

const TranscriptionRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const navigate = useNavigate();

  // Filter and sort records
  const filteredRecords = mockTranscriptRecords
    .filter(record => {
      const matchesSearch = record.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.clerkName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage = filterLanguage === 'all' || record.language.toLowerCase() === filterLanguage.toLowerCase();
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;

      return matchesSearch && matchesLanguage && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof TranscriptRecord] as string;
      let bValue: string | number = b[sortBy as keyof TranscriptRecord] as string;

      if (sortBy === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleViewTranscript = (recordId: string) => {
    // Navigate to detailed view
    navigate(`/clerk/transcript-detail/${recordId}`);
  };

  const handleDownload = (recordId: string, format: 'pdf' | 'txt') => {
    console.log(`Downloading transcript ${recordId} as ${format}`);
    // Here you would implement the actual download functionality
  };

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Transcription Records</h1>
            <p className="text-muted-foreground">Manage and access saved courtroom transcriptions</p>
          </div>
          <Button onClick={() => navigate('/clerk/transcription')}>
            <FileText className="w-4 h-4 mr-2" />
            New Transcription
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by case number, title, or clerk name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="w-40">
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Transcript Records ({filteredRecords.length})</CardTitle>
            <CardDescription>
              {filteredRecords.length} of {mockTranscriptRecords.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('caseNumber')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Case Number
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('caseTitle')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Case Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('date')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Clerk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{record.caseNumber}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={record.caseTitle}>
                          {record.caseTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {record.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.language}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {record.clerkName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[record.status]}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          record.verification === 'approved' ? 'default' :
                          record.verification === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {record.verification.charAt(0).toUpperCase() + record.verification.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.fileSize}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTranscript(record.id)}
                            disabled={record.status !== 'completed'}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(record.id, 'pdf')}
                            disabled={record.status !== 'completed'}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No transcripts found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || filterLanguage !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start a new transcription session to create your first record.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockTranscriptRecords.filter(r => r.status === 'completed').length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockTranscriptRecords.filter(r => r.status === 'processing').length}</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(mockTranscriptRecords.map(r => r.language)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Languages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(mockTranscriptRecords.map(r => r.clerkName)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Clerks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionRecords;
