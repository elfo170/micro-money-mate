
import { Home, List, Users, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'transactions', label: 'Lançar', icon: List },
  { id: 'debts', label: 'Dívidas', icon: Users },
  { id: 'auto', label: 'Auto', icon: Zap },
  { id: 'settings', label: 'Config', icon: Settings },
];

export const BottomNavigation = ({ currentTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors text-xs",
              currentTab === id
                ? "text-green-600 bg-green-50"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon size={20} />
            <span className="mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
