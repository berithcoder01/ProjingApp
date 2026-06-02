import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PhoneIcon, MailIcon, GlobeIcon, HashIcon, MapPinIcon } from './PDFIcons';
import { fmt } from '../constants';

const M = (mm) => mm * 2.83465;

const COLORS = {
  primary: '#1A5276',
  text: '#333333',
  muted: '#666666',
  border: '#CCCCCC',
  borderLight: '#EEEEEE',
  rowAlt: '#F2F6FC',
  badge: '#f8f9fa',
  orange: '#E67E22',
  white: '#FFFFFF',
  black: '#000000',
};

const baseFont = { fontFamily: 'Helvetica' };

const styles = StyleSheet.create({
  page: {
    ...baseFont,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    paddingTop: M(25),
    paddingBottom: M(25),
    paddingLeft: M(25),
    paddingRight: M(25),
    fontSize: 9,
    lineHeight: 1.4,
  },
  section: { marginBottom: M(8) },
  sectionNoBreak: { marginBottom: M(8) },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: M(18),
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerDivider: { width: 2, height: M(26), backgroundColor: COLORS.primary, marginLeft: M(2) },
  headerLogo: { height: M(26), objectFit: 'contain' },
  companyName: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, letterSpacing: -1 },
  companySubtitle: { fontSize: 8, color: COLORS.muted, fontWeight: 'bold', marginTop: 1, letterSpacing: 1 },
  headerRight: { textAlign: 'right', fontSize: 8, color: COLORS.text, lineHeight: 1.6, maxWidth: M(85) },
  headerRightRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  headerRightAccent: { color: COLORS.primary, marginLeft: 2 },
  headerRightLine: { textAlign: 'right', marginBottom: 1 },

  proposalTitleWrap: { textAlign: 'center', marginBottom: M(15) },
  proposalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, margin: 0 },
  proposalNumber: { fontSize: 11, color: '#555555', marginTop: 8 },

  sectionTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginTop: M(12),
    marginBottom: M(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  dataTable: { width: '100%', marginBottom: M(8) },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, borderBottomStyle: 'solid', paddingVertical: 3 },
  dataLabel: { width: M(28), fontWeight: 'bold', fontSize: 9 },
  dataValue: { flex: 1, fontSize: 9 },

  itemBlock: { marginBottom: M(5) },
  itemTitle: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary, marginBottom: 2 },
  paragraph: { fontSize: 9, color: COLORS.muted, textAlign: 'justify', marginBottom: 2 },
  paragraphText: { fontSize: 9, color: COLORS.text, textAlign: 'justify' },

  valuesTable: { width: '100%', borderWidth: 1, borderColor: COLORS.border, borderStyle: 'solid', marginBottom: M(6) },
  valuesHeader: { flexDirection: 'row', backgroundColor: COLORS.primary, color: COLORS.white },
  valuesHeaderCell: { flex: 1, padding: 4, fontSize: 8, fontWeight: 'bold', textAlign: 'center', color: COLORS.white },
  valuesHeaderCellLeft: { flex: 3, padding: 4, fontSize: 8, fontWeight: 'bold', textAlign: 'left', color: COLORS.white },
  valuesRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, borderTopStyle: 'solid' },
  valuesRowAlt: { flexDirection: 'row', backgroundColor: COLORS.rowAlt, borderTopWidth: 1, borderTopColor: COLORS.border, borderTopStyle: 'solid' },
  valuesCell: { flex: 1, padding: 4, fontSize: 8, textAlign: 'center' },
  valuesCellLeft: { flex: 3, padding: 4, fontSize: 8, textAlign: 'left' },
  valuesCellBold: { flex: 1, padding: 4, fontSize: 8, textAlign: 'right', fontWeight: 'bold' },
  valuesTotalLabel: { flex: 5, padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 10, color: COLORS.white, backgroundColor: COLORS.primary },
  valuesTotalValue: { flex: 1, padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 10, color: COLORS.white, backgroundColor: COLORS.primary },

  list: { marginBottom: M(6) },
  listItem: { flexDirection: 'row', marginBottom: 3 },
  listBullet: { width: 12, fontSize: 9 },
  listText: { flex: 1, fontSize: 9, textAlign: 'justify' },

  signWrap: { textAlign: 'center', marginTop: M(20) },
  signDate: { fontSize: 9, marginBottom: 8 },
  signName: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginBottom: 2 },
  signPhone: { fontSize: 9, color: '#555555', marginBottom: 10 },
  signThanks: { fontSize: 9, fontStyle: 'italic', color: COLORS.muted },

  footer: {
    marginTop: M(20),
    paddingTop: M(10),
    borderTopWidth: 2,
    borderTopColor: COLORS.orange,
    borderTopStyle: 'solid',
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: M(3),
    letterSpacing: 1,
  },
  footerIntro: {
    fontSize: 9,
    color: COLORS.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: M(8),
    lineHeight: 1.5,
    paddingHorizontal: M(20),
  },
  footerColumns: { flexDirection: 'row', gap: M(8) },
  footerColumn: {
    flex: 1,
    paddingVertical: M(5),
    paddingHorizontal: M(5),
    backgroundColor: COLORS.badge,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: COLORS.primary,
    borderRadius: 3,
  },
  footerColumnTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: COLORS.borderLight,
  },
  footerItem: { fontSize: 9, color: COLORS.text, marginBottom: 2, lineHeight: 1.4 },
});

