import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Document {
  id: string;
  title: string;
  type: 'Order' | 'Notice' | 'Summary' | 'Motion' | 'Judgment' | 'Other' | 'Civil' | 'Criminal' | 'Commercial' | 'Family' | 'Property';
  status: 'Draft' | 'Submitted' | 'Review' | 'Approved';
  content: string;
  caseNumber: string;
  lastEdited: string;
  createdBy: string;
  assignedTo?: string;
  comments: Comment[];
  aiSuggestions?: AISuggestion[];
  // New case-specific properties
  plaintiff?: string;
  defendant?: string;
  judge?: string;
  filingDate?: string;
  amount?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'approval';
}

export interface AISuggestion {
  id: string;
  title: string;
  content: string;
  type: 'clause' | 'precedent' | 'summary' | 'citation';
  confidence: number;
  applied: boolean;
}

interface DocumentContextType {
  documents: Document[];
  currentDocument: Document | null;
  searchTerm: string;
  filterStatus: string;
  filterType: string;

  // Document actions
  createDocument: (type: Document['type'], title: string, caseNumber: string) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setCurrentDocument: (document: Document | null) => void;

  // Search and filter
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterType: (type: string) => void;

  // Comments
  addComment: (documentId: string, content: string, author: string) => void;

  // AI suggestions
  generateAISuggestions: (documentId: string) => void;
  applyAISuggestion: (documentId: string, suggestionId: string) => void;

