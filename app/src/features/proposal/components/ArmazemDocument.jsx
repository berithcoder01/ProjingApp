import React from 'react';
import { fmt } from '../constants';
import { Phone, Mail, Globe, MapPin, Hash } from 'lucide-react';

// Calcula metros de cabo: (LARGURA×2 + COMPRIMENTO×2) + 5%
const calcMetrosCabo = (largura, comprimento) => {
  const l = parseFloat(largura) || 0;
  const c = parseFloat(comprimento) || 0;
  return Math.ceil((l * 2 + c * 2) * 1.05);
};

const ArmazemDocument = React.forwardRef(({ data, companySettings }, ref) => {
  const calc = data._calculo || {};
  const primaryColor = companySettings?.primaryColor || '#1A5276';
  const textColor = '#333333';
  const mutedColor = '#666666';
  const borderColor = '#CCCCCC';

  // Fallbacks para condições de pagamento
  const showEntrada = data.showEntrada !== false;
  const percentualEntrada = data.percentualEntrada || '15';
  const prazoEntrada = data.prazoEntrada || '28';

  const showMaterial = data.showMaterial !== false;
  const percentualMaterial = data.percentualMaterial || '40';
  const prazoMaterial = data.prazoMaterial || '28';

  const showMedicao = !!data.showMedicao;
  const percentualMedicao = data.percentualMedicao || '0';
  const frequenciaMedicao = data.frequenciaMedicao || '30';
  const prazoPagamentoMedicao = data.prazoPagamentoMedicao || '28';

  const showSaldo = data.showSaldo !== false;
  const prazoSaldo = data.prazoSaldo || '28';
  const formaPagamento = data.formaPagamento || 'depósito bancário';
  const validadeProposta = data.validadeProposta || '60';
  const prazoExecucao = data.prazoExecucao || '45';

  const calculateSaldo = () => {
    let total = 100;
    if (showEntrada) total -= parseFloat(percentualEntrada || 0);
    if (showMaterial) total -= parseFloat(percentualMaterial || 0);
    if (showMedicao) total -= parseFloat(percentualMedicao || 0);
    return Math.max(0, total);
  };

  const todayDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const cidade = data.local?.split(',')[0] || 'Marialva';

  // Verifica se temos faturamento direto para decidir a estrutura de páginas
  const temFaturamentoDireto = !!(data.faturamentoDireto && data.condicoesFaturamento);

    return (
    <div
      ref={ref}
      id="armazem-proposal-document"
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
          <h1 style={{ fontSize: '26pt', fontWeight: 'bold', color: '#000', margin: '0', letterSpacing: '2px' }}>PROPOSTA COMERCIAL</h1>
          <div style={{ fontSize: '12pt', color: '#555', fontWeight: 'bold', marginTop: '5px' }}>{data.numeroProposta}</div>
        </div>
      </div>

      {/* SECTION: Dados da Proposta */}
      <div className="pdf-section">
        <SectionTitle title="DADOS DA PROPOSTA" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
          <tbody>
            {data.referencia && <DataRow label="Referência / Capacidade:" value={data.referencia} border />}
            <DataRow label="Cliente:" value={data.cliente} border />
            <DataRow label="Contato:" value={data.contato} border />
            <DataRow label="Local:" value={data.local} border />
            <DataRow label="Objeto:" value={data.objeto || 'Revestimento interno de armazém graneleiro em PEAD'} border />
          </tbody>
        </table>
      </div>

      {/* SECTION: Descrição */}
      <div className="pdf-section">
        <SectionTitle title="DESCRIÇÃO DOS SERVIÇOS" color={primaryColor} />
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 'bold', color: primaryColor, margin: '0 0 8px' }}>
            Item 01.01 — Revestimento de Rampas e Peitos (Armazém Graneleiro)
          </h3>
        </div>
      </div>
      <ParagraphSplitter text={data.descricaoServico} style={{ fontSize: '10pt', color: textColor, textAlign: 'justify', lineHeight: '1.5' }} />

      {/* SECTION: Características */}
      {data.caracteristicasMaterial && (
        <div className="pdf-section" style={{ padding: '20px', background: '#f8f9fa', border: `1px solid ${borderColor}`, borderRadius: '10px', marginBottom: '30px' }}>
          <strong style={{ fontSize: '11pt', color: primaryColor, display: 'block', marginBottom: '10px', textTransform: 'uppercase' }}>Características Técnicas do Material:</strong>
          <ParagraphSplitter text={data.caracteristicasMaterial} style={{ fontSize: '10pt', color: textColor, lineHeight: '1.6' }} />
        </div>
      )}

      {/* SECTION: Escopo e Responsabilidades */}
      <div className="pdf-section">
        <SectionTitle title="ESCOPO E RESPONSABILIDADES" color={primaryColor} />
        <div style={{ marginBottom: '8px' }}>
          <h4 style={{ fontSize: '11pt', fontWeight: 'bold', color: primaryColor, margin: '0 0 10px' }}>Responsabilidades da Contratada</h4>
        </div>
      </div>
      <ParagraphSplitter text={data.escopoResponsabilidades || '• Mão de obra e materiais\n• Equipamentos e ferramentas\n• EPIs para toda equipe'} style={{ fontSize: '10pt', color: textColor, lineHeight: '1.5', marginBottom: '8px' }} />
      
      <div className="pdf-section">
        <div style={{ marginTop: '15px', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '11pt', fontWeight: 'bold', color: primaryColor, margin: '0 0 10px' }}>Itens Inclusos no Fornecimento</h4>
        </div>
      </div>
      <ParagraphSplitter text={data.itensInclusos} style={{ fontSize: '10pt', color: textColor, lineHeight: '1.5', marginBottom: '8px' }} />

      {data.fornecimentoCliente && (
        <div style={{ padding: '15px', borderLeft: `5px solid ${primaryColor}`, background: '#fcfcfc', borderRadius: '0 8px 8px 0', marginBottom: '25px', marginTop: '15px' }}>
          <div className="pdf-section">
            <strong style={{ fontSize: '10pt', color: primaryColor, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Fornecimento por conta do Cliente:</strong>
          </div>
          <ParagraphSplitter text={data.fornecimentoCliente} style={{ fontSize: '10pt', color: textColor, lineHeight: '1.4' }} />
        </div>
      )}

      {/* SECTION: Garantias */}
      <div className="pdf-section">
        <SectionTitle title="GARANTIAS DO SISTEMA" color={primaryColor} />
        <ul style={{ listStyleType: 'disc', paddingLeft: '25px', marginBottom: '35px' }}>
          <li style={liStyle}><strong>{data.garantiaDefeitos || '5'} anos</strong> contra defeitos de fabricação e instalação da Geomembrana PEAD.</li>
          <li style={liStyle}><strong>{data.garantiaAcidentes || '1'} ano</strong> contra danos acidentais (rasgamento, ruptura e furos).</li>
          {data.durabilidade && (
            <li style={liStyle}><strong>{data.durabilidade} anos</strong> de durabilidade estimada do material.</li>
          )}
          {data.vistorias && (
            <li style={liStyle}>Vistorias técnicas programadas: {data.vistorias}.</li>
          )}
        </ul>
      </div>

      {/* SECTION: Valores */}
      <div className="pdf-section">
        <SectionTitle title="VALORES DA PROPOSTA" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${borderColor}`, marginBottom: '35px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <th style={thStyle}>ITEM</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>DESCRIÇÃO DOS SERVIÇOS E MATERIAIS</th>
              <th style={thStyle}>QTD./UNID.</th>
              <th style={thStyle}>VALOR TOTAL (R$)</th>
            </tr>
          </thead>
          <tbody>
            {(data.itens || []).map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{String(index + 1).padStart(2, '0')}</td>
                <td style={{ ...tdStyle, textAlign: 'left' }}>{item.descricao}</td>
                <td style={tdStyle}>
                  {Number(item.quantidade || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {item.unidade || 'UN'}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>{fmt(item.valor || 0)}</td>
              </tr>
            ))}
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <td colSpan={3} style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', fontSize: '12pt' }}>VALOR TOTAL GERAL DA PROPOSTA:</td>
              <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', fontSize: '13pt' }}>{fmt(data.totalGeral || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION: Condições de Pagamento */}
      <div className="pdf-section">
        <SectionTitle title="CONDIÇÕES DE PAGAMENTO" color={primaryColor} />
        <ul style={{ listStyleType: 'disc', paddingLeft: '25px', marginBottom: '25px' }}>
          {showEntrada && (
            <li style={liStyle}>
              <strong>{percentualEntrada}%</strong> de entrada (mobilização):{' '}
              {data.tipoPrazoEntrada === 'inicio'
                ? 'pagamento no início da obra.'
                : `pagamento em ${prazoEntrada} dias.`}
            </li>
          )}
          {showMaterial && (
            <li style={liStyle}><strong>{percentualMaterial}%</strong> na entrega da Geomembrana no canteiro: pagamento em {prazoMaterial} dias.</li>
          )}
          {showMedicao && (
            <li style={liStyle}><strong>{percentualMedicao}%</strong> de medições de serviços executados (a cada {frequenciaMedicao} dias): pagamento em {prazoPagamentoMedicao} dias após NF.</li>
          )}
          {showSaldo && (
            <li style={liStyle}><strong>{calculateSaldo()}%</strong> de saldo final após conclusão: pagamento em {prazoSaldo} dias.</li>
          )}
          {formaPagamento && (
            <li style={liStyle}>Forma de pagamento: {formaPagamento}.</li>
          )}
        </ul>
      </div>

      {/* SECTION: Faturamento Direto */}
      {temFaturamentoDireto && (
        <div style={{ marginBottom: '40px' }}>
          <div className="pdf-section">
            <SectionTitle title="CONDIÇÕES DE FATURAMENTO DIRETO" color={primaryColor} />
          </div>
          <div style={{ padding: '5px 0' }}>
            <ParagraphSplitter text={data.condicoesFaturamento} style={{ fontSize: '10pt', color: textColor, textAlign: 'justify', lineHeight: '1.6' }} />
          </div>
        </div>
      )}

      {/* SECTION: Quadro de Impostos */}
      <div className="pdf-section">
        <SectionTitle title="QUADRO DE IMPOSTOS" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${borderColor}`, marginBottom: '35px' }}>
          <thead>
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <th style={thStyle}>CATEGORIA</th>
              <th style={thStyle}>IMPOSTO</th>
              <th style={thStyle}>ALÍQUOTA (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle} rowSpan={2}>Serviços</td><td style={tdStyle}>DAS Federal</td><td style={tdStyle}>{data.impostoDAS || '11.20'}%</td></tr>
            <tr><td style={tdStyle}>ISS</td><td style={tdStyle}>{data.impostoISS || '2.79'}%</td></tr>
            <tr><td style={tdStyle} rowSpan={2}>Materiais</td><td style={tdStyle}>Geomembrana IPI</td><td style={tdStyle}>{data.impostoIPI || '15.00'}%</td></tr>
            <tr><td style={tdStyle}>DIFAL</td><td style={tdStyle}>{data.impostoDIFAL || '6.00'}%</td></tr>
          </tbody>
        </table>
      </div>

      {/* SECTION: Multa Contratual */}
      {data.showMultas !== false && (data.multaDiaria || data.multaLimite) && (
        <div className="pdf-section">
          <SectionTitle title="MULTA CONTRATUAL" color={primaryColor} />
          <p style={{ fontSize: '11pt', marginBottom: '30px' }}>
            Multa por atraso na entrega da obra: <strong>{data.multaDiaria}% ao dia</strong>, limitado a {data.multaLimite}% do valor do contrato.
          </p>
        </div>
      )}

      {/* SECTION: Validade da Proposta */}
      {data.showValidade !== false && validadeProposta && (
        <div className="pdf-section">
          <SectionTitle title="VALIDADE DA PROPOSTA" color={primaryColor} />
          <p style={{ fontSize: '11pt', marginBottom: '30px' }}>
            Validade: <strong>{validadeProposta} dias</strong> a partir da data de emissão.
          </p>
        </div>
      )}

      {/* SECTION: Prazo de Execução */}
      {data.showPrazoExec !== false && prazoExecucao && (
        <div className="pdf-section">
          <SectionTitle title="PRAZO DE EXECUÇÃO" color={primaryColor} />
          <p style={{ fontSize: '11pt', marginBottom: '10px' }}>
            Execução: <strong>{prazoExecucao} dias efetivos</strong> por armazém graneleiro.
          </p>
        </div>
      )}

      {/* SECTION: Observação do Prazo */}
      {data.showObsPrazo !== false && data.obsPrazo && (
        <div className="pdf-section">
          <SectionTitle title="OBSERVAÇÃO DO PRAZO" color={primaryColor} />
          <p style={{ fontSize: '10pt', color: mutedColor, fontStyle: 'italic', textAlign: 'justify', marginBottom: '30px' }}>
            {data.obsPrazo}
          </p>
        </div>
      )}

      {/* SECTION: Assinaturas e Rodapé Institucional */}
      <div className="pdf-section" style={{ paddingBottom: '25mm' }}>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div style={{ fontSize: '11pt', marginBottom: '25px', color: mutedColor }}>{cidade}, PR — {todayDate}</div>
          <div style={{ fontSize: '16pt', fontWeight: 'bold', color: primaryColor, marginBottom: '5px' }}>J. Wilson Santos</div>
          <div style={{ fontSize: '11pt', color: '#555', marginBottom: '35px' }}>(44) 9 9813-9141</div>
          <div style={{ fontSize: '11pt', fontStyle: 'italic', color: mutedColor }}>Somos gratos pela oportunidade de parceria neste projeto.</div>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: `2px solid #E67E22` }}>
          <div style={{ fontSize: '15pt', fontWeight: 'bold', color: '#E67E22', textAlign: 'center', marginBottom: '8px', letterSpacing: '1.5px' }}>
            PROJING — 15 ANOS DE EXPERIÊNCIA
          </div>
          <p style={{ fontSize: '10pt', color: mutedColor, textAlign: 'center', fontStyle: 'italic', lineHeight: '1.5', maxWidth: '80%', margin: '0 auto 20px' }}>
            Há mais de 15 anos atuamos com excelência no setor de infraestrutura industrial e ambiental, oferecendo soluções completas em geomembrana PEAD e tratamento de efluentes.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '14px 16px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: `3px solid ${primaryColor}` }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #E0E0E0' }}>
                Revestimentos
              </div>
              <div style={{ fontSize: '10pt', color: '#333', lineHeight: '1.6' }}>
                <div>• Reservatórios</div>
                <div>• Silos</div>
                <div>• Armazéns graneleiros</div>
                <div>• Moegas</div>
              </div>
            </div>
            <div style={{ padding: '14px 16px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: `3px solid ${primaryColor}` }}>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #E0E0E0' }}>
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
  padding: '25mm 25mm', // Margem de 25mm (padrão Projing)
  background: '#ffffff',
  boxSizing: 'border-box',
  position: 'relative',
  color: '#333'
};

