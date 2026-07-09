import React, { useState, useEffect } from 'react';
import Input from '../../../../shared/Input';
import { fmt } from '../../constants';

const MSG_COMPLETO = {
  material: 'Fornecimento de geomembrana PEAD {espessura} mm',
  servico: 'Mão de obra, equipamentos, ferramentas, instalação e EPIs'
};

const MSG_SO_OBRA = {
  servico: 'Execução de revestimento em geomembrana (mão de obra e materiais de consumo)'
};

const PropostasArmazemDinamico = ({ data, updateData }) => {
  // Sugestão de itens pré-carregados
  const calc = data._calculo;
  const itensSugeridos = [];

  if (data.modoProposta === 'completo') {
    itensSugeridos.push({
      descricao: MSG_COMPLETO.material.replace('{espessura}', data.espessura),
      valor: calc?.financeiro?.custoTotalIdeal || 0
    });
    itensSugeridos.push({
      descricao: MSG_COMPLETO.servico,
      valor: 0
    });
  } else {
    // Só mão de obra
    itensSugeridos.push({
      descricao: MSG_SO_OBRA.servico,
      valor: calc?.financeiro?.custoTotalIdeal || 0
    });
  }

  // Se itens vazios ou modo fez alteração: migra
  const [itens, setItens] = useState(() => {
    if (data.itens && data.itens.length > 0) {
      return data.itens;
    } else {
      // Primeira carga: sugere itens conforme modo
      return itensSugeridos;
    }
  });

  const [errors, setErrors] = useState({});

  const totalGeral = itens.reduce((sum, item) => sum + item.valor, 0);

  // Sincroniza com o estado global
  useEffect(() => {
    updateData('itens', itens);
    updateData('totalGeral', totalGeral);
  }, [itens, totalGeral]);

  const adicionarItem = () => {
    setItens([...itens, { descricao: '', valor: 0 }]);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...itens];
    const novoValor = campo === 'valor' ? parseFloat(valor) || 0 : valor;

    novosItens[index][campo] = novoValor;

    // Validação
    const novosErrors = { ...errors };
    if (campo === 'descricao' && !novoValor.trim()) {
      novosErrors[`descricao-${index}`] = 'Descrição é obrigatória';
    } else {
      delete novosErrors[`descricao-${index}`];
    }

    setErrors(novosErrors);
    setItens(novosItens);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="p-3 text-left text-white font-bold uppercase text-xs tracking-wider">Descrição</th>
              <th className="p-3 text-left text-white font-bold uppercase text-xs tracking-wider">Valor (R$)</th>
              <th className="p-3 text-left text-white font-bold uppercase text-xs tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <tr key={index} className="border-b border-border hover:bg-surface/30 transition-colors">
                <td className="p-3">
                  <Input
                    value={item.descricao}
                    onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                    error={errors[`descricao-${index}`]}
                    className="w-full"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={item.valor}
                    onChange={(e) => atualizarItem(index, 'valor', e.target.value)}
                    suffix="R$"
                    className="w-full"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => removerItem(index)}
                    className="bg-danger text-white font-bold px-3 py-1 rounded-lg hover:bg-danger/80 transition-colors"
                    disabled={itens.length <= 1}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={adicionarItem}
          className="bg-accent text-white font-bold px-4 py-2 rounded-xl hover:bg-accent/80 transition-colors"
        >
          Adicionar Item
        </button>
        <div className="text-2xl font-bold text-white">
          Total: {fmt(totalGeral)}
        </div>
      </div>
    </div>
  );
};

export default PropostasArmazemDinamico;
