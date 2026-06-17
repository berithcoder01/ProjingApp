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
  badge: '#f8f9fa',
  badgeClient: '#fcfcfc',
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
    lineHeight: 1.7,
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
    letterSpacing: 2,
  },
  proposalNumber: {
    fontSize: 12,
    color: '#555555',
    fontWeight: 'bold',
    marginTop: 8,
  },

  sectionTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    borderBottomStyle: 'solid',
    paddingBottom: 6,
    marginTop: M(12),
    marginBottom: M(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  dataTable: { width: '100%', marginBottom: M(10) },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    borderBottomStyle: 'solid',
    paddingTop: 2,
    paddingBottom: 2,
  },
  dataLabel: {
    width: M(40),
    fontWeight: 'bold',
    fontSize: 10,
    paddingRight: M(2),
  },
  dataValue: { flex: 1, fontSize: 10 },

  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: M(2),
    marginBottom: M(2),
  },
  subTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: M(2),
    marginBottom: M(2),
  },
  paragraph: { fontSize: 10, color: COLORS.text, textAlign: 'justify', lineHeight: 1.5, marginBottom: 2 },
  paragraphMuted: { fontSize: 10, color: COLORS.muted, textAlign: 'justify', lineHeight: 1.4 },

  characteristicsBox: {
    padding: M(8),
    backgroundColor: COLORS.badge,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    borderRadius: 4,
    marginBottom: M(12),
  },
  characteristicsLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: M(4),
  },

  clientBox: {
    padding: M(6),
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    borderLeftStyle: 'solid',
    backgroundColor: COLORS.badgeClient,
    marginTop: M(6),
    marginBottom: M(10),
  },
  clientLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: M(3),
  },

  list: { paddingLeft: M(8), marginBottom: M(12) },
  listItem: {
    fontSize: 10,
    textAlign: 'justify',
    marginBottom: 2,
    flexDirection: 'row',
  },
  listBullet: { width: M(4) },
  listText: { flex: 1, lineHeight: 1.4 },

  valuesTable: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    marginBottom: M(12),
  },
  valuesHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  valuesHeaderCell: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  valuesHeaderCellLeft: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 4,
  },
  valuesRow: { flexDirection: 'row', backgroundColor: COLORS.white },
  valuesCell: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 9,
    textAlign: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    flex: 1,
  },
  valuesCellLeft: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 9,
    textAlign: 'left',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    flex: 4,
  },
  valuesCellBold: {
    paddingVertical: 4,
    paddingHorizontal: 5,
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
    fontSize: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    flex: 3,
  },
  valuesTotalValue: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    flex: 1,
  },

  signWrap: { textAlign: 'center', marginTop: M(25) },
  signDate: { fontSize: 11, marginBottom: M(10), color: COLORS.muted },
  signName: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 2 },
  signPhone: { fontSize: 11, color: '#555555', marginBottom: M(15) },
  signThanks: { fontSize: 11, fontStyle: 'italic', color: COLORS.muted },

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

const SectionTitle = ({ title, color }) => (
  <Text style={[styles.sectionTitle, { color, borderBottomColor: color }]}>{title}</Text>
);

const DataRow = ({ label, value }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value || '—'}</Text>
  </View>
);

