import React from 'react';
import { Package, HardHat, CheckCircle } from 'lucide-react';

const Step0TipoProposta = ({ data, updateData }) => {
  const selecionado = data.modoProposta || 'completo';

  const handleSelect = (modo) => {
    updateData('modoProposta', modo);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Tipo de Proposta</h2>
        <p className="text-muted text-sm mt-1">
          Escolha o escopo da proposta: fornecimento completo (material + mão de obra) ou apenas execução (mão de obra).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Material + Mão de Obra */}
        <button
          onClick={() => handleSelect('completo')}
          className={`text-left p-8 rounded-2xl border-2 transition-all duration-300 ${
            selecionado === 'completo'
              ? 'border-accent bg-surface shadow-xl shadow-accent/10 scale-[1.02]'
              : 'border-border bg-bg hover:border-accent/40 hover:bg-surface/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              selecionado === 'completo' ? 'bg-accent text-white' : 'bg-surface text-muted'
            }`}>
              <Package size={26} />
            </div>
            {selecionado === 'completo' && (
              <CheckCircle size={22} className="text-accent2" />
            )}
          </div>
          <h3 className="text-lg font-black font-syne text-white mb-2">
            Material + Mão de Obra
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Fornecimento da geomembrana PEAD, accesórios e execução completa do revestimento.
            A proposta inclui material, frete, impostos do produto e instalação.
          </p>
        </button>

        {/* Só Mão de Obra */}
        <button
          onClick={() => handleSelect('so_obra')}
          className={`text-left p-8 rounded-2xl border-2 transition-all duration-300 ${
            selecionado === 'so_obra'
              ? 'border-accent bg-surface shadow-xl shadow-accent/10 scale-[1.02]'
              : 'border-border bg-bg hover:border-accent/40 hover:bg-surface/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              selecionado === 'so_obra' ? 'bg-accent text-white' : 'bg-surface text-muted'
            }`}>
              <HardHat size={26} />
            </div>
            {selecionado === 'so_obra' && (
              <CheckCircle size={22} className="text-accent2" />
            )}
          </div>
          <h3 className="text-lg font-black font-syne text-white mb-2">
            Só Mão de Obra
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Execução do revestimento em geomembrana PEAD fornecida pelo cliente.
            A proposta cobre mão de obra, materiais de consumo e ferramentas — sem fornecimento de geomembrana.
          </p>
        </button>
      </div>

      {selecionado === 'so_obra' && (
        <div className="bg-gold/10 border-2 border-gold/30 p-4 rounded-xl">
          <p className="text-gold text-sm font-bold">
            Modo "Só Mão de Obra" selecionado.
          </p>
          <p className="text-gold/80 text-xs mt-1">
            A estimativa de material continuará sendo calculada para dimensionar a mão de obra,
            mas o documento final não incluirá fornecimento de geomembrana. Você poderá registrar
            uma recomendação técnica de material no Step 4.
          </p>
        </div>
      )}
    </div>
  );
};

export default Step0TipoProposta;
