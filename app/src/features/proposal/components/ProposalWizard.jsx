import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stepper from '../../../shared/Stepper';
import StepCliente from './StepCliente';
import StepServicos from './StepServicos';
import StepCondicoes from './StepCondicoes';
import StepRevisao from './StepRevisao';
import { fetchCatalog, saveProposal, updateProposal, fetchSettings, fetchProposalById } from '../../../shared/services/api';
import Button from '../../../shared/Button';
import { motion } from 'framer-motion';

import { CATALOG } from '../constants';

const STEPS = ["Cliente", "Serviços", "Condições", "Revisão"];

const VALID_PAYMENT_METHODS = ['depósito bancário', 'transferência bancária', 'boleto', 'PIX'];

const isLegacyPaymentTerm = (term) => {
  if (!term) return false;
  if (VALID_PAYMENT_METHODS.includes(term)) return false;
  return term.length > 30;
};

const parseObservations = (raw) => {
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

const combineObservations = (obsPagamento, obs) => {
  const pg = (obsPagamento || '').trim();
  const ob = (obs || '').trim();
  if (pg && ob) return `[PAGAMENTO] ${pg}\n\n${ob}`;
  if (pg) return `[PAGAMENTO] ${pg}`;
  return ob;
};

const ProposalWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(!!id);
  const [propNum, setPropNum] = useState(() => {
    const y = new Date().getFullYear();
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    const n = String(Math.floor(Math.random() * 900) + 100);
    return `${y}-${m}-${n}`;
  });

  const [cliente, setCliente] = useState({ nome: "", contato: "", cargo: "", local: "", tel: "", objeto: "" });
  const [items, setItems] = useState([]);
  const [cond, setCond] = useState({
    entrada: "20",
    prazoEntrada: "45",
    tipoPrazoEntrada: "dias",
    medicao: "10",
    prazoNF: "60",
    validade: "60",
    prazoExec: "",
    formaPagamento: "",
    obsPagamento: "",
    showEntrada: true,
    showMedicao: true,
    showNF: true,
    showFormaPagamento: true,
    showObsPagamento: true,
    obs: "",
      responsabilidadeContratada: "",
      tipoProposta: "valor_fechado"
    });
  const [isDone, setIsDone] = useState(false);
  const [companySettings, setCompanySettings] = useState(null);

  useEffect(() => {
    // 1. Carrega configurações
    fetchSettings()
      .then(data => {
        setCompanySettings(data);
        if (data && !id) { // Só aplica defaults se não for edição
          setCond(prev => ({
            ...prev,
            entrada: data.defaultEntrada,
            prazoEntrada: data.defaultPrazoEntrada,
            medicao: data.defaultMedicao,
            prazoNF: data.defaultPrazoNF,
            validade: data.defaultValidade,
            formaPagamento: data.defaultFormaPagamento,
          }));
        }
      })
      .catch(console.error);

    // 2. Se for edição, carrega a proposta
    if (id) {
      fetchProposalById(id)
        .then(p => {
          setPropNum(p.number);
          setCliente({
            nome: p.clientName || "",
            contato: p.clientContact || "",
            cargo: p.clientRole || "",
            local: p.location || "",
            tel: p.phone || "",
            objeto: p.object || ""
          });
          setItems(p.items.map(it => ({
            id: it.catalogId,
            label: it.label,
            unit: it.unit,
            qty: it.quantity,
            price: it.unitPrice
          })));
          
          if (p.conditions && p.conditions.length > 0) {
            const c = p.conditions[0];
            const legacyTerm = c.paymentTerms || "";
            const migratedFromTerm = isLegacyPaymentTerm(legacyTerm) ? legacyTerm : "";
            const formaPagamentoFinal = isLegacyPaymentTerm(legacyTerm) ? "" : legacyTerm;
            const { obsPagamento: obsPagFromObs, obs: obsFinal } = parseObservations(c.observations || "");
            setCond({
              entrada: String(c.downPayment || ""),
              prazoEntrada: String(c.downPaymentDays || ""),
              tipoPrazoEntrada: c.downPaymentOnStart ? "inicio" : "dias",
              medicao: String(c.measurementDays || ""),
              prazoNF: String(c.paymentNfDays || ""),
              validade: String(c.validadeDays || ""),
              prazoExec: c.executionPeriod || "",
              formaPagamento: formaPagamentoFinal,
              obsPagamento: obsPagFromObs || migratedFromTerm,
              obs: obsFinal,
              responsabilidadeContratada: p.metadata?.responsabilidadeContratada || "",
              tipoProposta: p.metadata?.tipoProposta || "valor_fechado"
            });
          }
          setIsLoading(false);
        })
        .catch(err => {
          alert("Erro ao carregar proposta para edição");
          navigate("/propostas");
        });
    }
  }, [id]);

  const handleGenerate = async () => {
    try {
      const metadata = {
        responsabilidadeContratada: cond.responsabilidadeContratada,
      };
      const condToSave = {
        ...cond,
        downPaymentOnStart: cond.tipoPrazoEntrada === 'inicio',
        obs: combineObservations(cond.obsPagamento, cond.obs)
      };
      if (id) {
        await updateProposal(id, { cliente, items, cond: condToSave, propNum, metadata });
      } else {
        await saveProposal({ cliente, items, cond: condToSave, propNum, metadata });
      }
    } catch (err) {
      console.error(err);
    }
    setIsDone(true);
  };

  const reset = () => {
    setStep(0);
    setIsDone(false);
    setCliente({ nome: "", contato: "", cargo: "", local: "", tel: "", objeto: "" });
    setItems([]);
    setCond({
      entrada: companySettings?.defaultEntrada || "20",
      prazoEntrada: companySettings?.defaultPrazoEntrada || "45",
      tipoPrazoEntrada: "dias",
      medicao: companySettings?.defaultMedicao || "10",
      prazoNF: companySettings?.defaultPrazoNF || "60",
      validade: companySettings?.defaultValidade || "60",
      prazoExec: "",
      formaPagamento: companySettings?.defaultFormaPagamento || "",
      obsPagamento: "",
      showEntrada: true,
      showMedicao: true,
      showNF: true,
      showFormaPagamento: true,
      showObsPagamento: true,
      obs: "",
      responsabilidadeContratada: "",
      tipoProposta: "valor_fechado"
    });
  };

  if (isDone) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 space-y-8"
      >
        <div className="text-7xl mb-4">✅</div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black font-syne text-white">Proposta Gerada!</h2>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            O PDF foi baixado para o seu dispositivo.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button variant="ghost" onClick={reset} className="px-10">
            + Nova Proposta
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black text-xl">P</div>
            <div>
              <div className="font-syne font-black text-lg leading-none">Projing<span className="text-accent2">Pro</span></div>
              <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">SaaS de Orçamentos</div>
            </div>
          </div>
          <div className="text-[11px] font-bold text-muted bg-surface px-4 py-2 rounded-full border border-border">
            PROPOSTA: <span className="text-white ml-1">{propNum}</span>
          </div>
        </div>
        
        <Stepper current={step} steps={STEPS} />
      </div>

      <div className="min-h-[400px]">
        {step === 0 && <StepCliente data={cliente} onChange={setCliente} onNext={() => setStep(1)} />}
        {step === 1 && (
          <StepServicos
            items={items}
            onChange={setItems}
            tipoProposta={cond.tipoProposta}
            onTipoChange={(val) => setCond(prev => ({ ...prev, tipoProposta: val }))}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
            companySettings={companySettings}
          />
        )}
        {step === 2 && <StepCondicoes data={cond} onChange={setCond} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepRevisao cliente={cliente} items={items} cond={cond} propNum={propNum} companySettings={companySettings} onBack={() => setStep(2)} onGenerate={handleGenerate} />}
      </div>
    </div>
  );
};

export default ProposalWizard;
