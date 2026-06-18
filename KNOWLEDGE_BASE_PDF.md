# Base de Conhecimento — Geração de PDF com @react-pdf/renderer

Referência completa para gerar documentos PDF profissionais usando React. Extraída do desenvolvimento do orçaAI (PROJING).

---

## 1. Contexto: Por que migramos

### Abordagem antiga (descartada)
- **html-to-image + jsPDF**: capturava o DOM oculto em tela, convertia para imagem, colava no PDF
- **Problemas**: texto não selecionável, sobreposição de camadas, retângulos brancos para "tapar" conteúdo, dependência de DOM renderizado, quebra de página imprevisível, arquivos pesados

### Abordagem atual (adotada)
- **@react-pdf/renderer**: gera PDF nativamente com texto vetorial, sem captura de DOM
- **Vantagens**: texto selecionável e pesquisável, quebra de página automática, sem gambiarra visual, leve, acessível

---

## 2. Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│  Ação do usuário                                        │
│  ├─ Wizard (criação) ── StepRevisao / Step10Documento   │
│  └─ Lista de propostas ── PdfGenerator (renderless)     │
└──────────────┬──────────────────────────────────────────┘
               │ chama
               ▼
┌─────────────────────────────────────────────────────────┐
│  pdfService.jsx  (orquestrador)                         │
│  1. getLogoPngDataUri()    SVG → Canvas → PNG data URI  │
│  2. <ComponentePDF props />  cria elemento React         │
│  3. pdf(doc).toBlob()      renderiza para Blob           │
│  4. shareOrDownload()      download web ou Capacitor     │
└──────────────┬──────────────────────────────────────────┘
               │ usa
               ▼
┌─────────────────────────────────────────────────────────┐
│  Componentes PDF (um por tipo de proposta)               │
│  ProposalDocumentPDF.jsx    proposta geral/serviço       │
│  MaterialDocumentPDF.jsx    fornecimento de material     │
│  ArmazemDocumentPDF.jsx     proposta armazém             │
│  PDFIcons.jsx               ícones SVG para header       │
│  constants.js               fmt(), CATALOG               │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Dependências

```json
{
  "@react-pdf/renderer": "^3.x",
  "@capacitor/filesystem": "^6.x",
  "@capacitor/share": "^6.x"
}
```

**Não usar**: html-to-image, html2canvas, dom-to-image, jspdf. Foram removidos do projeto.

---

## 4. Helpers e Funções Utilitárias

### 4.1 Conversão de milímetros para pontos PDF

```js
const M = (mm) => mm * 2.83465;
// Uso: padding: M(25)  →  25mm ≈ 70.87pt
```

### 4.2 Formatação monetária (pt-BR)

```js
export const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// fmt(31200) → "R$ 31.200,00"
```

### 4.3 Palette de cores

```js
const COLORS = {
  primary: '#1A5276',      // Azul-marinho (títulos, acentos)
  text: '#333333',         // Cinza escuro (corpo)
  muted: '#666666',        // Cinza médio (textos secundários)
  border: '#CCCCCC',       // Cinza claro (bordas de tabela)
  borderLight: '#EEEEEE',  // Cinza muito claro (separadores)
  rowAlt: '#F2F6FC',       // Azul muito claro (linhas alternadas)
  badge: '#f8f9fa',        // Quase branco (fundos de box)
  orange: '#E67E22',       // Laranja (destaque rodapé)
  white: '#FFFFFF',
  black: '#000000',
};
```

### 4.4 Conversão SVG → PNG para logo

`@react-pdf/renderer` **não aceita SVG** no componente `<Image>`. Solução:

```js
async function getLogoPngDataUri() {
  if (cachedLogoPng) return cachedLogoPng;

  const response = await fetch(logoUrl);
  const svgText = await response.text();
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const pngDataUri = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;  // largura alvo
      canvas.height = img.height * (600 / img.width);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(err); };
    img.src = url;
  });

  cachedLogoPng = pngDataUri;  // cache no nível do módulo
  return pngDataUri;
}
```

### 4.5 Split de parágrafos

