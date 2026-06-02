import React, { useEffect, useState } from 'react';
import { fmt, fmtNum } from '../../constants';
import Input from '../../../../shared/Input';

const Step6Custos = ({ data, updateData }) => {
  const calc = data._calculo;

  // Estados locais para controlar a máscara de input sem perder a precisão do número real
  const [displayMaterial, setDisplayMaterial] = useState('');
  const [displayMO, setDisplayMO] = useState('');

  // Formata número para string de moeda (ex: 1000.5 -> "1.000,50")
  const formatInput = (val) => {
    if (!val && val !== 0) return '';
    return Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Converte string de máscara para número real (ex: "1.000,50" -> 1000.5)
  const parseInput = (str) => {
    const clean = str.replace(/[^\d]/g, '');
    return clean ? parseFloat(clean) / 100 : 0;
  };

  useEffect(() => {
    if (calc && !data.valorMaterialManual) {
      const ideal = calc.financeiro.custoTotalIdeal;
      updateData('valorMaterialManual', ideal);
      setDisplayMaterial(formatInput(ideal));
    } else if (data.valorMaterialManual) {
      setDisplayMaterial(formatInput(data.valorMaterialManual));
    }

    if (data.valorMaoDeObra) {
      setDisplayMO(formatInput(data.valorMaoDeObra));
    }
  }, [calc]);

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

  useEffect(() => {
    updateData('totalGeral', totalGeral);
  }, [totalGeral]);

  const handleRestaurarOriginal = () => {
    const ideal = calc.financeiro.custoTotalIdeal;
    updateData('valorMaterialManual', ideal);
    setDisplayMaterial(formatInput(ideal));
  };

  const handleChangeMaterial = (e) => {
    const raw = parseInput(e.target.value);
    updateData('valorMaterialManual', raw);
    setDisplayMaterial(formatInput(raw));
  };

  const handleChangeMO = (e) => {
    const raw = parseInput(e.target.value);
    updateData('valorMaoDeObra', raw);
    setDisplayMO(formatInput(raw));
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Custos da Proposta</h2>
        <p className="text-muted text-sm mt-1">Composição final da proposta (Material + Mão de Obra e Despesas).</p>
      </div>

      <div className="bg-surface p-8 rounded-3xl border-2 border-border/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-accent h-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] ml-1">
                Valor do Material
              </span>
              <button 
                onClick={handleRestaurarOriginal}
                className="text-[10px] font-bold text-muted hover:text-gold transition-colors underline"
              >
                Sugerido: {fmt(calc.financeiro.custoTotalIdeal)}
              </button>
            </div>
            <Input 
              type="text"
              suffix="R$"
              value={displayMaterial}
              onChange={handleChangeMaterial}
              className="mt-1"
              placeholder="0,00"
            />
            <div className="text-[10px] text-muted/60 mt-3 ml-1 uppercase tracking-wider">Cobre geomembrana, frete e impostos do produto.</div>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-accent uppercase tracking-[0.2em] ml-1 mb-2">
              Mão de Obra e Despesas
            </span>
            <Input 
              type="text"
              suffix="R$"
              value={displayMO}
              onChange={handleChangeMO}
              placeholder="0,00"
            />
            <div className="text-[10px] text-muted/60 mt-3 ml-1 uppercase tracking-wider">Instalação, chumbadores, pessoal e EPIs.</div>
          </div>
        </div>

        <div className="mt-10 bg-bg/50 p-8 rounded-2xl border border-border flex justify-between items-center group hover:border-accent/30 transition-all">
          <div>
            <div className="text-xs font-bold text-muted uppercase tracking-[0.3em] mb-2">Total Geral da Proposta</div>
            <div className="text-[10px] text-muted/50 uppercase tracking-widest">A soma oficial que constará no documento.</div>
          </div>
          <div className="text-4xl font-black font-syne text-white tracking-tighter group-hover:text-accent transition-colors">
            {fmt(totalGeral)}
          </div>
        </div>
      </div>

      <div className="bg-bg border-2 border-border p-4 rounded-xl">
        <h3 className="font-bold text-white text-sm mb-3">Resumo Financeiro:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted block text-xs">Custo Material (Ideal)</span>
            <span className="text-white font-bold">{fmt(calc.financeiro.custoMaterialIdeal)}</span>
          </div>
          <div>
            <span className="text-muted block text-xs">Frete</span>
            <span className="text-white font-bold">{fmt(calc.financeiro.frete)}</span>
          </div>
          <div>
            <span className="text-muted block text-xs">Custo Material + Frete</span>
            <span className="text-white font-bold">{fmt(calc.financeiro.custoTotalIdeal)}</span>
          </div>
          <div>
            <span className="text-muted block text-xs">Qtd Bobinas</span>
            <span className="text-white font-bold">{calc.material?.qtdBobinas || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6Custos;