const ParagraphSplitter = ({ text, style }) => {
  if (!text) return null;
  if (typeof text !== 'string') {
    return <Text style={style}>{String(text)}</Text>;
  }
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  return paragraphs.map((p, i) => (
    <Text key={i} style={{ ...style, marginBottom: i < paragraphs.length - 1 ? 2 : 0 }}>{p}</Text>
  ));
};

const SectionTitle = ({ title, color }) => (
  <Text style={[styles.sectionTitle, { color, borderBottomColor: color }]}>{title}</Text>
);

const Header = ({ primaryColor, settings, logoSrc }) => {
  const cName = (settings?.companyName || 'PROJING').toUpperCase();
  const isProjing = cName === 'PROJING';
  return (
    <View style={styles.header} wrap={false}>
      <View style={styles.headerLeft}>
        <View>
          {isProjing && logoSrc ? (
            <Image src={logoSrc} style={styles.headerLogo} />
          ) : (
            <>
              <Text style={styles.companyName}>{cName}</Text>
              <Text style={styles.companySubtitle}>SOLUÇÕES EM PEAD</Text>
            </>
          )}
        </View>
        <View style={[styles.headerDivider, { backgroundColor: primaryColor }]} />
      </View>
      <View style={styles.headerRight}>
        <View style={styles.headerRightRow}>
          <PhoneIcon color={primaryColor} />
          <Text style={styles.headerRightLine}>{settings?.phone || '(44) 9 9813-9141'}</Text>
        </View>
        <View style={styles.headerRightRow}>
          <MailIcon color={primaryColor} />
          <Text style={styles.headerRightLine}>{settings?.email || 'projingehbengenharia@hotmail.com'}</Text>
        </View>
        <View style={styles.headerRightRow}>
          <GlobeIcon color={primaryColor} />
          <Text style={styles.headerRightLine}>{settings?.website || 'www.projing.pro'}</Text>
        </View>
        <View style={styles.headerRightRow}>
          <HashIcon color={primaryColor} />
          <Text style={styles.headerRightLine}>CNPJ {settings?.cnpj || '54.348.703/0001-34'}</Text>
        </View>
        <View style={styles.headerRightRow}>
          <MapPinIcon color={primaryColor} />
          <Text style={styles.headerRightLine}>{settings?.address || 'Rua João Hungari, 575, Marialva PR, CEP 86990-000'}</Text>
        </View>
      </View>
    </View>
  );
};

const DataRow = ({ label, value, border }) => (
  <View style={[styles.dataRow, { borderBottomWidth: border ? 1 : 0 }]}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value || '—'}</Text>
  </View>
);

