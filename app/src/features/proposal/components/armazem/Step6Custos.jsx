import React from 'react';
import { fmt } from '../../constants';
import PropostasArmazemDinamico from './PropostasArmazemDinamico';

const Step6Custos = ({ data, updateData }) => {
  const calc = data._calculo;

  if (!calc) {
    return (
      <div className="bg-surface border-2 border-dashed border-border p-12 rounded-2xl flex flex-col items-center justify-center text-muted">
        <div className="text-4xl mb-4 opacity-50">📏</div>
        <p className="font-bold text-lg text-white mb-1">Cálculo Pendente</p>
        <p className="text-sm">Volte ao passo de Dimensionamento e preencha as medidas para liberar os custos.</p>
      </div>
    );
  }

  const resumo = (
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
  );

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Orçamento da Proposta</h2>
        <p className="text-muted text-sm mt-1">
          Adicione os itens que compõem o valor total da proposta.
          {data.modoProposta === 'so_obra' 
            ? 'No modo "Só Mão de Obra", o cálculo automático é desativado, mas você pode usar os valores basepara dimensionar o serviço.' 
            : ' O primeiro item é pré-preenchido com o custo automático da geomembrana.'}
        </p>
      </div>

      {/* Tabela de itens */}
      <PropostasArmazemDinamico data={data} updateData={updateData} />

      {/* Resumo dos cálculos (sempre visível, mesmo em só-M.O.) */}
      {data.modoProposta === 'completo' && resumo}
      {data.modoProposta === 'so_obra' && resumo && (
        <div className="bg-warning/5 border-2 border-warning/20 p-3 rounded-xl text-xs text-muted">
          Os valores acima são apenas referências para dimensionar a mão de obra e materiais de consumo.
        </div>
      )}
    </div>
  );
};

export default Step6Custos;
