import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { fetchSettings, updateSettings } from '../../shared/services/api';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

const defaultPrices = {
  '0.50': { m2: 1180, pMin: 6.08, pIdeal: 6.43 },
  '0.75': { m2: 885, pMin: 9.26, pIdeal: 9.79 },
  '0.80': { m2: 826, pMin: 9.70, pIdeal: 10.27 },
  '1.00': { m2: 708, pMin: 12.14, pIdeal: 12.85 },
  '1.50': { m2: 448, pMin: 18.24, pIdeal: 19.30 },
  '2.00': { m2: 250, pMin: 24.52, pIdeal: 25.95 },
  '2.50': { m2: 207, pMin: 32.08, pIdeal: 33.95 },
  '3.00': { m2: 176, pMin: 39.09, pIdeal: 41.36 }
};

  const [localMargin, setLocalMargin] = useState('15');

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      if (!data.geomembranePrices) {
        data.geomembranePrices = defaultPrices;
      }
      setSettings(data);
      if (data.materialSafetyMargin) {
        setLocalMargin(Math.round((data.materialSafetyMargin - 1) * 100).toString());
      }
    } catch (error) {
      console.error('Erro ao carregar config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Falha ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleMarginChange = (val) => {
    setLocalMargin(val);
    const numeric = parseFloat(val);
    if (!isNaN(numeric)) {
      handleChange('materialSafetyMargin', (numeric / 100) + 1);
    }
  };

  const handlePriceChange = (espessura, field, value) => {
    setSettings(prev => ({
      ...prev,
      geomembranePrices: {
        ...prev.geomembranePrices,
        [espessura]: {
          ...prev.geomembranePrices[espessura],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  if (isLoading) return <div className="p-8 text-muted">Carregando configurações...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-syne text-white mb-2">Configurações</h1>
          <p className="text-muted">Personalize os dados da sua empresa e padrões comerciais.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6">
          <Save size={18} />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bloco: Dados da Empresa */}
        <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold font-syne text-accent2 border-b-2 border-border/50 pb-2">Identidade Visual e Empresa</h2>
          <div className="space-y-4">
            <Input 
              label="Nome da Empresa" 
              value={settings?.companyName || ''} 
              onChange={e => handleChange('companyName', e.target.value)} 
            />
            <Input 
              label="CNPJ" 
              value={settings?.cnpj || ''} 
              onChange={e => handleChange('cnpj', e.target.value)} 
            />
            <Input 
              label="Endereço Completo" 
              value={settings?.address || ''} 
              onChange={e => handleChange('address', e.target.value)} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Telefone" 
                value={settings?.phone || ''} 
                onChange={e => handleChange('phone', e.target.value)} 
              />
              <Input 
                label="Cor Principal (HEX)" 
                value={settings?.primaryColor || ''} 
                onChange={e => handleChange('primaryColor', e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="E-mail" 
                value={settings?.email || ''} 
                onChange={e => handleChange('email', e.target.value)} 
              />
              <Input 
                label="Site" 
                value={settings?.website || ''} 
                onChange={e => handleChange('website', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Bloco: Padrões Comerciais */}
        <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold font-syne text-gold border-b-2 border-border/50 pb-2">Padrões Comerciais</h2>
          <p className="text-xs text-muted mb-4">Esses valores serão pré-preenchidos ao criar uma nova proposta.</p>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Entrada Padrão (%)" 
              type="number"
              value={settings?.defaultEntrada || ''} 
              onChange={e => handleChange('defaultEntrada', e.target.value)} 
            />
            <Input 
              label="Prazo Entrada (dias)" 
              type="number"
              value={settings?.defaultPrazoEntrada || ''} 
              onChange={e => handleChange('defaultPrazoEntrada', e.target.value)} 
            />
            <Input 
              label="Medição a cada (dias)" 
              type="number"
              value={settings?.defaultMedicao || ''} 
              onChange={e => handleChange('defaultMedicao', e.target.value)} 
            />
            <Input 
              label="Prazo após NF (dias)" 
              type="number"
              value={settings?.defaultPrazoNF || ''} 
              onChange={e => handleChange('defaultPrazoNF', e.target.value)} 
            />
            <Input 
              label="Validade (dias)" 
              type="number"
              value={settings?.defaultValidade || ''} 
              onChange={e => handleChange('defaultValidade', e.target.value)} 
            />
            <Input 
              label="Margem de Segurança Material (%)" 
              type="number"
              value={localMargin} 
              onChange={e => handleMarginChange(e.target.value)} 
              placeholder="Ex: 15"
            />
          </div>
          <div className="space-y-4 pt-2">
            <Input 
              label="Forma de Pagamento Padrão" 
              value={settings?.defaultFormaPagamento || ''} 
              onChange={e => handleChange('defaultFormaPagamento', e.target.value)} 
              placeholder="Ex: depósito bancário, PIX"
            />
          </div>
        </div>
      </div>

      {/* Bloco: Tabela de Preços - Geomembrana */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <h2 className="text-xl font-bold font-syne text-success border-b-2 border-border/50 pb-2">Tabela de Preços (Geomembrana)</h2>
        <p className="text-xs text-muted mb-4">Atualize os preços de custo por m² das bobinas. Isso afetará diretamente a calculadora de armazéns.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {settings?.geomembranePrices && Object.entries(settings.geomembranePrices).map(([espessura, dados]) => (
            <div key={espessura} className="bg-bg border border-border p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-border/50 pb-2 mb-2">
                <span className="font-bold text-white">{espessura} mm</span>
                <span className="text-[10px] text-muted">{dados.m2} m²/bobina</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Preço Mínimo (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={dados.pMin}
                  onChange={e => handlePriceChange(espessura, 'pMin', e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Preço Ideal (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={dados.pIdeal}
                  onChange={e => handlePriceChange(espessura, 'pIdeal', e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
