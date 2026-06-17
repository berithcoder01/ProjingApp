# Geração de PDF

Gera PDFs de proposta comercial usando `@react-pdf/renderer` (texto nativo, selecionável, sem captura de DOM).

## Visão Geral

```
Ação do usuário
  │
  ├─ Wizard (criação): StepRevisao / Step10Documento
  │   └─ chama pdfService.generate*PDF()
  │
  └─ ProposalsList (propostas salvas)
      └─ renderiza PdfGenerator (renderless) → useEffect → pdfService
```

Três tipos de proposta, cada um com seu componente PDF e função de geração.

---

## Fluxo de Geração

### 1. pdfService — Orquestrador Central

**Arquivo:** `app/src/features/proposal/services/pdfService.jsx`

Funções exportadas:

| Função | Componente PDF | Props |
|---|---|---|
| `generateProposalPDF({ propNum, cliente, items, cond, companySettings })` | `ProposalDocumentPDF` | `cliente`, `items[]`, `cond`, `propNum`, `companySettings`, `logoSrc` |
| `generateMaterialPDF({ propNum, cliente, items, cond, companySettings })` | `MaterialDocumentPDF` | (mesma assinatura) |
| `generateArmazemPDF({ propNum, data, companySettings })` | `ArmazemDocumentPDF` | `data` (objeto único), `companySettings`, `logoSrc` |

Floco interno de cada `generate*PDF()`:

```js
const logoSrc = await getLogoPngDataUri();   // SVG → canvas → PNG data URI
const doc = <ProposalDocumentPDF {...props} logoSrc={logoSrc} />;
const blob = await pdf(doc).toBlob();         // @react-pdf/renderer
await shareOrDownload(blob, sanitizeFilename(propNum));
```

### 2. Disparo pelo Wizard (criação)

**StepRevisao** (`app/src/features/proposal/components/StepRevisao.jsx`):
- Botão "Baixar PDF"
- Roteia por `tipo`: `'material'` → `generateMaterialPDF()`, senão → `generateProposalPDF()`
- Passa `{ propNum, cliente, items, cond, companySettings }` direto do estado do wizard

**Step10Documento** (`app/src/features/proposal/components/armazem/Step10Documento.jsx`):
- Botão "Salvar e Gerar PDF"
- **Antes** de gerar o PDF, **salva a proposta no banco** (criação ou atualização)
- Depois chama `generateArmazemPDF({ propNum, data, companySettings })`
- `data` = estado completo do wizard armazém (objeto plano)

### 3. Disparo pela Lista de Propostas

**PdfGenerator** (`app/src/features/proposal/components/PdfGenerator.jsx`):
- Componente **renderless** (retorna `null`), executa lógica em `useEffect`
- Recebe `{ proposal, companySettings, onDone }`
- Lê `proposal.metadata.tipo` para decidir o caminho:
  - `'armazem'` → reconstrói objeto `data` plano a partir dos metadados aninhados
  - `'material'` → reconstrói `{ cliente, items, cond }` dos campos da proposta + metadata
  - `'geral'` (padrão) → reconstrói `{ cliente, items, cond }`
- Chama `generate*PDF()` e depois `onDone()`

**ProposalsList** (`app/src/features/proposal/ProposalsList.jsx`):
- Cada linha da tabela tem botão "PDF"
- Seta `generatingId` → renderiza `<PdfGenerator>` com a proposta → gera → limpa `generatingId`

---

## Componentes de Documento PDF

Usam `Document`, `Page`, `View`, `Text`, `Image`, `StyleSheet` do `@react-pdf/renderer`.
Ícones SVG via `Svg`, `Path`, `Circle` (componentes `PDFIcons.jsx`).

### ProposalDocumentPDF
**Arquivo:** `app/src/features/proposal/components/ProposalDocumentPDF.jsx`

Seções:
1. Header (logo + contato com ícones)
2. Título "PROPOSTA COMERCIAL" + número
3. DADOS DA PROPOSTA (tabela cliente)
4. DESCRIÇÃO DOS SERVIÇOS (por item)
5. VALOR DA PROPOSTA (tabela QTD + VALOR)
6. FORMA DE PAGAMENTO (5 sub-bullets condicionais via `show*`)
7. GARANTIAS / QUADRO DE IMPOSTOS / MULTA / VALIDADE / PRAZO EXECUÇÃO
8. RESPONSABILIDADE DA CONTRATADA
9. OBSERVAÇÕES GERAIS
10. Assinatura + rodapé institucional 2 colunas

### MaterialDocumentPDF
**Arquivo:** `app/src/features/proposal/components/MaterialDocumentPDF.jsx`

