import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Search,
    Filter,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Shield,
    Eye,
    Edit,
    Trash2,
    Users,
    CheckCircle2,
    Scale,
    Upload,
    Download
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const initialRoles = [
    {
        id: '1',
        name: 'Judge',
        description: 'Full access to case files, legal research, and transcription reviews.',
        permissions: ['View Case', 'Edit Transcript', 'Legal Research', 'Export Data'],
        userCount: 15,
        status: 'Active'
    },
    {
        id: '2',
        name: 'Clerk',
        description: 'Responsible for transcription control, record management, and user auditing.',
        permissions: ['Control Transcription', 'Manage Records', 'Audit Log', 'User Support'],
        userCount: 24,
        status: 'Active'
    },
    {
        id: '3',
        name: 'Registrar',
        description: 'Oversees case scheduling and administrative distribution.',
        permissions: ['Schedule Case', 'Assign Judges', 'Admin Access'],
        userCount: 8,
        status: 'Active'
    },
    {
        id: '4',
        name: 'Court Reporter',
        description: 'Specialized role for real-time transcription and record certification.',
        permissions: ['Live Transcription', 'Certify Record'],
        userCount: 42,
        status: 'Active'
    },
    {
        id: '5',
        name: 'Admin',
        description: 'System-wide configuration, role management, and security overrides.',
        permissions: ['Full Access', 'System Config', 'Manage Roles'],
        userCount: 3,
        status: 'Active'
    }
];

const UserRoles = () => {
    const [roles, setRoles] = useState(initialRoles);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        permissions: [] as string[]
    });

    const handleAddRole = () => {
        if (!newRole.name || !newRole.description) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const roleToAdd = {
            id: (roles.length + 1).toString(),
            name: newRole.name,
            description: newRole.description,
            permissions: newRole.permissions.length > 0 ? newRole.permissions : ['View Case', 'Audit Log'], // Default permissions
            userCount: 0,
            status: 'Active'
        };

        setRoles([roleToAdd, ...roles]);
        setNewRole({ name: '', description: '', permissions: [] });
        setIsDialogOpen(false);

        toast({
            title: "Success",
            description: `Role '${newRole.name}' has been created.`,
        });
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 animate-fade-in space-y-4 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Roles</h1>
                    <div className="flex items-center text-sm font-medium gap-2">
                        <Link to="/clerk" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-semibold cursor-default">User Management</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-semibold">Users Role</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="h-9 border-none bg-slate-200/80 hover:bg-slate-300 text-[#0047BB] font-bold px-5 shadow-none transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Export
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#0047BB] hover:bg-[#003da1] shadow-md h-9 px-5 font-bold text-white rounded-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Role</DialogTitle>
                                <DialogDescription>
                                    Define a new role and its associated permissions.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Role Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Senior Clerk"
                                        value={newRole.name}
                                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="Role responsibilities..."
                                        value={newRole.description}
                                        onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                    />
                                </div>
                                {/* Simplified Permissions Input for UX Speed */}
                                <div className="grid gap-2">
                                    <Label>Default Permissions</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['View Case', 'Audit Log', 'Manage Users', 'Edit Transcript'].map(perm => (
                                            <Badge
                                                key={perm}
                                                variant={newRole.permissions.includes(perm) ? 'default' : 'outline'}
                                                className={`cursor-pointer ${newRole.permissions.includes(perm) ? 'bg-primary' : 'bg-slate-50'}`}
                                                onClick={() => {
                                                    const perms = newRole.permissions.includes(perm)
                                                        ? newRole.permissions.filter(p => p !== perm)
                                                        : [...newRole.permissions, perm];
                                                    setNewRole({ ...newRole, permissions: perms });
                                                }}
                                            >
                                                {perm}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Click to toggle permissions.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button className="bg-primary hover:bg-primary/90" onClick={handleAddRole}>Create Role</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search & Filter Bar (Outer) */}
            <div className="flex gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search roles..."
                        className="pl-10 h-10 bg-white border-slate-200 focus:ring-primary/10 transition-all text-sm rounded-lg shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-600 font-medium px-4 shadow-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50" />
                </Button>
            </div>

            {/* Main Table Container */}
            <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-slate-50/30 border-b border-slate-100">
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4 pl-6">Role Name</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Description</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Users</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Permissions</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4 text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRoles.map((role) => (
                                    <TableRow key={role.id} className="group hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                                        <TableCell className="py-5 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">{role.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <p className="text-sm text-slate-600 max-w-sm line-clamp-2">{role.description}</p>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-600">{role.userCount} Users</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-wrap gap-1.5 max-w-md">
                                                {role.permissions.map((perm) => (
                                                    <Badge key={perm} variant="secondary" className="bg-slate-100 text-slate-600 font-semibold text-[10px] px-2 py-0.5 rounded shadow-none">
                                                        {perm}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 whitespace-nowrap py-5">
                                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-white hover:text-primary transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-white hover:text-primary transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-500 hover:bg-white hover:text-rose-600 transition-colors"
                                                    onClick={() => {
                                                        setRoles(roles.filter(r => r.id !== role.id));
                                                        toast({ title: "Deleted", description: "Role has been removed." });
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-500">
                            Total {roles.length} Roles Defined
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserRoles;
