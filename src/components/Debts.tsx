
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancialData } from '@/hooks/useFinancialData';
import { DebtForm } from './DebtForm';
import { Plus, Check, X, Trash2 } from 'lucide-react';

export const Debts = () => {
  const { data, updateDebtStatus, removeDebt, calculations } = useFinancialData();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('pendente');
  const [typeFilter, setTypeFilter] = useState<string>('todos');

  const filteredDebts = data.debts.filter(debt => {
    const statusMatch = statusFilter === 'todos' || debt.status === statusFilter;
    const typeMatch = typeFilter === 'todos' || debt.type === typeFilter;
    return statusMatch && typeMatch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dívidas</h1>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={20} />
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Me Devem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(calculations.totalOwing)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Eu Devo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-orange-600">
              {formatCurrency(calculations.totalOwed)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="quitado">Quitado</SelectItem>
              <SelectItem value="todos">Todos os status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="me_devem">Me devem</SelectItem>
              <SelectItem value="devo">Eu devo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de dívidas */}
      <div className="space-y-3">
        {filteredDebts.map((debt) => (
          <Card key={debt.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      debt.type === 'me_devem' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {debt.type === 'me_devem' ? 'Me devem' : 'Eu devo'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      debt.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {debt.status === 'pendente' ? 'Pendente' : 'Quitado'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">{debt.person}</p>
                  <p className="text-sm text-gray-600 mb-2">{debt.description}</p>
                  <p className="text-xs text-gray-500 mb-2">{debt.category}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${
                      debt.type === 'me_devem' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {formatCurrency(debt.value)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(debt.date)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 ml-2">
                  {debt.status === 'pendente' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateDebtStatus(debt.id, 'quitado')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateDebtStatus(debt.id, 'pendente')}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <X size={16} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDebt(debt.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDebts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma dívida encontrada</p>
          </div>
        )}
      </div>

      <DebtForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};
