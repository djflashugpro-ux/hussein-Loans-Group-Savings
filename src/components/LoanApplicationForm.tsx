import React, { useState, useRef, useEffect } from 'react';
import { useLoans } from '../context/LoanContext';
import {
  RatePeriod,
  EmploymentType,
  LoanPurposeCategory,
  PayoutChannel,
  UploadedDoc,
  calculateSimpleInterest,
  calculateTotalLoanPayment,
  calculatePaymentPerPeriod,
  formatUGX,
  formatUGXCompact,
} from '../types/loan';
import {
  User,
  CreditCard,
  Briefcase,
  Coins,
  Upload,
  FileCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Camera,
  FileText,
  Sparkles,
  Check,
} from 'lucide-react';

export const LoanApplicationForm: React.FC = () => {
  const { addApplication, setActiveTab } = useLoans();

  // Current Step: 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Step 1: Borrower Details
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+256 ');
  const [emailAddress, setEmailAddress] = useState('');
  const [dob, setDob] = useState('1994-08-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [district, setDistrict] = useState('Kampala');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('+256 ');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState('Spouse');

  // Step 2: National ID
  const [nin, setNin] = useState('');

  // Step 3: Employment Details
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    'Self-Employed / Small Business'
  );
  const [businessOrEmployerName, setBusinessOrEmployerName] = useState('');
  const [jobTitleOrTrade, setJobTitleOrTrade] = useState('');
  const [workplaceLocation, setWorkplaceLocation] = useState('');
  const [yearsExperience, setYearsExperience] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(2000000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(900000);

  // Step 4: Desired Loan Amount & Purpose (Weekly count on 10% by default, optional monthly, flexible 10%, 16%, 20%)
  const [desiredAmount, setDesiredAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(10); // 10% default standard
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>('Week'); // Weekly default, Monthly optional
  const [termPeriods, setTermPeriods] = useState<number>(4); // default 4 weeks
  const [customRateInput, setCustomRateInput] = useState<string>('');
  const [loanPurposeCategory, setLoanPurposeCategory] = useState<LoanPurposeCategory>(
    'Business Working Capital / Restock'
  );
  const [loanPurposeDetails, setLoanPurposeDetails] = useState('');
  const [payoutChannel, setPayoutChannel] = useState<PayoutChannel>('MTN Mobile Money');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [optInMomo, setOptInMomo] = useState(true);

  // Step 5: Supporting Documents
  const [documents, setDocuments] = useState<{
    nationalIdFront?: UploadedDoc;
    nationalIdBack?: UploadedDoc;
    proofOfIncome?: UploadedDoc;
    passportPhoto?: UploadedDoc;
    businessProof?: UploadedDoc;
    collateralProof?: UploadedDoc;
  }>({});

  // Step 6: Review & Electronic Signature
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Auto-sync payout account with phone number if empty
  useEffect(() => {
    if (!payoutAccount && phoneNumber.length > 5) {
      setPayoutAccount(phoneNumber);
    }
  }, [phoneNumber, payoutAccount]);

  // Calculations (Rules 4 & 5)
  const simpleInterest = calculateSimpleInterest(desiredAmount, interestRate, termPeriods);
  const totalLoanPayment = calculateTotalLoanPayment(desiredAmount, simpleInterest);
  const paymentPerPeriod = calculatePaymentPerPeriod(totalLoanPayment, termPeriods);

  // Quick fill helper for testing
  const handleAutoFillDemo = () => {
    setFullName('Kato Ibrahim Ssalongo');
    setPhoneNumber('+256 772 123 456');
    setEmailAddress('kato.ssalongo@gmail.com');
    setNin('CM92018104ABCD');
    setDob('1992-05-14');
    setGender('Male');
    setResidentialAddress('Kalerwe, Zone B, Plot 42');
    setDistrict('Kampala');
    setNextOfKinName('Nassolo Sarah');
    setNextOfKinPhone('+256 701 445 678');
    setNextOfKinRelationship('Spouse');

    setEmploymentType('Market Trader / Vendor');
    setBusinessOrEmployerName('Ssalongo Produce Supplies');
    setJobTitleOrTrade('Grain Wholesale Trader');
    setWorkplaceLocation('Kalerwe Central Produce Market, Stall 88');
    setYearsExperience(6);
    setMonthlyIncome(3500000);
    setMonthlyExpenses(1500000);

    setDesiredAmount(1500000);
    setRatePeriod('Week');
    setInterestRate(10);
    setTermPeriods(4);
    setLoanPurposeCategory('Business Working Capital / Restock');
    setLoanPurposeDetails('Purchase of 50 bags of maize grain and dry beans for wholesale supply.');
    setPayoutChannel('MTN Mobile Money');
    setPayoutAccount('+256 772 123 456');

    // Seed mock documents
    setDocuments({
      nationalIdFront: {
        id: 'mock-1',
        category: 'National ID (Front)',
        name: 'kato_nin_front.jpg',
        size: '1.2 MB',
        uploadedAt: new Date().toISOString(),
      },
      nationalIdBack: {
        id: 'mock-2',
        category: 'National ID (Back)',
        name: 'kato_nin_back.jpg',
        size: '1.1 MB',
        uploadedAt: new Date().toISOString(),
      },
      proofOfIncome: {
        id: 'mock-3',
        category: 'Mobile Money Statement',
        name: 'momo_6months_statement.pdf',
        size: '2.4 MB',
        uploadedAt: new Date().toISOString(),
      },
      passportPhoto: {
        id: 'mock-4',
        category: 'Applicant Passport Photo',
        name: 'kato_photo.jpg',
        size: '620 KB',
        uploadedAt: new Date().toISOString(),
      },
    });

    setAgreedToTerms(true);
    setHasSigned(true);
  };

  // Document Upload Handler
  const handleFileUpload = (
    key: keyof typeof documents,
    categoryName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      setDocuments((prev) => ({
        ...prev,
        [key]: {
          id: `doc-${Date.now()}`,
          category: categoryName,
          name: file.name,
          size: sizeStr,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (key: keyof typeof documents) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Canvas Signature functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
  }, [currentStep]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Final Submission
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !nin || desiredAmount <= 0) {
      alert('Please complete all required fields.');
      return;
    }

    const signatureDataUrl = canvasRef.current?.toDataURL();

    const newId = addApplication({
      fullName,
      phoneNumber,
      emailAddress,
      nin,
      dob,
      gender,
      residentialAddress,
      district,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelationship,
      employmentType,
      businessOrEmployerName,
      jobTitleOrTrade,
      workplaceLocation,
      yearsExperience,
      monthlyIncome,
      monthlyExpenses,
      desiredAmount,
      interestRate,
      ratePeriod,
      termPeriods,
      loanPurposeCategory,
      loanPurposeDetails,
      payoutChannel,
      payoutAccount,
      documents,
      signatureDataUrl,
      agreedToTerms,
      momoDisbursement: optInMomo
        ? {
            optedIn: true,
            network: payoutChannel === 'Airtel Money' ? 'Airtel Money' : 'MTN Mobile Money',
            phoneNumber: payoutAccount || phoneNumber,
            accountName: fullName,
          }
        : undefined,
    });

    setSubmittedAppId(newId);
  };

  // Denominations inspired by Uganda Banknotes depicted in the logo
  const presetAmounts = [100000, 300000, 500000, 1000000, 2000000, 5000000];

  const stepsList = [
    { num: 1, title: 'Personal & Contact' },
    { num: 2, title: 'National ID (NIN)' },
    { num: 3, title: 'Employment Details' },
    { num: 4, title: 'Loan Amount & Purpose' },
    { num: 5, title: 'Upload Documents' },
    { num: 6, title: 'Review & Sign' },
  ];

  // Success view if submitted
  if (submittedAppId) {
    return (
      <div className="p-6 text-center space-y-5 animate-in fade-in duration-300 bg-neutral-950 text-white">
        <div className="relative inline-block mx-auto">
          <img
            src="/logo.jpeg"
            alt="Hussein Loans Group Official Seal"
            className="w-20 h-20 rounded-full object-cover border-3 border-amber-400 mx-auto shadow-lg shadow-amber-500/20"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 text-black rounded-full flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            Application Submitted!
          </h2>
          <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
            Hussein Loans Group · Save • Borrow • Grow
          </p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-2xl border border-amber-500/40 text-left space-y-2 text-xs shadow-md">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800 font-mono">
            <span className="text-neutral-400">Application Reference:</span>
            <span className="font-bold text-amber-400 text-sm">{submittedAppId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Applicant:</span>
            <span className="font-bold text-white">{fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Requested Amount:</span>
            <span className="font-mono font-bold text-amber-300">{formatUGX(desiredAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Term:</span>
            <span className="font-semibold text-white">
              {termPeriods} {ratePeriod}s (16% Rate)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Payout Destination:</span>
            <span className="font-semibold text-amber-400">{payoutChannel}</span>
          </div>
        </div>

        <div className="p-3.5 bg-neutral-900/80 rounded-xl text-left border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
          <p className="font-bold text-amber-300">Fast Approval Process:</p>
          <p>• Verification of your National ID &amp; income documents has started.</p>
          <p>• Mobile money disbursement within 2 to 4 business hours upon approval.</p>
          <p>• Payout directly via MTN or Airtel Mobile Money.</p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => setActiveTab('status')}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Track Application Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setSubmittedAppId(null);
              setCurrentStep(1);
            }}
            className="w-full py-2.5 text-xs text-neutral-400 hover:text-white font-semibold transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-950 text-white">
      {/* Mobile Form Header & Progress (Gold & Black) */}
      <div className="bg-neutral-900/90 px-4 pt-3 pb-3 border-b border-neutral-800 sticky top-12 z-30 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              STEP {currentStep} OF 6
            </span>
            <h2 className="text-sm font-bold text-white">
              {stepsList[currentStep - 1].title}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="flex items-center gap-1 text-[11px] text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 font-bold px-2.5 py-1 rounded-lg shadow-xs transition-all"
            title="Auto-fill sample Ugandan borrower details for testing"
          >
            <Sparkles className="w-3 h-3 text-black" />
            <span>Auto-fill Demo</span>
          </button>
        </div>

        {/* Gold Progress Bar */}
        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-full rounded-full transition-all duration-300 ease-out shadow-xs"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Step Form Body */}
      <form onSubmit={handleSubmitApplication} className="p-4 space-y-4 flex-1">
        {/* ========================================================
            STEP 1: Borrower Information & Contact
            ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Borrower Full Information</p>
                <p className="text-[11px] text-neutral-400">
                  Enter your legal name and contact details as registered with NIRA Uganda.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kato Ibrahim Ssalongo"
                className="w-full px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Mobile Number (Momo) *
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+256 7..."
                  className="w-full px-3 py-2.5 text-xs bg-white text-black font-mono font-bold border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2.5 text-xs bg-white text-black border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white text-black border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                District &amp; Residential Location *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="col-span-1 px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
                >
                  <option value="Kampala">Kampala</option>
                  <option value="Wakiso">Wakiso</option>
                  <option value="Mukono">Mukono</option>
                  <option value="Jinja">Jinja</option>
                  <option value="Mbarara">Mbarara</option>
                  <option value="Gulu">Gulu</option>
                  <option value="Arua">Arua</option>
                  <option value="Masaka">Masaka</option>
                </select>
                <input
                  type="text"
                  required
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  placeholder="Zone, Street / Village, House #"
                  className="col-span-2 px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
                />
              </div>
            </div>

            {/* Next of Kin / Guarantor */}
            <div className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
                Next of Kin / Guarantor
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Guarantor Name"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  className="px-3 py-2 text-xs bg-white text-black rounded-xl border border-neutral-300"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  className="px-3 py-2 text-xs bg-white text-black rounded-xl font-mono border border-neutral-300"
                />
              </div>
              <select
                value={nextOfKinRelationship}
                onChange={(e) => setNextOfKinRelationship(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white text-black font-semibold rounded-xl border border-neutral-300"
              >
                <option value="Spouse">Spouse</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Parent">Parent</option>
                <option value="Business Partner">Business Partner</option>
                <option value="Friend">Friend</option>
              </select>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: National ID (NIN)
            ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Uganda National Identification (NIN)</p>
                <p className="text-[11px] text-neutral-400">
                  Required by NIRA and Bank of Uganda regulations for microfinance lending.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                National Identification Number (NIN) *
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={nin}
                onChange={(e) => setNin(e.target.value.toUpperCase())}
                placeholder="e.g. CM92018104ABCD"
                className="w-full px-3.5 py-3 text-base font-mono font-black tracking-widest uppercase bg-white text-black border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Format: 14 characters starting with CM (Male) or CF (Female).
              </p>
            </div>

            {/* Quick Card Upload Slots */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-amber-300 block">
                National ID Photos (Front &amp; Back)
              </span>

              {/* Front */}
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">National ID Front</div>
                    <div className="text-[10px] text-neutral-400">
                      {documents.nationalIdFront ? documents.nationalIdFront.name : 'Clear photo of front side'}
                    </div>
                  </div>
                </div>

                {documents.nationalIdFront ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc('nationalIdFront')}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black text-[11px] font-bold rounded-lg shadow-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload('nationalIdFront', 'National ID (Front)', e)}
                    />
                  </label>
                )}
              </div>

              {/* Back */}
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">National ID Back</div>
                    <div className="text-[10px] text-neutral-400">
                      {documents.nationalIdBack ? documents.nationalIdBack.name : 'Clear photo of barcode back'}
                    </div>
                  </div>
                </div>

                {documents.nationalIdBack ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc('nationalIdBack')}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black text-[11px] font-bold rounded-lg shadow-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload('nationalIdBack', 'National ID (Back)', e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: Employment Details
            ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Employment &amp; Income Source</p>
                <p className="text-[11px] text-neutral-400">
                  Evaluated by our credit team to determine repayment capacity and interest tier.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Employment Category *
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
              >
                <option value="Market Trader / Vendor">Market Trader / Vendor</option>
                <option value="Self-Employed / Small Business">Self-Employed / Small Business</option>
                <option value="Boda Boda / Transport Operator">Boda Boda / Transport Operator</option>
                <option value="Employed (Salaried)">Employed (Salaried)</option>
                <option value="Commercial Farmer / Agriculture">Commercial Farmer / Agriculture</option>
                <option value="Freelancer / Artisan">Freelancer / Artisan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Business / Employer Name *
              </label>
              <input
                type="text"
                required
                value={businessOrEmployerName}
                onChange={(e) => setBusinessOrEmployerName(e.target.value)}
                placeholder="e.g. Ssalongo Produce / Nakasero Market Stall"
                className="w-full px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Role / Occupation
                </label>
                <input
                  type="text"
                  value={jobTitleOrTrade}
                  onChange={(e) => setJobTitleOrTrade(e.target.value)}
                  placeholder="e.g. Grain Trader / Rider"
                  className="w-full px-3 py-2 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Years in Trade
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white text-black font-mono font-bold border border-neutral-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Workplace / Stall Location
              </label>
              <input
                type="text"
                value={workplaceLocation}
                onChange={(e) => setWorkplaceLocation(e.target.value)}
                placeholder="e.g. Kalerwe Market Stall 88"
                className="w-full px-3 py-2 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl"
              />
            </div>

            {/* Income & Expenses */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Est. Monthly Income (UGX)
                </label>
                <input
                  type="number"
                  min="100000"
                  step="50000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs font-mono font-black bg-white text-black border border-neutral-300 rounded-xl"
                />
                <span className="text-[10px] text-amber-400 font-mono mt-0.5 block">
                  {formatUGX(monthlyIncome)}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Est. Monthly Expenses (UGX)
                </label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs font-mono font-black bg-white text-black border border-neutral-300 rounded-xl"
                />
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                  {formatUGX(monthlyExpenses)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: Desired Loan Amount & Purpose
            ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Desired Loan &amp; Purpose</p>
                <p className="text-[11px] text-neutral-400">
                  Default 10% weekly simple interest model in Uganda Shillings (UGX) (custom rate &amp; monthly available).
                </p>
              </div>
            </div>

            {/* Desired Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300">
                  Desired Loan Amount (UGX) *
                </label>
                <span className="text-base font-mono font-black text-amber-400">
                  {formatUGX(desiredAmount)}
                </span>
              </div>

              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={desiredAmount}
                onChange={(e) => setDesiredAmount(Number(e.target.value))}
                className="w-full accent-amber-400"
              />

              {/* Quick Preset Buttons (Inspired by Ugandan cash banknotes in logo) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDesiredAmount(amt)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                      desiredAmount === amt
                        ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
                    }`}
                  >
                    {formatUGXCompact(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Purpose Category */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Loan Purpose *
              </label>
              <select
                value={loanPurposeCategory}
                onChange={(e) => setLoanPurposeCategory(e.target.value as LoanPurposeCategory)}
                className="w-full px-3 py-2.5 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 shadow-sm"
              >
                <option value="Business Working Capital / Restock">
                  Business Working Capital / Restock
                </option>
                <option value="School Fees & Tuition">School Fees &amp; Tuition</option>
                <option value="Motorcycle / Vehicle Purchase or Repair">
                  Motorcycle / Vehicle Purchase or Repair
                </option>
                <option value="Emergency Medical Expenses">Emergency Medical Expenses</option>
                <option value="Agricultural Inputs & Seeds">Agricultural Inputs &amp; Seeds</option>
                <option value="Shop Equipment / Tooling">Shop Equipment / Tooling</option>
                <option value="Personal / Home Improvement">Personal / Home Improvement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">
                Specific Purpose Details
              </label>
              <textarea
                rows={2}
                value={loanPurposeDetails}
                onChange={(e) => setLoanPurposeDetails(e.target.value)}
                placeholder="Briefly state how these funds will be deployed..."
                className="w-full px-3 py-2 text-xs bg-white text-black font-medium border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Flexible Interest Rate Selector: 10% (Default), 16%, 20%, or Custom */}
            <div className="space-y-1.5 p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300">
                  Interest Rate (%) *
                </label>
                <span className="text-xs font-mono font-black text-amber-400">
                  {interestRate}% per {ratePeriod.toLowerCase()}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {/* 10% Default Standard */}
                <button
                  type="button"
                  onClick={() => {
                    setInterestRate(10);
                    setCustomRateInput('');
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                    interestRate === 10 && !customRateInput
                      ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
                  }`}
                >
                  <span className="block font-black text-xs">10%</span>
                  <span className="text-[9px] text-neutral-400 block font-normal">Default</span>
                </button>

                {/* 16% */}
                <button
                  type="button"
                  onClick={() => {
                    setInterestRate(16);
                    setCustomRateInput('');
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                    interestRate === 16 && !customRateInput
                      ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
                  }`}
                >
                  <span className="block font-black text-xs">16%</span>
                  <span className="text-[9px] text-neutral-400 block font-normal">Option</span>
                </button>

                {/* 20% */}
                <button
                  type="button"
                  onClick={() => {
                    setInterestRate(20);
                    setCustomRateInput('');
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                    interestRate === 20 && !customRateInput
                      ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
                  }`}
                >
                  <span className="block font-black text-xs">20%</span>
                  <span className="text-[9px] text-neutral-400 block font-normal">Option</span>
                </button>

                {/* Custom Rate Input */}
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Custom %"
                    value={customRateInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomRateInput(val);
                      if (val && !isNaN(Number(val))) {
                        setInterestRate(Math.max(1, Number(val)));
                      }
                    }}
                    className={`w-full h-full py-2 px-1.5 text-center text-xs font-mono font-bold rounded-xl border transition-all ${
                      customRateInput
                        ? 'bg-amber-400 text-black border-amber-400 font-black'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                    }`}
                  />
                </div>
              </div>
              <p className="text-[10px] text-neutral-400">
                Loan counts weekly on 10% by default. You can freely choose 10%, 16%, 20%, or enter any custom rate.
              </p>
            </div>

            {/* Repayment Frequency: Weekly by default, Monthly optional */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300">
                  Loan Count Frequency *
                </label>
                <span className="text-[11px] text-amber-300 font-semibold">
                  {ratePeriod === 'Week' ? 'Weekly (Standard)' : 'Monthly (Optional)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRatePeriod('Week');
                    setTermPeriods(4);
                  }}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                    ratePeriod === 'Week'
                      ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="block text-xs">Weekly (Default)</span>
                  <span className="text-[10px] opacity-80 block font-normal">Counts weekly</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRatePeriod('Month');
                    setTermPeriods(2);
                  }}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                    ratePeriod === 'Month'
                      ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="block text-xs">Monthly (Optional)</span>
                  <span className="text-[10px] opacity-80 block font-normal">In case required</span>
                </button>
              </div>
            </div>

            {/* Term Periods & Disbursement Payout */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Term Length ({ratePeriod === 'Week' ? 'Weeks' : 'Months'}) *
                </label>
                <select
                  value={termPeriods}
                  onChange={(e) => setTermPeriods(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white text-black font-mono font-bold border border-neutral-300 rounded-xl"
                >
                  {ratePeriod === 'Week' ? (
                    <>
                      <option value={1}>1 Week</option>
                      <option value={2}>2 Weeks</option>
                      <option value={3}>3 Weeks</option>
                      <option value={4}>4 Weeks (1 Month)</option>
                      <option value={6}>6 Weeks</option>
                      <option value={8}>8 Weeks (2 Months)</option>
                      <option value={12}>12 Weeks (3 Months)</option>
                      <option value={16}>16 Weeks (4 Months)</option>
                      <option value={24}>24 Weeks (6 Months)</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>1 Month</option>
                      <option value={2}>2 Months</option>
                      <option value={3}>3 Months</option>
                      <option value={4}>4 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months (1 Year)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Disbursement Payout *
                </label>
                <select
                  value={payoutChannel}
                  onChange={(e) => setPayoutChannel(e.target.value as PayoutChannel)}
                  className="w-full px-3 py-2 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl"
                >
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Bank Transfer (Stanbic/Centenary/DFCU)">Bank Transfer</option>
                  <option value="Cash Pickup at Branch">Cash at Branch</option>
                </select>
              </div>
            </div>

            {/* Optional In-App Mobile Money Cashout Feature Card */}
            <div className="p-3.5 bg-neutral-900 rounded-2xl border border-amber-400/40 text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optInMomo}
                  onChange={(e) => setOptInMomo(e.target.checked)}
                  className="mt-0.5 accent-amber-400 w-4 h-4 rounded"
                />
                <div>
                  <span className="font-bold text-amber-300 text-xs block">
                    Receive Money via Mobile Money (MTN / Airtel)
                  </span>
                  <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">
                    Enable direct, in-app mobile money disbursement as long as you meet credit requirements.
                  </p>
                </div>
              </label>

              {optInMomo && (
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-[10px] space-y-1 text-neutral-300">
                  <span className="font-bold text-amber-400 block uppercase tracking-wider">
                    Required Requirements Checklist:
                  </span>
                  <p>✓ Credit Officer approval on your application</p>
                  <p>✓ National ID (NIN) verified with NIRA records</p>
                  <p>✓ Active MTN or Airtel line registered in your legal name</p>
                  <p>✓ Signed 16% simple interest agreement</p>
                </div>
              )}
            </div>

            {/* Live Financial Breakdown Card (Gold & Black) */}
            <div className="p-4 bg-neutral-900 text-white rounded-2xl border border-amber-400/40 shadow-md space-y-2 text-xs">
              <div className="flex justify-between items-center text-amber-300 text-[11px] font-bold border-b border-neutral-800 pb-1.5">
                <span>16% Simple Interest Model</span>
                <span className="font-mono">{termPeriods} {ratePeriod}s</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Simple Interest (16%):</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">
                  {formatUGX(simpleInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total Repayment:</span>
                <span className="font-mono font-black text-white text-sm tabular-nums">
                  {formatUGX(totalLoanPayment)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1.5 border-t border-neutral-800">
                <span className="text-amber-300 font-bold">Installment per {ratePeriod}:</span>
                <span className="font-mono font-black text-amber-400 text-sm tabular-nums">
                  {formatUGX(paymentPerPeriod)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: Supporting Documents Upload
            ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Supporting Documents Upload</p>
                <p className="text-[11px] text-neutral-400">
                  Attach supporting files or snap photos using your phone. JPG, PNG, or PDF accepted.
                </p>
              </div>
            </div>

            {/* Document Slots */}
            <div className="space-y-2.5">
              {/* 1. National ID Front */}
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      National ID (Front) *
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {documents.nationalIdFront ? documents.nationalIdFront.name : 'NIRA ID card front'}
                    </div>
                  </div>
                </div>

                {documents.nationalIdFront ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc('nationalIdFront')}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black text-[11px] font-bold rounded-lg shadow-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload('nationalIdFront', 'National ID (Front)', e)}
                    />
                  </label>
                )}
              </div>

              {/* 2. Proof of Income */}
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/20">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Proof of Income / Momo Statement *
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {documents.proofOfIncome ? documents.proofOfIncome.name : 'MTN/Airtel Momo statement or payslip'}
                    </div>
                  </div>
                </div>

                {documents.proofOfIncome ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc('proofOfIncome')}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black text-[11px] font-bold rounded-lg shadow-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload('proofOfIncome', 'Proof of Income', e)}
                    />
                  </label>
                )}
              </div>

              {/* 3. Passport Photo */}
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/20">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Applicant Passport Photo
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {documents.passportPhoto ? documents.passportPhoto.name : 'Clear front-facing portrait'}
                    </div>
                  </div>
                </div>

                {documents.passportPhoto ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc('passportPhoto')}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black text-[11px] font-bold rounded-lg shadow-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('passportPhoto', 'Passport Photo', e)}
                    />
                  </label>
                )}
              </div>

              {/* 4. Business License or LC1 Letter */}
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/20">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Business License / LC1 Letter
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {documents.businessProof ? documents.businessProof.name : 'Trading permit, stall receipt, or LC1 letter'}
                    </div>
                  </div>
                </div>

                {documents.businessProof ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc('businessProof')}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black text-[11px] font-bold rounded-lg shadow-sm">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload('businessProof', 'Business License', e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 6: Review & Electronic Signature
            ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Review &amp; Electronic Signature</p>
                <p className="text-[11px] text-neutral-400">
                  Please review your loan submission and sign with your finger below.
                </p>
              </div>
            </div>

            {/* Application Summary Card */}
            <div className="p-4 bg-white text-black rounded-2xl shadow-sm text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-semibold">Applicant:</span>
                <span className="font-black text-black">{fullName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-semibold">National ID (NIN):</span>
                <span className="font-mono font-black text-black">{nin || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-semibold">Phone:</span>
                <span className="font-mono font-bold text-black">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-semibold">Employment:</span>
                <span className="text-black font-semibold">{employmentType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-semibold">Desired Loan:</span>
                <span className="font-mono font-black text-amber-600 text-sm">{formatUGX(desiredAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-semibold">Repayment:</span>
                <span className="font-bold text-black">
                  {termPeriods} {ratePeriod}s @ {interestRate}% Simple Interest
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                <span className="text-neutral-600 font-bold">Total Repayable:</span>
                <span className="font-mono font-black text-black text-base">
                  {formatUGX(totalLoanPayment)}
                </span>
              </div>
            </div>

            {/* Touch Signature Pad */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300">
                  Borrower Finger Signature *
                </label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[11px] text-amber-400 hover:underline font-bold"
                >
                  Clear Signature
                </button>
              </div>

              <div className="border-2 border-amber-400 rounded-2xl bg-white overflow-hidden shadow-sm">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={120}
                  className="w-full h-28 touch-none bg-white cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <p className="text-[10px] text-neutral-400">
                Draw your signature with your finger or stylus inside the white box.
              </p>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 accent-amber-400 w-4 h-4 rounded"
              />
              <span className="text-[11px] text-neutral-300 leading-tight">
                I declare all information provided to <strong className="text-amber-400">Hussein Loans Group</strong> is true and correct. I agree to the 16% simple interest terms and authorize credit verification.
              </span>
            </label>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="pt-3 flex items-center justify-between gap-3 border-t border-neutral-800 mt-auto">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-700 text-xs font-bold text-neutral-300 hover:bg-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black shadow-md shadow-amber-500/20 hover:brightness-105 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!agreedToTerms}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-105 disabled:opacity-40 text-black text-xs font-black shadow-md shadow-amber-500/30 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
