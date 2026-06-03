import { useEffect } from 'react';
import { generateProposalPDF, generateArmazemPDF, generateMaterialPDF } from '../services/pdfService';

const splitObservations = (raw) => {
  if (!raw) return { obsPagamento: '', obs: '' };
  const marker = '[PAGAMENTO] ';
  if (raw.startsWith(marker)) {
    const rest = raw.slice(marker.length);
    const sep = rest.indexOf('\n\n');
    if (sep === -1) return { obsPagamento: rest.trim(), obs: '' };
    return { obsPagamento: rest.slice(0, sep).trim(), obs: rest.slice(sep + 2).trim() };
  }
  return { obsPagamento: '', obs: raw };
};

const VALID_PAYMENT_METHODS = ['depósito bancário', 'transferência bancária', 'boleto', 'PIX'];

const isLegacyPaymentTerm = (term) => {
  if (!term) return false;
  if (VALID_PAYMENT_METHODS.includes(term)) return false;
  return term.length > 30;
};

/**
 * Componente "controlador" de geração de PDF para propostas vindas do banco.
 * Recebe a `proposal` completa, identifica o tipo (geral, material ou armazém),
 * dispara a geração e chama `onDone` ao terminar.
 *
 * Não há mais DOM oculto nem ref — o PDF é gerado nativamente via @react-pdf/renderer.
 */
