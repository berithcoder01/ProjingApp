import React from 'react';
import Input from '../../../../shared/Input';
import { Shield, Zap, FileCheck } from 'lucide-react';

const CONDIcoES_FATURAMENTO_PADRAO = `Condições de Faturamento Direto para a Contratante

a. A contratante só emitirá pedido de compra para faturamento direto até o valor previsto no contrato. Caso a contratada necessite adquirir materiais além do valor previsto, deverá fazê-lo diretamente com os fornecedores, que emitirão nota fiscal para a contratada. O valor previsto em contrato para faturamento direto deve embutir eventuais diferenciais de alíquota de ICMS pagos pela contratante.

• Executar imediatamente os reparos necessários nos serviços de sua responsabilidade;
• Assumir integral responsabilidade por danos causados à contratante ou a terceiros, decorrentes dos serviços contratados;
• Descarga e movimentação dos materiais destinados à obra;
• Apresentar ao departamento de pessoal da contratante os documentos de cada funcionário alocado na obra (carteira de trabalho e registro);
• Técnico em segurança do trabalho em tempo integral no canteiro de obras (caso necessário);
• Guarda de materiais, equipamentos e ferramentas;
• Todas as entregas CIF, inclusive de terceiros;
• Apresentar contratos com subcontratados para a contratante, caso exista;
• Após a conclusão do serviço, desmontar e desmobilizar o canteiro, bem como limpar todas as áreas utilizadas pela contratada;
• Retirar toda a sobra de materiais, que será de sua propriedade;
• Seguir rigorosamente as normas de segurança vigentes e as normas internas da contratante.

Garantias:
• GeoMembrana (Material, frete e impostos): Previsto conforme cálculo técnico.
• Mão de obra de aplicação e materiais (instalação, chumbadores, materiais de consumo, material da linha de vida, despesas com pessoal e EPIs).

b. Caso o valor previsto para faturamento direto não seja alcançado, o saldo será ajustado no final do contrato através de aditivo que permitirá adicionar este saldo ao valor da contratada e reduzir o mesmo valor previsto para faturamento direto. O valor global não será alterado.

c. Em caso de sobra de material adquirido via faturamento direto, a contratada deverá realizar a retirada total da sobra ao final da obra, sem custo para a contratante.

d. A contratada deverá apresentar a documentação dos fornecedores para aprovação prévia da contratante.

e. A contratada deverá apresentar proposta dos fornecedores com antecedência de 15 dias da necessidade da colocação do pedido (30 dias para contratos/locação).

f. As propostas deverão ser na condição CIP (posto obra), caso contrário, a contratada deverá assumir o frete.

g. Preferencialmente, os pagamentos serão em 28 dias do faturamento.

h. A contratada é responsável pelas quantidades, prazos, qualidade e valores das aquisições de faturamento direto.

i. Só poderá ser faturado diretamente o material geomembrana. Não poderão ser faturados serviços.

j. As propostas serão avaliadas pela área técnica da contratante.

k. O valor de cada proposta deverá ser maior que R$ 50.000,00.

l. Não haverá emissão de nota fiscal de natureza de entrega futura.

m. Todas as sobras de materiais adquiridos por faturamento direto serão de propriedade da PROJING & HB ENGENHARIA e poderão ser retiradas ao finalizar a obra.`;

const Step5Opcionais = ({ data, updateData }) => {
  const handleCheckbox = (field) => (e) => {
    const checked = e.target.checked;
    updateData(field, checked);
    
    // Se ativar faturamento direto e o texto estiver vazio, carrega o padrão
    if (field === 'faturamentoDireto' && checked && !data.condicoesFaturamento) {
      updateData('condicoesFaturamento', CONDIcoES_FATURAMENTO_PADRAO);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-syne text-white">Opções e Garantias</h2>
        <p className="text-muted text-sm mt-1">
          Configure garantias, fornec. do cliente e condições de faturamento direto.
        </p>
      </div>

      {/* Garantias */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Shield size={18} className="text-accent2" /> Garantias
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              Defeitos Fabricação (anos)
            </label>
            <input 
              type="number"
              value={data.garantiaDefeitos || '5'}
              onChange={(e) => updateData('garantiaDefeitos', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              Acidentes (anos)
            </label>
            <input 
              type="number"
              value={data.garantiaAcidentes || '1'}
              onChange={(e) => updateData('garantiaAcidentes', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
              Durabilidade Estimada (anos)
            </label>
            <input 
              type="number"
              value={data.durabilidade || '30'}
              onChange={(e) => updateData('durabilidade', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">
            Vistorias Programadas (anos)
          </label>
          <input 
            type="text"
            value={data.vistorias || '1º, 3º e 5º ano'}
            onChange={(e) => updateData('vistorias', e.target.value)}
            placeholder="Ex: 1º, 3º e 5º ano"
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Fornecimento do Cliente */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Zap size={18} className="text-gold" /> Fornecimento do Cliente
        </h3>
        
        <div>
          <textarea 
            value={data.fornecimentoCliente || ''}
            onChange={(e) => updateData('fornecimentoCliente', e.target.value)}
            placeholder="Ex: Energia elétrica 220V (até 100 m)"
            className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent h-20 resize-none"
          />
        </div>
      </div>

      {/* Condições de Faturamento Direto */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <FileCheck size={18} className="text-success" /> Condições de Faturamento Direto
        </h3>
        
        <label className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-surface-hover cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 accent-accent2"
            checked={data.faturamentoDireto || false}
            onChange={handleCheckbox('faturamentoDireto')}
          />
          <div>
            <div className="font-bold text-white">Aplicar Faturamento Direto</div>
            <div className="text-sm text-muted">Adiciona as regras de compra de material direto ao documento.</div>
          </div>
        </label>

        {data.faturamentoDireto && (
          <div className="mt-4 pl-4 border-l-2 border-accent2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-accent2 uppercase tracking-widest ml-1">
                Condições de Faturamento Direto
              </label>
              <button 
                onClick={() => updateData('condicoesFaturamento', CONDIcoES_FATURAMENTO_PADRAO)}
                className="text-[10px] font-bold text-muted hover:text-white transition-colors underline"
              >
                Restaurar Padrão
              </button>
            </div>
            <textarea 
              value={data.condicoesFaturamento || ''}
              onChange={(e) => updateData('condicoesFaturamento', e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent h-48 resize-none text-sm"
              placeholder="Condições de faturamento direto..."
            />
          </div>
        )}
      </div>

      {/* Prazos */}
      <div className="bg-surface border-2 border-border p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white">Prazos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Prazo de Execução (Dias por Armazém)" 
            type="number"
            value={data.prazoExecucao || ''}
            onChange={(e) => updateData('prazoExecucao', e.target.value)}
            placeholder="Ex: 45"
          />
          <Input 
            label="Prazo de Pagamento (Dias)" 
            type="number"
            value={data.prazoPagamento || ''}
            onChange={(e) => updateData('prazoPagamento', e.target.value)}
            placeholder="Ex: 28"
          />
        </div>
      </div>
    </div>
  );
};

export default Step5Opcionais;