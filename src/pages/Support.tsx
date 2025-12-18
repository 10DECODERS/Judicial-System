import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
    Headphones,
    MessageCircle,
    FileQuestion,
    Activity,
    Mail,
    Phone,
    Send,
    CheckCircle2,
    AlertCircle,
    Key,
    RefreshCw,
    Download,
    Database
} from 'lucide-react';

const Support = () => {
    return (
        <div className="h-full bg-[hsl(var(--main-bg))] p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-accent/10 rounded-lg hidden">
                        <Headphones className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
                            Help & Support
                        </h1>
                        <p className="text-sm text-body">
                            Get assistance, browse FAQs, and check system status
                        </p>
                    </div>
                </div>

                {/* Support Tabs */}
                <Tabs defaultValue="contact" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="contact">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact Support
                        </TabsTrigger>
                        <TabsTrigger value="faq">
                            <FileQuestion className="w-4 h-4 mr-2" />
                            FAQs
                        </TabsTrigger>
                        <TabsTrigger value="status">
                            <Activity className="w-4 h-4 mr-2" />
                            System Status
                        </TabsTrigger>
                    </TabsList>

                    {/* Contact Tab */}
                    <TabsContent value="contact">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="court-card">
                                    <CardHeader>
                                        <CardTitle className="text-headings">Send us a Message</CardTitle>
                                        <CardDescription>We typically respond within 2 hours during business days</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="category">Issue Category</Label>
                                                <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                    <option>Technical Issue</option>
                                                    <option>Account Access</option>
                                                    <option>Feature Request</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="priority">Priority</Label>
                                                <select id="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                    <option>Low</option>
                                                    <option>Medium</option>
                                                    <option>High</option>
                                                    <option>Urgent</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="Brief description of the issue" className="border-borders" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="message">Message</Label>
                                            <textarea
                                                id="message"
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Please describe your issue in detail..."
                                            />
                                        </div>
                                        <Button className="w-full sm:w-auto">
                                            <Send className="w-4 h-4 mr-2" />
                                            Submit Ticket
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card className="court-card border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-headings">Need immediate assistance?</CardTitle>
                                        <CardDescription className="text-slate-500">Direct lines for urgent matters</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <Phone className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">IT Helpdesk</p>
                                                <p className="font-bold text-slate-800">+971 4 123 4567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">Email Support</p>
                                                <p className="font-bold text-slate-800">support@judicial.ai</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="court-card border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-headings">Support Hours</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Monday - Friday</span>
                                            <span className="font-bold text-slate-900">8:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Saturday</span>
                                            <span className="font-bold text-slate-900">9:00 AM - 2:00 PM</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Sunday</span>
                                            <span className="text-slate-400 font-medium">Closed</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* FAQ Tab */}
                    <TabsContent value="faq">
                        <Card className="court-card border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-headings">Frequently Asked Questions</CardTitle>
                                <CardDescription>Find answers to common questions about the Judicial System</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <Accordion type="single" collapsible className="w-full space-y-3">
                                        <AccordionItem value="item-1" className="bg-slate-50/50 border border-slate-100 rounded-lg px-4 hover:bg-slate-50 transition-colors">
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                                        <Key className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">How do I reset my password?</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600 pl-[52px] pb-4">
                                                You can reset your password by going to Settings {'>'} Security {'>'} Change Password. If you cannot log in, please contact the IT Helpdesk for a temporary password reset.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-2" className="bg-slate-50/50 border border-slate-100 rounded-lg px-4 hover:bg-slate-50 transition-colors">
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">How do I update case status?</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600 pl-[52px] pb-4">
                                                Navigate to the specific case detail page. In the Actions menu or Status panel, you can select the new status. Changes are logged automatically in the audit trail.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-3" className="bg-slate-50/50 border border-slate-100 rounded-lg px-4 hover:bg-slate-50 transition-colors">
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">Where can I find transcript exports?</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600 pl-[52px] pb-4">
                                                In the Transcripts module, select the desired transcript. Use the 'Export' button in the toolbar to download as PDF or Word document.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-4" className="bg-slate-50/50 border border-slate-100 rounded-lg px-4 hover:bg-slate-50 transition-colors">
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                                                        <Database className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">Is the legal research database updated in real-time?</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600 pl-[52px] pb-4">
                                                Yes, the legal research database is synchronized with the central repository every 15 minutes to ensure you have access to the latest precedents and statutes.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* System Status Tab */}
                    <TabsContent value="status">
                        <Card className="court-card">
                            <CardHeader>
                                <CardTitle className="text-headings">System Operational Status</CardTitle>
                                <CardDescription>Current status of Judicial AI services</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-emerald-900">Core Services</p>
                                                <p className="text-xs text-emerald-700">Operational</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-emerald-900">Database</p>
                                                <p className="text-xs text-emerald-700">Operational</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-amber-900">Transcription AI</p>
                                                <p className="text-xs text-amber-700">Degraded Performance</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <h3 className="font-semibold text-headings">Recent Incidents</h3>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-24 text-xs font-mono text-muted-foreground pt-1">Dec 18, 14:00</div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Scheduled Maintenance Completed</p>
                                                    <p className="text-sm text-body">Regular database optimization was completed successfully.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-24 text-xs font-mono text-muted-foreground pt-1">Dec 15, 09:30</div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Search Indexing Delay</p>
                                                    <p className="text-sm text-body">Users may have experienced delays in search results. Issue resolved in 15 mins.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Support;
