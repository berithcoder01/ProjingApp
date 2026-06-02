import React from 'react';
import Input from '../../../../shared/Input';
import { Percent, Calculator } from 'lucide-react';

const Step7Impostos = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Impostos</h2>
        <p className="text-muted text-sm mt-1">
          Configure os percentuais de impostos que serão exibidos na proposta.
        </p>
      </div>

      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Calculator size={18} className="text-accent2" /> Impostos sobre Serviços
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              DAS Federal (%)
            </label>
            <input 
              type="number"
              step="0.01"
              value={data.impostoDAS || '11.20'}
              onChange={(e) => updateData('impostoDAS', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              ISS (%)
            </label>
            <input 
              type="number"
              step="0.01"
              value={data.impostoISS || '2.79'}
              onChange={(e) => updateData('impostoISS', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Percent size={18} className="text-gold" /> Impostos sobre Materiais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              IPI (%)
            </label>
            <input 
              type="number"
              step="0.01"
              value={data.impostoIPI || '15.00'}
              onChange={(e) => updateData('impostoIPI', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              DIFAL (%)
            </label>
            <input 
              type="number"
              step="0.01"
              value={data.impostoDIFAL || '6.00'}
              onChange={(e) => updateData('impostoDIFAL', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <div className="bg-bg border-2 border-border p-4 rounded-xl">
        <h3 className="font-bold text-white text-sm mb-3">Preview - Tabela de Impostos:</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="pb-2 font-bold">Categoria</th>
              <th className="pb-2 font-bold">Imposto</th>
              <th className="pb-2 font-bold text-right">Percentual</th>
            </tr>
          </thead>
          <tbody className="text-white">
            <tr>
              <td className="py-1">Serviço</td>
              <td>DAS Federal</td>
              <td className="text-right">{data.impostoDAS || '11,20'}%</td>
            </tr>
            <tr>
              <td className="py-1">Serviço</td>
              <td>ISS</td>
              <td className="text-right">{data.impostoISS || '2,79'}%</td>
            </tr>
            <tr>
              <td className="py-1">Material</td>
              <td>IPI</td>
              <td className="text-right">{data.impostoIPI || '15,00'}%</td>
            </tr>
            <tr>
              <td className="py-1">Material</td>
              <td>DIFAL</td>
              <td className="text-right">{data.impostoDIFAL || '6,00'}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Step7Impostos;