
import { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Dashboard } from '@/components/Dashboard';
import { Transactions } from '@/components/Transactions';
import { Debts } from '@/components/Debts';
import { Auto } from '@/components/Auto';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'debts':
        return <Debts />;
      case 'auto':
        return <Auto />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-16">
        {renderCurrentTab()}
      </main>
      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default Index;
