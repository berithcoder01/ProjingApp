import React from 'react';
import { ChevronRight, ArrowRight, ArrowLeft, Truck, FileText, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../../shared/Input';
import Button from '../../../shared/Button';

const StepCondicoes = ({ data, onChange, onNext, onBack, materialMode = false }) => {
  const update = (field, val) => onChange({ ...data, [field]: val });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Condições Comerciais</h2>
        <p className="text-muted text-sm mt-1">
          {materialMode
            ? 'Configure entrega, pagamento, especificações técnicas e garantia do material.'
            : 'Configure o modelo de contrato, faturamento e visibilidade.'}
        </p>
      </div>

      {!materialMode && (
        <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Modelo de Precificação</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => update('tipoProposta', 'valor_fechado')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.tipoProposta === 'valor_fechado' ? 'border-accent bg-accent/10' : 'border-border bg-bg hover:border-accent/30'
              }`}
            >
              <div className={`font-bold text-sm mb-1 ${data.tipoProposta === 'valor_fechado' ? 'text-white' : 'text-muted'}`}>Valor Fechado</div>
              <div className="text-[11px] text-muted">Escopo e quantidades fixas.</div>
            </button>
            <button
              type="button"
              onClick={() => update('tipoProposta', 'servico_continuo')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.tipoProposta === 'servico_continuo' ? 'border-accent bg-accent/10' : 'border-border bg-bg hover:border-accent/30'
              }`}
            >
              <div className={`font-bold text-sm mb-1 ${data.tipoProposta === 'servico_continuo' ? 'text-white' : 'text-muted'}`}>Medição / Contínuo</div>
              <div className="text-[11px] text-muted">Faturamento baseado na execução real.</div>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* SEÇÃO: FORMA DE PAGAMENTO */}
        <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showPagamento !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => update('showPagamento', data.showPagamento === false)}
          >
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={data.showPagamento !== false} 
                readOnly
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
              />
              <div>
                <h3 className="font-bold text-white text-sm">Condições de Pagamento</h3>
                <p className="text-[10px] text-muted uppercase tracking-wider">Entrada, Medição e Prazos</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${data.showPagamento !== false ? 'rotate-90' : ''}`}>
              <ChevronRight size={18} className="text-muted" />
            </div>
          </div>

          {data.showPagamento !== false && (
            <div className="p-6 pt-2 border-t border-border/50 bg-black/10 space-y-8">
              {/* Entrada (Mobilização) */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={data.showEntrada !== false}
                    onChange={(e) => update('showEntrada', e.target.checked)}
                    className="w-5 h-5 accent-accent2"
                  />
                  <span className="font-bold text-white group-hover:text-accent2 transition-colors">Entrada (Mobilização)</span>
                </label>
                {data.showEntrada !== false && (
                  <div className="pl-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Entrada (%)" type="number" value={data.entrada} onChange={e => update('entrada', e.target.value)} suffix="%" />
                      {data.tipoPrazoEntrada === 'inicio' ? (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Prazo da Entrada</label>
                          <div className="w-full bg-accent/10 border-2 border-accent rounded-xl px-4 py-3 text-sm text-accent font-bold">
                            {materialMode ? 'Pagamento no ato do pedido' : 'Pagamento no início da obra'}
                          </div>
                        </div>
                      ) : (
                        <Input label="Prazo Entrada" type="number" value={data.prazoEntrada} onChange={e => update('prazoEntrada', e.target.value)} suffix="dias" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Momento do Pagamento</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="tipoPrazoEntrada"
                            value="dias"
                            checked={data.tipoPrazoEntrada !== 'inicio'}
                            onChange={() => update('tipoPrazoEntrada', 'dias')}
                            className="w-4 h-4 accent-accent2"
                          />
                          <span className="text-sm text-white group-hover:text-accent2 transition-colors">{materialMode ? 'Em dias após aprovação' : 'Em dias após assinatura'}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="tipoPrazoEntrada"
                            value="inicio"
                            checked={data.tipoPrazoEntrada === 'inicio'}
                            onChange={() => update('tipoPrazoEntrada', 'inicio')}
                            className="w-4 h-4 accent-accent2"
                          />
                          <span className="text-sm text-white group-hover:text-accent2 transition-colors">{materialMode ? 'No ato do pedido' : 'No início da obra'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Medição de Saldo */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={data.showMedicao !== false}
                    onChange={(e) => update('showMedicao', e.target.checked)}
                    className="w-5 h-5 accent-accent2"
                  />
                  <span className="font-bold text-white group-hover:text-accent2 transition-colors">Medição de Saldo</span>
                </label>
                {data.showMedicao !== false && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                    <Input label="Medição a cada" type="number" value={data.medicao} onChange={e => update('medicao', e.target.value)} suffix="dias" />
                  </div>
                )}
              </div>

              {/* Prazo de Pagamento da NF */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={data.showNF !== false}
                    onChange={(e) => update('showNF', e.target.checked)}
                    className="w-5 h-5 accent-accent2"
                  />
                  <span className="font-bold text-white group-hover:text-accent2 transition-colors">Prazo de Pagamento da NF</span>
                </label>
                {data.showNF !== false && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                    <Input label="Prazo Pagto NF" type="number" value={data.prazoNF} onChange={e => update('prazoNF', e.target.value)} suffix="dias" />
                  </div>
                )}
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={data.showFormaPagamento !== false}
                    onChange={(e) => update('showFormaPagamento', e.target.checked)}
                    className="w-5 h-5 accent-accent2"
                  />
                  <span className="font-bold text-white group-hover:text-accent2 transition-colors">Forma de Pagamento Preferencial</span>
                </label>
                {data.showFormaPagamento !== false && (
                  <div className="pl-8">
                    <select
                      value={data.formaPagamento || ''}
                      onChange={e => update('formaPagamento', e.target.value)}
                      className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-accent transition-all"
                    >
                      <option value="">— Selecione —</option>
                      <option value="depósito bancário">Depósito bancário</option>
                      <option value="transferência bancária">Transferência bancária</option>
                      <option value="boleto">Boleto</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Observações do Pagamento */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={data.showObsPagamento !== false}
                    onChange={(e) => update('showObsPagamento', e.target.checked)}
                    className="w-5 h-5 accent-accent2"
                  />
                  <span className="font-bold text-white group-hover:text-accent2 transition-colors">Observações do Pagamento</span>
                </label>
                {data.showObsPagamento !== false && (
                  <div className="pl-8">
                    <textarea
                      rows={3}
                      value={data.obsPagamento || ''}
                      onChange={e => update('obsPagamento', e.target.value)}
                      placeholder="Notas adicionais: Ex.: Pagamento da entrada no início da obra, saldo 15 dias após a conclusão do serviço..."
                      className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all h-24 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO: ENTREGA E FRETE (apenas material) */}
        {materialMode && (
          <div className="bg-surface border-2 border-accent/40 rounded-2xl shadow-lg shadow-accent/5 overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Truck size={20} className="text-accent2" />
                <div>
                  <h3 className="font-bold text-white text-sm">Prazo e Condições de Entrega</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Logística, local e tipo de frete</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Prazo de Entrega" type="number" value={data.prazoEntrega || ''} onChange={e => update('prazoEntrega', e.target.value)} suffix="dias" />
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1 mb-2 block">Local de Entrega</label>
                  <input
                    type="text"
                    value={data.localEntrega || ''}
                    onChange={e => update('localEntrega', e.target.value)}
                    placeholder="Ex.: Obra do cliente, em Marialva - PR"
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1 mb-3 block">Tipo de Frete (Incoterm)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['CIF', 'FOB', 'A combinar', 'Retirada'].map(tipo => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => update('tipoFrete', tipo)}
                      className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        (data.tipoFrete || 'CIF') === tipo ? 'border-accent bg-accent/10 text-white' : 'border-border bg-bg text-muted hover:border-accent/30'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO: ESPECIFICAÇÕES TÉCNICAS (apenas material) */}
        {materialMode && (
          <div className="bg-surface border-2 border-accent/40 rounded-2xl shadow-lg shadow-accent/5 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={20} className="text-accent2" />
                <div>
                  <h3 className="font-bold text-white text-sm">Especificações Técnicas</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Normas NBR / ASTM / ISO aplicáveis</p>
                </div>
              </div>
              <textarea
                rows={4}
                value={data.especificacoes || ''}
                onChange={e => update('especificacoes', e.target.value)}
                placeholder="Ex.: Geomembrana PEAD 2,00 mm lisa, conforme NBR 13935 / ASTM D4397, normas de fabricação ISO 9001..."
                className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all h-28 resize-none"
              />
            </div>
          </div>
        )}

        {/* SEÇÃO: GARANTIA DO MATERIAL (apenas material) */}
        {materialMode && (
          <div className="bg-surface border-2 border-accent/40 rounded-2xl shadow-lg shadow-accent/5 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={20} className="text-accent2" />
                <div>
                  <h3 className="font-bold text-white text-sm">Garantia do Material</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Prazo e cobertura</p>
                </div>
              </div>
              <textarea
                rows={2}
                value={data.garantiaMaterial || '12 meses contra defeitos de fabricação, mediante condições normais de uso e instalação conforme especificação técnica.'}
                onChange={e => update('garantiaMaterial', e.target.value)}
                className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all h-24 resize-none"
              />
            </div>
          </div>
        )}

        {/* SEÇÃO: GARANTIAS (serviço) */}
        {!materialMode && (
          <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showGarantias !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => update('showGarantias', data.showGarantias === false)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.showGarantias !== false}
                  readOnly
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">Garantias</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Prazos contra defeitos e acidentes</p>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${data.showGarantias !== false ? 'rotate-90' : ''}`}>
                <ChevronRight size={18} className="text-muted" />
              </div>
            </div>

            {data.showGarantias !== false && (
              <div className="p-6 pt-2 border-t border-border/50 bg-black/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Garantia Fabricação" value={data.garantiaFabrica || '5'} onChange={e => update('garantiaFabrica', e.target.value)} suffix="anos" />
                <Input label="Garantia Instalação" value={data.garantiaInstalacao || '1'} onChange={e => update('garantiaInstalacao', e.target.value)} suffix="ano" />
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO: IMPOSTOS (apenas serviço) */}
        {!materialMode && (
          <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showImpostos !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => update('showImpostos', data.showImpostos === false)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.showImpostos !== false}
                  readOnly
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">Quadro de Impostos</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Alíquotas Federais e Estaduais</p>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${data.showImpostos !== false ? 'rotate-90' : ''}`}>
                <ChevronRight size={18} className="text-muted" />
              </div>
            </div>

            {data.showImpostos !== false && (
              <div className="p-6 pt-2 border-t border-border/50 bg-black/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="DAS Federal" value={data.impostoDAS || '11,20'} onChange={e => update('impostoDAS', e.target.value)} suffix="%" />
                <Input label="ISS" value={data.impostoISS || '2,79'} onChange={e => update('impostoISS', e.target.value)} suffix="%" />
                <Input label="IPI" value={data.impostoIPI || '15,00'} onChange={e => update('impostoIPI', e.target.value)} suffix="%" />
                <Input label="DIFAL" value={data.impostoDIFAL || '6,00'} onChange={e => update('impostoDIFAL', e.target.value)} suffix="%" />
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO: MULTAS (apenas serviço) */}
        {!materialMode && (
          <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showMultas !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => update('showMultas', data.showMultas === false)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.showMultas !== false}
                  readOnly
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">Multa Contratual</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Atraso na execução</p>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${data.showMultas !== false ? 'rotate-90' : ''}`}>
                <ChevronRight size={18} className="text-muted" />
              </div>
            </div>

            {data.showMultas !== false && (
              <div className="p-6 pt-2 border-t border-border/50 bg-black/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Multa Diária" value={data.multaDiaria || '0,3'} onChange={e => update('multaDiaria', e.target.value)} suffix="%" />
                <Input label="Limite Máximo" value={data.multaLimite || '10'} onChange={e => update('multaLimite', e.target.value)} suffix="%" />
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO: VALIDADE DA PROPOSTA */}
        <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showValidade !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => update('showValidade', data.showValidade === false)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.showValidade !== false}
                readOnly
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
              />
              <div>
                <h3 className="font-bold text-white text-sm">Validade da Proposta</h3>
                <p className="text-[10px] text-muted uppercase tracking-wider">Prazo em dias a partir da emissão</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${data.showValidade !== false ? 'rotate-90' : ''}`}>
              <ChevronRight size={18} className="text-muted" />
            </div>
          </div>

          {data.showValidade !== false && (
            <div className="p-6 pt-2 border-t border-border/50 bg-black/10">
              <Input label="Validade da Proposta" type="number" value={data.validade} onChange={e => update('validade', e.target.value)} suffix="dias" />
            </div>
          )}
        </div>

        {/* SEÇÃO: PRAZO DE EXECUÇÃO (apenas serviço) */}
        {!materialMode && (
          <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showPrazoExec !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => update('showPrazoExec', data.showPrazoExec === false)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.showPrazoExec !== false}
                  readOnly
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">Prazo de Execução</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Estimativa de entrega da obra</p>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${data.showPrazoExec !== false ? 'rotate-90' : ''}`}>
                <ChevronRight size={18} className="text-muted" />
              </div>
            </div>

            {data.showPrazoExec !== false && (
              <div className="p-6 pt-2 border-t border-border/50 bg-black/10">
                <Input label="Prazo de Execução" value={data.prazoExec} onChange={e => update('prazoExec', e.target.value)} placeholder="Ex.: 30 dias úteis" />
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO: RESPONSABILIDADE DA CONTRATADA */}
        <div className="bg-surface border-2 border-accent/40 rounded-2xl shadow-lg shadow-accent/5 overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <span className="text-accent2 font-bold text-sm">RC</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Responsabilidade da Contratada</h3>
                <p className="text-[10px] text-muted uppercase tracking-wider">Escopo e obrigações da empresa contratada</p>
              </div>
            </div>
            <textarea
              rows={6}
              value={data.responsabilidadeContratada || ''}
              onChange={e => update('responsabilidadeContratada', e.target.value)}
              placeholder="Ex.: Fornecer e instalar geomembrana PEAD conforme especificações técnicas; executar serviços de terraplanagem e preparação do terreno; fornecer materiais de fixação (berço e estacas); testes de estanqueidade..."
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all h-40 resize-none"
            />
          </div>
        </div>

        {/* SEÇÃO: OBSERVAÇÕES GERAIS */}
        <div className={`bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${data.showObs !== false ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`}>
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => update('showObs', data.showObs === false)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.showObs !== false}
                readOnly
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
              />
              <div>
                <h3 className="font-bold text-white text-sm">Observações Gerais</h3>
                <p className="text-[10px] text-muted uppercase tracking-wider">Notas e condições adicionais</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${data.showObs !== false ? 'rotate-90' : ''}`}>
              <ChevronRight size={18} className="text-muted" />
            </div>
          </div>

          {data.showObs !== false && (
            <div className="p-6 pt-2 border-t border-border/50 bg-black/10">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Observações</label>
              <textarea
                rows={3}
                value={data.obs}
                onChange={e => update('obs', e.target.value)}
                placeholder="Notas adicionais..."
                className="mt-2 w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent transition-all h-32 resize-none"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={18} /> Voltar
        </Button>
        <Button onClick={onNext} className="flex items-center gap-2">
          Revisar proposta <ArrowRight size={18} />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepCondicoes;
