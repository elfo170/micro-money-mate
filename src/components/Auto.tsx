
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Smartphone, Bell } from 'lucide-react';

export const Auto = () => {
  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lançamentos Automáticos</h1>
      
      <Card className="text-center py-12">
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-4 text-gray-300">
            <Zap size={48} />
            <Smartphone size={48} />
            <Bell size={48} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Ops... Ainda estamos implementando essa função
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Em breve você poderá capturar suas notificações bancárias automaticamente 
              e transformá-las em lançamentos com apenas um toque.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-700">
              <strong>Prévia da funcionalidade:</strong> Capture notificações → 
              Categorize automaticamente → Aprove os lançamentos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
