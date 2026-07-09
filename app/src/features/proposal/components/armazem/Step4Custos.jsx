import React from 'react';
import PropostasArmazemDinamico from './PropostasArmazemDinamico';
import { fmt } from '../constants';

const Step4Custos = ({ data, updateData }) => {
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

  // Sugere o primeiro item com base no cálculo
  const itensSugeridos = data.itens || [{
    descricao: "Fornecimento de materiais e execução de revestimento em Geomembrana PEAD",
    valor: calc.financeiro.custoTotalIdeal || 0
  }];

  // Atualiza o estado global com os itens sugeridos (caso ainda não exista)
  if (!data.itens) {
    updateData('itens', itensSugeridos);
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Proposta de Armazém</h2>
        <p className="text-muted text-sm mt-1">Adicione os itens da proposta e veja o valor total automaticamente.</p>
      </div>

      <PropostasArmazemDinamico data={data} updateData={updateData} />
    </div>
  );
};

export default Step4Custos;
