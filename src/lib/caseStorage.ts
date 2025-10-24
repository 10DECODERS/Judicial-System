// Centralized case storage for all user roles
export interface CaseRecord {
  id: string;
  caseNumber: string;
  caseType: string;
  caseTitle: string;
  lawyerName: string;
  emirates: string;
  emiratesId: string;
  plaintiff: string;
  defendant: string;
  status: string;
  description?: string;
  amount?: string;
  filingDate?: string;
  judge?: string;
  language?: string;
  translationStatus?: string;
  translatedContent?: string;
  translatedLanguage?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: 'clerk' | 'judge' | 'admin' | 'translator';
  sharedWith: Array<'clerk' | 'judge' | 'translator'>;
  documentContent?: string;
}

const STORAGE_KEY = 'app_cases';

// Initialize with 10+ default records
const defaultCases: CaseRecord[] = [
  {
    id: '1',
    caseNumber: '2025-CR-045',
    caseType: 'Criminal Case',
    caseTitle: 'Property Fraud Case',
    lawyerName: 'Adv. Rajesh Kumar',
    emirates: 'Dubai',
    emiratesId: '784-2025-1234567-8',
    plaintiff: 'State of UAE',
    defendant: 'Mr. Ahmed Hassan',
    status: 'Approved',
    description: 'Property fraud investigation',
    amount: '500000',
    filingDate: '2025-01-15',
    judge: 'Justice R. Meenakshi',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-20T15:30:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '2',
    caseNumber: '2025-CV-089',
    caseType: 'Civil Suit',
    caseTitle: 'Loan Agreement Dispute',
    lawyerName: 'Adv. Fatima Ali',
    emirates: 'Abu Dhabi',
    emiratesId: '784-2024-9876543-2',
    plaintiff: 'Mrs. Sara Ahmed',
    defendant: 'M/s. City Bank LLC',
    status: 'Under Review',
    description: 'Dispute over loan terms',
    amount: '750000',
    filingDate: '2024-12-10',
    judge: 'Justice K. Sharma',
    createdAt: '2024-12-10T09:00:00Z',
    updatedAt: '2025-01-18T14:20:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '3',
    caseNumber: '2025-CP-067',
    caseType: 'Commercial Property',
    caseTitle: 'Commercial Lease Violation',
    lawyerName: 'Adv. Mohamed Khalifa',
    emirates: 'Sharjah',
    emiratesId: '784-2023-5678912-4',
    plaintiff: 'M/s. Gulf Properties LLC',
    defendant: 'Mr. Ravi Patel',
    status: 'Pending',
    description: 'Lease agreement breach',
    amount: '1200000',
    filingDate: '2023-11-20',
    judge: 'Justice A. Khan',
    createdAt: '2023-11-20T11:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '4',
    caseNumber: '2025-CA-034',
    caseType: 'Commercial Appeal',
    caseTitle: 'Shareholder Rights Violation',
    lawyerName: 'Adv. Layla Hassan',
    emirates: 'Ras Al Khaimah',
    emiratesId: '784-2024-3456789-1',
    plaintiff: 'M/s. Gulf Investments LLC',
    defendant: 'Mr. John Smith',
    status: 'Pending',
    description: 'Corporate governance dispute',
    amount: '2000000',
    filingDate: '2024-10-05',
    judge: 'Justice M. Ali',
    createdAt: '2024-10-05T08:30:00Z',
    updatedAt: '2025-01-17T16:45:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '5',
    caseNumber: '2025-FC-112',
    caseType: 'Family Law Case',
    caseTitle: 'Divorce and Custody Dispute',
    lawyerName: 'Adv. Ahmed Yusuf',
    emirates: 'Dubai',
    emiratesId: '784-2025-2468135-7',
    plaintiff: 'Mrs. Priya Sharma',
    defendant: 'Mr. Ali Hassan',
    status: 'Under Review',
    description: 'Custody and alimony proceedings',
    amount: '300000',
    filingDate: '2025-01-10',
    judge: 'Justice L. Kumar',
    createdAt: '2025-01-10T13:00:00Z',
    updatedAt: '2025-01-19T11:30:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '6',
    caseNumber: '2025-TR-023',
    caseType: 'Translation Case',
    caseTitle: 'Contract Translation - Arabic to English',
    lawyerName: 'Adv. Samira Al-Mansoori',
    emirates: 'Dubai',
    emiratesId: '784-2025-7891234-5',
    plaintiff: 'M/s. Emirates Trading',
    defendant: 'Shanghai Imports Co.',
    status: 'Pending Translation',
    description: 'International trade contract translation',
    amount: '850000',
    filingDate: '2025-01-12',
    language: 'Arabic to English',
    translationStatus: 'In Progress',
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '7',
    caseNumber: '2025-CC-156',
    caseType: 'Consumer Court',
    caseTitle: 'Product Liability Case',
    lawyerName: 'Adv. Omar Khalid',
    emirates: 'Abu Dhabi',
    emiratesId: '784-2025-3216549-8',
    plaintiff: 'Mr. Vikram Patel',
    defendant: 'Electronics World LLC',
    status: 'Approved',
    description: 'Defective product complaint',
    amount: '45000',
    filingDate: '2025-01-08',
    judge: 'Justice S. Rahman',
    createdAt: '2025-01-08T14:00:00Z',
    updatedAt: '2025-01-21T10:15:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '8',
    caseNumber: '2025-LP-078',
    caseType: 'Labor Dispute',
    caseTitle: 'Wrongful Termination',
    lawyerName: 'Adv. Nadia Ibrahim',
    emirates: 'Sharjah',
    emiratesId: '784-2024-6543210-9',
    plaintiff: 'Mr. Hassan Mohammed',
    defendant: 'Construction Corp UAE',
    status: 'Pending',
    description: 'Employment termination dispute',
    amount: '180000',
    filingDate: '2024-12-15',
    judge: 'Justice H. Patel',
    createdAt: '2024-12-15T09:30:00Z',
    updatedAt: '2025-01-16T13:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '9',
    caseNumber: '2025-IP-091',
    caseType: 'Intellectual Property',
    caseTitle: 'Patent Infringement',
    lawyerName: 'Adv. Khalifa Al-Mazrouei',
    emirates: 'Dubai',
    emiratesId: '784-2025-1597534-2',
    plaintiff: 'Tech Innovations LLC',
    defendant: 'Smart Solutions Inc.',
    status: 'Under Review',
    description: 'Software patent violation',
    amount: '3500000',
    filingDate: '2025-01-05',
    judge: 'Justice T. Sharma',
    createdAt: '2025-01-05T11:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '10',
    caseNumber: '2025-RE-134',
    caseType: 'Real Estate',
    caseTitle: 'Property Ownership Dispute',
    lawyerName: 'Adv. Mariam Al-Zaabi',
    emirates: 'Ajman',
    emiratesId: '784-2024-9517532-6',
    plaintiff: 'Mr. Abdullah Rahman',
    defendant: 'Skyline Developers',
    status: 'Pending',
    description: 'Ownership title dispute',
    amount: '5000000',
    filingDate: '2024-11-25',
    judge: 'Justice N. Kumar',
    createdAt: '2024-11-25T10:00:00Z',
    updatedAt: '2025-01-15T15:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '11',
    caseNumber: '2025-BC-045',
    caseType: 'Banking Case',
    caseTitle: 'Credit Card Fraud',
    lawyerName: 'Adv. Yousef Al-Hammadi',
    emirates: 'Dubai',
    emiratesId: '784-2025-7536421-3',
    plaintiff: 'National Bank UAE',
    defendant: 'Mr. James Wilson',
    status: 'Under Review',
    description: 'Alleged credit card misuse',
    amount: '125000',
    filingDate: '2025-01-14',
    judge: 'Justice F. Ali',
    createdAt: '2025-01-14T12:00:00Z',
    updatedAt: '2025-01-19T16:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '12',
    caseNumber: '2025-MC-089',
    caseType: 'Medical Malpractice',
    caseTitle: 'Surgical Negligence',
    lawyerName: 'Adv. Sara Mahmoud',
    emirates: 'Abu Dhabi',
    emiratesId: '784-2024-8524691-7',
    plaintiff: 'Mr. Ahmed Al-Rashid',
    defendant: 'City Medical Center',
    status: 'Pending',
    description: 'Medical negligence claim',
    amount: '650000',
    filingDate: '2024-12-20',
    judge: 'Justice R. Patel',
    createdAt: '2024-12-20T08:00:00Z',
    updatedAt: '2025-01-17T12:30:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'judge']
  },
  {
    id: '13',
    caseNumber: '2025-TR-101',
    caseType: 'Translation Case',
    caseTitle: 'Commercial Contract Translation',
    lawyerName: 'Adv. Hassan Al-Balushi',
    emirates: 'Sharjah',
    emiratesId: '784-2025-1122334-4',
    plaintiff: 'Global Trading LLC',
    defendant: 'Local Suppliers Co.',
    status: 'Pending Translation',
    description: 'Contract translation Arabic to English',
    amount: '450000',
    filingDate: '2025-01-16',
    language: 'Arabic to English',
    translationStatus: 'Pending',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-20T09:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '14',
    caseNumber: '2025-TR-102',
    caseType: 'Translation Case',
    caseTitle: 'Real Estate Agreement Translation',
    lawyerName: 'Adv. Layla Hassan',
    emirates: 'Dubai',
    emiratesId: '784-2025-2233445-5',
    plaintiff: 'Mr. Vikram Kumar',
    defendant: 'Property Developers Inc.',
    status: 'Pending Translation',
    description: 'Property purchase agreement translation',
    amount: '2500000',
    filingDate: '2025-01-17',
    language: 'English to Hindi',
    translationStatus: 'In Progress',
    createdAt: '2025-01-17T11:00:00Z',
    updatedAt: '2025-01-20T14:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '15',
    caseNumber: '2025-TR-103',
    caseType: 'Translation Case',
    caseTitle: 'Employment Contract Translation',
    lawyerName: 'Adv. Ahmed Yusuf',
    emirates: 'Abu Dhabi',
    emiratesId: '784-2025-3344556-6',
    plaintiff: 'Ms. Fatima Ali',
    defendant: 'Tech Solutions Ltd.',
    status: 'Translation Approved',
    description: 'Employment contract translation',
    amount: '120000',
    filingDate: '2025-01-10',
    language: 'Arabic to English',
    translationStatus: 'Completed',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-19T16:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '16',
    caseNumber: '2025-TR-104',
    caseType: 'Translation Case',
    caseTitle: 'Legal Notice Translation',
    lawyerName: 'Adv. Omar Khalid',
    emirates: 'Dubai',
    emiratesId: '784-2025-4455667-7',
    plaintiff: 'ABC Corporation',
    defendant: 'XYZ Enterprises',
    status: 'Pending Translation',
    description: 'Legal notice document translation',
    amount: '75000',
    filingDate: '2025-01-18',
    language: 'English to Arabic',
    translationStatus: 'Pending',
    createdAt: '2025-01-18T10:30:00Z',
    updatedAt: '2025-01-20T11:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '17',
    caseNumber: '2025-TR-105',
    caseType: 'Translation Case',
    caseTitle: 'Court Order Translation',
    lawyerName: 'Adv. Mariam Al-Zaabi',
    emirates: 'Ajman',
    emiratesId: '784-2025-5566778-8',
    plaintiff: 'Mr. John Smith',
    defendant: 'Construction Company LLC',
    status: 'Pending Translation',
    description: 'Court order translation for enforcement',
    amount: '320000',
    filingDate: '2025-01-19',
    language: 'Arabic to English',
    translationStatus: 'In Progress',
    createdAt: '2025-01-19T08:00:00Z',
    updatedAt: '2025-01-20T15:30:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '18',
    caseNumber: '2025-TR-106',
    caseType: 'Translation Case',
    caseTitle: 'Judgment Translation',
    lawyerName: 'Adv. Khalifa Al-Mazrouei',
    emirates: 'Sharjah',
    emiratesId: '784-2025-6677889-9',
    plaintiff: 'Ms. Priya Sharma',
    defendant: 'Real Estate Holdings',
    status: 'Translation Approved',
    description: 'Final judgment translation',
    amount: '980000',
    filingDate: '2025-01-12',
    language: 'Arabic to English',
    translationStatus: 'Completed',
    createdAt: '2025-01-12T09:30:00Z',
    updatedAt: '2025-01-18T17:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '19',
    caseNumber: '2025-TR-107',
    caseType: 'Translation Case',
    caseTitle: 'Business Agreement Translation',
    lawyerName: 'Adv. Nadia Ibrahim',
    emirates: 'Dubai',
    emiratesId: '784-2025-7788990-1',
    plaintiff: 'International Corp',
    defendant: 'Local Business Partners',
    status: 'Pending Translation',
    description: 'Partnership agreement translation',
    amount: '650000',
    filingDate: '2025-01-20',
    language: 'English to Arabic',
    translationStatus: 'Pending',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '20',
    caseNumber: '2025-TR-108',
    caseType: 'Translation Case',
    caseTitle: 'Insurance Claim Translation',
    lawyerName: 'Adv. Samira Al-Mansoori',
    emirates: 'Abu Dhabi',
    emiratesId: '784-2025-8899001-2',
    plaintiff: 'Mr. Ali Hassan',
    defendant: 'Insurance Company UAE',
    status: 'Pending Translation',
    description: 'Insurance claim documents translation',
    amount: '220000',
    filingDate: '2025-01-19',
    language: 'Arabic to English',
    translationStatus: 'In Progress',
    createdAt: '2025-01-19T11:00:00Z',
    updatedAt: '2025-01-20T13:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '21',
    caseNumber: '2025-TR-109',
    caseType: 'Translation Case',
    caseTitle: 'Divorce Decree Translation',
    lawyerName: 'Adv. Yousef Al-Hammadi',
    emirates: 'Ras Al Khaimah',
    emiratesId: '784-2025-9900112-3',
    plaintiff: 'Mrs. Maryam Ali',
    defendant: 'Mr. Abdullah Rahman',
    status: 'Translation Approved',
    description: 'Family court decree translation',
    amount: '50000',
    filingDate: '2025-01-11',
    language: 'Arabic to English',
    translationStatus: 'Completed',
    createdAt: '2025-01-11T14:00:00Z',
    updatedAt: '2025-01-17T10:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  },
  {
    id: '22',
    caseNumber: '2025-TR-110',
    caseType: 'Translation Case',
    caseTitle: 'Trademark Registration Translation',
    lawyerName: 'Adv. Hassan Al-Balushi',
    emirates: 'Dubai',
    emiratesId: '784-2025-0011223-4',
    plaintiff: 'Innovation Tech LLC',
    defendant: 'Competitor Industries',
    status: 'Pending Translation',
    description: 'Trademark documents translation',
    amount: '180000',
    filingDate: '2025-01-20',
    language: 'English to Arabic',
    translationStatus: 'Pending',
    createdAt: '2025-01-20T15:00:00Z',
    updatedAt: '2025-01-20T15:00:00Z',
    createdBy: 'clerk',
    sharedWith: ['clerk', 'translator']
  }
];

// Initialize storage if empty
export const initializeStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCases));
  }
};

