import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Building2, Ruler, FileText, DollarSign, Shield, CreditCard, CheckCircle, ArrowLeft, Layers } from 'lucide-react';
import { fetchProposalById, fetchSettings } from '../../../shared/services/api';

import Step0TipoProposta from './armazem/Step0TipoProposta';
import Step1Cliente from './armazem/Step1Cliente';
import Step2Dimensoes from './armazem/Step2Dimensoes';
import Step3Descricao from './armazem/Step3Descricao';
import Step4EscopoFornecimento from './armazem/Step4EscopoFornecimento';
import Step4RecomendacaoMaterial from './armazem/Step4RecomendacaoMaterial';
import Step5Opcionais from './armazem/Step5Opcionais';
import Step6Custos from './armazem/Step6Custos';
import Step7Impostos from './armazem/Step7Impostos';
import Step8Condicoes from './armazem/Step8Condicoes';
import Step9Revisao from './armazem/Step9Revisao';
import Step10Documento from './armazem/Step10Documento';

const steps = [
  { id: 0, title: 'Tipo', icon: Layers },
  { id: 1, title: 'Cliente', icon: Building2 },
  { id: 2, title: 'Dimensões', icon: Ruler },
  { id: 3, title: 'Descrição', icon: FileText },
  { id: 4, title: 'Escopo', icon: CheckCircle },
  { id: 5, title: 'Opcionais', icon: Shield },
  { id: 6, title: 'Custos', icon: DollarSign },
  { id: 7, title: 'Impostos', icon: CreditCard },
  { id: 8, title: 'Condições', icon: CreditCard },
  { id: 9, title: 'Revisão', icon: CheckCircle },
  { id: 10, title: 'Gerar', icon: FileText }
];

