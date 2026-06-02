import React, { useEffect } from 'react';
import { fmt } from '../constants';

const Step4Custos = ({ data, updateData }) => {
  const calc = data._calculo;

  // Se tem cálculo e ainda não definiu valor do material, sugere o valor ideal
  useEffect(() => {
    if (calc && !data.valorMaterialManual) {
      updateData('valorMaterialManual', calc.financeiro.custoTotalIdeal.toString());
    }
  }, [calc, data.valorMaterialManual]);

  if (!calc) {
    return (
      <div className="bg-surface border-2 border-dashed border-border p-12 rounded-2xl flex flex-col items-center justify-center text-muted">
        <div className="text-4xl mb-4 opacity-50">📏</div>
        <p className="font-bold text-lg text-white mb-1">Cálculo Pendente</p>
        <p className="text-sm">Volte ao passo de Dimensionamento e preencha as medidas para liberar os custos.</p>
      </div>
    );
  }

  const matNumber = parseFloat(data.valorMaterialManual) || 0;
  const moNumber = parseFloat(data.valorMaoDeObra) || 0;
  const totalGeral = matNumber + moNumber;

  // Atualiza o total geral na data silenciosamente para uso na tela final e docx
  useEffect(() => {
    updateData('totalGeral', totalGeral);
  }, [totalGeral]);

  const handleRestaurarOriginal = () => {
    updateData('valorMaterialManual', calc.financeiro.custoTotalIdeal.toString());
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Confirmação de Custos</h2>
        <p className="text-muted text-sm mt-1">Composição final da proposta (Material + Mão de Obra e Despesas).</p>
      </div>

      <div className="bg-surface p-6 rounded-2xl border-2 border-accent/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 bg-accent h-full" />
        
        <div className="ml-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1">
                Valor Total do Material (R$)
              </label>
              <button 
                onClick={handleRestaurarOriginal}
                className="text-[10px] font-bold text-muted hover:text-gold transition-colors underline"
              >
                Sugerido: {fmt(calc.financeiro.custoTotalIdeal)}
              </button>
            </div>
            <input 
              type="number"
              value={data.valorMaterialManual || ''}
              onChange={e => updateData('valorMaterialManual', e.target.value)}
              placeholder="Ex: 145480"
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors"
            />
            <div className="text-xs text-muted mt-2 ml-1">Cobre geomembrana, frete e impostos do produto.</div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest mb-2 ml-1">
              Mão de Obra e Despesas (R$)
            </label>
            <input 
              type="number"
              value={data.valorMaoDeObra || ''}
              onChange={e => updateData('valorMaoDeObra', e.target.value)}
              placeholder="Ex: 147800"
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors"
            />
            <div className="text-xs text-muted mt-2 ml-1">Instalação, chumbadores, linha de vida (se houver), pessoal e EPIs.</div>
          </div>
        </div>

        <div className="ml-4 mt-8 bg-bg p-6 rounded-xl border border-border flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Total Geral da Proposta</div>
            <div className="text-xs text-muted">A soma oficial que constará no documento.</div>
          </div>
          <div className="text-4xl font-black font-syne text-white">
            {fmt(totalGeral)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Custos;
