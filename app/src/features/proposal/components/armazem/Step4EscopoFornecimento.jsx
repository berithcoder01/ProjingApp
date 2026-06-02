import React, { useEffect } from 'react';
import Input from '../../../../shared/Input';
import { CheckCircle, Package } from 'lucide-react';

const RESPONSABILIDADES_PADRAO = `• Mão de obra e materiais
• Transporte e alojamento da equipe
• Equipamentos e ferramentas
• EPIs para toda equipe
• Encargos sociais
• Mobilização e desmobilização
• Proteção dos serviços executados
• Facilitar fiscalização
• Manter equipe adequada`;

// Gera a lista de itens inclusos com/sem linha de vida e numeração correta
const gerarItensInclusos = ({ m2, espessura, metrosCabo, incluirLinhaVida, qtdSuportes, chumbadores }) => {
  const itens = [
    `Parafusos zincados com expansão mecânica`,
    `${m2} m² de geomembrana PEAD ${espessura} mm`,
  ];

  if (incluirLinhaVida) {
    itens.push(`Linha de vida (${metrosCabo} m cabo aço galvanizado)`);
  }

  itens.push(
    `Perfis metálicos`,
    `Ferramental geral`,
    `Soldador técnico (termofusão)`,
    `04 colaboradores (mão de obra braçal)`,
    `Soldador termoplástico`,
    `Técnico mecânico`,
    `Hospedagem da equipe`,
    `Máquina de solda termoplástica`,
    `Perfis metálicos para ${qtdSuportes} suportes`,
    `Furadeira de bancada`,
    `Compressor`,
    `Máquina de solda metálica`,
    `~${chumbadores} chumbadores`,
    `${Math.round(chumbadores * 0.035)} chumbadores PBA 3/4`
  );

  return itens.map((item, i) => `${i + 1}. ${item}`).join('\n');
};

// Calcula metros de cabo: ((LARGURA×2 + COMPRIMENTO×2) * 2) + 5%
const calcMetrosCabo = (largura, comprimento) => {
  const l = parseFloat(largura) || 0;
  const c = parseFloat(comprimento) || 0;
  return Math.ceil(((l * 2) + (c * 2)) * 2 * 1.05);
};

const Step4EscopoFornecimento = ({ data, updateData }) => {
  const calc = data._calculo;
  const area = calc?.material?.areaGeomembrana || 0;
  const espessura = data.espessura || '1.50';
  const chumbadores = Math.round((calc?.areas?.totalObra || 0) * 0.78);
  const metrosCabo = data.incluirLinhaVida
    ? calcMetrosCabo(data.largura, data.comprimento)
    : 0;

  // Gera os itens toda vez que incluirLinhaVida mudar (ou na primeira carga)
  useEffect(() => {
    if (!data.escopoResponsabilidades) {
      updateData('escopoResponsabilidades', RESPONSABILIDADES_PADRAO);
    }

    if (calc && !data.itensInclusos) {
      const qtdSuportes = Math.round((calc?.areas?.totalObra || 0) / 40);
      const metros = data.incluirLinhaVida
        ? calcMetrosCabo(data.largura, data.comprimento)
        : 0;

      const texto = gerarItensInclusos({
        m2: area.toFixed(0),
        espessura,
        metrosCabo: metros,
        incluirLinhaVida: data.incluirLinhaVida,
        qtdSuportes,
        chumbadores,
      });

      updateData('itensInclusos', texto);
    }
  }, [calc, area, espessura, data.incluirLinhaVida]);

  const restaurarResponsabilidades = () => {
    updateData('escopoResponsabilidades', RESPONSABILIDADES_PADRAO);
  };

  const restaurarItens = () => {
    const metros = data.incluirLinhaVida
      ? calcMetrosCabo(data.largura, data.comprimento)
      : 0;
    const qtdSuportes = Math.round((calc?.areas?.totalObra || 0) / 40);

    const texto = gerarItensInclusos({
      m2: area.toFixed(0),
      espessura,
      metrosCabo: metros,
      incluirLinhaVida: data.incluirLinhaVida,
      qtdSuportes,
      chumbadores,
    });

    updateData('itensInclusos', texto);
  };

  if (!calc) {
    return (
      <div className="bg-surface border-2 border-dashed border-border p-12 rounded-2xl flex flex-col items-center justify-center text-muted">
        <div className="text-4xl mb-4 opacity-50">📏</div>
        <p className="font-bold text-lg text-white mb-1">Cálculo Pendente</p>
        <p className="text-sm">Preencha as medidas na etapa de Dimensões para gerar os itens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Escopo de Fornecimento</h2>
        <p className="text-muted text-sm mt-1">
          Configure as responsabilidades da contratada e itens inclusos. Use o padrão ou edite conforme necessidade.
        </p>
      </div>

      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1 flex items-center gap-2">
              <CheckCircle size={14} /> Responsabilidades da Contratada
            </label>
            <button 
              onClick={restaurarResponsabilidades}
              className="text-[10px] font-bold text-muted hover:text-white transition-colors underline"
            >
              Restaurar Padrão
            </button>
          </div>
          <textarea 
            value={data.escopoResponsabilidades || ''}
            onChange={(e) => updateData('escopoResponsabilidades', e.target.value)}
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors h-40 resize-none text-sm"
            placeholder="Lista de responsabilidades..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Package size={14} /> Itens Inclusos
            </label>
            <button 
              onClick={restaurarItens}
              className="text-[10px] font-bold text-muted hover:text-white transition-colors underline"
            >
              Restaurar Padrão
            </button>
          </div>
          <textarea 
            value={data.itensInclusos || ''}
            onChange={(e) => updateData('itensInclusos', e.target.value)}
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors h-64 resize-none text-sm"
            placeholder="Lista de itens inclusos..."
          />
        </div>
      </div>

      <div className="bg-bg border-2 border-border p-4 rounded-xl">
        <h3 className="font-bold text-white text-sm mb-3">Preview - Valores automáticos:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted block text-xs">Geomembrana</span>
            <span className="text-white font-bold">{area.toFixed(0)} m²</span>
          </div>
          <div>
            <span className="text-muted block text-xs">Espessura</span>
            <span className="text-white font-bold">{espessura} mm</span>
          </div>
          <div>
            <span className="text-muted block text-xs">Chumbadores</span>
            <span className="text-white font-bold">~{chumbadores} un</span>
          </div>
          <div>
            <span className="text-muted block text-xs">Cabo de Aço (L.V.)</span>
            <span className="text-white font-bold">
              {data.incluirLinhaVida
                ? `${metrosCabo} m  ((${data.largura}×2 + ${data.comprimento}×2)×2 +5%)`
                : 'Não incluso'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4EscopoFornecimento;