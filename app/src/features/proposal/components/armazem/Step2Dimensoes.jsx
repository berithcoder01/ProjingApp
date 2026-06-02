import React, { useEffect, useState } from 'react';
import Input from '../../../../shared/Input';
import { calcularArmazem } from '../../services/armazemCalculator';
import { fmt, fmtNum } from '../../constants';
import { fetchSettings } from '../../../../shared/services/api';

const Step2Dimensoes = ({ data, updateData }) => {
  const [companySettings, setCompanySettings] = useState(null);
  const precosDb = companySettings?.geomembranePrices || null;

  // Carregar as configurações do sistema
  useEffect(() => {
    const loadData = async () => {
      try {
        const s = await fetchSettings();
        setCompanySettings(s);
      } catch (e) {
        console.error('Erro ao carregar configurações', e);
      }
    };
    loadData();
  }, []);
  // Inicializar defaults caso vazio
  useEffect(() => {
    if (!data.espessura) updateData('espessura', '2.00');
  }, []);

  const comprimento = data.comprimento || '';
  const largura = data.largura || '';
  const rampa = data.rampa || '';
  // v1.1 - Forçando atualização de área com folga
  const espessura = data.espessura || '2.00';

  let resultado = null;
  let erro = null;

  try {
    if (comprimento && largura && rampa) {
      resultado = calcularArmazem(comprimento, largura, rampa, espessura, precosDb, {
        incluirLinhaVida: data.incluirLinhaVida,
        materialSafetyMargin: companySettings?.materialSafetyMargin || 1.50
      });
      // Garantia de que a folga está presente (v1.1)
      if (resultado && !resultado.areas.totalObraComFolga) {
        resultado.areas.totalObraComFolga = resultado.areas.totalObra * (companySettings?.materialSafetyMargin || 1.15);
      }
    }
  } catch (e) {
    erro = e.message;
  }

  // Atualiza os dados calculados no state global silenciosamente para uso nos próximos steps
  useEffect(() => {
    if (resultado) {
      updateData('_calculo', resultado);
    } else {
      updateData('_calculo', null);
    }
  }, [comprimento, largura, rampa, espessura, data.incluirLinhaVida, companySettings]);

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Dimensionamento Geométrico</h2>
        <p className="text-muted text-sm mt-1">Informe os dados da rampa para o motor matemático gerar as áreas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input 
          label="Comp. Armazém" 
          type="number" 
          suffix="m"
          value={comprimento} 
          onChange={e => updateData('comprimento', e.target.value)} 
          placeholder="Lado maior"
        />
        <Input 
          label="Largura Armazém" 
          type="number" 
          suffix="m"
          value={largura} 
          onChange={e => updateData('largura', e.target.value)} 
          placeholder="Lado menor"
        />
        <Input 
          label="Rampa" 
          type="number" 
          suffix="m"
          value={rampa} 
          onChange={e => updateData('rampa', e.target.value)} 
          placeholder="Inclinada"
        />
        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
            Espessura (mm)
          </label>
          <select 
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold transition-colors"
            value={espessura} 
            onChange={e => updateData('espessura', e.target.value)}
          >
            <option value="0.50">0.50 mm (1180 m²/bobina)</option>
            <option value="0.75">0.75 mm (885 m²/bobina)</option>
            <option value="0.80">0.80 mm (826 m²/bobina)</option>
            <option value="1.00">1.00 mm (708 m²/bobina)</option>
            <option value="1.50">1.50 mm (448 m²/bobina)</option>
            <option value="2.00">2.00 mm (250 m²/bobina)</option>
            <option value="2.50">2.50 mm (207 m²/bobina)</option>
            <option value="3.00">3.00 mm (176 m²/bobina)</option>
          </select>
        </div>
      </div>

      {/* Resumo do Cálculo */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gold" />
        <h3 className="font-bold text-gold ml-4 mb-4">Análise Automática do Sistema</h3>
        
        {erro ? (
          <div className="ml-4 text-danger font-bold text-sm">{erro}</div>
        ) : resultado ? (
          <div className="ml-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg p-3 rounded-lg border border-border">
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">Área da Obra (+15%)</div>
              <div className="text-lg font-bold text-white">{fmtNum(resultado.areas.totalObraComFolga, 1)} <span className="text-xs text-muted">m²</span></div>
            </div>
            <div className="bg-bg p-3 rounded-lg border border-border">
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">Qtd Geomembrana</div>
              <div className="text-lg font-bold text-white">{fmtNum(resultado.material.areaGeomembrana, 0)} <span className="text-xs text-muted">m²</span></div>
              <div className="text-[10px] text-gold font-bold">{resultado.material.qtdBobinas} bobina(s)</div>
            </div>
            <div className="bg-bg p-3 rounded-lg border border-border">
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">Chumbadores (Est.)</div>
              <div className="text-lg font-bold text-white">{fmtNum(resultado.areas.totalObra * 0.78, 0)} <span className="text-xs text-muted font-normal uppercase">un</span></div>
            </div>
            <div className="bg-bg p-3 rounded-lg border border-gold/50 bg-gold/5">
              <div className="text-[10px] text-gold uppercase font-bold tracking-wider mb-1">Custo Ideal Tabela</div>
              <div className="text-lg font-black text-gold">{fmt(resultado.financeiro.custoTotalIdeal)}</div>
            </div>
          </div>
        ) : (
          <div className="ml-4 text-muted text-sm">Insira as medidas para visualizar o cálculo de material e custo base.</div>
        )}
      </div>
    </div>
  );
};

export default Step2Dimensoes;
