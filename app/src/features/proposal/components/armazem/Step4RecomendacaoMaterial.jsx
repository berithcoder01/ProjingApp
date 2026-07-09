import React, { useEffect } from 'react';
import { Info, Package, CheckCircle, ClipboardList } from 'lucide-react';
import { fmtNum } from '../../constants';

const RECOMENDACAO_PADRAO = `• Geomembrana PEAD 100% virgem (material reciclado não é aceito para revestimento de armazém graneleiro)
• Espessura conforme cálculo técnico ({espessura} mm)
• Quantidade estimada: {area} m² ({qtdBobinas} bobinas)
• Material deve ser fornecido pelo cliente e estar devidamente acondicionado para aplicação
• Recomenda-se conferência do material no canteiro antes do início da execução`;

const RESPONSABILIDADES_PADRAO = `• Execução dos serviços e mão de obra especializada
• Equipamentos, ferramentas e EPIs para instalação de geomembrana PEAD
• Mobilização e desmobilização da equipe
• Controle de qualidade e entregas`;

// Gera a lista de itens inclusos com/sem linha de vida e numeração correta
const gerarItensInclusos = ({ m2, espessura, metrosCabo, incluirLinhaVida, qtdSuportes, chumbadores }) => {
  const itens = [
    `Parafusos zincados com expansão mecânica — adquirido e faturado diretamente pelo cliente`,
    `Perfis metálicos para vedação (barra chata) — adquirido e faturado diretamente pelo cliente`,
  ];

  if (incluirLinhaVida) {
    itens.push(`Linha de vida (${metrosCabo} m cabo aço galvanizado) — adquirido e faturado diretamente pelo cliente`);
    itens.push(`Suportes para linha de vida — adquirido e faturado diretamente pelo cliente`);
    itens.push(`Chumbadores para linha de vida — adquirido e faturado diretamente pelo cliente`);
  }

  itens.push(
    `Ferramental geral`,
    `Soldador técnico (termofusão)`,
    `04 colaboradores (mão de obra braçal)`,
    `Hospedagem, alimentação e transporte da equipe`,
    `EPIs de uso pessoal`,
  );

  return itens.map((item, i) => `${i + 1}. ${item}`).join('\n');
};

// Calcula metros de cabo: ((LARGURA×2 + COMPRIMENTO×2) * 2) + 5%
const calcMetrosCabo = (largura, comprimento) => {
  const l = parseFloat(largura) || 0;
  const c = parseFloat(comprimento) || 0;
  return Math.ceil(((l * 2) + (c * 2)) * 2 * 1.05);
};

const Step4RecomendacaoMaterial = ({ data, updateData }) => {
  const calc = data._calculo;
  const area = calc?.material?.areaGeomembrana || 0;
  const qtdBobinas = calc?.material?.qtdBobinas || 0;
  const espessura = data.espessura || '2.00';
  const chumbadores = Math.round((calc?.areas?.totalObra || 0) * 0.78);
  const metrosCabo = data.incluirLinhaVida
    ? calcMetrosCabo(data.largura, data.comprimento)
    : 0;

  const gerarTextoPadrao = () => {
    return RECOMENDACAO_PADRAO
      .replace('{espessura}', espessura)
      .replace('{area}', area.toFixed(0))
      .replace('{qtdBobinas}', qtdBobinas);
  };

  useEffect(() => {
    if (calc && !data.quantidadeMaterialEstimada) {
      updateData('quantidadeMaterialEstimada', area.toFixed(2));
    }
    if (calc && !data.descricaoRecomendacaoMaterial) {
      updateData('descricaoRecomendacaoMaterial', gerarTextoPadrao());
    }
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
        <p className="text-sm">Preencha as medidas na etapa de Dimensões para gerar a estimativa de material.</p>
      </div>
    );
  }

  const restaurarPadrao = () => {
    updateData('descricaoRecomendacaoMaterial', gerarTextoPadrao());
    updateData('quantidadeMaterialEstimada', area.toFixed(2));
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Recomendação de Material</h2>
        <p className="text-muted text-sm mt-1">
          Estimativa de material para dimensionar a mão de obra. Como esta é uma proposta de
          execução sem fornecimento, deixe aqui a recomendação técnica para o cliente.
        </p>
      </div>

      {/* ESCOPO E RESPONSABILIDADES */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <ClipboardList size={16} className="text-accent2" />
          <span className="text-[10px] font-bold text-accent2 uppercase tracking-widest">Escopo e Responsabilidades</span>
        </div>

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

      {/* Quantidade estimada */}
      <div className="bg-surface border-2 border-accent/50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 bg-accent h-full" />
        <div className="ml-4">
          <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Package size={14} /> Quantidade de Material Estimada (m²)
          </label>
          <input
            type="text"
            value={data.quantidadeMaterialEstimada || ''}
            onChange={(e) => updateData('quantidadeMaterialEstimada', e.target.value)}
            placeholder="Ex: 1500.00"
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors"
          />
          <div className="text-xs text-muted mt-2 ml-1">
            Calculado a partir das dimensões: <span className="text-white font-bold">{fmtNum(area, 0)} m²</span>
            {' × safety margin '}• equivalente a <span className="text-white font-bold">{qtdBobinas} bobinas</span> de PEAD {espessura}mm.
          </div>
        </div>
      </div>

      {/* Descritivo */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Info size={14} /> Recomendação Técnica de Material
          </label>
          <button
            onClick={restaurarPadrao}
            className="text-[10px] font-bold text-muted hover:text-white transition-colors underline"
          >
            Restaurar Padrão
          </button>
        </div>
        <textarea
          value={data.descricaoRecomendacaoMaterial || ''}
          onChange={(e) => updateData('descricaoRecomendacaoMaterial', e.target.value)}
          className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors h-56 resize-none text-sm"
          placeholder="Descreva a recomendação técnica do material (qualidade, espessura, quantidade, etc.)..."
        />
        <div className="text-xs text-muted/60 ml-1 uppercase tracking-wider">
          Este texto constará no documento final como "Recomendação de Material (Estimativa)".
        </div>
      </div>
    </div>
  );
};

export default Step4RecomendacaoMaterial;
