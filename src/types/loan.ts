/**
 * Hussien Loans Group Savings & Loans Group
 * Motto: Helping You Move Forward
 * Mobile Loan Application & Core Models
 */

export type RatePeriod = 'Week' | 'Month';

export type EmploymentType =
  | 'Employed (Salaried)'
  | 'Self-Employed / Small Business'
  | 'Market Trader / Vendor'
  | 'Boda Boda / Transport Operator'
  | 'Commercial Farmer / Agriculture'
  | 'Freelancer / Artisan';

export type LoanPurposeCategory =
  | 'Business Working Capital / Restock'
  | 'School Fees & Tuition'
  | 'Emergency Medical Expenses'
  | 'Motorcycle / Vehicle Purchase or Repair'
  | 'Agricultural Inputs & Seeds'
  | 'Shop Equipment / Tooling'
  | 'Personal / Home Improvement';

export type PayoutChannel =
  | 'MTN Mobile Money'
  | 'Airtel Money'
  | 'Bank Transfer (Stanbic/Centenary/DFCU)'
  | 'Cash Pickup at Branch';

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'KYC Verified'
  | 'Approved'
  | 'Disbursed'
  | 'Needs Documents'
  | 'Rejected';

export interface UploadedDoc {
  id: string;
  category: string;
  name: string;
  size: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface LoanApplication {
  id: string; // e.g. HLG-APP-1049
  createdAt: string;
  status: ApplicationStatus;

  // Borrower Profile
  fullName: string;
  phoneNumber: string;
  emailAddress?: string;
  nin: string; // Uganda National Identification Number
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  residentialAddress: string;
  district: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;

  // Employment & Income Details
  employmentType: EmploymentType;
  businessOrEmployerName: string;
  jobTitleOrTrade: string;
  workplaceLocation: string;
  yearsExperience: number;
  monthlyIncome: number; // UGX
  monthlyExpenses: number; // UGX

  // Desired Loan Request
  desiredAmount: number; // UGX
  interestRate: number; // 16% standard
  ratePeriod: RatePeriod; // 'Week' or 'Month'
  termPeriods: number; // number of weeks or months
  loanPurposeCategory: LoanPurposeCategory;
  loanPurposeDetails: string;
  payoutChannel: PayoutChannel;
  payoutAccount: string; // Phone number or account number

  // Supporting Documents
  documents: {
    nationalIdFront?: UploadedDoc;
    nationalIdBack?: UploadedDoc;
    proofOfIncome?: UploadedDoc;
    passportPhoto?: UploadedDoc;
    businessProof?: UploadedDoc;
    collateralProof?: UploadedDoc;
  };

  // Electronic Signature
  signatureDataUrl?: string;
  agreedToTerms: boolean;
  officerRemarks?: string;

  // Mobile Money Direct In-App Payout
  momoDisbursement?: {
    optedIn: boolean;
    network: 'MTN Mobile Money' | 'Airtel Money';
    phoneNumber: string;
    accountName: string;
    disbursedAt?: string;
    transactionId?: string;
    referenceNumber?: string;
  };
}

export interface MomoRequirementCheck {
  id: string;
  label: string;
  passed: boolean;
  tip: string;
}

export function checkMomoEligibility(app: LoanApplication): {
  isEligible: boolean;
  isAlreadyDisbursed: boolean;
  requirements: MomoRequirementCheck[];
} {
  const isApproved = app.status === 'Approved' || app.status === 'Disbursed';
  const hasValidNIN = Boolean(app.nin && app.nin.length >= 10);
  const hasIDDocs = Boolean(app.documents.nationalIdFront);
  const hasPhone = Boolean(app.phoneNumber && app.phoneNumber.length >= 10);
  const hasSigned = Boolean(app.agreedToTerms);
  const isAlreadyDisbursed = app.status === 'Disbursed' || Boolean(app.momoDisbursement?.disbursedAt);

  const requirements: MomoRequirementCheck[] = [
    {
      id: 'approval',
      label: 'Officer Credit Approval',
      passed: isApproved,
      tip: isApproved ? 'Application reviewed and approved by credit committee' : 'Pending credit officer approval',
    },
    {
      id: 'nin',
      label: 'National ID (NIN) Verified',
      passed: hasValidNIN,
      tip: hasValidNIN ? `NIN ${app.nin} on file` : 'Valid National ID required',
    },
    {
      id: 'id_docs',
      label: 'ID Card Photo Attached',
      passed: hasIDDocs,
      tip: hasIDDocs ? 'National ID front uploaded' : 'Upload National ID photo',
    },
    {
      id: 'sim_reg',
      label: 'Registered MTN / Airtel SIM',
      passed: hasPhone,
      tip: hasPhone ? `Registered to ${app.fullName}` : 'Provide registered mobile money number',
    },
    {
      id: 'terms',
      label: 'Signed Loan Agreement',
      passed: hasSigned,
      tip: hasSigned ? '16% simple interest terms accepted' : 'Agreement must be accepted',
    },
  ];

  const isEligible = requirements.every((r) => r.passed);

  return {
    isEligible,
    isAlreadyDisbursed,
    requirements,
  };
}

/**
 * Requirement 4 & 5 Simple Interest Computations (Rule 4, 5, 6):
 * Simple Interest = Principal × (Rate ÷ 100) × Number of periods.
 * Total Loan Payment = Principal + Interest; Payment per period = Total ÷ periods.
 */
export function calculateSimpleInterest(principal: number, rate: number, periods: number): number {
  if (principal <= 0 || rate <= 0 || periods <= 0) return 0;
  return Math.round(principal * (rate / 100) * periods);
}

export function calculateTotalLoanPayment(principal: number, interest: number): number {
  return Math.round(principal + interest);
}

export function calculatePaymentPerPeriod(totalPayment: number, periods: number): number {
  if (periods <= 0) return 0;
  return Math.round(totalPayment / periods);
}

export function formatUGX(amount: number): string {
  const rounded = Math.round(amount || 0);
  return 'UGX ' + rounded.toLocaleString('en-US');
}

export function formatUGXCompact(amount: number): string {
  const val = Math.round(amount || 0);
  if (val >= 1_000_000) {
    return `UGX ${(val / 1_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000) {
    return `UGX ${(val / 1_000).toFixed(0)}k`;
  }
  return `UGX ${val}`;
}

export function addPeriodsToDate(startDateStr: string, periods: number, periodType: RatePeriod): string {
  try {
    const d = new Date(startDateStr);
    if (isNaN(d.getTime())) return startDateStr;
    if (periodType === 'Week') {
      d.setDate(d.getDate() + periods * 7);
    } else {
      d.setMonth(d.getMonth() + periods);
    }
    return d.toISOString().split('T')[0];
  } catch {
    return startDateStr;
  }
}
