import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, Trash2, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fmt } from '../constants';
import Button from '../../../shared/Button';
import Input from '../../../shared/Input';
import { calcularGeomembrana, ESPESSURAS_DISPONIVEIS } from '../services/geomembraneCalculator';

const StepServicos = ({ items, onChange, tipoProposta, onTipoChange, onNext, onBack, companySettings }) => {

  const addItem = () => {
    const newId = `ITEM.${String(items.length + 1).padStart(2, '0')}`;
    onChange([...items, { id: newId, label: '', unit: 'UNID.', qty: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    onChange(items.filter(i => i.id !== id));
  };

  const updateItem = (id, field, val) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  // ── Estado da calculadora de geomembrana ──
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcEspessura, setCalcEspessura] = useState('1.00');
  const [calcArea, setCalcArea] = useState('');
  const [calcIncluirFrete, setCalcIncluirFrete] = useState(false);

  const precosDb = companySettings?.geomembranePrices || null;
  const calcResult = calcOpen
    ? calcularGeomembrana(calcArea, calcEspessura, calcIncluirFrete, precosDb)
    : null;

  const adicionarMaterialAoEscopo = () => {
    if (!calcResult) return;
    const espessuraFmt = calcResult.espessura.replace('.', ',');
    const newId = `ITEM.${String(items.length + 1).padStart(2, '0')}`;
    const descricaoTecnica = [
      `Fornecimento de Geomembrana PEAD ${espessuraFmt} mm`,
      `Área solicitada: ${fmtNumBR(calcResult.areaSolicitada)} m²`,
      `Quantidade de bobinas: ${calcResult.qtdBobinas} (${fmtNumBR(calcResult.m2PorBobina)} m²/bobina)`,
      `Custo do material: ${fmt(calcResult.custoMaterialBruto)}`,
      calcResult.incluirFrete ? `Frete estimado: ${fmt(calcResult.frete)}` : 'Sem frete',
    ].join('\n');
    onChange([
      ...items,
      {
        id: newId,
        label: `Fornecimento de Geomembrana PEAD ${espessuraFmt} mm`,
        unit: 'm²',
        qty: String(calcResult.areaSolicitada),
        price: Number(calcResult.precoUnitario.toFixed(2)),
        description: descricaoTecnica,
      },
    ]);
  };

  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const isContinuous = tipoProposta === 'servico_continuo';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-extrabold font-syne mb-2">Escopo de Fornecimento</h2>
          <p className="text-muted text-sm">Adicione os serviços e materiais que farão parte desta proposta comercial.</p>
        </div>

        <div className="bg-surface border-2 border-border p-2 rounded-xl flex gap-1">
          <button
            onClick={() => onTipoChange('valor_fechado')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isContinuous ? 'bg-accent text-white shadow-lg' : 'text-muted hover:text-white'}`}
          >
            Valor Fechado
          </button>
          <button
            onClick={() => onTipoChange('servico_continuo')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isContinuous ? 'bg-accent text-white shadow-lg' : 'text-muted hover:text-white'}`}
          >
            Serviço Contínuo
          </button>
        </div>
      </div>

      {/* ── Painel: Calculadora de Geomembrana ── */}
      <div className="bg-surface border-2 border-gold/30 rounded-2xl overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setCalcOpen(o => !o)}
          className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gold/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <div className="font-bold text-white">Calculadora de Geomembrana</div>
              <div className="text-xs text-muted">Informe a metragem quadrada e obtenha a sugestão de preço.</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${calcOpen ? 'bg-gold/20 text-gold' : 'bg-bg text-muted'}`}>
              {calcOpen ? 'Aberta' : 'Fechada'}
            </span>
            {calcOpen ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
          </div>
        </button>

        <AnimatePresence>
          {calcOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t-2 border-border/40"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 block">Espessura</label>
                  <select
                    value={calcEspessura}
                    onChange={e => setCalcEspessura(e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold transition-colors"
                  >
                    {ESPESSURAS_DISPONIVEIS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Input
                    label="Metragem Quadrada (m²)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex.: 500"
                    value={calcArea}
                    onChange={e => setCalcArea(e.target.value)}
                    suffix="m²"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 block">Frete</label>
                  <div className="bg-bg border-2 border-border rounded-xl p-1 flex gap-1 h-[50px]">
                    <button
                      type="button"
                      onClick={() => setCalcIncluirFrete(false)}
                      className={`flex-1 rounded-lg text-xs font-bold transition-all ${!calcIncluirFrete ? 'bg-gold text-bg shadow-lg' : 'text-muted hover:text-white'}`}
                    >
                      Sem frete
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcIncluirFrete(true)}
                      className={`flex-1 rounded-lg text-xs font-bold transition-all ${calcIncluirFrete ? 'bg-gold text-bg shadow-lg' : 'text-muted hover:text-white'}`}
                    >
                      Com frete
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="bg-bg/60 border-2 border-border rounded-2xl p-5">
                  {calcResult ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <CalcField label="Bobinas" value={`${calcResult.qtdBobinas} un`} />
                        <CalcField label="Custo Material" value={fmt(calcResult.custoMaterialBruto)} accent />
                        <CalcField
                          label="Frete"
                          value={calcResult.incluirFrete ? fmt(calcResult.frete) : 'Não incluso'}
                        />
                        <CalcField label="Total Material" value={fmt(calcResult.custoTotal)} accent />
                      </div>

                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-border/40">
                        <div>
                          <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Preço unitário sugerido (por m²)</div>
                          <div className="text-3xl font-black font-syne text-gold tracking-tight">
                            {fmt(calcResult.precoUnitario)}
                          </div>
                          <div className="text-[10px] text-muted/70 mt-1">
                            {calcResult.areaDesperdicio > 0 && (
                              <>Inclui sobra de {fmtNumBR(calcResult.areaDesperdicio)} m² (arredondamento de bobinas). </>
                            )}
                            {!calcResult.incluirFrete && 'Sem frete.'}
                          </div>
                        </div>
                        <Button
                          onClick={adicionarMaterialAoEscopo}
                          className="px-6 py-3 flex items-center gap-2 whitespace-nowrap"
                        >
                          <Plus size={18} /> Adicionar ao Escopo
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted text-sm">
                      <Calculator size={28} className="mx-auto mb-2 opacity-40" />
                      Informe a metragem quadrada para ver a sugestão de preço.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-2 border-accent bg-accent/5 rounded-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b-2 border-border/50 bg-black/20">
                <div className="text-sm font-bold text-white flex items-center gap-3">
                  <span className="text-accent2 font-syne text-lg">{index + 1}</span>
                  Item do Escopo
                </div>
                <Button variant="ghost" className="text-danger hover:text-danger hover:bg-danger/10 px-3 py-1 flex items-center gap-2" onClick={() => removeItem(item.id)}>
                  <Trash2 size={16} /> Remover
                </Button>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Descrição Curta (Título) *"
                  placeholder="Ex.: Reconstrução de taludes"
                  value={item.label}
                  onChange={e => updateItem(item.id, "label", e.target.value)}
                />
                <Input 
                  label="Unidade de Medida"
                  placeholder="Ex.: UNID., HRS, M²"
                  value={item.unit}
                  onChange={e => updateItem(item.id, "unit", e.target.value)}
                />
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Detalhamento Técnico (Parágrafo)</label>
                  <textarea 
                    rows={3}
                    placeholder="Descreva detalhadamente o serviço ou material..."
                    value={item.description || ''}
                    onChange={e => updateItem(item.id, "description", e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
              <div className="border-t-2 border-border/50 p-5 bg-black/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Input 
                    type="number"
                    label="Qtd"
                    value={item.qty}
                    onChange={e => updateItem(item.id, "qty", e.target.value)}
                  />
                  <Input 
                    type="number"
                    step="0.01"
                    label="Valor Unit. (R$)"
                    value={item.price}
                    onChange={e => updateItem(item.id, "price", e.target.value)}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Subtotal</label>
                    <div className="bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm font-bold text-accent2 flex items-center">
                      {fmt((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border rounded-2xl text-muted text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
              <Plus size={24} className="text-accent" />
            </div>
            <p className="font-bold text-white mb-2">Nenhum item adicionado</p>
            <p className="text-sm">Comece adicionando o primeiro serviço do seu escopo.</p>
          </div>
        )}
        
        <div className="pt-4 pb-6">
          <Button onClick={addItem} className="w-full border-dashed border-2 bg-transparent hover:bg-accent/10 border-accent/50 text-accent2 py-4 text-lg">
            + Adicionar Item ao Escopo
          </Button>
        </div>
      </div>

      {/* Floating Total Summary */}
      <div className="sticky bottom-4 bg-surface/80 backdrop-blur-xl border-2 border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl z-10">
        {!isContinuous ? (
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Total Estimado</div>
            <div className="text-3xl font-black font-syne text-gold">{fmt(total)}</div>
          </div>
        ) : (
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">Modelo de Precificação</div>
            <div className="text-xl font-black font-syne text-white">Valor por Medição</div>
          </div>
        )}
        <div className="flex gap-4 w-full sm:w-auto">
          <Button variant="ghost" onClick={onBack} className="flex-1 sm:flex-none flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Voltar
          </Button>
          <Button 
            onClick={onNext} 
            disabled={items.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2"
          >
            Próximo <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CalcField = ({ label, value, accent }) => (
  <div>
    <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{label}</div>
    <div className={`text-sm font-bold ${accent ? 'text-gold' : 'text-white'}`}>{value}</div>
  </div>
);

const fmtNumBR = (v) =>
  Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default StepServicos;