  // Filtered documents
  filteredDocuments: Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Sample data
const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Order - Case #2025-CR-045',
    type: 'Order',
    status: 'Draft',
    content: `ORDER

1. Background / Procedural History
This matter came before this Court on January 15, 2025 for final argument. The petitioner/plaintiff filed petition/application under Section 138 of Negotiable Instruments Act, 1881, seeking recovery of debt amount.

The respondent/defendant filed written statement/counter affidavit on February 20, 2025.

2. Facts of the Case
The facts, in brief, are as follows:
• The complainant gave loan to the accused in the amount of ₹5,00,000/- on dated agreement
• The accused issued a cheque dated March 15, 2024 for ₹5,00,000/- towards repayment
• The cheque was dishonored due to insufficient funds when presented for payment
• Despite repeated notices, payment was not made within the statutory period

3. Issues for Determination
The following issues are framed for consideration:
• Issue 1: Whether the cheque dated March 15, 2024 drawn on account of legal debt/liability is valid and enforceable?
• Issue 2: Whether the accused committed offence under Section 138 of Negotiable Instruments Act, 1881?

4. Findings and Analysis
After hearing both parties and examining the evidence on record, this Court observes:
• The complainant has proved the transaction supported by written agreement and bank statements
• The accused failed to provide any reasonable explanation for dishonoring the cheque
• Section 138 NI Act provides clear procedure for dishonored cheque cases
• The mandatory notice period of 15 days was given before filing the complaint

5. Order / Directions
In view of the foregoing discussions and findings, it is hereby ORDERED that:
• The petition is allowed in full amount of ₹5,00,000/- with interest @ 9% p.a.
• The accused shall pay the compensation amount within 30 days from the date of this order
• The case is disposed of accordingly

6. Further Directions (if any)
• The matter is listed for compliance on April 15, 2025 at 2:00 PM
• In case of default, the defendant shall pay additional ₹10,000/- as costs
• Certified copy of this order be delivered to both parties

7. Pronounced in Open Court on [Current Date]

(Judge's Signature)
Hon'ble Justice R. Kumar
District & Sessions Judge
[Court Seal]`,
    caseNumber: '2025-CR-045',
    lastEdited: '2 hours ago',
    createdBy: 'Clerk Johnson',
    comments: [
      {
        id: 'c1',
        author: 'Clerk Johnson',
        content: 'Prepared initial draft based on motion documents.',
        timestamp: '10:30 AM',
        type: 'comment'
      },
      {
        id: 'c2',
        author: 'Judge Williams',
        content: 'Please review the evidence section for accuracy.',
        timestamp: '11:15 AM',
        type: 'comment'
      }
    ],
    aiSuggestions: [
      {
        id: 's1',
        title: 'Evidence Analysis',
        content: 'Consider adding: "The Court has reviewed the submitted evidence and finds that the defendant\'s motion to suppress is supported by precedent in Miranda v. Arizona (1966)."',
        type: 'clause',
        confidence: 0.87,
        applied: false
      },
      {
        id: 's2',
        title: 'Procedural Recommendation',
        content: 'Based on similar criminal cases, recommend scheduling a status hearing within 30 days to discuss discovery timeline.',
        type: 'precedent',
        confidence: 0.92,
        applied: false
      }
    ]
  },
  {
    id: '2',
    title: 'Notice - Case #2025-CV-089',
    type: 'Notice',
    status: 'Submitted',
    content: 'NOTICE OF HEARING\n\nCase No. 2025-CV-089\n\nTo all parties and their attorneys of record...',
    caseNumber: '2025-CV-089',
    lastEdited: '5 hours ago',
    createdBy: 'Clerk Smith',
    comments: [
      {
        id: 'c3',
        author: 'Clerk Smith',
        content: 'Draft notice prepared for upcoming hearing.',
        timestamp: '9:45 AM',
        type: 'comment'
      }
    ],
    aiSuggestions: [
      {
        id: 's3',
        title: 'Hearing Notice Enhancement',
        content: 'Consider adding specific witness list and estimated duration for the hearing to improve notice clarity.',
        type: 'clause',
        confidence: 0.78,
        applied: false
      }
    ]
  },
  {
    id: '3',
    title: 'Summary - Case #2025-CV-067',
    type: 'Summary',
    status: 'Approved',
    content: 'CASE SUMMARY\n\nCase No. 2025-CV-067\n\nPlaintiff alleges breach of contract...',
    caseNumber: '2025-CV-067',
    lastEdited: '1 day ago',
    createdBy: 'Judge Williams',
    comments: [
      {
        id: 'c2',
        author: 'Judge Williams',
        content: 'Approved with minor revisions.',
        timestamp: '2:30 PM',
        type: 'approval'
      }
    ],
    aiSuggestions: []
  }
];

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load documents from localStorage on initialization
  const loadDocumentsFromStorage = (): Document[] => {
    try {
      const stored = localStorage.getItem('judge-documents');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to proper format for comments and suggestions
        return parsed.map((doc: any) => ({
          ...doc,
          comments: doc.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp).toLocaleTimeString()
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading documents from localStorage:', error);
    }
    return sampleDocuments;
  };

  // Save documents to localStorage whenever documents change
  const saveDocumentsToStorage = (docs: Document[]) => {
    try {
      localStorage.setItem('judge-documents', JSON.stringify(docs));
    } catch (error) {
      console.error('Error saving documents to localStorage:', error);
    }
  };

  const [documents, setDocuments] = useState<Document[]>(loadDocumentsFromStorage());
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Save to localStorage whenever documents change
  useEffect(() => {
    saveDocumentsToStorage(documents);
  }, [documents]);

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    const matchesType = !filterType || doc.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const generateAISuggestionsForNewDoc = (): AISuggestion[] => [
    {
      id: 's1',
      title: 'Recommended Clause',
      content: 'Based on similar cases, consider adding: "The Court finds that the preponderance of evidence supports..."',
      type: 'clause' as const,
      confidence: 0.85,
      applied: false
    },
    {
      id: 's2',
      title: 'Similar Judgment Analysis',
      content: 'Smith v. Jones (2023) - Civil contract dispute over service agreement. Case duration: 8 months from filing to judgment. Process: Initial pleadings (2 months), discovery phase (3 months), pre-trial motions (1 month), trial (1 week), judgment (2 weeks). Result: Plaintiff prevailed, awarded ₹8,50,000 plus 9% interest. Key factors: Strong documentary evidence, credible witness testimony, defendant\'s procedural errors.',
      type: 'precedent' as const,
      confidence: 0.92,
      applied: false
    },
    {
      id: 's3',
      title: 'Case Timeline Recommendation',
      content: 'Based on similar commercial disputes: Expected timeline - Filing to first hearing: 4-6 weeks, Discovery completion: 12-16 weeks, Trial preparation: 8-10 weeks, Trial: 3-5 days, Judgment: 4-8 weeks. Total estimated duration: 7-9 months. Consider requesting expedited schedule if urgent business impact.',
      type: 'summary' as const,
      confidence: 0.88,
      applied: false
    },
    {
      id: 's4',
      title: 'Evidence Strategy',
      content: 'Similar cases show success rate of 78% when including: 1) Contemporaneous business records, 2) Email correspondence, 3) Witness affidavits from involved parties, 4) Expert testimony on industry standards, 5) Photographic evidence of disputed goods/services. Consider strengthening chain of custody documentation.',
      type: 'clause' as const,
      confidence: 0.90,
      applied: false
    }
  ];

  const createDocument = (type: Document['type'], title: string, caseNumber: string): Document => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      type,
      status: 'Draft',
      content: generateTemplateContent(type, title, caseNumber),
      caseNumber,
      lastEdited: 'Just now',
      createdBy: 'Current User', // In real app, get from auth context
      comments: [],
      aiSuggestions: []
    };

    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id
        ? { ...doc, ...updates, lastEdited: 'Just now' }
        : doc
    ));

    if (currentDocument?.id === id) {
      setCurrentDocument(prev => prev ? { ...prev, ...updates, lastEdited: 'Just now' } : null);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (currentDocument?.id === id) {
      setCurrentDocument(null);
    }
  };

  const addComment = (documentId: string, content: string, author: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: new Date().toLocaleTimeString(),
      type: 'comment'
    };

    setDocuments(prev => prev.map(doc =>
      doc.id === documentId
        ? { ...doc, comments: [...doc.comments, newComment] }
        : doc
    ));
  };

  const generateAISuggestions = (documentId: string) => {
    const suggestions: AISuggestion[] = [
      {
        id: 's1',
        title: 'Recommended Clause',
        content: 'Based on similar cases, consider adding: "The Court finds that the preponderance of evidence supports..."',
        type: 'clause',
        confidence: 0.85,
        applied: false
      },
      {
        id: 's2',
        title: 'Similar Judgment Analysis',
        content: 'Smith v. Jones (2023) - Civil contract dispute over service agreement. Case duration: 8 months from filing to judgment. Process: Initial pleadings (2 months), discovery phase (3 months), pre-trial motions (1 month), trial (1 week), judgment (2 weeks). Result: Plaintiff prevailed, awarded ₹8,50,000 plus 9% interest. Key factors: Strong documentary evidence, credible witness testimony, defendant\'s procedural errors.',
        type: 'precedent',
        confidence: 0.92,
        applied: false
      },
      {
        id: 's3',
        title: 'Case Timeline Recommendation',
        content: 'Based on similar commercial disputes: Expected timeline - Filing to first hearing: 4-6 weeks, Discovery completion: 12-16 weeks, Trial preparation: 8-10 weeks, Trial: 3-5 days, Judgment: 4-8 weeks. Total estimated duration: 7-9 months. Consider requesting expedited schedule if urgent business impact.',
        type: 'summary',
        confidence: 0.88,
        applied: false
      },
      {
        id: 's4',
        title: 'Evidence Strategy',
        content: 'Similar cases show success rate of 78% when including: 1) Contemporaneous business records, 2) Email correspondence, 3) Witness affidavits from involved parties, 4) Expert testimony on industry standards, 5) Photographic evidence of disputed goods/services. Consider strengthening chain of custody documentation.',
        type: 'clause',
        confidence: 0.90,
        applied: false
      }
    ];

    setDocuments(prev => prev.map(doc =>
      doc.id === documentId
        ? { ...doc, aiSuggestions: suggestions }
        : doc
    ));
  };

  const applyAISuggestion = (documentId: string, suggestionId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId && doc.aiSuggestions) {
        const suggestion = doc.aiSuggestions.find(s => s.id === suggestionId);
        if (suggestion) {
          return {
            ...doc,
            content: doc.content + '\n\n' + suggestion.content,
            aiSuggestions: doc.aiSuggestions.map(s =>
              s.id === suggestionId ? { ...s, applied: true } : s
            )
          };
        }
      }
      return doc;
    }));
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      currentDocument,
      searchTerm,
      filterStatus,
      filterType,
      createDocument,
      updateDocument,
      deleteDocument,
      setCurrentDocument,
      setSearchTerm,
      setFilterStatus,
      setFilterType,
      addComment,
      generateAISuggestions,
      applyAISuggestion,
      filteredDocuments
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