const pageInnerStyle = {
  width: '100%',
  paddingBottom: '25mm' // Rodapé fixo de 25mm
};

import logoProjing from '../../../../logo.svg';

const Header = ({ primaryColor, settings }) => {
  const cName = (settings?.companyName || 'PROJING').toUpperCase();
  const isProjing = cName === 'PROJING';
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div>
          {isProjing ? (
            <img src={logoProjing} alt="PROJING" style={{ height: '75px', objectFit: 'contain' }} />
          ) : (
            <>
              <div style={{ fontSize: '28pt', fontWeight: '900', color: '#333', letterSpacing: '-1px', lineHeight: '1' }}>
                {cName}
              </div>
              <div style={{ fontSize: '9pt', color: '#666', fontWeight: 'bold', marginTop: '3px', letterSpacing: '1px' }}>SOLUÇÕES EM PEAD</div>
            </>
          )}
        </div>
        <div style={{ width: '3px', height: '75px', background: primaryColor, marginLeft: '5px' }} />
      </div>
      <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#333', lineHeight: '1.7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.phone || '(44) 9 9813-9141'} <Phone size={11} color={primaryColor} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.email || 'projingehbengenharia@hotmail.com'} <Mail size={11} color={primaryColor} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.website || 'www.projing.pro'} <Globe size={11} color={primaryColor} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          CNPJ {settings?.cnpj || '54.348.703/0001-34'} <Hash size={11} color={primaryColor} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          {settings?.address || 'Rua João Hungari, 575, Marialva PR, CEP 86990-000'} <MapPin size={11} color={primaryColor} />
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
    <td style={{ padding: '8px 0', width: '110px', fontWeight: 'bold', verticalAlign: 'top', fontSize: '11pt' }}>{label}</td>
    <td style={{ padding: '8px 0', fontSize: '11pt' }}>{value || '—'}</td>
  </tr>
);

const thStyle = { padding: '8px 12px', fontSize: '9.5pt', fontWeight: 'bold', textAlign: 'center' };
const tdStyle = { padding: '8px 12px', fontSize: '9.5pt', textAlign: 'center', border: '1px solid #CCCCCC' };
const liStyle = { marginBottom: '8px', fontSize: '11pt', textAlign: 'justify', lineHeight: '1.4' };

ArmazemDocument.displayName = 'ArmazemDocument';
export default ArmazemDocument;
