import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, Warehouse, ArrowRight } from 'lucide-react';

const SelectProposalType = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black font-syne text-white">Selecione o Tipo de Orçamento</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Escolha o modelo adequado para iniciar a estruturação da sua proposta comercial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Opção: Geral */}
        <button 
          onClick={() => navigate('/propostas/nova/geral')}
          className="bg-surface border-2 border-border p-8 rounded-3xl text-left hover:border-accent hover:bg-accent/5 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-10 group-hover:bg-accent/20 transition-colors" />
          
          <div className="w-16 h-16 bg-bg border-2 border-border rounded-2xl flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
            <Settings className="text-accent2" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold font-syne text-white mb-3">Geral / Padrão</h2>
          <p className="text-muted mb-6 leading-relaxed">
            Orçamento flexível contendo serviços de mão de obra e materiais diversos em PEAD, seja por valor fechado ou medição contínua.
          </p>
          
          <div className="flex items-center gap-2 font-bold text-accent2 text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Iniciar Geral <ArrowRight size={16} />
          </div>
        </button>

        {/* Opção: Armazém */}
        <button 
          onClick={() => navigate('/propostas/nova/armazem')}
          className="bg-surface border-2 border-border p-8 rounded-3xl text-left hover:border-gold hover:bg-gold/5 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -z-10 group-hover:bg-gold/20 transition-colors" />
          
          <div className="w-16 h-16 bg-bg border-2 border-border rounded-2xl flex items-center justify-center mb-6 group-hover:border-gold transition-colors">
            <Warehouse className="text-gold" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold font-syne text-white mb-3">Armazém</h2>
          <p className="text-muted mb-6 leading-relaxed">
            Módulo específico para projetos estruturais de armazéns, contendo lógica automatizada de cálculo de obras e dimensionamento de materiais.
          </p>
          
          <div className="flex items-center gap-2 font-bold text-gold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Iniciar Armazém <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default SelectProposalType;
