import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, ArrowRight } from 'lucide-react';
import Button from '../../../../shared/Button';
import { saveProposal } from '../../../../shared/services/api';
import { useNavigate } from 'react-router-dom';
import { fmt } from '../constants';

const Step5Documento = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Formata a payload para o backend genérico de proposals
      const payload = {
        title: `Armazém - ${data.cliente} (${data.referencia})`,
        clientName: data.cliente,
        value: data.totalGeral,
        status: 'DRAFT',
        metadata: {
          tipo: 'armazem',
          geometria: data._calculo?.geometria,
          areas: data._calculo?.areas,
          material: data._calculo?.material,
          opcionais: {
            linhaVida: !!data.incluirLinhaVida,
            tubulacao: !!data.retirarTubulacao,
            faturamentoDireto: !!data.faturamentoDireto
          },
          prazos: {
            execucao: data.prazoExecucao,
            pagamento: data.prazoPagamento
          },
          valores: {
            material: parseFloat(data.valorMaterialManual),
            maoDeObra: parseFloat(data.valorMaoDeObra),
            totalGeral: data.totalGeral
          }
        }
      };

      await saveProposal(payload);
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (success) {
    return (
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
          Os dados do armazém foram salvos no pipeline. Em breve, a geração de documento PDF/DOCX específico para armazéns estará disponível.
        </p>
        <div className="pt-8">
          <Button onClick={() => navigate('/propostas')} className="px-8 py-3">
            Ir para Pipeline
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Revisão Final</h2>
        <p className="text-muted text-sm mt-1">Confira os dados do armazém antes de salvar a proposta.</p>
      </div>

      <div className="bg-surface p-6 rounded-2xl border-2 border-border grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Cliente / Obra</div>
            <div className="text-white font-bold">{data.cliente} - {data.local}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Dimensões Base</div>
            <div className="text-white text-sm">Largura: {data.largura}m | Rampa: {data.comprimento}m | Geo: {data.espessura}mm</div>
          </div>
          <div>
            <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Opcionais Inclusos</div>
            <ul className="text-white text-sm list-disc pl-4 mt-1">
              {data.incluirLinhaVida && <li>Linha de Vida</li>}
              {data.retirarTubulacao && <li>Retirada de Tubulação</li>}
              {data.faturamentoDireto && <li>Faturamento Direto</li>}
              {!data.incluirLinhaVida && !data.retirarTubulacao && !data.faturamentoDireto && <li className="text-muted list-none -ml-4">Nenhum adicional</li>}
            </ul>
          </div>
        </div>

        <div className="bg-bg p-6 rounded-xl border border-border flex flex-col justify-center items-center text-center space-y-2">
          <div className="text-[10px] text-muted uppercase font-bold tracking-widest">Valor Final (Material + M.O.)</div>
          <div className="text-4xl font-black font-syne text-accent2">{fmt(data.totalGeral || 0)}</div>
        </div>
      </div>

      {error && <div className="text-danger font-bold text-center">{error}</div>}

      <div className="flex justify-center pt-8">
        <Button 
          onClick={handleSave} 
          disabled={isGenerating || !data.totalGeral}
          className="px-12 py-4 text-lg flex items-center gap-3"
        >
          {isGenerating ? 'Salvando...' : 'Salvar Proposta'}
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Step5Documento;