Seções:
1. Header + título "PROPOSTA COMERCIAL — FORNECIMENTO DE MATERIAIS"
2. DADOS DA PROPOSTA
3. DESCRIÇÃO DOS MATERIAIS
4. ESPECIFICAÇÕES TÉCNICAS
5. PRAZO E CONDIÇÕES DE ENTREGA (prazo, local, frete)
6. VALOR DA PROPOSTA (6 colunas: ITEM, DESCRIÇÃO, UNID., QTD., VALOR UNIT., VALOR TOTAL)
7. CONDIÇÕES DE PAGAMENTO / GARANTIA DO MATERIAL / VALIDADE / OBS

### ArmazemDocumentPDF
**Arquivo:** `app/src/features/proposal/components/ArmazemDocumentPDF.jsx`

Recebe `data` único (não separado em cliente/items/cond). Seções:
1. Header + título
2. DADOS DA PROPOSTA
3. DESCRIÇÃO DOS SERVIÇOS (item fixo "Revestimento de Rampas e Peitos")
4. Características Técnicas / ESCOPO E RESPONSABILIDADES
5. GARANTIAS DO SISTEMA
6. VALORES DA PROPOSTA (tabela de linha única)
7. CONDIÇÕES DE PAGAMENTO (com `calculateSaldo()` interno)
8. FATURAMENTO DIRETO / IMPOSTOS / MULTA / VALIDADE / PRAZO EXECUÇÃO / OBS

### PDFIcons.jsx
**Arquivo:** `app/src/features/proposal/components/PDFIcons.jsx`

5 componentes SVG para uso nos headers dos PDFs:
`PhoneIcon`, `MailIcon`, `GlobeIcon`, `HashIcon`, `MapPinIcon`

Tamanho 9pt, cor configurável via prop `color` (default `#1A5276`).

---

## Funções Auxiliares Internas (pdfService)

### `getLogoPngDataUri()`
```js
async function getLogoPngDataUri(): Promise<string | null>
```
- Fetch do SVG (`logoProjingUrl`)
- Cria `Blob` → `Image()` → desenha em `<canvas>` (targetWidth 600)
- Retorna `canvas.toDataURL('image/png')`
- Cache em `cachedLogoPng` (módulo-level)
- Se falhar, loga warning e retorna `null`

### `shareOrDownload(blob, filename)`
```js
async function shareOrDownload(blob: Blob, filename: string): Promise<void>
```
- **Mobile (Capacitor):** `Filesystem.writeFile` (cache) → `Share.share()`
- **Desktop:** `URL.createObjectURL` → `<a download>` click → revoga URL após 100ms

### `sanitizeFilename(propNum)`
```js
function sanitizeFilename(propNum: string): string
```
Retorna `Proposta_<sanitized>.pdf` (substitui caracteres especiais por `-`)

---

## Paleta de Cores (constante `COLORS` em cada *PDF.jsx)

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#1A5276` (customizável via `companySettings.primaryColor`) | Títulos, bordas decorativas, badges |
| `orange` | `#E67E22` | Nome da marca no rodapé |
| `muted` | `#666666` | Textos secundários |
| `text` | `#333333` | Corpo do texto |
| `border` | `#CCCCCC` | Bordas de tabelas |
| `borderLight` | `#EEEEEE` | Bordas sutis |
| `rowAlt` | `#F2F6FC` | Linhas alternadas de tabela |
| `badge` | `#f8f9fa` | Fundo de badges |

---

## Árvore de Dependências

```
constants.js  ──────────────────────┐
                                    ├──> ProposalDocumentPDF.jsx
PDFIcons.jsx  ──────────────────────┤        MaterialDocumentPDF.jsx
                                    │        ArmazemDocumentPDF.jsx
logo.svg      ──────────────────────┤
                                    │
pdfService.jsx <────────────────────┘
  │   │   │
  │   │   └──> generateMaterialPDF()
  │   └────────> generateArmazemPDF()
  └────────────> generateProposalPDF()
       │
       ├── StepRevisao.jsx (wizard geral/material)
       ├── Step10Documento.jsx (wizard armazém)
       └── PdfGenerator.jsx (renderless, via ProposalsList)
```

---

## Notas de Arquitetura

- **Preview DOM vs PDF nativo:** Componentes `ProposalDocument.jsx` / `MaterialDocument.jsx` são HTML puro para preview em tela (StepRevisao). PDF usa componentes `*PDF.jsx` separados com `@react-pdf/renderer`. Armazém não tem preview DOM.
- **Logo:** SVG → canvas → PNG porque `@react-pdf/renderer` não renderiza SVG nativamente.
- **Visibilidade condicional:** Cada seção usa flag `cond.show*` (ex: `showPagamento`, `showValidade`) — default `!== false` para compatibilidade com dados legados.
- **Armazém:** Usa objeto `data` único em vez de `{ cliente, items, cond }` separados porque o wizard armazém tem estrutura muito diferente (geometria, cálculos, rateio de pagamento detalhado).
