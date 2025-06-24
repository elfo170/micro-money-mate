import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancialData } from '@/hooks/useFinancialData';
import { TransactionForm } from './TransactionForm';
import { Plus, Trash2 } from 'lucide-react';
import { CATEGORIES } from '@/types/financial';

export const Transactions = () => {
  const { data, removeTransaction } = useFinancialData();
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  const filteredTransactions = data.transactions.filter(transaction => {
    const typeMatch = typeFilter === 'todos' || transaction.type === typeFilter;
    const categoryMatch = categoryFilter === 'todos' || transaction.category === categoryFilter;
    return typeMatch && categoryMatch;
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
        <h1 className="text-2xl font-bold text-gray-900">Lançamentos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={20} />
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as categorias</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de lançamentos */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'receita' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                    <span className="text-xs text-gray-500">{transaction.category}</span>
                  </div>
                  <p className="font-semibold text-white mb-1">{transaction.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${
                      transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.value)}
                    </span>
                    <div className="text-xs text-gray-500 text-right">
                      <div>{formatDate(transaction.date)}</div>
                      <div className="capitalize">{transaction.paymentMethod}</div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTransaction(transaction.id)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum lançamento encontrado</p>
          </div>
        )}
      </div>

      <TransactionForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};
