import React, { useEffect } from 'react';
import { Info, Package } from 'lucide-react';
import { fmtNum } from '../../constants';
import TextareaAutosize from 'react-textarea-autosize';

const RECOMENDACAO_PADRAO = `• Geomembrana PEAD 100% virgem (material reciclado não é aceito para revestimento de armazém graneleiro)
• Espessura conforme cálculo técnico ({espessura} mm)
• Quantidade estimada: {area} m² ({qtdBobinas} bobinas)
• Material deve ser fornecido pelo cliente,those devidamente acondicionado para aplicação
• Recomenda-se conferência do material no canteiro antes do início da execução`;

const Step4RecomendacaoMaterial = ({ data, updateData }) => {
  const calc = data._calculo;
  const area = calc?.material?.areaGeomembrana || 0;
  const qtdBobinas = calc?.material?.qtdBobinas || 0;
  const espessura = data.espessura || '2.00';

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
  }, [calc]);

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
