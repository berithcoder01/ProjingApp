import React from 'react';
import { fmt } from '../../constants';
import { CheckCircle } from 'lucide-react';

const Step9Revisao = ({ data }) => {
  const calc = data._calculo;

  if (!calc) {
    return (
      <div className="bg-surface border-2 border-dashed border-border p-12 rounded-2xl flex flex-col items-center justify-center text-muted">
        <div className="text-4xl mb-4 opacity-50">📋</div>
        <p className="font-bold text-lg text-white mb-1">Dados Incompletos</p>
        <p className="text-sm">Preencha todas as etapas anteriores para revisar a proposta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Revisão Geral</h2>
        <p className="text-muted text-sm mt-1">Confirme todos os dados antes de gerar o documento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1: Dados Principais */}
        <div className="space-y-4">
          <div className="bg-surface border-2 border-border p-4 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-accent2" /> Identificação
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Número:</span>
                <span className="text-white font-bold">{data.numeroProposta || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cliente:</span>
                <span className="text-white font-bold">{data.cliente || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Contato:</span>
                <span className="text-white font-bold">{data.contato || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Local:</span>
                <span className="text-white font-bold">{data.local || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Objeto:</span>
                <span className="text-white font-bold text-right max-w-[150px]">{data.objeto || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border-2 border-border p-4 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-gold" /> Dimensões
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Largura:</span>
                <span className="text-white font-bold">{data.largura} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Comprimento:</span>
                <span className="text-white font-bold">{data.comprimento} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Espessura:</span>
                <span className="text-white font-bold">{data.espessura} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Área Total:</span>
                <span className="text-white font-bold">{calc.areas.totalObra.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Chumbadores:</span>
                <span className="text-white font-bold">~{Math.round(calc.areas.totalObra * 0.78)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border-2 border-border p-4 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-success" /> Opcionais
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data.incluirLinhaVida ? 'bg-success' : 'bg-muted'}`} />
                <span className="text-muted">Linha de Vida:</span>
                <span className="text-white">{data.incluirLinhaVida ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data.retirarTubulacao ? 'bg-success' : 'bg-muted'}`} />
                <span className="text-muted">Tubulação:</span>
                <span className="text-white">{data.retirarTubulacao ? 'Sim' : 'Não'}</span>
              </div>
        {data.modoProposta !== 'so_obra' && (
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${data.faturamentoDireto ? 'bg-success' : 'bg-muted'}`} />
            <span className="text-muted">Faturamento Direto:</span>
            <span className="text-white">{data.faturamentoDireto ? 'Sim' : 'Não'}</span>
          </div>
        )}
            </div>
          </div>
        </div>

        {/* Coluna 2: Valores e Condições */}
        <div className="space-y-4">
          <div className="bg-surface border-2 border-accent/50 p-4 rounded-xl">
            <h3 className="font-bold text-accent2 text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={16} /> Valores
            </h3>
        <div className="space-y-2 text-sm">
          {data.itens && data.itens.length > 0 ? (
            <>
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs text-muted">ITEM</th>
                    <th className="text-left py-2 text-xs text-muted">DESCRIÇÃO</th>
                    <th className="text-right py-2 text-xs text-muted">QTD.</th>
                    <th className="text-right py-2 text-xs text-muted">VALOR (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.itens.map((item, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-2 text-xs">{index + 1}</td>
                      <td className="py-2">{item.descricao || '—'}</td>
                      <td className="py-2 text-right whitespace-nowrap">
                        {Number(item.quantidade || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {item.unidade || 'UN'}
                      </td>
                      <td className="py-2 text-right">{fmt(item.valor || 0)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="pt-4 text-left font-bold">TOTAL:</td>
                    <td className="pt-4 text-right font-black text-lg text-accent2">{fmt(data.totalGeral || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-white font-bold">TOTAL:</span>
                <span className="text-accent2 font-black text-lg">{fmt(data.totalGeral || 0)}</span>
              </div>
            </div>
          )}
        </div>
          </div>

          <div className="bg-surface border-2 border-border p-4 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-gold" /> Impostos
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">DAS Federal:</span>
                <span className="text-white">{data.impostoDAS || '11,20'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">ISS:</span>
                <span className="text-white">{data.impostoISS || '2,79'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">IPI:</span>
                <span className="text-white">{data.impostoIPI || '15,00'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">DIFAL:</span>
                <span className="text-white">{data.impostoDIFAL || '6,00'}%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border-2 border-border p-4 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-accent2" /> Condições
            </h3>
            <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Entrada:</span>
          <span className="text-white">{data.percentualEntrada || '15'}%</span>
        </div>
        {data.modoProposta !== 'so_obra' && (
          <div className="flex justify-between">
            <span className="text-muted">Material:</span>
            <span className="text-white">{data.percentualMaterial || '40'}%</span>
          </div>
        )}
              <div className="flex justify-between">
                <span className="text-muted">Validade:</span>
                <span className="text-white">{data.validadeProposta || '60'} dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Execução:</span>
                <span className="text-white">{data.prazoExecucao || '45'} dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Multa:</span>
                <span className="text-white">{data.multaDiaria || '0,3'}%/dia (max {data.multaLimite || '10'}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9Revisao;
