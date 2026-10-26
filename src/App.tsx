import React from 'react';
import { LoanProvider, useLoans } from './context/LoanContext';
import { PhoneContainer } from './components/PhoneContainer';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoanApplicationForm } from './components/LoanApplicationForm';
import { ApplicationStatusView } from './components/ApplicationStatusView';
import { MobileCalculator } from './components/MobileCalculator';
import { OfficerPortal } from './components/OfficerPortal';

const PhoneAppContent: React.FC = () => {
  const { activeTab } = useLoans();

  return (
    <PhoneContainer>
      {/* Mobile App Header */}
      <MobileTopBar />

      {/* Dynamic Screen View */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'apply' && <LoanApplicationForm />}
        {activeTab === 'status' && <ApplicationStatusView />}
        {activeTab === 'calculator' && <MobileCalculator />}
        {activeTab === 'officer' && <OfficerPortal />}
      </main>

      {/* Thumb-zone Fixed Bottom Navigation */}
      <MobileBottomNav />
    </PhoneContainer>
  );
};

export default function App() {
  return (
    <LoanProvider>
      <PhoneAppContent />
    </LoanProvider>
  );
}