```js
const ParagraphSplitter = ({ text, style }) => {
  if (!text) return null;
  if (typeof text !== 'string') return <Text style={style}>{String(text)}</Text>;

  return text.split('\n')
    .filter(p => p.trim() !== '')
    .map((p, i, arr) => (
      <Text key={i} style={{ ...style, marginBottom: i < arr.length - 1 ? 2 : 0 }}>
        {p}
      </Text>
    ));
};
```

### 4.6 Download/Capacitor share

```js
async function shareOrDownload(blob, filename) {
  // Capacitor (mobile)
  if (window.Capacitor?.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');

    const base64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });

    const file = await Filesystem.writeFile({
      path: filename, data: base64, directory: Directory.Cache,
    });
    await Share.share({ title: 'Abrir Proposta', text: filename, url: file.uri });
    return;
  }

  // Web
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}
```

---

## 5. Primitivas do @react-pdf/renderer

| Primitiva | Uso |
|-----------|-----|
| `Document` | Raiz do documento; recebe `title`, `author`, `subject` |
| `Page` | Página; `size="A4"`, `wrap` habilitado para overflow |
| `View` | Container de layout; flex row/col, seções, boxes, tabelas |
| `Text` | Todo conteúdo de texto; aceita `style` inline |
| `Image` | Imagens; recebe `src` como data URI (não aceita SVG) |
| `StyleSheet.create()` | Definição de estilos (similar ao React Native) |
| `Svg`, `Path`, `Circle` | Ícones SVG inline |

### Estilos suportados

- `flexDirection`: `'row'` | `'column'` (default)
- `justifyContent`: `'space-between'` | `'flex-end'` | `'center'` | `'flex-start'`
- `alignItems`: `'center'` | `'flex-start'`
- `flex`: número (proporção)
- `width`, `height`: número ou string (`'100%'`)
- `padding*`, `margin*`: número
- `border*Width`, `border*Color`, `border*Style`
- `borderRadius`: número
- `backgroundColor`, `color`
- `fontSize`, `fontWeight`, `fontStyle`, `fontFamily`
- `textAlign`: `'left'` | `'center'` | `'right'`
- `textTransform`: `'uppercase'`
- `letterSpacing`: número
- `lineHeight`: número
- `opacity`: 0–1
- `objectFit`: `'contain'` | `'cover'` (em Image)

### Não suportado

- `display: 'flex'` (flex é o padrão, sempre ativo)
- `position: 'absolute'` (existe mas com limitações)
- `overflow`, `zIndex`, `boxShadow`
- `<svg>` HTML (usar `Svg` do renderer)
- Aninhamento arbitrário de `<Text>` dentro de `<Text>` (ver seção 6)

---

## 6. Armadilhas Conhecidas (e como resolver)

### 6.1 Texto sobreposto por `<Text>` aninhado

**Problema**: `<Text><Text style={{fontWeight:'bold'}}>X%</Text> de entrada</Text>` causa sobreposição visual no render.

**Causa**: `@react-pdf/renderer` renderiza `<Text>` aninhado como camadas separadas, não inline.

**Solução A** (para bullets/listas): usar `<View>` flex com `<Text>` separados:

```jsx
<View style={{ flexDirection: 'row' }}>
  <Text style={{ width: M(4) }}>•</Text>
  <Text style={{ flex: 1 }}>15% de entrada (mobilização): pagamento em 28 dias.</Text>
</View>
```

**Solução B** (quando bold é aceitável como bloco): remover o `<Text>` nested e aceitar texto simples:

```jsx
<Text>{data.garantiaDefeitos || '5'} anos contra defeitos de fabricação.</Text>
```

**Solução C** (quando precisa de bold real): usar dois `<View>` em row com larguras fixas:

```jsx
<View style={{ flexDirection: 'row' }}>
  <Text style={{ fontWeight: 'bold', width: 60 }}>{percentual}%</Text>
  <Text style={{ flex: 1 }}>de entrada: pagamento em 28 dias.</Text>
</View>
```

### 6.2 `wrap={false}` e overflow de página

**Problema**: conteúdo muito longo dentro de `<View wrap={false}>` empurra para fora da página ou cria espaço em branco.

**Regra**: usar `wrap={false}` APENAS em blocos pequenos (título de seção + 2-3 linhas). Para conteúdo longo (parágrafos, listas extensas), **remover** `wrap={false}` e deixar o conteúdo quebrar naturalmente.

