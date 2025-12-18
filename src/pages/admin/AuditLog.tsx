import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    History,
    Search,
    Filter,
    Download,
    Upload,
    Plus,
    AlertTriangle,
    Info,
    User,
    Shield,
    FileText,
    Calendar as CalendarIcon,
    Pause,
    Play,
    Activity,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const initialLogs = [
    {
        id: '1',
        timestamp: '2025-12-18 11:24:05',
        user: 'Ahmed Al Mansouri',
        action: 'User Login',
        category: 'Security',
        details: 'Successful login from IP 192.168.1.45',
        level: 'Info'
    },
    {
        id: '2',
        timestamp: '2025-12-18 10:45:12',
        user: 'Sarah Wilson',
        action: 'Transcript Exported',
        category: 'Transcription',
        details: 'Exported PDF for Case #2025-CR-023',
        level: 'Info'
    },
    {
        id: '3',
        timestamp: '2025-12-18 09:12:33',
        user: 'System Admin',
        action: 'Role Modified',
        category: 'Management',
        details: 'Elevated Robert Cheng to Clerk Supervisor',
        level: 'Warning'
    },
    {
        id: '4',
        timestamp: '2025-12-18 08:30:00',
        user: 'Ahmed Al Mansouri',
        action: 'Transcript View',
        category: 'Transcription',
        details: 'Viewed Transcript for Case #2024-CV-112',
        level: 'Info'
    },
    {
        id: '5',
        timestamp: '2025-12-17 17:15:22',
        user: 'Robert Cheng',
        action: 'Failed Login',
        category: 'Security',
        details: 'Failed password attempt for user robert.c',
        level: 'Error'
    },
    {
        id: '6',
        timestamp: '2025-12-17 16:20:10',
        user: 'Mona Al Hashmi',
        action: 'New User Created',
        category: 'Management',
        details: 'Created account for Salim Al Hashimi',
        level: 'Info'
    },
    {
        id: '7',
        timestamp: '2025-12-17 15:45:05',
        user: 'Sarah Wilson',
        action: 'Transcription Started',
        category: 'Transcription',
        details: 'Started live transcription for Courtroom 4',
        level: 'Info'
    },
    {
        id: '8',
        timestamp: '2025-12-17 14:30:12',
        user: 'System',
        action: 'Database Backup',
        category: 'System',
        details: 'Daily automated backup completed successfully',
        level: 'Info'
    }
];

const ACTIONS = ['User Login', 'Transcript View', 'Role Modified', 'Failed Login', 'New User Created', 'Transcription Started', 'Document Downloaded'];
const USERS = ['Ahmed Al Mansouri', 'Sarah Wilson', 'System Admin', 'Robert Cheng', 'Mona Al Hashmi', 'System'];
const CATEGORIES = ['Security', 'Transcription', 'Management', 'System'];
const LEVELS = ['Info', 'Info', 'Info', 'Warning', 'Error'];

