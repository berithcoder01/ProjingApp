import React from 'react';
import Input from '../../../../shared/Input';
import { Settings2 } from 'lucide-react';

const Step3Escopo = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Escopo e Opcionais</h2>
        <p className="text-muted text-sm mt-1">Defina serviços extras e condições específicas para o Armazém.</p>
      </div>

      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
          <Settings2 size={18} className="text-accent2" /> Serviços Opcionais Inclusos
        </h3>

        <label className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-surface-hover cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 accent-accent2"
            checked={data.incluirLinhaVida || false}
            onChange={e => updateData('incluirLinhaVida', e.target.checked)}
          />
          <div>
            <div className="font-bold text-white">Incluir Linha de Vida</div>
            <div className="text-sm text-muted">Adiciona fabricação e instalação de linha de vida com cabo de aço galvanizado no escopo.</div>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-surface-hover cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 accent-accent2"
            checked={data.retirarTubulacao || false}
            onChange={e => updateData('retirarTubulacao', e.target.checked)}
          />
          <div>
            <div className="font-bold text-white">Retirar Tubulação de Aeração</div>
            <div className="text-sm text-muted">Inclui a retirada da tubulação (quando existente e necessário).</div>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-surface-hover cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 accent-accent2"
            checked={data.faturamentoDireto || false}
            onChange={e => updateData('faturamentoDireto', e.target.checked)}
          />
          <div>
            <div className="font-bold text-white">Aplicar Faturamento Direto</div>
            <div className="text-sm text-muted">Adiciona a página com as regras padrão (ex: Coamo/Cargill) de compra de material direto.</div>
          </div>
        </label>
      </div>

      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white mb-2">Condições de Contrato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Prazo de Execução (Dias Efetivos)" 
            type="number"
            value={data.prazoExecucao || ''}
            onChange={e => updateData('prazoExecucao', e.target.value)}
            placeholder="Ex: 45"
          />
          <Input 
            label="Prazo de Pagamento Padrão (Dias)" 
            type="number"
            value={data.prazoPagamento || ''}
            onChange={e => updateData('prazoPagamento', e.target.value)}
            placeholder="Ex: 28 (p/ Material e Saldo Final)"
          />
        </div>
      </div>
    </div>
  );
};

export default Step3Escopo;