// Helper function to generate template content
const generateTemplateContent = (type: Document['type'], title: string, caseNumber: string): string => {
  const templates = {
    'Order': `ORDER

1. Background / Procedural History
This matter came before this Court on [Enter date here] for [Enter type of proceeding here, e.g., final argument, motion]. The petitioner/plaintiff filed [Enter type of filing here, e.g., petition/complaint/application] under [Enter relevant section of law here], seeking [Brief description of relief sought].

The respondent/defendant filed [Enter type of response here, e.g., written statement/counter affidavit] on [Enter date here].

2. Facts of the Case
The facts, in brief, are as follows:
• [Describe key facts or events leading to the case here]
• [Mention any evidence, witness statements, or exhibits if applicable]

3. Issues for Determination
The following issues are framed for consideration:
• Issue 1: [Enter specific legal issue to be determined here]
• Issue 2: [Enter additional issue(s) if applicable here]

4. Findings and Analysis
After hearing both parties and examining the evidence on record, this Court observes:
• [Summarize reasoning or legal interpretation here]
• [Refer to relevant sections, precedents, or case laws here]
• [Explain findings on each issue framed above here]

5. Order / Directions
In view of the foregoing discussions and findings, it is hereby ORDERED that:
• [Enter order details here - petition allowed/dismissed]
• [Specify any relief granted, injunction issued, or costs imposed here]
• [Specify timeline for compliance, if applicable here]

6. Further Directions (if any)
• [Enter follow-up instructions here, e.g., "The matter is listed for compliance on..."]
• [Specify any contempt or enforcement warnings, if necessary]

7. Pronounced in Open Court on [Enter Date Here]

(Judge's Signature)
Hon'ble [Enter Judge's Name Here]
[Enter Judge's Designation here, e.g., District & Sessions Judge]
[Court Seal]`,

    'Notice': `NOTICE OF HEARING

Case No. ${caseNumber}

To all parties and their attorneys of record:

YOU ARE HEREBY NOTIFIED that a hearing has been scheduled for:

Date: [HEARING DATE]
Time: [HEARING TIME]
Location: [COURT LOCATION]

Matter: [BRIEF DESCRIPTION]

All parties must appear and be prepared to address the following issues:

1. [Issue 1]

2. [Issue 2]

3. [Issue 3]

Failure to appear may result in adverse consequences.

Dated: [CURRENT DATE]`,

    'Summary': `CASE SUMMARY

Case No. ${caseNumber}

PARTIES:
Plaintiff: [PLAINTIFF NAME]
Defendant: [DEFENDANT NAME]

NATURE OF ACTION:
[Brief description of the case]

PROCEDURAL HISTORY:
[Key procedural events]

FACTUAL BACKGROUND:
[Summary of key facts]

ISSUES PRESENTED:
[Legal issues to be decided]

CURRENT STATUS:
[Current stage of litigation]`,

    'Motion': `NOTICE OF MOTION AND MOTION

Case No. ${caseNumber}

TO: [OPPOSING PARTY]
FROM: [MOVING PARTY]

PLEASE TAKE NOTICE that on [DATE], at [TIME], or as soon thereafter as the matter may be heard, [MOVING PARTY] will move this Court for an order:

[RELIEF REQUESTED]

This motion is made pursuant to [LEGAL AUTHORITY] on the grounds that:

1. [Ground 1]

2. [Ground 2]

3. [Ground 3]

This motion is based on this notice, the memorandum of points and authorities, declarations, and all papers and records on file in this action.

Dated: [CURRENT DATE]`,

    'Judgment': `ORDER

1. Background / Procedural History
This matter came before this Court on [Enter date here] for [Enter type of proceeding here, e.g., final argument, motion]. The petitioner/plaintiff filed [Enter type of filing here, e.g., petition/complaint/application] under [Enter relevant section of law here], seeking [Brief description of relief sought].

The respondent/defendant filed [Enter type of response here, e.g., written statement/counter affidavit] on [Enter date here].

2. Facts of the Case
The facts, in brief, are as follows:
• [Describe key facts or events leading to the case here]
• [Mention any evidence, witness statements, or exhibits if applicable]

3. Issues for Determination
The following issues are framed for consideration:
• Issue 1: [Enter specific legal issue to be determined here]
• Issue 2: [Enter additional issue(s) if applicable here]

4. Findings and Analysis
After hearing both parties and examining the evidence on record, this Court observes:
• [Summarize reasoning or legal interpretation here]
• [Refer to relevant sections, precedents, or case laws here]
• [Explain findings on each issue framed above here]

5. Order / Directions
In view of the foregoing discussions and findings, it is hereby ORDERED that:
• [Enter order details here - petition allowed/dismissed]
• [Specify any relief granted, injunction issued, or costs imposed here]
• [Specify timeline for compliance, if applicable here]

6. Further Directions (if any)
• [Enter follow-up instructions here, e.g., "The matter is listed for compliance on..."]
• [Specify any contempt or enforcement warnings, if necessary]

7. Pronounced in Open Court on [Enter Date Here]

(Judge's Signature)
Hon'ble [Enter Judge's Name Here]
[Enter Judge's Designation here, e.g., District & Sessions Judge]
[Court Seal]`,

    'Other': `DOCUMENT

Case No. ${caseNumber}

[Document content will be added here...]

[Additional content...]`
  };

  return templates[type] || templates['Other'];
};