const AuditLog = () => {
    const [logs, setLogs] = useState(initialLogs);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isLive, setIsLive] = useState(false);
    const { toast } = useToast();

    const generateRandomLog = useCallback(() => {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').split('.')[0];
        const user = USERS[Math.floor(Math.random() * USERS.length)];
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];

        return {
            id: Math.random().toString(36).substr(2, 9),
            timestamp,
            user,
            action,
            category,
            details: `Automated live event: ${action} triggered by ${user}`,
            level
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLive) {
            interval = setInterval(() => {
                setLogs(prev => [generateRandomLog(), ...prev.slice(0, 49)]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLive, generateRandomLog]);

    const getLevelBadge = (level: string) => {
        switch (level.toLowerCase()) {
            case 'info':
                return <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 shadow-none px-3 py-1 rounded-md text-[10px] uppercase tracking-wide"><Info className="w-3 h-3 mr-1" />Info</Badge>;
            case 'warning':
                return <Badge variant="outline" className="bg-amber-50/50 text-amber-700 border-amber-100 shadow-none px-3 py-1 rounded-md text-[10px] uppercase tracking-wide"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
            case 'error':
                return <Badge variant="outline" className="bg-rose-50/50 text-rose-700 border-rose-100 shadow-none px-3 py-1 rounded-md text-[10px] uppercase tracking-wide"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
            default:
                return <Badge variant="outline" className="px-3 py-1 rounded-md text-[10px] uppercase tracking-wide">{level}</Badge>;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'security':
                return <Shield className="w-4 h-4 text-slate-500" />;
            case 'transcription':
                return <FileText className="w-4 h-4 text-slate-500" />;
            case 'management':
                return <User className="w-4 h-4 text-slate-500" />;
            default:
                return <Info className="w-4 h-4 text-slate-500" />;
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || log.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const toggleLiveMonitor = () => {
        setIsLive(!isLive);
        toast({
            title: isLive ? "Monitor Paused" : "Live Monitor Active",
            description: isLive ? "Real-time updates stopped." : "Listening for new system events...",
        });
    };

    return (
        <div className="p-8 animate-fade-in space-y-6 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Audit Log
                        {isLive && (
                            <Badge className="bg-emerald-100 text-emerald-700 animate-pulse border-emerald-200 h-5 px-1.5 text-[10px] font-bold uppercase tracking-tight">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
                                Live
                            </Badge>
                        )}
                    </h1>
                    <div className="flex items-center text-sm font-medium gap-2">
                        <Link to="/clerk" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-semibold">Audit Log</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="h-9 border-none bg-slate-200/80 hover:bg-slate-300 text-[#0047BB] font-bold px-5 shadow-none transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        onClick={toggleLiveMonitor}
                        className={`h-9 ${isLive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#0047BB] hover:bg-[#003da1]'} shadow-md font-bold px-5 text-white rounded-lg transition-all`}
                    >
                        {isLive ? (
                            <>
                                <Pause className="w-4 h-4 mr-2" />
                                Stop Monitor
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2 text-white/80" />
                                Live Monitor
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: isLive ? '45,282+' : '45,282', icon: History, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Security Alerts', value: logs.filter(l => l.category === 'Security' && l.level === 'Error').length.toString(), icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Transcriptions', value: logs.filter(l => l.category === 'Transcription').length.toString(), icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Monitoring Status', value: isLive ? 'Active' : 'Idle', icon: Activity, color: isLive ? 'text-emerald-600' : 'text-slate-600', bg: isLive ? 'bg-emerald-50' : 'bg-slate-50' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-white border-none shadow-md shadow-slate-200/50 group hover:shadow-lg transition-all">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters Bar (Outer) */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Filter by user, action or details..."
                        className="pl-10 h-10 bg-white border-slate-200 focus:ring-primary/10 transition-all text-sm rounded-lg shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-48 h-10 bg-white border-slate-200 shadow-sm text-slate-600 font-medium">
                            <div className="flex items-center">
                                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                                <SelectValue placeholder="Category" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="border-slate-100">
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="transcription">Transcription</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-10 w-10 bg-white border-slate-200 shadow-sm text-slate-500 hover:text-primary">
                        <CalendarIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Table Container */}
            <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-slate-50/30 border-b border-slate-100">
                                    <TableHead className="w-[18%] pl-6 font-bold text-xs text-slate-500 uppercase tracking-tight py-4">Timestamp</TableHead>
                                    <TableHead className="w-[15%] font-bold text-xs text-slate-500 uppercase tracking-tight py-4">User</TableHead>
                                    <TableHead className="w-[15%] font-bold text-xs text-slate-500 uppercase tracking-tight py-4">Action</TableHead>
                                    <TableHead className="w-[12%] font-bold text-xs text-slate-500 uppercase tracking-tight py-4">Category</TableHead>
                                    <TableHead className="w-[30%] font-bold text-xs text-slate-500 uppercase tracking-tight py-4">Details</TableHead>
                                    <TableHead className="w-[10%] text-right pr-6 font-bold text-xs text-slate-500 uppercase tracking-tight py-4">Level</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.id} className={`${isLive && log.id.length < 10 ? 'animate-in fade-in slide-in-from-left-2 duration-500' : ''} group hover:bg-slate-50/50 border-b border-slate-50 transition-colors`}>
                                        <TableCell className="pl-6 font-mono text-[11px] text-slate-500">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#E5F1FF] flex items-center justify-center text-[10px] text-primary font-bold border border-primary/10 shrink-0">
                                                    {log.user.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-sm font-medium text-slate-800 truncate">{log.user}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium text-slate-800">{log.action}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                                {getCategoryIcon(log.category)}
                                                {log.category}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600 leading-relaxed font-medium min-w-[200px]">
                                            {log.details}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            {getLevelBadge(log.level)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLog;
