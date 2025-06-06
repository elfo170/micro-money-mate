
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/types/financial';
import { useFinancialData } from '@/hooks/useFinancialData';

interface DebtFormProps {
  open: boolean;
  onClose: () => void;
}

export const DebtForm = ({ open, onClose }: DebtFormProps) => {
  const { addDebt } = useFinancialData();
  const [formData, setFormData] = useState({
    type: 'me_devem' as 'devo' | 'me_devem',
    category: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    person: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value || !formData.category || !formData.person || !formData.description) {
      return;
    }

    addDebt({
      type: formData.type,
      category: formData.category,
      value: parseFloat(formData.value),
      date: formData.date,
      person: formData.person,
      description: formData.description,
      status: 'pendente',
    });

    setFormData({
      type: 'me_devem',
      category: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      person: '',
      description: '',
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Nova Dívida</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <Select value={formData.type} onValueChange={(value: 'devo' | 'me_devem') => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me_devem">Me devem</SelectItem>
                <SelectItem value="devo">Eu devo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Pessoa/Empresa</Label>
            <Input
              value={formData.person}
              onChange={(e) => setFormData({...formData, person: e.target.value})}
              placeholder="Nome da pessoa ou empresa"
              required
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva a dívida"
              required
            />
          </div>

          <div>
            <Label>Data</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
