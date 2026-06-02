import React, { useEffect, useState } from 'react';
import { Building2, User, MapPin, Warehouse, FileText, Search } from 'lucide-react';
import Input from '../../../../shared/Input';
import { fetchClients } from '../../../../shared/services/api';

const Step1Cliente = ({ data, updateData }) => {
  const [numeroProposta, setNumeroProposta] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Carregar clientes cadastrados
    const loadClients = async () => {
      try {
        const list = await fetchClients();
        setClients(list);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };
    loadClients();

    // Gerar número da proposta se não existir
    if (!data.numeroProposta) {
      const now = new Date();
      const ano = now.getFullYear().toString().slice(-2);
      const mes = String(now.getMonth() + 1).padStart(2, '0');
      const random = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
      const novoNumero = `001-${random}/${ano}`;
      updateData('numeroProposta', novoNumero);
      setNumeroProposta(novoNumero);
    } else {
      setNumeroProposta(data.numeroProposta);
    }
  }, []);

  const handleNumeroChange = (e) => {
    setNumeroProposta(e.target.value);
    updateData('numeroProposta', e.target.value);
  };

  const handleClientChange = (e) => {
    const value = e.target.value;
    updateData('cliente', value);
    
    if (value.length > 1) {
      const filtered = clients.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectClient = (client) => {
    updateData('cliente', client.name);
    updateData('contato', client.contact || '');
    updateData('local', client.location || '');
    if (client.phone) updateData('tel', client.phone);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-syne text-white">Identificação da Proposta</h2>
        <p className="text-muted text-sm mt-1">Dados principais para o cabeçalho do documento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Número da Proposta" 
          value={numeroProposta}
          onChange={handleNumeroChange}
          placeholder="001-01/26"
          required
        />

        <Input 
          label="Referência / Capacidade" 
          value={data.referencia || ''}
          onChange={(e) => updateData('referencia', e.target.value)}
          placeholder="Ex: 01 armazém graneleiro / 60.000t"
          required
        />

        <div className="relative">
          <Input 
            label="Nome do Cliente (Empresa)" 
            value={data.cliente || ''}
            onChange={handleClientChange}
            onFocus={() => data.cliente?.length > 1 && setShowSuggestions(true)}
            placeholder="Digite para buscar..."
            required
            autoComplete="off"
          />
          {showSuggestions && filteredClients.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-surface border-2 border-border rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-hidden">
              {filteredClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => selectClient(client)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/10 hover:text-accent transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                >
                  <Building2 size={16} className="text-muted" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{client.name}</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">{client.location}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Input 
          label="Nome do Contato" 
          value={data.contato || ''}
          onChange={(e) => updateData('contato', e.target.value)}
          placeholder="Ex: Gustavo"
          required
        />

        <Input 
          label="Local da Obra (Cidade/UF)" 
          value={data.local || ''}
          onChange={(e) => updateData('local', e.target.value)}
          placeholder="Ex: Mangueirinha, PR"
          required
          className="md:col-span-2"
        />
      </div>

      <div className="mt-6">
        <label className="block text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2 ml-1">
          Objeto do Serviço *
        </label>
        <textarea 
          value={data.objeto || ''}
          onChange={(e) => updateData('objeto', e.target.value)}
          placeholder="Ex: Execução de isolamento por geomembrana PEAD 1,5 mm"
          className="w-full bg-bg/50 border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors h-24 resize-none text-sm"
          required
        />
        <div className="text-[10px] text-muted/60 mt-2 ml-1 uppercase tracking-wider">
          Descreva brevemente o objeto da proposta.
        </div>
      </div>
    </div>
  );
};

export default Step1Cliente;