// Get all cases
export const getAllCases = (): CaseRecord[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get cases by role
export const getCasesByRole = (role: 'clerk' | 'judge' | 'translator'): CaseRecord[] => {
  const allCases = getAllCases();
  return allCases.filter(c => c.sharedWith.includes(role));
};

// Get case by ID
export const getCaseById = (id: string): CaseRecord | null => {
  const cases = getAllCases();
  return cases.find(c => c.id === id) || null;
};

// Get case by case number
export const getCaseByCaseNumber = (caseNumber: string): CaseRecord | null => {
  const cases = getAllCases();
  return cases.find(c => c.caseNumber === caseNumber) || null;
};

// Add new case
export const addCase = (caseData: Omit<CaseRecord, 'id' | 'createdAt' | 'updatedAt'>): CaseRecord => {
  const cases = getAllCases();
  const newCase: CaseRecord = {
    ...caseData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  cases.unshift(newCase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return newCase;
};

// Update case
export const updateCase = (caseNumber: string, updates: Partial<CaseRecord>): CaseRecord | null => {
  const cases = getAllCases();
  const index = cases.findIndex(c => c.caseNumber === caseNumber);
  
  if (index === -1) return null;
  
  cases[index] = {
    ...cases[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return cases[index];
};

// Update case status
export const updateCaseStatus = (caseNumber: string, status: string): CaseRecord | null => {
  return updateCase(caseNumber, { status });
};

// Share case with role
export const shareCaseWith = (caseNumber: string, role: 'judge' | 'translator'): CaseRecord | null => {
  const caseRecord = getCaseByCaseNumber(caseNumber);
  if (!caseRecord) return null;
  
  const sharedWith = [...new Set([...caseRecord.sharedWith, role])];
  return updateCase(caseNumber, { sharedWith });
};

// Delete case
export const deleteCase = (caseNumber: string): boolean => {
  const cases = getAllCases();
  const filtered = cases.filter(c => c.caseNumber !== caseNumber);
  
  if (filtered.length === cases.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