const ArmazemDocumentPDF = ({ data, companySettings, logoSrc }) => {
  const primaryColor = companySettings?.primaryColor || COLORS.primary;
  const todayDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const cidade = (data.local?.split(',')[0] || 'Marialva').trim();

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

  const temFaturamentoDireto = !!(data.faturamentoDireto && data.condicoesFaturamento);

  return (
    <Document
      title={`Proposta ${data.numeroProposta}`}
      author={companySettings?.companyName || 'Projing'}
      subject="Proposta Comercial - Armazém"
    >
      <Page size="A4" style={styles.page} wrap>
        <View wrap={false}>
          <Header primaryColor={primaryColor} settings={companySettings} logoSrc={logoSrc} />
          <View style={styles.proposalTitleWrap}>
            <Text style={styles.proposalTitle}>PROPOSTA COMERCIAL</Text>
            <Text style={styles.proposalNumber}>{data.numeroProposta}</Text>
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="DADOS DA PROPOSTA" color={primaryColor} />
          <View style={styles.dataTable}>
            {data.referencia && <DataRow label="Referência / Capacidade:" value={data.referencia} />}
            <DataRow label="Cliente:" value={data.cliente} />
            <DataRow label="Contato:" value={data.contato} />
            <DataRow label="Local:" value={data.local} />
            <DataRow label="Objeto:" value={data.objeto || 'Revestimento interno de armazém graneleiro em PEAD'} />
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="DESCRIÇÃO DOS SERVIÇOS" color={primaryColor} />
          <Text style={styles.itemTitle}>
            Item 01.01 — Revestimento de Rampas e Peitos (Armazém Graneleiro)
          </Text>
          <ParagraphSplitter
            text={data.descricaoServico}
            style={styles.paragraph}
          />
        </View>

        {data.caracteristicasMaterial && (
          <View wrap={false} style={styles.characteristicsBox}>
            <Text style={styles.characteristicsLabel}>Características Técnicas do Material:</Text>
            <ParagraphSplitter text={data.caracteristicasMaterial} style={styles.paragraph} />
          </View>
        )}

        <View wrap={false}>
          <SectionTitle title="ESCOPO E RESPONSABILIDADES" color={primaryColor} />
          <Text style={styles.subTitle}>Responsabilidades da Contratada</Text>
          <ParagraphSplitter
            text={data.escopoResponsabilidades || '• Mão de obra e materiais\n• Equipamentos e ferramentas\n• EPIs para toda equipe'}
            style={styles.paragraph}
          />
          <Text style={styles.subTitle}>Itens Inclusos no Fornecimento</Text>
          <ParagraphSplitter text={data.itensInclusos} style={styles.paragraph} />
        </View>

        {data.fornecimentoCliente && (
          <View style={styles.clientBox} wrap={false}>
            <Text style={styles.clientLabel}>Fornecimento por conta do Cliente:</Text>
            <ParagraphSplitter text={data.fornecimentoCliente} style={styles.paragraphMuted} />
          </View>
        )}

        <View wrap={false}>
          <SectionTitle title="GARANTIAS DO SISTEMA" color={primaryColor} />
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>
                {data.garantiaDefeitos || '5'} anos contra defeitos de fabricação e instalação da Geomembrana PEAD.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>
                {data.garantiaAcidentes || '1'} ano contra danos acidentais (rasgamento, ruptura e furos).
              </Text>
            </View>
            {data.durabilidade && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>
                  {data.durabilidade} anos de durabilidade estimada do material.
                </Text>
              </View>
            )}
            {data.vistorias && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Vistorias técnicas programadas: {data.vistorias}.</Text>
              </View>
            )}
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="VALORES DA PROPOSTA" color={primaryColor} />
          <View style={styles.valuesTable}>
            <View style={styles.valuesHeader}>
              <Text style={styles.valuesHeaderCell}>ITEM</Text>
              <Text style={styles.valuesHeaderCellLeft}>DESCRIÇÃO DOS SERVIÇOS E MATERIAIS</Text>
              <Text style={styles.valuesHeaderCell}>UNID.</Text>
              <Text style={styles.valuesHeaderCell}>VALOR TOTAL (R$)</Text>
            </View>
            <View style={styles.valuesRow}>
              <Text style={styles.valuesCell}>01</Text>
              <Text style={styles.valuesCellLeft}>Fornecimento de materiais e execução de revestimento em Geomembrana PEAD</Text>
              <Text style={styles.valuesCell}>UN</Text>
              <Text style={styles.valuesCellBold}>{fmt(data.totalGeral || 0)}</Text>
            </View>
            <View style={styles.valuesHeader}>
              <Text style={styles.valuesTotalLabel}>VALOR TOTAL GERAL DA PROPOSTA:</Text>
              <Text style={styles.valuesTotalValue}>{fmt(data.totalGeral || 0)}</Text>
            </View>
          </View>
        </View>

        <View wrap={false}>
          <SectionTitle title="CONDIÇÕES DE PAGAMENTO" color={primaryColor} />
          <View style={styles.list}>
            {showEntrada && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={{ fontWeight: 'bold' }}>{percentualEntrada}%</Text> de entrada (mobilização):{' '}
                  {data.tipoPrazoEntrada === 'inicio'
                    ? 'pagamento no início da obra.'
                    : `pagamento em ${prazoEntrada} dias.`}
                </Text>
              </View>
            )}
            {showMaterial && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}><Text style={{ fontWeight: 'bold' }}>{percentualMaterial}%</Text> na entrega da Geomembrana no canteiro: pagamento em {prazoMaterial} dias.</Text>
              </View>
            )}
            {showMedicao && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}><Text style={{ fontWeight: 'bold' }}>{percentualMedicao}%</Text> de medições de serviços executados (a cada {frequenciaMedicao} dias): pagamento em {prazoPagamentoMedicao} dias após NF.</Text>
              </View>
            )}
            {showSaldo && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}><Text style={{ fontWeight: 'bold' }}>{calculateSaldo()}%</Text> de saldo final após conclusão: pagamento em {prazoSaldo} dias.</Text>
              </View>
            )}
            {formaPagamento && (
              <View style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>Forma de pagamento: {formaPagamento}.</Text>
              </View>
            )}
          </View>
        </View>

        {temFaturamentoDireto && (
          <View>
            <SectionTitle title="CONDIÇÕES DE FATURAMENTO DIRETO" color={primaryColor} />
            <ParagraphSplitter text={data.condicoesFaturamento} style={styles.paragraph} />
          </View>
        )}

        <View wrap={false}>
          <SectionTitle title="QUADRO DE IMPOSTOS" color={primaryColor} />
          <View style={styles.valuesTable}>
            <View style={styles.valuesHeader}>
              <Text style={styles.valuesHeaderCell}>CATEGORIA</Text>
              <Text style={styles.valuesHeaderCell}>IMPOSTO</Text>
              <Text style={styles.valuesHeaderCell}>ALÍQUOTA (%)</Text>
            </View>
            <View style={styles.valuesRow}>
              <Text style={styles.valuesCell}>Serviços</Text>
              <Text style={styles.valuesCell}>DAS Federal</Text>
              <Text style={styles.valuesCellBold}>{data.impostoDAS || '11.20'}%</Text>
            </View>
            <View style={styles.valuesRow}>
              <Text style={styles.valuesCell}>{''}</Text>
              <Text style={styles.valuesCell}>ISS</Text>
              <Text style={styles.valuesCellBold}>{data.impostoISS || '2.79'}%</Text>
            </View>
            <View style={styles.valuesRow}>
              <Text style={styles.valuesCell}>Materiais</Text>
              <Text style={styles.valuesCell}>Geomembrana IPI</Text>
              <Text style={styles.valuesCellBold}>{data.impostoIPI || '15.00'}%</Text>
            </View>
            <View style={styles.valuesRow}>
              <Text style={styles.valuesCell}>{''}</Text>
              <Text style={styles.valuesCell}>DIFAL</Text>
              <Text style={styles.valuesCellBold}>{data.impostoDIFAL || '6.00'}%</Text>
            </View>
          </View>
        </View>

        {(data.showMultas !== false) && (data.multaDiaria || data.multaLimite) && (
          <View wrap={false}>
            <SectionTitle title="MULTA CONTRATUAL" color={primaryColor} />
            <Text style={[styles.paragraph, { fontSize: 11 }]}>
              Multa por atraso na entrega da obra: <Text style={{ fontWeight: 'bold' }}>{data.multaDiaria}% ao dia</Text>, limitado a {data.multaLimite}% do valor do contrato.
            </Text>
          </View>
        )}

        {data.showValidade !== false && validadeProposta && (
          <View wrap={false}>
            <SectionTitle title="VALIDADE DA PROPOSTA" color={primaryColor} />
            <Text style={[styles.paragraph, { fontSize: 11 }]}>
              Validade: <Text style={{ fontWeight: 'bold' }}>{validadeProposta} dias</Text> a partir da data de emissão.
            </Text>
          </View>
        )}

        {data.showPrazoExec !== false && prazoExecucao && (
          <View wrap={false}>
            <SectionTitle title="PRAZO DE EXECUÇÃO" color={primaryColor} />
            <Text style={[styles.paragraph, { fontSize: 11 }]}>
              Execução: <Text style={{ fontWeight: 'bold' }}>{prazoExecucao} dias efetivos</Text> por armazém graneleiro.
            </Text>
          </View>
        )}

        {data.showObsPrazo !== false && data.obsPrazo && (
          <View wrap={false}>
            <SectionTitle title="OBSERVAÇÃO DO PRAZO" color={primaryColor} />
            <Text style={[styles.paragraphMuted, { fontStyle: 'italic' }]}>
              {data.obsPrazo}
            </Text>
          </View>
        )}

        <View wrap={false}>
          <View style={styles.signWrap}>
            <Text style={styles.signDate}>{cidade}, PR — {todayDate}</Text>
            <Text style={styles.signName}>J. Wilson Santos</Text>
            <Text style={styles.signPhone}>(44) 9 9813-9141</Text>
            <Text style={styles.signThanks}>Somos gratos pela oportunidade de parceria neste projeto.</Text>
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

export default ArmazemDocumentPDF;
