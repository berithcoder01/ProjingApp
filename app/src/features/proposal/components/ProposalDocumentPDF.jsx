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
  headerDivider: {
    width: 2,
    height: M(26),
    backgroundColor: COLORS.primary,
    marginLeft: M(2),
  },
  headerLogo: { height: M(26), objectFit: 'contain' },
  companyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: -1,
  },
  companySubtitle: {
    fontSize: 8,
    color: COLORS.muted,
    fontWeight: 'bold',
    marginTop: 1,
    letterSpacing: 1,
  },
  headerRight: {
    textAlign: 'right',
    fontSize: 8,
    color: COLORS.text,
    lineHeight: 1.6,
    maxWidth: M(85),
  },
  headerRightRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  headerRightAccent: { color: COLORS.primary, marginLeft: 2 },
  headerRightLine: { textAlign: 'right', marginBottom: 1 },

  proposalTitleWrap: { textAlign: 'center', marginBottom: M(15) },
  proposalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    margin: 0,
  },
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
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    borderBottomStyle: 'solid',
    paddingTop: 2,
    paddingBottom: 2,
  },
  dataRowNoBorder: { flexDirection: 'row', paddingTop: 2, paddingBottom: 2 },
  dataLabel: {
    width: M(35),
    fontWeight: 'bold',
    fontSize: 10,
    paddingRight: M(2),
  },
  dataValue: { flex: 1, fontSize: 10 },

  itemBlock: { marginBottom: M(5) },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  paragraph: { fontSize: 10, color: COLORS.muted, textAlign: 'justify', marginBottom: 2 },
  paragraphText: { fontSize: 10, color: COLORS.text, textAlign: 'justify', marginBottom: 2 },

  valuesTable: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    marginBottom: M(5),
  },
  valuesHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  valuesHeaderCell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  valuesHeaderCellLeft: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 3,
  },
  valuesGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  valuesGroupCell: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    fontSize: 9,
  },
  valuesRow: { flexDirection: 'row' },
  valuesRowAlt: { flexDirection: 'row', backgroundColor: COLORS.rowAlt },
  valuesCell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    textAlign: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    flex: 1,
  },
  valuesCellLeft: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    textAlign: 'left',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    flex: 3,
  },
  valuesCellBold: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    textAlign: 'right',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    flex: 1,
  },
  valuesTotalLabel: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 11,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    flex: 4,
  },
  valuesTotalValue: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 11,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    flex: 1,
  },
  continuousNote: {
    fontSize: 8,
    color: COLORS.muted,
    marginTop: 2,
    fontStyle: 'italic',
    marginBottom: M(8),
  },

  list: { paddingLeft: M(8), marginBottom: M(8) },
  listItem: {
    fontSize: 10,
    textAlign: 'justify',
    marginBottom: 2,
    flexDirection: 'row',
  },
  listBullet: { width: M(4) },
  listText: { flex: 1 },

  signWrap: { textAlign: 'center', marginTop: M(25) },
  signDate: { fontSize: 10, marginBottom: M(10) },
  signName: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 2 },
  signPhone: { fontSize: 10, color: '#555555', marginBottom: M(15) },
  signThanks: { fontSize: 10, fontStyle: 'italic', color: COLORS.muted },

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
  footerColumns: {
    flexDirection: 'row',
    gap: M(8),
  },
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
  footerItem: {
    fontSize: 9,
    color: COLORS.text,
    marginBottom: 2,
    lineHeight: 1.4,
  },
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

const Header = ({ primaryColor, settings, logoSrc }) => {
  const cName = (settings?.companyName || 'PROJING').toUpperCase();
  const isProjing = cName === 'PROJING';
  const headerRightStyle = [styles.headerRight, { color: COLORS.text }];
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
      <View style={headerRightStyle}>
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

const SectionTitle = ({ title, color }) => (
  <Text style={[styles.sectionTitle, { color, borderBottomColor: color }]}>{title}</Text>
);

const DataRow = ({ label, value, border }) => (
  <View style={border ? styles.dataRow : styles.dataRowNoBorder}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value || '—'}</Text>
  </View>
);