```jsx
// CORRETO — conteúdo curto
<View wrap={false}>
  <SectionTitle title="GARANTIAS DO SISTEMA" />
  <Text>5 anos contra defeitos...</Text>
</View>

// ERRADO — conteúdo longo
<View wrap={false}>
  <SectionTitle title="FATURAMENTO DIRETO" />
  <ParagraphSplitter text={textoLongo} />  <!-- Overflow! -->
</View>

// CORRETO — conteúdo longo
<View>
  <SectionTitle title="FATURAMENTO DIRETO" />
  <ParagraphSplitter text={textoLongo} />
</View>
```

### 6.3 Linha do título cortando o texto

**Problema**: `borderBottom` no título muito próximo do texto, parecendo que a linha "corta" as letras.

**Solução**: aumentar `paddingBottom` para pelo menos `6`:

```js
sectionTitle: {
  borderBottomWidth: 3,
  paddingBottom: 6,    // NÃO usar 2 — a linha colar no texto
  // ...
}
```

### 6.4 SVG não funciona em `<Image>`

**Problema**: `<Image src="logo.svg" />` não renderiza.

**Solução**: converter SVG → Canvas → PNG data URI antes de passar como `src` (ver seção 4.4).

### 6.5 Texto não quebra em tabela

**Problema**: células de tabela com texto longo não quebram linha.

**Solução**: usar `flex` proporcional nas colunas e `flexWrap` se necessário. Para tabelas com 4+ colunas, ajustar `flex` para dar mais espaço à coluna de descrição:

```js
valuesHeaderCellLeft: { flex: 4 },  // descrição
valuesHeaderCell: { flex: 1 },      // outras colunas
```

---

## 7. Estrutura de um Componente PDF

### Template padrão

```jsx
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const M = (mm) => mm * 2.83465;

const COLORS = { primary: '#1A5276', text: '#333333', /* ... */ };

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: COLORS.white,
    color: COLORS.text,
    paddingTop: M(25),
    paddingBottom: M(25),
    paddingLeft: M(25),
    paddingRight: M(25),
    fontSize: 9,
    lineHeight: 1.4,
  },
  // ... outros estilos
});

const MeuDocumentoPDF = ({ data, companySettings, logoSrc }) => {
  const primaryColor = companySettings?.primaryColor || COLORS.primary;

  return (
    <Document title={`Proposta ${data.numero}`} author="Empresa">
      <Page size="A4" style={styles.page} wrap>
        <View wrap={false}>
          {/* Header */}
        </View>
        <View wrap={false}>
          {/* Seção de dados */}
        </View>
        <View>
          {/* Seção de conteúdo longo (pode quebrar página) */}
        </View>
        <View wrap={false}>
          {/* Tabela de valores */}
        </View>
        <View wrap={false}>
          {/* Rodapé / Assinatura */}
        </View>
      </Page>
    </Document>
  );
};

export default MeuDocumentoPDF;
```

### Convenções de nomenclatura

- Componente: `{Tipo}DocumentPDF` (ex: `ArmazemDocumentPDF`)
- Arquivo: `{Tipo}DocumentPDF.jsx`
- Estilos: todos no topo do arquivo via `StyleSheet.create()`
- Helpers: `ParagraphSplitter`, `SectionTitle`, `DataRow` como componentes internos

---

## 8. Flags de Visibilidade Condicional

Padrão `show*` para controlar seções opcionais:

```jsx
// Padrão: visível quando NÃO é false (compatibilidade com dados legados)
const showSecao = data.showSecao !== false;

// Exceção: medição só aparece quando explicitamente habilitada
const showMedicao = !!data.showMedicao;

{showSecao && (
  <View wrap={false}>
    <SectionTitle title="SEÇÃO OPCIONAL" />
    {/* conteúdo */}
  </View>
)}
```

Isso permite que dados antigos (sem a flag) continuem funcionando com todas as seções visíveis por padrão.

---

## 9. Ícones SVG no PDF

Usar `Svg`, `Path`, `Circle` do `@react-pdf/renderer` (não o SVG HTML):

```jsx
import { Svg, Path, Circle } from '@react-pdf/renderer';

export const PhoneIcon = ({ color = '#1A5276' }) => (
  <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginRight: 3 }}>
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
      stroke={color} strokeWidth="2" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);
```

