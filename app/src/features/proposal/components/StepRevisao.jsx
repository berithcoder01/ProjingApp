import React, { useState } from 'react';
import { ArrowLeft, Download, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../../shared/Button';
import ProposalDocument from './ProposalDocument';
import MaterialDocument from './MaterialDocument';
import { generateProposalPDF, generateMaterialPDF } from '../services/pdfService';

const StepRevisao = ({ cliente, items, cond, propNum, companySettings, onBack, onGenerate, tipo = 'geral' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const isMaterial = tipo === 'material';

  const handleGenerate = async () => {
    setIsGenerating(true);
    const ok = isMaterial
      ? await generateMaterialPDF({ propNum, cliente, items, cond, companySettings })
      : await generateProposalPDF({ propNum, cliente, items, cond, companySettings });
    setIsGenerating(false);
    if (ok) onGenerate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold font-syne mb-2">Revisão da Proposta</h2>
        <p className="text-muted text-sm">
          Confira o documento abaixo — ele será gerado <strong className="text-white">exatamente assim</strong> em PDF.
        </p>
      </div>

      {/* Preview do documento */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-2xl">
        {/* Barra de escala visual */}
        <div className="bg-surface px-4 py-2 border-b border-border flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger/70" />
          <div className="w-3 h-3 rounded-full bg-gold/70" />
          <div className="w-3 h-3 rounded-full bg-success/70" />
          <span className="ml-3 text-[10px] font-bold text-muted uppercase tracking-widest">Preview — Proposta {propNum}</span>
        </div>

        {/* Documento renderizado — escala para caber na tela */}
        <div
          className="overflow-auto bg-[#e8e8e8] p-6"
          style={{ maxHeight: '70vh' }}
        >
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'top center' }}>
            {isMaterial ? (
              <MaterialDocument
                cliente={cliente}
                items={items}
                cond={cond}
                propNum={propNum}
                companySettings={companySettings}
              />
            ) : (
              <ProposalDocument
                cliente={cliente}
                items={items}
                cond={cond}
                propNum={propNum}
                companySettings={companySettings}
              />
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2" disabled={isGenerating}>
          <ArrowLeft size={18} /> Voltar
        </Button>

        <Button
          variant="success"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-3 px-10"
        >
          {isGenerating ? (
            <>
              <Loader size={18} className="animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              Baixar PDF
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepRevisao;
