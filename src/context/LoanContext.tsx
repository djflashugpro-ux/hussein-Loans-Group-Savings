import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoanApplication, ApplicationStatus } from '../types/loan';
import { SAMPLE_APPLICATIONS } from '../data/sampleApplications';

interface LoanContextType {
  applications: LoanApplication[];
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  activeTab: 'apply' | 'status' | 'calculator' | 'officer' | 'support';
  setActiveTab: (tab: 'apply' | 'status' | 'calculator' | 'officer' | 'support') => void;
  phoneFrameMode: boolean;
  setPhoneFrameMode: (enabled: boolean) => void;
  addApplication: (app: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>) => string;
  updateApplicationStatus: (id: string, status: ApplicationStatus, officerRemarks?: string) => void;
  disburseViaMobileMoney: (
    id: string,
    network: 'MTN Mobile Money' | 'Airtel Money',
    phoneNumber: string,
    accountName: string
  ) => { txnId: string; reference: string };
  deleteApplication: (id: string) => void;
  resetApplications: () => void;
}

const STORAGE_KEY_APPS = 'hlg_mobile_loan_apps_v2';
const STORAGE_KEY_FRAME = 'hlg_phone_frame_mode';

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<LoanApplication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return SAMPLE_APPLICATIONS;
  });

  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    SAMPLE_APPLICATIONS[0]?.id || null
  );

  const [activeTab, setActiveTab] = useState<'apply' | 'status' | 'calculator' | 'officer' | 'support'>('apply');

  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FRAME);
      if (stored !== null) return stored === 'true';
    } catch {
      // fallback
    }
    // Default to true on wide screens so users see the phone frame immediately!
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch {
      // Ignore
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FRAME, String(phoneFrameMode));
    } catch {
      // Ignore
    }
  }, [phoneFrameMode]);

  const addApplication = (appData: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>): string => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `HLG-APP-2026-${randomNum}`;
    const newApp: LoanApplication = {
      ...appData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'Submitted',
    };

    setApplications((prev) => [newApp, ...prev]);
    setSelectedAppId(newId);
    return newId;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, officerRemarks?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              ...(officerRemarks !== undefined ? { officerRemarks } : {}),
            }
          : app
      )
    );
  };

  const disburseViaMobileMoney = (
    id: string,
    network: 'MTN Mobile Money' | 'Airtel Money',
    phoneNumber: string,
    accountName: string
  ): { txnId: string; reference: string } => {
    const txnNum = Math.floor(100000 + Math.random() * 900000);
    const txnId = network === 'MTN Mobile Money' ? `MTN-UG-${txnNum}` : `AIRTEL-UG-${txnNum}`;
    const reference = `HLG-DISB-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'Disbursed',
              momoDisbursement: {
                optedIn: true,
                network,
                phoneNumber,
                accountName,
                disbursedAt: nowIso,
                transactionId: txnId,
                referenceNumber: reference,
              },
            }
          : app
      )
    );

    return { txnId, reference };
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (selectedAppId === id) {
      setSelectedAppId(applications.find((a) => a.id !== id)?.id || null);
    }
  };

  const resetApplications = () => {
    if (window.confirm('Reset applications to original sample records?')) {
      setApplications(SAMPLE_APPLICATIONS);
      setSelectedAppId(SAMPLE_APPLICATIONS[0].id);
    }
  };

  return (
    <LoanContext.Provider
      value={{
        applications,
        selectedAppId,
        setSelectedAppId,
        activeTab,
        setActiveTab,
        phoneFrameMode,
        setPhoneFrameMode,
        addApplication,
        updateApplicationStatus,
        disburseViaMobileMoney,
        deleteApplication,
        resetApplications,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
};