const MaterialDocumentPDF = ({ cliente, items, cond, propNum, companySettings, logoSrc }) => {
  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const todayDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const primaryColor = companySettings?.primaryColor || COLORS.primary;

  return (
    <Document
      title={`Proposta Material ${propNum}`}
      author={companySettings?.companyName || 'Projing'}
      subject="Proposta Comercial — Fornecimento de Materiais"
    >
      <Page size="A4" style={styles.page} wrap>
        <View wrap={false}>
          <Header primaryColor={primaryColor} settings={companySettings} logoSrc={logoSrc} />
          <View style={styles.proposalTitleWrap}>
            <Text style={styles.proposalTitle}>PROPOSTA COMERCIAL — FORNECIMENTO DE MATERIAIS</Text>
            <Text style={styles.proposalNumber}>Nº {propNum}</Text>
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="DADOS DA PROPOSTA" color={primaryColor} />
          <View style={styles.dataTable}>
            <DataRow label="Cliente:" value={cliente.nome} border />
            <DataRow label="Contato:" value={`${cliente.contato}${cliente.cargo ? ` (${cliente.cargo})` : ''}`} border />
            <DataRow label="Local:" value={cliente.local} border />
            <DataRow label="Objeto:" value={cliente.objeto || 'Fornecimento de materiais em PEAD e correlatos'} border />
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="DESCRIÇÃO DOS MATERIAIS" color={primaryColor} />
          {items.map((it, idx) => (
            <View key={it.id} style={styles.itemBlock} wrap={false}>
              <Text style={styles.itemTitle}>
                Item {String(idx + 1).padStart(2, '0')} — {it.label}
              </Text>
              <ParagraphSplitter
                text={it.description || 'Material conforme especificações técnicas anexas.'}
                style={styles.paragraph}
              />
            </View>
          ))}
        </View>

        {cond.especificacoes && (
          <View wrap={false}>
            <SectionTitle title="ESPECIFICAÇÕES TÉCNICAS" color={primaryColor} />
            <ParagraphSplitter text={cond.especificacoes} style={styles.paragraphText} />
          </View>
        )}

        <View wrap={false}>
          <SectionTitle title="PRAZO E CONDIÇÕES DE ENTREGA" color={primaryColor} />
          <View style={styles.list}>
            {cond.prazoEntrega && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Prazo de entrega: {cond.prazoEntrega} dias úteis a partir da confirmação do pedido.</Text>
              </View>
            )}
            {cond.localEntrega && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Local de entrega: {cond.localEntrega}.</Text>
              </View>
            )}
            {cond.tipoFrete && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Tipo de frete: {cond.tipoFrete}.</Text>
              </View>
            )}
            {!cond.prazoEntrega && !cond.localEntrega && !cond.tipoFrete && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>A combinar.</Text>
              </View>
            )}
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="VALOR DA PROPOSTA" color={primaryColor} />
          <View style={styles.valuesTable}>
            <View style={styles.valuesHeader}>
              <Text style={styles.valuesHeaderCell}>ITEM</Text>
              <Text style={styles.valuesHeaderCellLeft}>DESCRIÇÃO</Text>
              <Text style={styles.valuesHeaderCell}>UNID.</Text>
              <Text style={styles.valuesHeaderCell}>QTD.</Text>
              <Text style={styles.valuesHeaderCell}>VALOR UNIT. (R$)</Text>
              <Text style={styles.valuesHeaderCell}>VALOR TOTAL (R$)</Text>
            </View>
            {items.map((it, idx) => (
              <View key={it.id} style={idx % 2 ? styles.valuesRowAlt : styles.valuesRow}>
                <Text style={styles.valuesCell}>{String(idx + 1).padStart(2, '0')}</Text>
                <Text style={styles.valuesCellLeft}>{it.label}</Text>
                <Text style={styles.valuesCell}>{it.unit}</Text>
                <Text style={styles.valuesCell}>{it.qty}</Text>
                <Text style={styles.valuesCell}>{fmt(it.price)}</Text>
                <Text style={styles.valuesCellBold}>{fmt(parseFloat(it.qty) * parseFloat(it.price))}</Text>
              </View>
            ))}
            <View style={styles.valuesRow}>
              <View style={styles.valuesTotalLabel}>
                <Text>TOTAL GERAL:</Text>
              </View>
              <View style={styles.valuesTotalValue}>
                <Text>{fmt(total)}</Text>
              </View>
            </View>
          </View>
        </View>

        {cond.showPagamento !== false && (
          <View wrap={false}>
            <SectionTitle title="CONDIÇÕES DE PAGAMENTO" color={primaryColor} />
            <View style={styles.list}>
              {cond.showEntrada !== false && (cond.entrada || cond.prazoEntrada) && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>
                    {cond.entrada ? `${cond.entrada}% de entrada` : 'Entrada'}
                    {cond.tipoPrazoEntrada === 'inicio'
                      ? ': pagamento no ato do pedido.'
                      : (cond.prazoEntrada ? `: pagamento em ${cond.prazoEntrada} dias após aprovação.` : '.')}
                  </Text>
                </View>
              )}
              {cond.showMedicao !== false && cond.medicao && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>Saldo: medição a cada {cond.medicao} dias.</Text>
                </View>
              )}
              {cond.showNF !== false && cond.prazoNF && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>Pagamento em até {cond.prazoNF} dias da entrega da NF.</Text>
                </View>
              )}
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Preços unitários fixos e irreajustáveis.</Text>
              </View>
              {cond.showFormaPagamento !== false && cond.formaPagamento && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>Pagamento via {cond.formaPagamento}.</Text>
                </View>
              )}
              {cond.showObsPagamento !== false && cond.obsPagamento && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{cond.obsPagamento}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {cond.garantiaMaterial && (
          <View wrap={false}>
            <SectionTitle title="GARANTIA DO MATERIAL" color={primaryColor} />
            <Text style={styles.paragraphText}>{cond.garantiaMaterial}</Text>
          </View>
        )}

        {cond.showValidade !== false && cond.validade && (
          <View wrap={false}>
            <SectionTitle title="VALIDADE DA PROPOSTA" color={primaryColor} />
            <Text style={styles.paragraphText}>{cond.validade} dias a partir da data de emissão.</Text>
          </View>
        )}

        {cond.showObs !== false && cond.obs && (
          <View wrap={false}>
            <SectionTitle title="OBSERVAÇÕES GERAIS" color={primaryColor} />
            <ParagraphSplitter text={cond.obs} style={styles.paragraphText} />
          </View>
        )}

        <View wrap={false}>
          <View style={styles.signWrap}>
            <Text style={styles.signDate}>Marialva, PR — {todayDate}</Text>
            <Text style={styles.signName}>J. Wilson Santos</Text>
            <Text style={styles.signPhone}>(44) 9 9813-9141</Text>
            <Text style={styles.signThanks}>Agradecemos a oportunidade de cotar.</Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerBrand}>PROJING — 15 ANOS DE EXPERIÊNCIA</Text>
            <Text style={styles.footerIntro}>
              Há mais de 15 anos atuamos com excelência no setor de infraestrutura industrial e ambiental, oferecendo soluções completas em geomembrana PEAD e tratamento de efluentes.
            </Text>
            <View style={styles.footerColumns}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Revestimentos</Text>
                <Text style={styles.footerItem}>• Reservatórios</Text>
                <Text style={styles.footerItem}>• Silos</Text>
                <Text style={styles.footerItem}>• Armazéns graneleiros</Text>
                <Text style={styles.footerItem}>• Moegas</Text>
              </View>
              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Infraestrutura &amp; Tratamento</Text>
                <Text style={styles.footerItem}>• Tubulações em PEAD</Text>
                <Text style={styles.footerItem}>• Tratamento de esgoto</Text>
                <Text style={styles.footerItem}>• Tratamento de efluentes</Text>
                <Text style={styles.footerItem}>• Águas industriais</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MaterialDocumentPDF;
