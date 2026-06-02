import React, { useEffect } from 'react';
import Input from '../../../../shared/Input';
import { FileText, Settings2, Shield } from 'lucide-react';
import { fmtNum } from '../../constants';

const TEXTOS_PADRAO = {
  descricaoServico: `Serviço de mão de obra com fornecimento e aplicação de material para revestimento interno em toda a superfície de rampas de {qtdArmazens} armazém graneleiro, totalizando aproximadamente {area} m².\n\n- Sistema de ancoragem por parafusamento e reforço metálico\n- Aplicação contempla:\n  - 1,00 m de paredes verticais\n  - Continuidade de 0,40 cm para rampa\n- Aplicação de geomembrana PEAD:\n  - Espessura: {espessura} mm\n  - Cordão de sustentação a cada 3,00 m\n  - Fixação com chumbadores em ~60% das rampas`,
  
  caracteristicas: `- 100% virgem\n- Densidade: 0,94 a 0,96 g/cm³\n- Temperatura de fusão: 135 a 150°C\n- Resistência a rasgos: 180 a 390 N\n- Alta resistência a hidrocarbonetos, solventes e intempéries`
};

const Step3Descricao = ({ data, updateData }) => {
  const calc = data._calculo;
  // v1.1 - Forçando atualização de área com folga
  const area = calc?.areas?.totalObraComFolga || (calc?.areas?.totalObra ? calc.areas.totalObra * 1.15 : 0);
  const espessura = data.espessura || '1.50';

  useEffect(() => {
    if (!data.descricaoServico && calc) {
      const texto = TEXTOS_PADRAO.descricaoServico
        .replace('{qtdArmazens}', '01')
        .replace('{area}', area.toFixed(0))
        .replace('{espessura}', espessura)
        .replace('{comp}', data.comprimento || '—')
        .replace('{larg}', data.largura || '—')
        .replace('{rampa}', data.rampa || '—');
      updateData('descricaoServico', texto);
    }
    
    if (!data.caracteristicasMaterial) {
      updateData('caracteristicasMaterial', TEXTOS_PADRAO.caracteristicas);
    }
  }, [calc, area, espessura]);

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Descrição do Serviço</h2>
        <p className="text-muted text-sm mt-1">
          Configure o texto padrão da proposta. Você pode editar cada campo ou usar o padrão.
        </p>
      </div>

      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText size={14} /> Descrição do Serviço
            </label>
            <button 
              onClick={() => {
                const texto = TEXTOS_PADRAO.descricaoServico
                  .replace('{qtdArmazens}', '01')
                  .replace('{area}', fmtNum(area, 0))
                  .replace('{espessura}', espessura)
                  .replace('{comp}', data.comprimento || '—')
                  .replace('{larg}', data.largura || '—')
                  .replace('{rampa}', data.rampa || '—');
                updateData('descricaoServico', texto);
              }}
              className="text-[10px] font-bold text-muted hover:text-white transition-colors underline"
            >
              Restaurar Padrão
            </button>
          </div>
          <textarea 
            value={data.descricaoServico || ''}
            onChange={(e) => updateData('descricaoServico', e.target.value)}
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors h-48 resize-none text-sm"
            placeholder="Descrição do serviço..."
          />
          <div className="text-xs text-muted mt-2 ml-1">
            Use {'{area}'} para área calculada e {'{espessura}'} para espessura selecionada.
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Settings2 size={14} /> Características do Material
            </label>
            <button 
              onClick={() => updateData('caracteristicasMaterial', TEXTOS_PADRAO.caracteristicas)}
              className="text-[10px] font-bold text-muted hover:text-white transition-colors underline"
            >
              Restaurar Padrão
            </button>
          </div>
          <textarea 
            value={data.caracteristicasMaterial || ''}
            onChange={(e) => updateData('caracteristicasMaterial', e.target.value)}
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-colors h-32 resize-none text-sm"
            placeholder="Características do material..."
          />
        </div>
      </div>

      {/* Opcionais — aqui, antes do Step4 que usa esses valores */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-3">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Shield size={18} className="text-accent2" /> Serviços Opcionais
        </h3>
        <p className="text-xs text-muted">Defina agora para que os itens do escopo sejam gerados corretamente.</p>

        <label className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 accent-accent2"
            checked={data.incluirLinhaVida || false}
            onChange={e => updateData('incluirLinhaVida', e.target.checked)}
          />
          <div>
            <div className="font-bold text-white">Incluir Linha de Vida</div>
            <div className="text-sm text-muted">
              Fabricação e instalação de linha de vida com cabo de aço galvanizado.
              {data.incluirLinhaVida && data.largura && data.comprimento && (() => {
                const metros = ((parseFloat(data.largura) * 2) + (parseFloat(data.comprimento) * 2)) * 2 * 1.05;
                return <span className="text-accent2 font-bold ml-2">≈ {fmtNum(metros, 0)} m de cabo</span>;
              })()}
            </div>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 accent-accent2"
            checked={data.retirarTubulacao || false}
            onChange={e => updateData('retirarTubulacao', e.target.checked)}
          />
          <div>
            <div className="font-bold text-white">Retirar Tubulação de Aeração</div>
            <div className="text-sm text-muted">Inclui a retirada da tubulação (quando existente e necessário).</div>
          </div>
        </label>
      </div>

      {calc && (
        <div className="bg-bg border-2 border-border p-4 rounded-xl">
          <h3 className="font-bold text-white text-sm mb-3">Preview - Valores que serão inseridos:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted block text-xs">Área (+15%)</span>
              <span className="text-white font-bold">{fmtNum(area, 1)} m²</span>
            </div>
            <div>
              <span className="text-muted block text-xs">Espessura</span>
              <span className="text-white font-bold">{espessura} mm</span>
            </div>
            <div>
              <span className="text-muted block text-xs">Geomembrana</span>
              <span className="text-white font-bold">{calc.material?.areaGeomembrana || 0} m²</span>
            </div>
            <div>
              <span className="text-muted block text-xs">Cabo de Aço (L.V.)</span>
              <span className="text-white font-bold">
                {data.incluirLinhaVida && data.largura && data.comprimento
                  ? `~${fmtNum(((parseFloat(data.largura)*2)+(parseFloat(data.comprimento)*2))*2*1.05, 0)} m`
                  : 'Não incluso'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Descricao;