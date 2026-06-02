import React from 'react';
import Input from '../../../../shared/Input';
import { CreditCard, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';

const Step8Condicoes = ({ data, updateData }) => {
  const percentualEntrada = data.percentualEntrada || '15';
  const prazoEntrada = data.prazoEntrada || '28';
  const percentualMaterial = data.percentualMaterial || '40';
  const prazoMaterial = data.prazoMaterial || '28';
  const percentualMedicao = data.percentualMedicao || '0';
  const frequenciaMedicao = data.frequenciaMedicao || '30';
  const prazoPagamentoMedicao = data.prazoPagamentoMedicao || '28';
  const prazoSaldo = data.prazoSaldo || '28';

  const showEntrada = data.showEntrada !== false;
  const showMaterial = data.showMaterial !== false;
  const showMedicao = !!data.showMedicao;
  const showSaldo = data.showSaldo !== false;

  const showMultas = data.showMultas !== false;
  const showValidade = data.showValidade !== false;
  const showPrazoExec = data.showPrazoExec !== false;
  const showObsPrazo = data.showObsPrazo !== false;

  const calculateSaldo = () => {
    let total = 100;
    if (showEntrada) total -= parseFloat(percentualEntrada || 0);
    if (showMaterial) total -= parseFloat(percentualMaterial || 0);
    if (showMedicao) total -= parseFloat(percentualMedicao || 0);
    return Math.max(0, total);
  };

  const cardClass = (on) => `bg-surface border-2 rounded-2xl transition-all duration-300 overflow-hidden ${on ? 'border-accent/40 shadow-lg shadow-accent/5' : 'border-border opacity-70'}`;

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Condições Comerciais</h2>
        <p className="text-muted text-sm mt-1">
          Configure as condições de pagamento, multa contratual e validade da proposta.
        </p>
      </div>

      {/* Forma de Pagamento */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <CreditCard size={18} className="text-accent2" /> Forma de Pagamento
        </h3>

        <div className="bg-bg p-4 rounded-xl border border-border space-y-8">
          {/* Entrada */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showEntrada}
                onChange={(e) => updateData('showEntrada', e.target.checked)}
                className="w-5 h-5 accent-accent2"
              />
              <span className="font-bold text-white group-hover:text-accent2 transition-colors">Entrada (Mobilização)</span>
            </label>

            {showEntrada && (
              <div className="pl-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Percentual (%)</label>
                    <input
                      type="number"
                      value={percentualEntrada}
                      onChange={(e) => updateData('percentualEntrada', e.target.value)}
                      className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                    />
                  </div>
                  {data.tipoPrazoEntrada === 'inicio' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Prazo da Entrada</label>
                      <div className="w-full bg-accent/10 border-2 border-accent rounded-xl px-4 py-3 text-accent font-bold">
                        Pagamento no início da obra
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Prazo (Dias)</label>
                      <input
                        type="number"
                        value={prazoEntrada}
                        onChange={(e) => updateData('prazoEntrada', e.target.value)}
                        className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Momento do Pagamento</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="tipoPrazoEntrada"
                        value="dias"
                        checked={data.tipoPrazoEntrada !== 'inicio'}
                        onChange={() => updateData('tipoPrazoEntrada', 'dias')}
                        className="w-4 h-4 accent-accent2"
                      />
                      <span className="text-sm text-white group-hover:text-accent2 transition-colors">Em dias após assinatura</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="tipoPrazoEntrada"
                        value="inicio"
                        checked={data.tipoPrazoEntrada === 'inicio'}
                        onChange={() => updateData('tipoPrazoEntrada', 'inicio')}
                        className="w-4 h-4 accent-accent2"
                      />
                      <span className="text-sm text-white group-hover:text-accent2 transition-colors">No início da obra</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Material */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showMaterial}
                onChange={(e) => updateData('showMaterial', e.target.checked)}
                className="w-5 h-5 accent-accent2"
              />
              <span className="font-bold text-white group-hover:text-accent2 transition-colors">Entrega de Material</span>
            </label>

            {showMaterial && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Percentual (%)</label>
                  <input
                    type="number"
                    value={percentualMaterial}
                    onChange={(e) => updateData('percentualMaterial', e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Prazo (Dias)</label>
                  <input
                    type="number"
                    value={prazoMaterial}
                    onChange={(e) => updateData('prazoMaterial', e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Medição */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showMedicao}
                onChange={(e) => updateData('showMedicao', e.target.checked)}
                className="w-5 h-5 accent-accent2"
              />
              <span className="font-bold text-white group-hover:text-accent2 transition-colors">Medição de Serviços</span>
            </label>

            {showMedicao && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Percentual (%)</label>
                  <input
                    type="number"
                    value={percentualMedicao}
                    onChange={(e) => updateData('percentualMedicao', e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Frequência (Dias)</label>
                  <input
                    type="number"
                    value={frequenciaMedicao}
                    onChange={(e) => updateData('frequenciaMedicao', e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Prazo Pagto (Dias)</label>
                  <input
                    type="number"
                    value={prazoPagamentoMedicao}
                    onChange={(e) => updateData('prazoPagamentoMedicao', e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Saldo */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showSaldo}
                onChange={(e) => updateData('showSaldo', e.target.checked)}
                className="w-5 h-5 accent-accent2"
              />
              <span className="font-bold text-white group-hover:text-accent2 transition-colors">Saldo após Conclusão</span>
            </label>

            {showSaldo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Percentual (%)</label>
                  <input
                    type="number"
                    value={calculateSaldo()}
                    readOnly
                    className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Prazo (Dias)</label>
                  <input
                    type="number"
                    value={prazoSaldo}
                    onChange={(e) => updateData('prazoSaldo', e.target.value)}
                    className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
            Forma de Pagamento Preferencial
          </label>
          <select
            value={data.formaPagamento || 'depósito bancário'}
            onChange={(e) => updateData('formaPagamento', e.target.value)}
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
          >
            <option value="depósito bancário">Depósito bancário</option>
            <option value="transferência bancária">Transferência bancária</option>
            <option value="boleto">Boleto</option>
            <option value="PIX">PIX</option>
          </select>
        </div>
      </div>

      {/* Multa Contratual */}
      <div className={cardClass(showMultas)}>
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => updateData('showMultas', !showMultas)}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showMultas}
              readOnly
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
            />
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle size={16} className="text-danger" /> Multa Contratual
              </h3>
              <p className="text-[10px] text-muted uppercase tracking-wider">Atraso na execução</p>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${showMultas ? 'rotate-90' : ''}`}>
            <ChevronRight size={18} className="text-muted" />
          </div>
        </div>

        {showMultas && (
          <div className="p-6 pt-2 border-t border-border/50 bg-black/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
                Multa por Atraso (% ao dia)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.multaDiaria || '0.3'}
                onChange={(e) => updateData('multaDiaria', e.target.value)}
                className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
                Limite da Multa (% do contrato)
              </label>
              <input
                type="number"
                value={data.multaLimite || '10'}
                onChange={(e) => updateData('multaLimite', e.target.value)}
                className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Validade da Proposta */}
      <div className={cardClass(showValidade)}>
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => updateData('showValidade', !showValidade)}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showValidade}
              readOnly
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
            />
            <div>
              <h3 className="font-bold text-white text-sm">Validade da Proposta</h3>
              <p className="text-[10px] text-muted uppercase tracking-wider">Prazo em dias a partir da emissão</p>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${showValidade ? 'rotate-90' : ''}`}>
            <ChevronRight size={18} className="text-muted" />
          </div>
        </div>

        {showValidade && (
          <div className="p-6 pt-2 border-t border-border/50 bg-black/10">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              Validade da Proposta (dias)
            </label>
            <input
              type="number"
              value={data.validadeProposta || '60'}
              onChange={(e) => updateData('validadeProposta', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
        )}
      </div>

      {/* Prazo de Execução */}
      <div className={cardClass(showPrazoExec)}>
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => updateData('showPrazoExec', !showPrazoExec)}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showPrazoExec}
              readOnly
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
            />
            <div>
              <h3 className="font-bold text-white text-sm">Prazo de Execução</h3>
              <p className="text-[10px] text-muted uppercase tracking-wider">Dias efetivos por armazém graneleiro</p>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${showPrazoExec ? 'rotate-90' : ''}`}>
            <ChevronRight size={18} className="text-muted" />
          </div>
        </div>

        {showPrazoExec && (
          <div className="p-6 pt-2 border-t border-border/50 bg-black/10">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              Prazo de Execução (dias por armazém)
            </label>
            <input
              type="number"
              value={data.prazoExecucao || '45'}
              onChange={(e) => updateData('prazoExecucao', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
        )}
      </div>

      {/* Observação do Prazo */}
      <div className={cardClass(showObsPrazo)}>
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => updateData('showObsPrazo', !showObsPrazo)}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showObsPrazo}
              readOnly
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-bg"
            />
            <div>
              <h3 className="font-bold text-white text-sm">Observação do Prazo</h3>
              <p className="text-[10px] text-muted uppercase tracking-wider">Notas sobre fatores climáticos e operacionais</p>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${showObsPrazo ? 'rotate-90' : ''}`}>
            <ChevronRight size={18} className="text-muted" />
          </div>
        </div>

        {showObsPrazo && (
          <div className="p-6 pt-2 border-t border-border/50 bg-black/10">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              Observação
            </label>
            <textarea
              value={data.obsPrazo || 'Depende de condições climáticas e ausência de materiais no local.'}
              onChange={(e) => updateData('obsPrazo', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent h-20 resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step8Condicoes;