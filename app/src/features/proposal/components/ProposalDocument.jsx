import React from 'react';
import { fmt } from '../constants';

/**
 * ProposalDocument
 * Versão final otimizada para impressão sem cortes.
 * Utiliza o sistema de captura página por página (.pj-page).
 */
const ProposalDocument = React.forwardRef(({ cliente, items, cond, propNum, companySettings }, ref) => {
  const isContinuous = cond.tipoProposta === 'servico_continuo';
  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const todayDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  
  const primaryColor = companySettings?.primaryColor || '#1A5276'; 
  const textColor = '#333333';
  const mutedColor = '#666666';
  const borderColor = '#CCCCCC';

  // Distribuição de conteúdo para evitar cortes
  const descItemsP1 = items.slice(0, 7); // Cabeçalho + Dados + 7 itens cabem na P1
  const descItemsP2 = items.slice(7);    // Restante dos itens

  return (
    <div
      ref={ref}
      id="proposal-document"
      style={{
        width: '210mm',
        background: '#ffffff',
        color: '#333333', // FIXED: Força a cor do texto para não herdar branco do tema
        padding: '0 25mm',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* SECTION: Cabeçalho */}
      <div className="pdf-section" style={{ paddingTop: '25mm' }}>
        <Header primaryColor={primaryColor} settings={companySettings} />
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24pt', fontWeight: 'bold', color: '#000', margin: '0' }}>PROPOSTA COMERCIAL</h1>
          <div style={{ fontSize: '11pt', color: '#555' }}>Nº {propNum}</div>
        </div>
      </div>

      {/* SECTION: Dados da Proposta */}
      <div className="pdf-section">
        <SectionTitle title="DADOS DA PROPOSTA" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <tbody>
            <DataRow label="Cliente:" value={cliente.nome} border />
            <DataRow label="Contato:" value={`${cliente.contato}${cliente.cargo ? ` (${cliente.cargo})` : ''}`} border />
            <DataRow label="Local:" value={cliente.local} border />
            <DataRow label="Objeto:" value={cliente.objeto || 'Prestação de serviços e fornecimento de materiais em PEAD'} border />
          </tbody>
        </table>
      </div>

      {/* SECTION: Descrição dos Serviços */}
      <div className="pdf-section">
        <SectionTitle title="DESCRIÇÃO DOS SERVIÇOS" color={primaryColor} />
      </div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ marginBottom: '12px' }}>
          <div className="pdf-section" style={{ marginBottom: '3px' }}>
            <h3 style={{ fontSize: '11pt', fontWeight: 'bold', color: primaryColor, margin: '0' }}>
              Item {String(idx + 1).padStart(2, '0')} — {it.label}
            </h3>
          </div>
          <ParagraphSplitter text={it.description || 'Execução de serviços especializados Projing.'} style={{ fontSize: '10pt', color: mutedColor, textAlign: 'justify' }} />
        </div>
      ))}

      {/* SECTION: Valor da Proposta */}
      <div className="pdf-section">
        <SectionTitle title="VALOR DA PROPOSTA" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${borderColor}`, marginBottom: '10px' }}>
          <thead>
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <th style={thStyle}>ITEM</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>DESCRIÇÃO</th>
              <th style={thStyle}>UNID.</th>
              {isContinuous ? (
                <th style={{ ...thStyle, textAlign: 'right' }}>VALOR UNIT. (R$)</th>
              ) : (
                <>
                  <th style={thStyle}>QTD.</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>VALOR (R$)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <td colSpan={isContinuous ? 4 : 5} style={{ padding: '6px 12px', fontWeight: 'bold', fontSize: '9pt' }}>
                01 — DESCRIÇÃO DOS ITENS DA PROPOSTA
              </td>
            </tr>
            {items.map((it, idx) => (
              <tr key={it.id} style={{ background: idx % 2 ? '#F2F6FC' : '#fff' }}>
                <td style={tdStyle}>{String(idx + 1).padStart(2, '0')}</td>
                <td style={{ ...tdStyle, textAlign: 'left' }}>{it.label}</td>
                <td style={tdStyle}>{it.unit}</td>
                {isContinuous ? (
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>{fmt(it.price)}</td>
                ) : (
                  <>
                    <td style={tdStyle}>{it.qty}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>{fmt(parseFloat(it.qty) * parseFloat(it.price))}</td>
                  </>
                )}
              </tr>
            ))}
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <td colSpan={isContinuous ? 3 : 4} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>
                {isContinuous ? 'FATURAMENTO:' : 'TOTAL GERAL:'}
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>
                {isContinuous ? 'VALOR A APURAR CONFORME MEDIÇÃO' : fmt(total)}
              </td>
            </tr>
          </tbody>
        </table>
        {isContinuous && (
          <p style={{ fontSize: '8pt', color: mutedColor, marginTop: '8px', fontStyle: 'italic', marginBottom: '20px' }}>
            * Os quantitativos serão apurados por medição durante e após a execução dos serviços.
          </p>
        )}
      </div>

      {/* SECTION: Condições */}
      {cond.showPagamento !== false && (
        <div className="pdf-section">
          <SectionTitle title="FORMA DE PAGAMENTO" color={primaryColor} />
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
            {cond.showEntrada !== false && (cond.entrada || cond.prazoEntrada) && (
              <li style={liStyle}>
                {cond.entrada ? `${cond.entrada}% de entrada (mobilização)` : 'Entrada (mobilização)'}
                {cond.tipoPrazoEntrada === 'inicio'
                  ? ': pagamento no início da obra.'
                  : (cond.prazoEntrada ? `: pagamento em ${cond.prazoEntrada} dias.` : '.')}
              </li>
            )}

            {cond.showMedicao !== false && !isContinuous && (
              <li style={liStyle}>
                {cond.medicao ? `Saldo: medição a cada ${cond.medicao} dias.` : 'Saldo: conforme medição.'}
              </li>
            )}
            {cond.showMedicao !== false && isContinuous && (
              <li style={liStyle}>Faturamento baseado em medição periódica.</li>
            )}

            {cond.showNF !== false && cond.prazoNF && (
              <li style={liStyle}>Pagamento em até {cond.prazoNF} dias da entrega da NF.</li>
            )}

            <li style={liStyle}>Preços fixos e irreajustáveis.</li>

            {cond.showFormaPagamento !== false && cond.formaPagamento && (
              <li style={liStyle}>Pagamento via {cond.formaPagamento}.</li>
            )}

            {cond.showObsPagamento !== false && cond.obsPagamento && (
              <li style={liStyle}>{cond.obsPagamento}</li>
            )}
          </ul>
        </div>
      )}

      {/* SECTION: Garantias */}
      {cond.showGarantias !== false && (
        <div className="pdf-section">
          <SectionTitle title="GARANTIAS" color={primaryColor} />
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={liStyle}>{cond.garantiaFabrica || '5'} anos contra defeitos de fabricação e instalação (geomembrana).</li>
            <li style={liStyle}>{cond.garantiaInstalacao || '1'} ano contra acidentes de rasgamento, ruptura e furos.</li>
            <li style={liStyle}>Garantia técnica integral durante o período de execução.</li>
          </ul>
        </div>
      )}

      {/* SECTION: Impostos */}
      {cond.showImpostos !== false && (
        <div className="pdf-section">
          <SectionTitle title="QUADRO DE IMPOSTOS" color={primaryColor} />
          <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: primaryColor, color: '#fff' }}>
                <th style={thStyle}>CATEGORIA</th>
                <th style={thStyle}>IMPOSTO</th>
                <th style={thStyle}>%</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={tdStyle} rowSpan={2}>Serviço</td><td style={tdStyle}>DAS Federal</td><td style={tdStyle}>{cond.impostoDAS || '11,2'}%</td></tr>
              <tr><td style={tdStyle}>ISS</td><td style={tdStyle}>{cond.impostoISS || '2,79'}%</td></tr>
              <tr><td style={tdStyle} rowSpan={2}>Materiais</td><td style={tdStyle}>Geomembrana IPI</td><td style={tdStyle}>{cond.impostoIPI || '15'}%</td></tr>
              <tr><td style={tdStyle}>DIFAL</td><td style={tdStyle}>{cond.impostoDIFAL || '6'}%</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION: Multa Contratual */}
      {cond.showMultas !== false && (
        <div className="pdf-section">
          <SectionTitle title="MULTA CONTRATUAL" color={primaryColor} />
          <p style={{ fontSize: '10pt', marginBottom: '20px' }}>
            Multa por atraso na entrega da obra: {cond.multaDiaria || '0,3'}% ao dia, limitado a {cond.multaLimite || '10'}% do valor do contrato.
          </p>
        </div>
      )}

      {/* SECTION: Validade da Proposta */}
      {cond.showValidade !== false && cond.validade && (
        <div className="pdf-section">
          <SectionTitle title="VALIDADE DA PROPOSTA" color={primaryColor} />
          <p style={{ fontSize: '10pt', marginBottom: '20px' }}>
            {cond.validade} dias a partir da data de emissão.
          </p>
        </div>
      )}

      {/* SECTION: Prazo de Execução */}
      {cond.showPrazoExec !== false && cond.prazoExec && (
        <div className="pdf-section">
          <SectionTitle title="PRAZO DE EXECUÇÃO" color={primaryColor} />
          <p style={{ fontSize: '10pt', marginBottom: '10px' }}>
            {cond.prazoExec}
          </p>
          <p style={{ fontSize: '9pt', color: mutedColor, fontStyle: 'italic', textAlign: 'justify' }}>
            Obs.: O fator climático é determinante no cumprimento do prazo. As áreas devem estar isentas de conteúdos.
          </p>
        </div>
      )}

      {/* SECTION: Responsabilidade da Contratada */}
      {cond.responsabilidadeContratada && (
        <div className="pdf-section">
          <SectionTitle title="RESPONSABILIDADE DA CONTRATADA" color={primaryColor} />
          <ParagraphSplitter text={cond.responsabilidadeContratada} style={{ fontSize: '10pt', color: textColor, textAlign: 'justify' }} />
        </div>
      )}

      {/* SECTION: Observações Gerais */}
      {cond.showObs !== false && cond.obs && (
        <div className="pdf-section">
          <SectionTitle title="OBSERVAÇÕES GERAIS" color={primaryColor} />
          <ParagraphSplitter text={cond.obs} style={{ fontSize: '10pt', color: textColor, textAlign: 'justify' }} />
        </div>
      )}

      {/* SECTION: Assinatura e Rodapé Institucional */}
      <div className="pdf-section" style={{ paddingBottom: '25mm' }}>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <div style={{ fontSize: '10pt', marginBottom: '20px' }}>Marialva, PR — {todayDate}</div>
          <div style={{ fontSize: '14pt', fontWeight: 'bold', color: primaryColor, marginBottom: '5px' }}>J. Wilson Santos</div>
          <div style={{ fontSize: '10pt', color: '#555', marginBottom: '30px' }}>(44) 9 9813-9141</div>
          <div style={{ fontSize: '10pt', fontStyle: 'italic', color: mutedColor }}>Somos gratos por participarmos deste projeto.</div>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #E67E22' }}>
          <div style={{ fontSize: '14pt', fontWeight: 'bold', color: '#E67E22', textAlign: 'center', marginBottom: '8px', letterSpacing: '1px' }}>
            PROJING — 15 ANOS DE EXPERIÊNCIA
          </div>
          <p style={{ fontSize: '9pt', color: mutedColor, textAlign: 'center', fontStyle: 'italic', lineHeight: '1.5', maxWidth: '80%', margin: '0 auto 20px' }}>
            Há mais de 15 anos atuamos com excelência no setor de infraestrutura industrial e ambiental, oferecendo soluções completas em geomembrana PEAD e tratamento de efluentes.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ padding: '14px 16px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '3px solid #1A5276' }}>
              <div style={{ fontSize: '9pt', fontWeight: 'bold', color: '#1A5276', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #E0E0E0' }}>
                Revestimentos
              </div>
              <div style={{ fontSize: '10pt', color: '#333', lineHeight: '1.6' }}>
                <div>• Reservatórios</div>
                <div>• Silos</div>
                <div>• Armazéns graneleiros</div>
                <div>• Moegas</div>
              </div>
            </div>
            <div style={{ padding: '14px 16px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '3px solid #1A5276' }}>
              <div style={{ fontSize: '9pt', fontWeight: 'bold', color: '#1A5276', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #E0E0E0' }}>
                Infraestrutura &amp; Tratamento
              </div>
              <div style={{ fontSize: '10pt', color: '#333', lineHeight: '1.6' }}>
                <div>• Tubulações em PEAD</div>
                <div>• Tratamento de esgoto</div>
                <div>• Tratamento de efluentes</div>
                <div>• Águas industriais</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── Estilos Auxiliares ───────────────────────────────────────────────────────

const pageStyle = {
  width: '210mm',
  minHeight: '297mm',
  padding: '25mm 25mm',
  background: '#ffffff',
  boxSizing: 'border-box',
  position: 'relative',
  color: '#333'
};

const pageInnerStyle = {
  width: '100%',
  paddingBottom: '25mm'
};

import logoProjing from '../../../../logo.svg';

const Header = ({ primaryColor, settings }) => {
  const cName = (settings?.companyName || 'PROJING').toUpperCase();
  const isProjing = cName === 'PROJING';
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div>
          {isProjing ? (
            <img src={logoProjing} alt="PROJING" style={{ height: '75px', objectFit: 'contain' }} />
          ) : (
            <>
              <div style={{ fontSize: '26pt', fontWeight: '900', color: '#333', letterSpacing: '-1px', lineHeight: '1' }}>
                {cName}
              </div>
              <div style={{ fontSize: '8pt', color: '#666', fontWeight: 'bold', marginTop: '2px', letterSpacing: '1px' }}>SOLUÇÕES EM PEAD</div>
            </>
          )}
        </div>
        <div style={{ width: '2px', height: '75px', background: primaryColor, marginLeft: '5px' }} />
      </div>
      <div style={{ textAlign: 'right', fontSize: '8pt', color: '#333', lineHeight: '1.6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.phone || '(44) 9 9813-9141'} <span style={{ color: primaryColor, marginLeft: '4px' }}>✆</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.email || 'projingehbengenharia@hotmail.com'} <span style={{ color: primaryColor, marginLeft: '4px' }}>✉</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.website || 'www.projing.pro'} <span style={{ color: primaryColor, marginLeft: '4px' }}>🌐</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          CNPJ {settings?.cnpj || '54.348.703/0001-34'} <span style={{ color: primaryColor, marginLeft: '4px' }}>#</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.address || 'Rua João Hungari, 575, Marialva PR, CEP 86990-000'} <span style={{ color: primaryColor, marginLeft: '4px' }}>📍</span>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, color }) => (
  <div style={{
    color: color,
    fontWeight: 'bold',
    fontSize: '15pt',
    borderBottom: `3px solid ${color}`,
    paddingBottom: '6px',
    marginTop: '30px',
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }}>{title}</div>
);

const ParagraphSplitter = ({ text, style }) => {
  if (!text) return null;
  if (typeof text !== 'string') {
    return (
      <div className="pdf-section" style={{ marginBottom: '6px' }}>
        <p style={{ ...style, margin: 0 }}>{text}</p>
      </div>
    );
  }
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  return (
    <>
      {paragraphs.map((p, i) => (
        <div key={i} className="pdf-section" style={{ marginBottom: '6px' }}>
          <p style={{ ...style, margin: 0 }}>{p}</p>
        </div>
      ))}
    </>
  );
};

const DataRow = ({ label, value, border }) => (
  <tr style={{ borderBottom: border ? '1px solid #eee' : 'none' }}>
    <td style={{ padding: '6px 0', width: '100px', fontWeight: 'bold', verticalAlign: 'top', fontSize: '10pt' }}>{label}</td>
    <td style={{ padding: '6px 0', fontSize: '10pt' }}>{value || '—'}</td>
  </tr>
);

const thStyle = { padding: '6px 10px', fontSize: '9pt', fontWeight: 'bold', textAlign: 'center' };
const tdStyle = { padding: '6px 10px', fontSize: '9pt', textAlign: 'center', border: '1px solid #CCCCCC' };
const liStyle = { marginBottom: '6px', fontSize: '10pt', textAlign: 'justify' };

ProposalDocument.displayName = 'ProposalDocument';
export default ProposalDocument;