const ProposalDocumentPDF = ({ cliente, items, cond, propNum, companySettings, logoSrc }) => {
  const isContinuous = cond.tipoProposta === 'servico_continuo';
  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const todayDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const primaryColor = companySettings?.primaryColor || COLORS.primary;

  return (
    <Document
      title={`Proposta ${propNum}`}
      author={companySettings?.companyName || 'Projing'}
      subject="Proposta Comercial"
    >
      <Page size="A4" style={styles.page} wrap>
        <View wrap={false}>
          <Header primaryColor={primaryColor} settings={companySettings} logoSrc={logoSrc} />
          <View style={styles.proposalTitleWrap}>
            <Text style={styles.proposalTitle}>PROPOSTA COMERCIAL</Text>
            <Text style={styles.proposalNumber}>Nº {propNum}</Text>
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="DADOS DA PROPOSTA" color={primaryColor} />
          <View style={styles.dataTable}>
            <DataRow label="Cliente:" value={cliente.nome} border />
            <DataRow label="Contato:" value={`${cliente.contato}${cliente.cargo ? ` (${cliente.cargo})` : ''}`} border />
            <DataRow label="Local:" value={cliente.local} border />
            <DataRow label="Objeto:" value={cliente.objeto || 'Prestação de serviços e fornecimento de materiais em PEAD'} border />
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="DESCRIÇÃO DOS SERVIÇOS" color={primaryColor} />
          {items.map((it, idx) => (
            <View key={it.id} style={styles.itemBlock} wrap={false}>
              <Text style={styles.itemTitle}>
                Item {String(idx + 1).padStart(2, '0')} — {it.label}
              </Text>
              <ParagraphSplitter
                text={it.description || 'Execução de serviços especializados Projing.'}
                style={styles.paragraph}
              />
            </View>
          ))}
        </View>

        <View wrap={false}>
          <SectionTitle title="VALOR DA PROPOSTA" color={primaryColor} />
          <View style={styles.valuesTable}>
            <View style={styles.valuesHeader}>
              <Text style={styles.valuesHeaderCell}>ITEM</Text>
              <Text style={styles.valuesHeaderCellLeft}>DESCRIÇÃO</Text>
              <Text style={styles.valuesHeaderCell}>UNID.</Text>
              {isContinuous ? (
                <Text style={styles.valuesHeaderCell}>VALOR UNIT. (R$)</Text>
              ) : (
                <>
                  <Text style={styles.valuesHeaderCell}>QTD.</Text>
                  <Text style={styles.valuesHeaderCell}>VALOR (R$)</Text>
                </>
              )}
            </View>
            <View style={styles.valuesGroup}>
              <Text style={styles.valuesGroupCell}>
                01 — DESCRIÇÃO DOS ITENS DA PROPOSTA
              </Text>
            </View>
            {items.map((it, idx) => (
              <View key={it.id} style={idx % 2 ? styles.valuesRowAlt : styles.valuesRow}>
                <Text style={styles.valuesCell}>{String(idx + 1).padStart(2, '0')}</Text>
                <Text style={styles.valuesCellLeft}>{it.label}</Text>
                <Text style={styles.valuesCell}>{it.unit}</Text>
                {isContinuous ? (
                  <Text style={styles.valuesCellBold}>{fmt(it.price)}</Text>
                ) : (
                  <>
                    <Text style={styles.valuesCell}>{it.qty}</Text>
                    <Text style={styles.valuesCellBold}>{fmt(parseFloat(it.qty) * parseFloat(it.price))}</Text>
                  </>
                )}
              </View>
            ))}
            <View style={styles.valuesGroup}>
              <Text style={styles.valuesTotalLabel}>
                {isContinuous ? 'FATURAMENTO:' : 'TOTAL GERAL:'}
              </Text>
              <Text style={styles.valuesTotalValue}>
                {isContinuous ? 'VALOR A APURAR CONFORME MEDIÇÃO' : fmt(total)}
              </Text>
            </View>
          </View>
          {isContinuous && (
            <Text style={styles.continuousNote}>
              * Os quantitativos serão apurados por medição durante e após a execução dos serviços.
            </Text>
          )}
        </View>

        {cond.showPagamento !== false && (
          <View wrap={false}>
            <SectionTitle title="FORMA DE PAGAMENTO" color={primaryColor} />
            <View style={styles.list}>
              {cond.showEntrada !== false && (cond.entrada || cond.prazoEntrada) && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>
                    {cond.entrada ? `${cond.entrada}% de entrada (mobilização)` : 'Entrada (mobilização)'}
                    {cond.tipoPrazoEntrada === 'inicio'
                      ? ': pagamento no início da obra.'
                      : (cond.prazoEntrada ? `: pagamento em ${cond.prazoEntrada} dias.` : '.')}
                  </Text>
                </View>
              )}
              {cond.showMedicao !== false && !isContinuous && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>
                    {cond.medicao ? `Saldo: medição a cada ${cond.medicao} dias.` : 'Saldo: conforme medição.'}
                  </Text>
                </View>
              )}
              {cond.showMedicao !== false && isContinuous && (
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>Faturamento baseado em medição periódica.</Text>
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
                <Text style={styles.listText}>Preços fixos e irreajustáveis.</Text>
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

        {cond.showGarantias !== false && (
          <View wrap={false}>
            <SectionTitle title="GARANTIAS" color={primaryColor} />
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{cond.garantiaFabrica || '5'} anos contra defeitos de fabricação e instalação (geomembrana).</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{cond.garantiaInstalacao || '1'} ano contra acidentes de rasgamento, ruptura e furos.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Garantia técnica integral durante o período de execução.</Text>
              </View>
            </View>
          </View>
        )}

        {cond.showImpostos !== false && (
          <View wrap={false}>
            <SectionTitle title="QUADRO DE IMPOSTOS" color={primaryColor} />
            <View style={styles.valuesTable}>
              <View style={styles.valuesHeader}>
                <Text style={styles.valuesHeaderCell}>CATEGORIA</Text>
                <Text style={styles.valuesHeaderCell}>IMPOSTO</Text>
                <Text style={styles.valuesHeaderCell}>%</Text>
              </View>
              <View style={styles.valuesRow}>
                <Text style={[styles.valuesCell, { flex: 1.2 }]}>Serviço</Text>
                <Text style={styles.valuesCell}>DAS Federal</Text>
                <Text style={styles.valuesCellBold}>{cond.impostoDAS || '11,2'}%</Text>
              </View>
              <View style={styles.valuesRowAlt}>
                <Text style={styles.valuesCell}>{''}</Text>
                <Text style={styles.valuesCell}>ISS</Text>
                <Text style={styles.valuesCellBold}>{cond.impostoISS || '2,79'}%</Text>
              </View>
              <View style={styles.valuesRow}>
                <Text style={[styles.valuesCell, { flex: 1.2 }]}>Materiais</Text>
                <Text style={styles.valuesCell}>Geomembrana IPI</Text>
                <Text style={styles.valuesCellBold}>{cond.impostoIPI || '15'}%</Text>
              </View>
              <View style={styles.valuesRowAlt}>
                <Text style={styles.valuesCell}>{''}</Text>
                <Text style={styles.valuesCell}>DIFAL</Text>
                <Text style={styles.valuesCellBold}>{cond.impostoDIFAL || '6'}%</Text>
              </View>
            </View>
          </View>
        )}

        {cond.showMultas !== false && (
          <View wrap={false}>
            <SectionTitle title="MULTA CONTRATUAL" color={primaryColor} />
            <Text style={styles.paragraphText}>
              Multa por atraso na entrega da obra: {cond.multaDiaria || '0,3'}% ao dia, limitado a {cond.multaLimite || '10'}% do valor do contrato.
            </Text>
          </View>
        )}

        {cond.showValidade !== false && cond.validade && (
          <View wrap={false}>
            <SectionTitle title="VALIDADE DA PROPOSTA" color={primaryColor} />
            <Text style={styles.paragraphText}>
              {cond.validade} dias a partir da data de emissão.
            </Text>
          </View>
        )}

        {cond.showPrazoExec !== false && cond.prazoExec && (
          <View wrap={false}>
            <SectionTitle title="PRAZO DE EXECUÇÃO" color={primaryColor} />
            <Text style={[styles.paragraphText, { marginBottom: 2 }]}>{cond.prazoExec}</Text>
            <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>
              Obs.: O fator climático é determinante no cumprimento do prazo. As áreas devem estar isentas de conteúdos.
            </Text>
          </View>
        )}

        {cond.responsabilidadeContratada && (
          <View wrap={false}>
            <SectionTitle title="RESPONSABILIDADE DA CONTRATADA" color={primaryColor} />
            <ParagraphSplitter text={cond.responsabilidadeContratada} style={styles.paragraphText} />
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
            <Text style={styles.signThanks}>Somos gratos por participarmos deste projeto.</Text>
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

export default ProposalDocumentPDF;
