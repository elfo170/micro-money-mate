import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Smartphone, Bell, Check, X } from 'lucide-react';
import { CATEGORIES } from '@/types/financial';
import { CapturaNotificacao, NotificationData } from '@/plugins/capturaNotificacao';
import { useFinancialData } from '@/hooks/useFinancialData';

interface PendingTransaction {
  id: string;
  title: string;
  value: string;
  category: string;
  description: string;
  date: string;
  paymentMethod: 'credito' | 'pix';
  notification: NotificationData;
}

export const Auto = () => {
  const { addTransaction } = useFinancialData();
  const [pending, setPending] = useState<PendingTransaction[]>([]);

  useEffect(() => {
    CapturaNotificacao.startCapture().catch(() => {});
    const sub = CapturaNotificacao.addListener('notificationReceived', (notif) => {
      if (notif.packageName !== 'br.com.xp.carteira') return;
      const valueMatch = notif.text.match(/R\$ ?([\d.,]+)/i);
      const value = valueMatch ? valueMatch[1].replace('.', '').replace(',', '.') : '';
      setPending((prev) => [
        ...prev,
        {
          id: notif.id + '-' + notif.timestamp,
          title: notif.title || 'XP',
          value,
          category: '',
          description: notif.text || '',
          date: new Date(notif.timestamp).toISOString().split('T')[0],
          paymentMethod: 'credito',
          notification: notif,
        },
      ]);
    });
    return () => { sub.then(s => s.remove()); };
  }, []);

  const approve = (tx: PendingTransaction) => {
    addTransaction({
      type: 'despesa',
      value: parseFloat(tx.value),
      category: tx.category || 'Outros',
      description: tx.description,
      date: tx.date,
      paymentMethod: tx.paymentMethod,
    });
    setPending((prev) => prev.filter((t) => t.id !== tx.id));
  };

  const discard = (id: string) => {
    setPending((prev) => prev.filter((t) => t.id !== id));
  };

  const updateField = (id: string, field: keyof PendingTransaction, value: string) => {
    setPending((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lançamentos Automáticos</h1>

      <Card className="text-center py-8 mb-6">
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-4 text-gray-300">
            <Zap size={48} />
            <Smartphone size={48} />
            <Bell size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Captura automática de notificações XP
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Notificações do app XP serão capturadas automaticamente e sugeridas como lançamentos. Edite e aprove para adicionar ao seu controle financeiro.
            </p>
          </div>
        </CardContent>
      </Card>

      {pending.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Nenhuma notificação aguardando aprovação.
          </CardContent>
        </Card>
      )}

      {pending.map((tx) => (
        <Card key={tx.id} className="mb-4 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Bell size={18} /> Notificação XP capturada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={e => {
                e.preventDefault();
                approve(tx);
              }}
            >
              <div>
                <label className="block text-xs font-medium mb-1">Valor (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tx.value}
                  onChange={e => updateField(tx.id, 'value', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Categoria</label>
                <Select
                  value={tx.category}
                  onValueChange={val => updateField(tx.id, 'category', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Descrição</label>
                <Textarea
                  value={tx.description}
                  onChange={e => updateField(tx.id, 'description', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Data</label>
                <Input
                  type="date"
                  value={tx.date}
                  onChange={e => updateField(tx.id, 'date', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Forma de Pagamento</label>
                <Select
                  value={tx.paymentMethod}
                  onValueChange={val => updateField(tx.id, 'paymentMethod', val as 'credito' | 'pix')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credito">Crédito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => discard(tx.id)}
                >
                  <X size={16} className="mr-1" /> Descartar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!tx.value || !tx.category || !tx.description}
                >
                  <Check size={16} className="mr-1" /> Aprovar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