const PdfGenerator = ({ proposal, companySettings, onDone }) => {
  useEffect(() => {
    if (!proposal) return;
    let cancelled = false;

    const run = async () => {
      const meta = proposal.metadata || {};
      const isArmazem = meta.tipo === 'armazem';
      const isMaterial = meta.tipo === 'material';

      try {
        if (isArmazem) {
          const data = {
            numeroProposta: proposal.number,
            referencia: meta.referencia || '',
            cliente: proposal.clientName,
            contato: meta.contato || '',
            local: proposal.location || meta.local || '',
            objeto: proposal.object || meta.objeto || '',
            descricaoServico: meta.descricaoServico || '',
            caracteristicasMaterial: meta.caracteristicasMaterial || '',
            escopoResponsabilidades: meta.escopoResponsabilidades || '',
            itensInclusos: meta.itensInclusos || '',
            garantiaDefeitos: meta.garantias?.defeitos || '5',
            garantiaAcidentes: meta.garantias?.acidentes || '1',
            durabilidade: meta.durabilidade || '30',
            vistorias: meta.vistorias || '1º, 3º e 5º ano',
            fornecimentoCliente: meta.fornecimentoCliente || '',
            faturamentoDireto: meta.opcionais?.faturamentoDireto || false,
            condicoesFaturamento: meta.condicoesFaturamento || '',
            valorMaterialManual: meta.valores?.material || 0,
            valorMaoDeObra: meta.valores?.maoDeObra || 0,
            totalGeral: proposal.total || meta.valores?.totalGeral || 0,
            impostoDAS: meta.impostos?.DAS || '11.20',
            impostoISS: meta.impostos?.ISS || '2.79',
            impostoIPI: meta.impostos?.IPI || '15.00',
            impostoDIFAL: meta.impostos?.DIFAL || '6.00',
            showEntrada: meta.condicoesPagamento?.showEntrada !== false,
            percentualEntrada: meta.condicoesPagamento?.entrada || '15',
            prazoEntrada: meta.condicoesPagamento?.prazoEntrada || '28',
            tipoPrazoEntrada: meta.condicoesPagamento?.entradaNoInicio ? 'inicio' : 'dias',
            showMaterial: meta.condicoesPagamento?.showMaterial !== false,
            percentualMaterial: meta.condicoesPagamento?.material || '40',
            prazoMaterial: meta.condicoesPagamento?.prazoMaterial || '28',
            showMedicao: !!meta.condicoesPagamento?.showMedicao,
            percentualMedicao: meta.condicoesPagamento?.percentualMedicao || '0',
            frequenciaMedicao: meta.condicoesPagamento?.frequenciaMedicao || '30',
            prazoPagamentoMedicao: meta.condicoesPagamento?.prazoPagamentoMedicao || '28',
            showSaldo: meta.condicoesPagamento?.showSaldo !== false,
            prazoSaldo: meta.condicoesPagamento?.prazoSaldo || '28',
            formaPagamento: meta.condicoesPagamento?.formaPagamento || 'depósito bancário',
            multaDiaria: meta.multa?.diaria || '0.3',
            multaLimite: meta.multa?.limite || '10',
            validadeProposta: meta.validade || '60',
            prazoExecucao: meta.prazoExecucao || '45',
            obsPrazo: meta.obsPrazo || '',
            largura: meta.geometria?.largura || meta.largura || '',
            comprimento: meta.geometria?.comprimento || meta.comprimento || '',
            rampa: meta.geometria?.rampa || meta.rampa || '',
            espessura: meta.material?.espessura || meta.espessura || '2.00',
            _calculo: {
              areas: meta.areas || {},
              material: meta.material || { espessura: meta.material?.espessura || meta.espessura || '2.00' },
              geometria: meta.geometria || { largura: meta.largura, comprimento: meta.comprimento, rampa: meta.rampa },
            },
          };
          await generateArmazemPDF({ propNum: proposal.number, data, companySettings });
        } else if (isMaterial) {
          const cliente = {
            nome: proposal.clientName,
            contato: proposal.clientContact || '',
            cargo: proposal.clientRole || '',
            local: proposal.location || '',
            tel: proposal.phone || '',
            objeto: proposal.object || '',
          };
          const items = (proposal.items || []).map((it) => ({
            id: it.id,
            label: it.label,
            unit: it.unit,
            qty: it.quantity,
            price: it.unitPrice,
            description: it.description || '',
          }));
          const rawCond = proposal.conditions?.[0] || {};
          const legacyTerm = rawCond.paymentTerms || '';
          const migratedFromTerm = isLegacyPaymentTerm(legacyTerm) ? legacyTerm : '';
          const formaPagamentoFinal = isLegacyPaymentTerm(legacyTerm) ? '' : legacyTerm;
          const { obsPagamento, obs } = splitObservations(rawCond.observations || '');
          const materialMeta = meta.material || {};
          const cond = {
            entrada: rawCond.downPayment,
            prazoEntrada: rawCond.downPaymentDays,
            tipoPrazoEntrada: rawCond.downPaymentOnStart ? 'inicio' : 'dias',
            medicao: rawCond.measurementDays,
            prazoNF: rawCond.paymentNfDays,
            validade: rawCond.validadeDays,
            prazoExec: rawCond.executionPeriod,
            formaPagamento: formaPagamentoFinal,
            obsPagamento: obsPagamento || migratedFromTerm,
            obs: obs,
            showPagamento: meta.showPagamento !== false,
            showEntrada: meta.showEntrada !== false,
            showMedicao: meta.showMedicao !== false,
            showNF: meta.showNF !== false,
            showFormaPagamento: meta.showFormaPagamento !== false,
            showObsPagamento: meta.showObsPagamento !== false,
            showValidade: meta.showValidade !== false,
            showObs: meta.showObs !== false,
            prazoEntrega: materialMeta.prazoEntrega || meta.prazoEntrega || '',
            localEntrega: materialMeta.localEntrega || meta.localEntrega || '',
            tipoFrete: materialMeta.tipoFrete || meta.tipoFrete || 'CIF',
            especificacoes: materialMeta.especificacoes || meta.especificacoes || '',
            garantiaMaterial: materialMeta.garantiaMaterial || meta.garantiaMaterial || '',
            responsabilidadeContratada: meta.responsabilidadeContratada || '',
            tipoProposta: 'valor_fechado',
          };
          await generateMaterialPDF({ propNum: proposal.number, cliente, items, cond, companySettings });
        } else {
          const cliente = {
            nome: proposal.clientName,
            contato: proposal.clientContact || '',
            cargo: proposal.clientRole || '',
            local: proposal.location || '',
            tel: proposal.phone || '',
            objeto: proposal.object || '',
          };
          const items = (proposal.items || []).map((it) => ({
            id: it.id,
            label: it.label,
            unit: it.unit,
            qty: it.quantity,
            price: it.unitPrice,
            description: it.description || '',
          }));
          const rawCond = proposal.conditions?.[0] || {};
          const cond = {
            entrada: rawCond.downPayment,
            prazoEntrada: rawCond.downPaymentDays,
            medicao: rawCond.measurementDays,
            prazoNF: rawCond.paymentNfDays,
            validade: rawCond.validadeDays,
            prazoExec: rawCond.executionPeriod,
            formaPagamento: rawCond.paymentTerms,
            obs: rawCond.observations,
            responsabilidadeContratada: proposal.metadata?.responsabilidadeContratada || '',
            tipoProposta: proposal.metadata?.tipoProposta || 'padrao',
          };
          await generateProposalPDF({ propNum: proposal.number, cliente, items, cond, companySettings });
        }
      } catch (err) {
        console.error('[PdfGenerator] erro:', err);
      } finally {
        if (!cancelled && onDone) onDone();
      }
    };

    run();
    return () => { cancelled = true; };
  }, [proposal, companySettings, onDone]);

  return null;
};

export default PdfGenerator;
