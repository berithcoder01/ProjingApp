import React from 'react';
import { fmt } from '../constants';
import logoProjing from '../../../../logo.svg';

const MaterialDocument = React.forwardRef(({ cliente, items, cond, propNum, companySettings }, ref) => {
  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const todayDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const primaryColor = companySettings?.primaryColor || '#1A5276';
  const textColor = '#333333';
  const mutedColor = '#666666';
  const borderColor = '#CCCCCC';

  return (
    <div
      ref={ref}
      id="material-document"
      style={{
        width: '210mm',
        background: '#ffffff',
        color: '#333333',
        padding: '0 25mm',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <div className="pdf-section" style={{ paddingTop: '25mm' }}>
        <Header primaryColor={primaryColor} settings={companySettings} />

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '22pt', fontWeight: 'bold', color: '#000', margin: '0' }}>
            PROPOSTA COMERCIAL — FORNECIMENTO DE MATERIAIS
          </h1>
          <div style={{ fontSize: '11pt', color: '#555', marginTop: '4px' }}>Nº {propNum}</div>
        </div>
      </div>

      <div className="pdf-section">
        <SectionTitle title="DADOS DA PROPOSTA" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <tbody>
            <DataRow label="Cliente:" value={cliente.nome} border />
            <DataRow label="Contato:" value={`${cliente.contato}${cliente.cargo ? ` (${cliente.cargo})` : ''}`} border />
            <DataRow label="Local:" value={cliente.local} border />
            <DataRow label="Objeto:" value={cliente.objeto || 'Fornecimento de materiais em PEAD e correlatos'} border />
          </tbody>
        </table>
      </div>

      <div className="pdf-section">
        <SectionTitle title="DESCRIÇÃO DOS MATERIAIS" color={primaryColor} />
      </div>
      {items.map((it, idx) => (
        <div key={it.id} style={{ marginBottom: '12px' }}>
          <div className="pdf-section" style={{ marginBottom: '3px' }}>
            <h3 style={{ fontSize: '11pt', fontWeight: 'bold', color: primaryColor, margin: '0' }}>
              Item {String(idx + 1).padStart(2, '0')} — {it.label}
            </h3>
          </div>
          <ParagraphSplitter
            text={it.description || 'Material conforme especificações técnicas anexas.'}
            style={{ fontSize: '10pt', color: mutedColor, textAlign: 'justify' }}
          />
        </div>
      ))}

      {cond.especificacoes && (
        <div className="pdf-section">
          <SectionTitle title="ESPECIFICAÇÕES TÉCNICAS" color={primaryColor} />
          <ParagraphSplitter text={cond.especificacoes} style={{ fontSize: '10pt', color: textColor, textAlign: 'justify' }} />
        </div>
      )}

      <div className="pdf-section">
        <SectionTitle title="PRAZO E CONDIÇÕES DE ENTREGA" color={primaryColor} />
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
          {cond.prazoEntrega && (
            <li style={liStyle}>Prazo de entrega: {cond.prazoEntrega} dias úteis a partir da confirmação do pedido.</li>
          )}
          {cond.localEntrega && (
            <li style={liStyle}>Local de entrega: {cond.localEntrega}.</li>
          )}
          {cond.tipoFrete && (
            <li style={liStyle}>Tipo de frete: {cond.tipoFrete}.</li>
          )}
          {!cond.prazoEntrega && !cond.localEntrega && !cond.tipoFrete && (
            <li style={liStyle}>A combinar.</li>
          )}
        </ul>
      </div>

      <div className="pdf-section">
        <SectionTitle title="VALOR DA PROPOSTA" color={primaryColor} />
        <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <th style={thStyle}>ITEM</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>DESCRIÇÃO</th>
              <th style={thStyle}>UNID.</th>
              <th style={thStyle}>QTD.</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>VALOR UNIT. (R$)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>VALOR TOTAL (R$)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.id} style={{ background: idx % 2 ? '#F2F6FC' : '#fff' }}>
                <td style={tdStyle}>{String(idx + 1).padStart(2, '0')}</td>
                <td style={{ ...tdStyle, textAlign: 'left' }}>{it.label}</td>
                <td style={tdStyle}>{it.unit}</td>
                <td style={tdStyle}>{it.qty}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(it.price)}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>
                  {fmt(parseFloat(it.qty) * parseFloat(it.price))}
                </td>
              </tr>
            ))}
            <tr style={{ background: primaryColor, color: '#fff' }}>
              <td colSpan={5} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>
                TOTAL GERAL:
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>
                {fmt(total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {cond.showPagamento !== false && (
        <div className="pdf-section">
          <SectionTitle title="CONDIÇÕES DE PAGAMENTO" color={primaryColor} />
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
            {cond.showEntrada !== false && (cond.entrada || cond.prazoEntrada) && (
              <li style={liStyle}>
                {cond.entrada ? `${cond.entrada}% de entrada` : 'Entrada'}
                {cond.tipoPrazoEntrada === 'inicio'
                  ? ': pagamento no ato do pedido.'
                  : (cond.prazoEntrada ? `: pagamento em ${cond.prazoEntrada} dias após aprovação.` : '.')}
              </li>
            )}
            {cond.showMedicao !== false && cond.medicao && (
              <li style={liStyle}>Saldo: medição a cada {cond.medicao} dias.</li>
            )}
            {cond.showNF !== false && cond.prazoNF && (
              <li style={liStyle}>Pagamento em até {cond.prazoNF} dias da entrega da NF.</li>
            )}
            <li style={liStyle}>Preços unitários fixos e irreajustáveis.</li>
            {cond.showFormaPagamento !== false && cond.formaPagamento && (
              <li style={liStyle}>Pagamento via {cond.formaPagamento}.</li>
            )}
            {cond.showObsPagamento !== false && cond.obsPagamento && (
              <li style={liStyle}>{cond.obsPagamento}</li>
            )}
          </ul>
        </div>
      )}

      {cond.garantiaMaterial && (
        <div className="pdf-section">
          <SectionTitle title="GARANTIA DO MATERIAL" color={primaryColor} />
          <p style={{ fontSize: '10pt', marginBottom: '20px', textAlign: 'justify' }}>{cond.garantiaMaterial}</p>
        </div>
      )}

      {cond.showValidade !== false && cond.validade && (
        <div className="pdf-section">
          <SectionTitle title="VALIDADE DA PROPOSTA" color={primaryColor} />
          <p style={{ fontSize: '10pt', marginBottom: '20px' }}>{cond.validade} dias a partir da data de emissão.</p>
        </div>
      )}

      {cond.showObs !== false && cond.obs && (
        <div className="pdf-section">
          <SectionTitle title="OBSERVAÇÕES GERAIS" color={primaryColor} />
          <ParagraphSplitter text={cond.obs} style={{ fontSize: '10pt', color: textColor, textAlign: 'justify' }} />
        </div>
      )}

      <div className="pdf-section" style={{ paddingBottom: '25mm' }}>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <div style={{ fontSize: '10pt', marginBottom: '20px' }}>Marialva, PR — {todayDate}</div>
          <div style={{ fontSize: '14pt', fontWeight: 'bold', color: primaryColor, marginBottom: '5px' }}>J. Wilson Santos</div>
          <div style={{ fontSize: '10pt', color: '#555', marginBottom: '30px' }}>(44) 9 9813-9141</div>
          <div style={{ fontSize: '10pt', fontStyle: 'italic', color: mutedColor }}>
            Agradecemos a oportunidade de cotar.
          </div>
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
              <div style={{ fontSize: '26pt', fontWeight: '900', color: '#333', letterSpacing: '-1px', lineHeight: '1' }}>{cName}</div>
              <div style={{ fontSize: '8pt', color: '#666', fontWeight: 'bold', marginTop: '2px', letterSpacing: '1px' }}>SOLUÇÕES EM PEAD</div>
            </>
          )}
        </div>
        <div style={{ width: '2px', height: '75px', background: primaryColor, marginLeft: '5px' }} />
      </div>
      <div style={{ textAlign: 'right', fontSize: '8pt', color: '#333', lineHeight: '1.6' }}>
        <div>Tel.: {settings?.phone || '(44) 9 9813-9141'}</div>
        <div>E-mail: {settings?.email || 'projingehbengenharia@hotmail.com'}</div>
        <div>Web: {settings?.website || 'www.projing.pro'}</div>
        <div>CNPJ {settings?.cnpj || '54.348.703/0001-34'}</div>
        <div>{settings?.address || 'Rua João Hungari, 575, Marialva PR, CEP 86990-000'}</div>
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

MaterialDocument.displayName = 'MaterialDocument';
export default MaterialDocument;
