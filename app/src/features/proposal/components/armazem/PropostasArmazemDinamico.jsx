import React, { useState, useEffect } from 'react';
import Input from '../../../../shared/Input';
import { fmt } from '../../constants';

const formatarValorMonetario = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const parsearValorMonetario = (texto) => {
  const normalizado = texto
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  const valor = Number.parseFloat(normalizado);
  return Number.isFinite(valor) ? Math.round(valor * 100) / 100 : 0;
};

const CampoMonetario = ({ value, onChange }) => {
  const [emEdicao, setEmEdicao] = useState(false);
  const [texto, setTexto] = useState(formatarValorMonetario(value));

  useEffect(() => {
    if (!emEdicao) setTexto(formatarValorMonetario(value));
  }, [value, emEdicao]);

  const iniciarEdicao = () => {
    setEmEdicao(true);
    setTexto(Number(value || 0).toFixed(2).replace('.', ','));
  };

  const atualizar = (novoTexto) => {
    const partes = novoTexto.replace(/[^\d,.-]/g, '').split(',');
    const limitado = partes.length > 1
      ? `${partes[0]},${partes.slice(1).join('').slice(0, 2)}`
      : partes[0];
    setTexto(limitado);
    onChange(parsearValorMonetario(limitado));
  };

  const finalizarEdicao = () => {
    setEmEdicao(false);
    setTexto(formatarValorMonetario(parsearValorMonetario(texto)));
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={texto}
      onFocus={iniciarEdicao}
      onChange={(e) => atualizar(e.target.value)}
      onBlur={finalizarEdicao}
      suffix="R$"
      className="w-full"
    />
  );
};

const MSG_COMPLETO = {
  material: 'Fornecimento de geomembrana PEAD {espessura} mm',
  servico: 'Mão de obra, equipamentos, ferramentas, instalação e EPIs'
};

const MSG_SO_OBRA = {
  servico: 'Execução de revestimento em geomembrana (mão de obra e materiais de consumo)'
};

const PropostasArmazemDinamico = ({ data, updateData }) => {
  const quantidadeEstimada = parseFloat(
    data.quantidadeMaterialEstimada || data._calculo?.material?.areaGeomembrana || 0
  );

  // Sugestão de itens pré-carregados
  const calc = data._calculo;
  const itensSugeridos = [];

  if (data.modoProposta === 'completo') {
    itensSugeridos.push({
      descricao: MSG_COMPLETO.material.replace('{espessura}', data.espessura),
      quantidade: quantidadeEstimada,
      unidade: 'm²',
      valor: calc?.financeiro?.custoTotalIdeal || 0
    });
    itensSugeridos.push({
      descricao: MSG_COMPLETO.servico,
      quantidade: quantidadeEstimada,
      unidade: 'm²',
      valor: 0
    });
  } else {
    // Só mão de obra
    itensSugeridos.push({
      descricao: MSG_SO_OBRA.servico,
      quantidade: quantidadeEstimada,
      unidade: 'm²',
      valor: calc?.financeiro?.custoTotalIdeal || 0
    });
  }

  // Se itens vazios ou modo fez alteração: migra
  const [itens, setItens] = useState(() => {
    if (data.itens && data.itens.length > 0) {
      return data.itens.map((item, index) => ({
        ...item,
        quantidade: item.quantidade ?? (index === 0 ? quantidadeEstimada : 1),
        unidade: item.unidade || (index === 0 ? 'm²' : 'UN')
      }));
    } else {
      // Primeira carga: sugere itens conforme modo
      return itensSugeridos;
    }
  });

  const [errors, setErrors] = useState({});

  const totalGeral = itens.reduce((sum, item) => sum + Number(item.valor || 0), 0);

  // Sincroniza com o estado global
  useEffect(() => {
    updateData('itens', itens);
    updateData('totalGeral', totalGeral);
  }, [itens, totalGeral]);

  const adicionarItem = () => {
    setItens([...itens, { descricao: '', quantidade: 1, unidade: 'UN', valor: 0 }]);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = itens.map(item => ({ ...item }));
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
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[820px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[44%]" />
            <col className="w-[18%]" />
            <col className="w-[24%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="bg-surface">
              <th className="p-3 text-left text-white font-bold uppercase text-xs tracking-wider">Descrição</th>
              <th className="p-3 text-left text-white font-bold uppercase text-xs tracking-wider">Quantidade</th>
              <th className="p-3 text-left text-white font-bold uppercase text-xs tracking-wider">Valor total (R$)</th>
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
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                      className="min-w-0"
                    />
                    <select
                      value={item.unidade}
                      onChange={(e) => atualizarItem(index, 'unidade', e.target.value)}
                      className="w-20 shrink-0 rounded-xl border-2 border-border bg-bg px-2 text-sm font-bold text-white outline-none focus:border-accent"
                    >
                      <option value="m²">m²</option>
                      <option value="m">m</option>
                      <option value="UN">UN</option>
                      <option value="VB">VB</option>
                    </select>
                  </div>
                </td>
                <td className="p-3">
                  <CampoMonetario
                    value={item.valor}
                    onChange={(valor) => atualizarItem(index, 'valor', valor)}
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
