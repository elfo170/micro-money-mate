
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinancialData } from '@/hooks/useFinancialData';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Settings = () => {
  const { data, updateSettings, clearAllData } = useFinancialData();
  const [formData, setFormData] = useState({
    currentBalance: data.settings.currentBalance.toString(),
    cardBill: data.settings.cardBill.toString(),
    expectedRevenue: data.settings.expectedRevenue.toString(),
    finalGoal: data.settings.finalGoal.toString(),
  });

  // Atualizar formulário quando os dados mudarem
  useEffect(() => {
    setFormData({
      currentBalance: data.settings.currentBalance.toString(),
      cardBill: data.settings.cardBill.toString(),
      expectedRevenue: data.settings.expectedRevenue.toString(),
      finalGoal: data.settings.finalGoal.toString(),
    });
  }, [data.settings]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateSettings({
      currentBalance: parseFloat(formData.currentBalance) || 0,
      cardBill: parseFloat(formData.cardBill) || 0,
      expectedRevenue: parseFloat(formData.expectedRevenue) || 0,
      finalGoal: parseFloat(formData.finalGoal) || 0,
    });
  };

  const handleClearData = () => {
    clearAllData();
    setFormData({
      currentBalance: '0',
      cardBill: '0',
      expectedRevenue: '0',
      finalGoal: '0',
    });
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">Configurações</h1>
      
      {/* Card com valores atuais */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Valores Atuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Saldo Atual:</span>
            <span className="font-semibold text-foreground">{formatCurrency(data.settings.currentBalance)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Fatura do Cartão:</span>
            <span className="font-semibold text-foreground">{formatCurrency(data.settings.cardBill)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Receita Esperada:</span>
            <span className="font-semibold text-foreground">{formatCurrency(data.settings.expectedRevenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Meta Final:</span>
            <span className="font-semibold text-foreground">{formatCurrency(data.settings.finalGoal)}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Alterar Valores Base</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentBalance" className="text-foreground">Saldo Atual (R$)</Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                value={formData.currentBalance}
                onChange={(e) => setFormData({...formData, currentBalance: e.target.value})}
                placeholder="0,00"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="cardBill" className="text-foreground">Fatura do Cartão (R$)</Label>
              <Input
                id="cardBill"
                type="number"
                step="0.01"
                value={formData.cardBill}
                onChange={(e) => setFormData({...formData, cardBill: e.target.value})}
                placeholder="0,00"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="expectedRevenue" className="text-foreground">Receita Esperada (R$)</Label>
              <Input
                id="expectedRevenue"
                type="number"
                step="0.01"
                value={formData.expectedRevenue}
                onChange={(e) => setFormData({...formData, expectedRevenue: e.target.value})}
                placeholder="0,00"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="finalGoal" className="text-foreground">Saldo Desejado no Final do Mês (R$)</Label>
              <Input
                id="finalGoal"
                type="number"
                step="0.01"
                value={formData.finalGoal}
                onChange={(e) => setFormData({...formData, finalGoal: e.target.value})}
                placeholder="0,00"
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-card">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Esta ação irá apagar todos os seus dados permanentemente. 
            Todos os lançamentos, dívidas e configurações serão perdidos.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 size={16} className="mr-2" />
                Limpar Todos os Dados
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Esta ação não pode ser desfeita. Todos os seus dados financeiros 
                  serão permanentemente deletados dos nossos servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-background border-border text-foreground">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearData}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sim, limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