**Regras**: stroke-only (sem fill), `viewBox="0 0 24 24"`, `strokeWidth="2"`, `strokeLinecap="round"`.

---

## 10. Layout de Página A4

```
┌──────────────────────────────────┐  ← 25mm margem
│  [Logo] ┃  Tel: (44) 9 9813-9141│
│  PROJING ┃  Email: ...           │
│         ┃  Website: ...          │
│         ┃  CNPJ: ...             │
│         ┃  Endereço: ...         │
├──────────────────────────────────┤
│                                  │
│     PROPOSTA COMERCIAL           │  ← fontSize 24, bold
│        2026-05-123               │
│                                  │
├──────────────────────────────────┤
│  DADOS DA PROPOSTA               │  ← SectionTitle
│  Cliente: ...                    │
│  Local: ...                      │
│  Objeto: ...                     │
├──────────────────────────────────┤
│  DESCRIÇÃO DOS SERVIÇOS          │
│  Item 01.01 — ...               │
├──────────────────────────────────┤
│  [Seções condicionais]           │
├──────────────────────────────────┤
│  VALORES DA PROPOSTA             │
│  ┌──────┬─────────┬──────┬─────┐│
│  │ITEM  │DESCRIÇÃO│UNID. │VALOR││
│  ├──────┼─────────┼──────┼─────┤│
│  │ 01   │ ...     │ m2   │R$.. ││
│  ├──────┴─────────┴──────┴─────┤│
│  │  VALOR TOTAL:        R$..   ││
│  └─────────────────────────────┘│
├──────────────────────────────────┤
│  CONDIÇÕES DE PAGAMENTO          │
│  • 15% entrada: 28 dias          │
│  • 40% material: 28 dias         │
│  • 45% saldo: 28 dias            │
├──────────────────────────────────┤
│  [IMPOSTOS / MULTA / VALIDADE]   │
├──────────────────────────────────┤
│                                  │
│        Marialva, PR — 18/jun/26  │
│        J. Wilson Santos          │
│        (44) 9 9813-9141          │
│                                  │
├──────────────────────────────────┤
│  ═══════════ laranja ═══════════ │
│  PROJING — 15 ANOS DE EXPERIÊNCIA│
│  ┌─────────────┬────────────────┐│
│  │ Revestimentos│Infraestrutura ││
│  │ • Reservatórios│• Tubulações ││
│  │ • Silos     │• Tratamento   ││
│  │ • Armazéns  │• Efluentes    ││
│  └─────────────┴────────────────┘│
└──────────────────────────────────┘
```

---

## 11. Checklist para Nova Aplicação

- [ ] Instalar `@react-pdf/renderer`
- [ ] Criar palette de cores (COLORS) e helper `M(mm)`
- [ ] Criar `ParagraphSplitter` para texto multi-linha
- [ ] Implementar conversão SVG → PNG para logos
- [ ] Criar componente `SectionTitle` com paddingBottom ≥ 6
- [ ] Evitar `<Text>` aninhado — usar `<View>` flex quando precisar de formatação inline
- [ ] Usar `wrap={false}` apenas em blocos curtos
- [ ] Habilitar `wrap` no `<Page>` para overflow
- [ ] Definir flags `show*` com padrão `!== false` para dados legados
- [ ] Testar com conteúdo longo em cada seção
- [ ] Formatar valores monetários com `fmt()` (pt-BR)
- [ ] Testar em mobile com `@capacitor/filesystem` + `@capacitor/share`

---

## 12. Referência Rápida de Estilos

| Propriedade | Valor recomendado | Uso |
|------------|-------------------|-----|
| Page padding | `M(25)` (~70.87pt) | Margem A4 |
| Body fontSize | `9`–`10` | Texto do corpo |
| Section title fontSize | `15` | Títulos de seção |
| Section title paddingBottom | `6` | Espaço antes da borda |
| Section title borderBottomWidth | `3` | Grossura da linha |
| Table header fontSize | `8`–`9` | Cabeçalho de tabela |
| Table cell fontSize | `8`–`9` | Células |
| Header right fontSize | `8` | Informações de contato |
| Footer fontSize | `9` | Itens do rodapé |
| Paragraph lineHeight | `1.4`–`1.5` | Legibilidade |
| Letter spacing (títulos) | `0.5`–`2` | Tracking |
