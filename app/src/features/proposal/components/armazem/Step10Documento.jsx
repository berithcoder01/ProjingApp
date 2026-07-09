import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../../../shared/Button';
import { saveProposal, updateProposal } from '../../../../shared/services/api';
import { generateArmazemPDF } from '../../services/pdfService';
import { useNavigate } from 'react-router-dom';
import { fmt } from '../../constants';

const Step10Documento = ({ data, companySettings }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState('Salvando...');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    setIsGenerating(true);
    setGeneratingLabel('Salvando proposta...');
    setError(null);
    try {
      const firstClientName = data.cliente ? data.cliente.trim().split(' ')[0] : 'Cliente';
      const payload = {
        title: `Armazém - ${firstClientName} (${data.numeroProposta})`,
        clientName: data.cliente,
        value: data.totalGeral,
        status: 'DRAFT',
        metadata: {
          tipo: 'armazem',
          numeroProposta: data.numeroProposta,
          objeto: data.objeto,
          contato: data.contato,
          local: data.local,
          referencia: data.referencia,
          // Garante que campos vitais fiquem no root para facilitar edição posterior
          largura: data.largura,
          comprimento: data.comprimento,
          rampa: data.rampa,
          espessura: data.espessura,
          geometria: data._calculo?.geometria || { largura: data.largura, comprimento: data.comprimento, rampa: data.rampa },
          areas: data._calculo?.areas,
          material: data._calculo?.material || { espessura: data.espessura },
          descricaoServico: data.descricaoServico,
          caracteristicasMaterial: data.caracteristicasMaterial,
        escopoResponsabilidades: data.escopoResponsabilidades,
        itensInclusos: data.itensInclusos,
        opcionais: {
        // Campos novos
        modoProposta: data.modoProposta,
        itens: data.itens,
        quantidadeMaterialEstimada: data.quantidadeMaterialEstimada,
        descricaoRecomendacaoMaterial: data.descricaoRecomendacaoMaterial,
            linhaVida: !!data.incluirLinhaVida,
            tubulacao: !!data.retirarTubulacao,
            faturamentoDireto: !!data.faturamentoDireto
          },
          garantias: {
            defeitos: data.garantiaDefeitos,
            acidentes: data.garantiaAcidentes,
            durabilidade: data.durabilidade,
            vistorias: data.vistorias
          },
          fornecimentoCliente: data.fornecimentoCliente,
          condicoesFaturamento: data.condicoesFaturamento,
          valores: {
            material: parseFloat(data.valorMaterialManual),
            maoDeObra: parseFloat(data.valorMaoDeObra),
            totalGeral: data.totalGeral
          },
          impostos: {
            DAS: data.impostoDAS || '11.20',
            ISS: data.impostoISS || '2.79',
            IPI: data.impostoIPI || '15.00',
            DIFAL: data.impostoDIFAL || '6.00'
          },
          condicoesPagamento: {
            showEntrada: data.showEntrada !== false,
            entrada: data.percentualEntrada,
            prazoEntrada: data.prazoEntrada,
            entradaNoInicio: data.tipoPrazoEntrada === 'inicio',
            showMaterial: data.showMaterial !== false,
            material: data.percentualMaterial,
            prazoMaterial: data.prazoMaterial,
            showMedicao: !!data.showMedicao,
            percentualMedicao: data.percentualMedicao,
            frequenciaMedicao: data.frequenciaMedicao,
            prazoPagamentoMedicao: data.prazoPagamentoMedicao,
            showSaldo: data.showSaldo !== false,
            saldo: 100
              - (data.showEntrada !== false ? parseFloat(data.percentualEntrada || 0) : 0)
              - ((data.showMaterial !== false && data.modoProposta !== 'so_obra') ? parseFloat(data.percentualMaterial || 0) : 0)
              - (data.showMedicao ? parseFloat(data.percentualMedicao || 0) : 0),
            prazoSaldo: data.prazoSaldo,
            formaPagamento: data.formaPagamento
          },
          multa: {
            diaria: data.multaDiaria,
            limite: data.multaLimite
          },
          validade: data.validadeProposta,
          prazoExecucao: data.prazoExecucao,
          obsPrazo: data.obsPrazo
        }
      };

      if (data.id) {
        await updateProposal(data.id, payload);
      } else {
        await saveProposal(payload);
      }

      setGeneratingLabel('Gerando PDF...');
      const ok = await generateArmazemPDF({
        propNum: data.numeroProposta,
        data,
        companySettings,
      });
      if (!ok) {
        throw new Error('Falha ao gerar o PDF.');
      }

      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 space-y-6"
        >
          <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black font-syne text-white">Proposta Salva!</h2>
          <p className="text-muted max-w-md mx-auto">
            Proposta salva e PDF gerado com sucesso. Verifique os downloads do seu navegador.
          </p>

          <div className="bg-surface border-2 border-border p-6 rounded-xl max-w-md mx-auto">
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Proposta:</span>
                <span className="text-white font-bold">{data.numeroProposta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cliente:</span>
                <span className="text-white font-bold">{data.cliente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Valor:</span>
                <span className="text-accent2 font-black">{fmt(data.totalGeral)}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-center gap-4">
            <Button onClick={() => navigate('/propostas')} className="px-8 py-3">
              Ir para Pipeline
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold font-syne text-white">Gerar Proposta</h2>
            <p className="text-muted text-sm mt-1">Confirme os dados e salve a proposta.</p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border-2 border-border grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Número da Proposta</div>
                <div className="text-white font-bold text-xl">{data.numeroProposta || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Cliente / Obra</div>
                <div className="text-white font-bold">{data.cliente} - {data.local}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Objeto</div>
                <div className="text-white text-sm">{data.objeto || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Especificações</div>
                <div className="text-white text-sm">
                  Geomembrana PEAD {data.espessura}mm
                </div>
              </div>
            </div>

            <div className="bg-bg p-6 rounded-xl border border-border flex flex-col justify-center items-center text-center space-y-2">
              <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Valor Final</div>
              <div className="text-4xl font-black font-syne text-accent2">{fmt(data.totalGeral || 0)}</div>
              {data.itens && data.itens.length > 0 ? (
                <div className="space-y-1 mt-2 text-xs text-muted">
                  {data.itens.map((item, i) => (
                    <div key={i} className="flex justify-between gap-4">
                      <span>
                        {item.descricao.replace(/^\s*\d+\.?\s*/, '')}
                        {item.quantidade ? (
                          <small className="ml-2 text-muted">
                            ({Number(item.quantidade).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {item.unidade || 'UN'})
                          </small>
                        ) : null}
                      </span>
                      <span>{fmt(item.valor)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted">
                  Material: {fmt(parseFloat(data.valorMaterialManual) || 0)} + M.O.: {fmt(parseFloat(data.valorMaoDeObra) || 0)}
                </div>
              )}
            </div>
          </div>

          {error && <div className="text-danger font-bold text-center">{error}</div>}

          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSave}
              disabled={isGenerating || !data.totalGeral}
              className="px-12 py-4 text-lg flex items-center gap-3"
            >
              {isGenerating ? generatingLabel : 'Salvar e Gerar PDF'}
              <ArrowRight size={20} />
            </Button>
          </div>

          <div className="bg-gold/10 border-2 border-gold/30 p-4 rounded-xl text-center">
            <p className="text-gold text-sm">
              📄 O PDF será gerado automaticamente após salvar.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Step10Documento;
