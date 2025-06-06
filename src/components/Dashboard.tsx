
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialData } from '@/hooks/useFinancialData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#6B7280'];

export const Dashboard = () => {
  const { data, calculations } = useFinancialData();

  const chartData = Object.entries(calculations.expensesByCategory)
    .map(([category, value]) => ({
      name: category,
      value: value,
    }))
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="p-4 pb-20 space-y-4 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard Financeiro</h1>
      
      {/* Cards principais */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(data.settings.currentBalance)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Esperada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency(data.settings.expectedRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fatura do Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(data.settings.cardBill)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meta Final</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(data.settings.finalGoal)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Me Devem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(calculations.totalOwing)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eu Devo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-400">
              {formatCurrency(calculations.totalOwed)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card do valor que pode gastar */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-green-100">Posso Gastar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {formatCurrency(calculations.canSpend)}
          </p>
          <p className="text-sm text-green-100 mt-2">
            Saldo + Receita + Me Devem - Fatura - Devo - Meta
          </p>
        </CardContent>
      </Card>

      {/* Gráfico de gastos por categoria */}
      {chartData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