const ArmazemWizard = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(!!id);
  const [companySettings, setCompanySettings] = useState(null);
  const [formData, setFormData] = useState({
    espessura: '2.00', // default
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings().then(setCompanySettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
      fetchProposalById(id)
        .then(p => {
          if (p.metadata) {
            const m = p.metadata;
            // Mapeia campos aninhados para a raiz do formulário para os steps funcionarem
            setFormData({
              ...m,
              id: p.id,
              cliente: p.clientName,
              totalGeral: p.total,
              // Geometria - Tenta ler da raiz primeiro (mais recente), depois do objeto geometria corrigido
              largura: m.largura || (m.geometria?.rampa ? m.geometria.largura : ''),
              comprimento: m.comprimento || (m.geometria?.rampa ? m.geometria.comprimento : m.geometria?.largura),
              rampa: m.rampa || m.geometria?.rampa || m.geometria?.comprimento,
              espessura: m.espessura || m.material?.espessura || '2.00',
              // Impostos
              impostoDAS: m.impostos?.DAS || m.impostoDAS,
              impostoISS: m.impostos?.ISS || m.impostoISS,
              impostoIPI: m.impostos?.IPI || m.impostoIPI,
              impostoDIFAL: m.impostos?.DIFAL || m.impostoDIFAL,
              // Opcionais
              incluirLinhaVida: m.opcionais?.linhaVida,
              retirarTubulacao: m.opcionais?.tubulacao,
              faturamentoDireto: m.opcionais?.faturamentoDireto,
              condicoesFaturamento: m.condicoesFaturamento,
              // Garantias
              garantiaDefeitos: m.garantias?.defeitos,
              garantiaAcidentes: m.garantias?.acidentes,
              durabilidade: m.garantias?.durabilidade || m.durabilidade,
              vistorias: m.garantias?.vistorias || m.vistorias,
              // Valores
              valorMaterialManual: m.valores?.material,
              valorMaoDeObra: m.valores?.maoDeObra,
              // Condições de Pagamento (Mapeia do objeto aninhado para a raiz do wizard)
              showEntrada: m.condicoesPagamento?.showEntrada,
              percentualEntrada: m.condicoesPagamento?.entrada,
              prazoEntrada: m.condicoesPagamento?.prazoEntrada,
              tipoPrazoEntrada: m.condicoesPagamento?.entradaNoInicio ? 'inicio' : 'dias',
        showMaterial: m.condicoesPagamento?.showMaterial,
        percentualMaterial: m.condicoesPagamento?.material,
        prazoMaterial: m.condicoesPagamento?.prazoMaterial,

        // Campos novos
        modoProposta: m.modoProposta || 'completo',
        itens: m.opcionais?.itens ?? m.itens,
        quantidadeMaterialEstimada: m.opcionais?.quantidadeMaterialEstimada ?? m.quantidadeMaterialEstimada,
        descricaoRecomendacaoMaterial: m.opcionais?.descricaoRecomendacaoMaterial ?? m.descricaoRecomendacaoMaterial,
              showMedicao: m.condicoesPagamento?.showMedicao,
              percentualMedicao: m.condicoesPagamento?.percentualMedicao,
              frequenciaMedicao: m.condicoesPagamento?.frequenciaMedicao,
              prazoPagamentoMedicao: m.condicoesPagamento?.prazoPagamentoMedicao,
              showSaldo: m.condicoesPagamento?.showSaldo,
              prazoSaldo: m.condicoesPagamento?.prazoSaldo,
              formaPagamento: m.condicoesPagamento?.formaPagamento,
              // Multas e Prazos
              multaDiaria: m.multa?.diaria,
              multaLimite: m.multa?.limite,
              validadeProposta: m.validade,
              prazoExecucao: m.prazoExecucao,
              obsPrazo: m.obsPrazo
            });
          }
          setIsLoading(false);
        })
        .catch(err => {
          alert("Erro ao carregar proposta de armazém");
          navigate("/propostas");
        });
    }
  }, [id]);

  if (isLoading) return <div className="p-10 text-muted">Carregando dados da proposta...</div>;

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step0TipoProposta data={formData} updateData={updateData} />;
      case 1: return <Step1Cliente data={formData} updateData={updateData} />;
      case 2: return <Step2Dimensoes data={formData} updateData={updateData} />;
      case 3: return <Step3Descricao data={formData} updateData={updateData} />;
      case 4:
        if (formData.modoProposta === 'so_obra') {
          return <Step4RecomendacaoMaterial data={formData} updateData={updateData} />;
        } else {
          return <Step4EscopoFornecimento data={formData} updateData={updateData} />;
        }
      case 5: return <Step5Opcionais data={formData} updateData={updateData} />;
      case 6: return <Step6Custos data={formData} updateData={updateData} />;
      case 7: return <Step7Impostos data={formData} updateData={updateData} />;
      case 8: return <Step8Condicoes data={formData} updateData={updateData} />;
      case 9: return <Step9Revisao data={formData} updateData={updateData} />;
      case 10: return <Step10Documento data={formData} updateData={updateData} companySettings={companySettings} />;
      default: return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.cliente || !formData.local || !formData.objeto;
    if (currentStep === 2) return !formData.largura || !formData.comprimento || !formData.rampa || !formData.espessura;
    if (currentStep === 6) return !formData.totalGeral;
    return false;
  };
  return (
    <div className="max-w-5xl mx-auto py-8">
      <button 
        onClick={() => navigate('/propostas/nova')}
        className="flex items-center gap-2 text-muted hover:text-white transition-colors font-bold mb-8"
      >
        <ArrowLeft size={20} />
        Voltar para Seleção de Tipo
      </button>

      {/* Progress Bar Header */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-surface -z-10 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-accent -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl
                  ${isActive ? 'bg-accent text-white scale-110' : 
                    isPast ? 'bg-accent/20 text-accent border border-accent/30' : 
                    'bg-surface text-muted border border-border'}`}
              >
                <Icon size={20} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-accent2' : isPast ? 'text-white' : 'text-muted'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-bg min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {currentStep < 10 && (
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border/50">
          <button
            onClick={handlePrev}
            className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-colors
              ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-muted hover:text-white hover:bg-surface'}`}
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          
          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="flex items-center gap-2 font-bold px-8 py-3 rounded-xl bg-surface border-2 border-border text-white hover:border-accent hover:text-accent2 transition-all disabled:opacity-50 disabled:hover:border-border disabled:hover:text-white"
          >
            Avançar <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ArmazemWizard;
