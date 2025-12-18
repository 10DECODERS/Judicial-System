import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    UserPlus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Download,
    Upload,
    Plus,
    ChevronDown,
    Scale
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialUsers = [
    {
        id: '1',
        name: 'Ahmed Al Mansouri',
        email: 'ahmed.m@courts.gov.ae',
        phone: '+971 50 943 94738',
        role: 'Judge',
        status: 'Active',
        added: '29 Dec 2024',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah.w@courts.gov.ae',
        phone: '+971 50 234 56781',
        role: 'Clerk',
        status: 'Active',
        added: '24 Dec 2024',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
        id: '3',
        name: 'Mona Al Hashmi',
        email: 'mona.h@courts.gov.ae',
        phone: '+971 50 998 12344',
        role: 'Admin',
        status: 'Active',
        added: '12 Dec 2024',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
    },
    {
        id: '4',
        name: 'Salim Al Hashimi',
        email: 'salim.h@courts.gov.ae',
        phone: '+971 52 445 66778',
        role: 'Registrar',
        status: 'Blocked',
        added: '21 Oct 2024',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
        id: '5',
        name: 'Robert Cheng',
        email: 'robert.c@courts.gov.ae',
        phone: '+971 56 778 88990',
        role: 'Clerk',
        status: 'Active',
        added: '21 Oct 2024',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
        id: '6',
        name: 'Khalifa Bin Zayed',
        email: 'khalifa.z@courts.gov.ae',
        phone: '+971 50 112 23344',
        role: 'Judge',
        status: 'Blocked',
        added: '19 Sep 2024',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop'
    },
    {
        id: '7',
        name: 'Fatima Al Ameri',
        email: 'fatima.a@courts.gov.ae',
        phone: '+971 55 667 77889',
        role: 'Clerk',
        status: 'Active',
        added: '19 Sep 2024',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    {
        id: '8',
        name: 'Omar Al Suwaidi',
        email: 'omar.s@courts.gov.ae',
        phone: '+971 50 443 33221',
        role: 'Admin',
        status: 'Active',
        added: '19 Sep 2024',
        avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop'
    }
];

const UserManagement = () => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const { toast } = useToast();

    // Form State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Clerk',
        phone: ''
    });

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100 font-medium';
            case 'blocked':
                return 'bg-rose-50 text-rose-700 border-rose-100 font-medium';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100 font-medium';
        }
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const userToAdd = {
            id: (users.length + 1).toString(),
            ...newUser,
            status: 'Active',
            added: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            avatar: ''
        };

        setUsers([userToAdd, ...users]);
        setNewUser({ name: '', email: '', role: 'Clerk', phone: '' });
        setIsDialogOpen(false);

        toast({
            title: "Success",
            description: `${newUser.name} has been added to the Judicial System.`,
        });
    };

    const toggleSelectUser = (id: string) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="p-8 animate-fade-in space-y-4 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h1>
                    <div className="flex items-center text-sm font-medium gap-2">
                        <Link to="/clerk" className="text-primary hover:underline cursor-pointer">Dashboard</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <Link to="/clerk/users" className="text-primary hover:underline cursor-pointer">User Management</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-semibold">Users List</span>
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
                                Add New User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Judicial User</DialogTitle>
                                <DialogDescription>
                                    Create a new staff or judge profile in the system.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Salim Al Hashimi"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@courts.gov.ae"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+971 50 XXX XXXX"
                                        value={newUser.phone}
                                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">User Role</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Judge">Judge</SelectItem>
                                            <SelectItem value="Clerk">Clerk</SelectItem>
                                            <SelectItem value="Registrar">Registrar</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button className="bg-primary hover:bg-primary/90" onClick={handleAddUser}>Create User</Button>
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
                        placeholder="Search users..."
                        className="pl-10 h-10 bg-white border-slate-200 focus:ring-primary/10 transition-all text-sm rounded-lg shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-600 font-medium px-4 shadow-sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {(roleFilter !== 'all' || statusFilter !== 'all') && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px]">
                                    {(roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
                                </Badge>
                            )}
                            <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                            <h4 className="font-medium leading-none">Filter Users</h4>
                            <div className="grid gap-2">
                                <Label htmlFor="role-filter">User Role</Label>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger id="role-filter" className="bg-white">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="Judge">Judge</SelectItem>
                                        <SelectItem value="Clerk">Clerk</SelectItem>
                                        <SelectItem value="Registrar">Registrar</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status-filter">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger id="status-filter" className="bg-white">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Blocked">Blocked</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(roleFilter !== 'all' || statusFilter !== 'all') && (
                                <Button
                                    variant="ghost"
                                    className="w-full h-8 text-xs text-muted-foreground hover:text-primary"
                                    onClick={() => {
                                        setRoleFilter('all');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Main Table Container */}
            <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-slate-50/30 border-b border-slate-100">
                                    <TableHead className="w-12 pl-6">
                                        <Checkbox
                                            checked={selectedUsers.length === users.length && users.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                            className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">User Name</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Phone</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">User Role</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Status</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight py-4">Added</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-tight text-right pr-6 py-4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                                        <TableCell className="pl-6">
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => toggleSelectUser(user.id)}
                                                className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#E5F1FF] flex items-center justify-center">
                                                            <Scale className="w-5 h-5 text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-medium text-slate-800 truncate">{user.name}</span>
                                                    <span className="text-[11px] text-slate-500 truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600 font-medium whitespace-nowrap">{user.phone}</TableCell>
                                        <TableCell className="text-sm text-slate-600 font-medium">{user.role}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getStatusStyles(user.status)} px-3 py-1 rounded-md text-[10px] border shadow-none uppercase tracking-wide`}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600 font-medium whitespace-nowrap">{user.added}</TableCell>
                                        <TableCell className="text-right pr-6 whitespace-nowrap">
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
                                                        setUsers(users.filter(u => u.id !== user.id));
                                                        toast({ title: "Deleted", description: "User has been removed." });
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

                    {/* Pagination Footer */}
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-500">
                            Showing 1-8 from {users.length * 12}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-none">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="default" className="h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm p-0 text-xs font-bold">1</Button>
                            <Button variant="secondary" className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 p-0 text-xs font-bold border-none">2</Button>
                            <Button variant="secondary" className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 p-0 text-xs font-bold border-none">3</Button>
                            <Button variant="secondary" className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 p-0 text-xs font-bold border-none">4</Button>
                            <Button variant="secondary" className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 p-0 text-xs font-bold border-none">5</Button>
                            <span className="text-slate-400 text-[10px] font-bold px-1 py-1 rounded-lg bg-slate-100 h-8 flex items-center justify-center min-w-[32px]">...</span>
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border-none">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagement;
