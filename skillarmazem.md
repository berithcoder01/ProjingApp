name: orcamento-geomembrana
description: >
  Gera propostas comerciais padronizadas em .docx para serviços de revestimento de armazéns
  e silos com geomembrana PEAD (espessuras 0,50mm a 3,00mm). Use esta skill SEMPRE que
  o usuário pedir para gerar, criar ou montar um orçamento, proposta comercial, cotação ou
  documento de proposta para revestimento com geomembrana, impermeabilização de armazém ou
  silo. A skill calcula automaticamente a área do armazém a partir das dimensões, arredonda
  para bobinas inteiras, aplica preços reais por espessura e produz o arquivo .docx completo
  pronto para envio ao cliente, seguindo o padrão da PROJING & HB ENGENHARIA.
---

# Skill: Gerador de Proposta Comercial — Geomembrana PEAD

## O que esta skill faz

1. Recebe as dimensões do armazém e calcula automaticamente a área total a revestir
2. Arredonda para cima para cobrir bobinas inteiras da espessura escolhida
3. Calcula o custo do material (geomembrana + frete) com base na tabela de preços oficial
4. Gera o arquivo `.docx` completo de proposta comercial no padrão da empresa

---

## TABELA DE BOBINAS E PREÇOS (BMD — FRETE FOB, ICMS 12%)

Esta é a fonte oficial de referência para metragem por bobina e preço por m²:

| Código | Descrição          | Espessura | Med. Bobina (m²) | Preço Mínimo (R$/m²) | Preço Ideal (R$/m²) |
|--------|--------------------|-----------|------------------|----------------------|---------------------|
| 338401 | MACMANTA           | 0,50 mm   | 1.180            | R$ 6,08              | R$ 6,43             |
| —      | MACLINE SDH        | 0,75 mm   | 885              | R$ 9,26              | R$ 9,79             |
| 336043 | MACLINE SDH        | 0,80 mm   | 826              | R$ 9,70              | R$ 10,27            |
| 336044 | MACLINE SDH        | 1,00 mm   | 708              | R$ 12,14             | R$ 12,85            |
| 306333 | MACLINE SDH        | 1,50 mm   | 448              | R$ 18,24             | R$ 19,30            |
| 306269 | MACLINE SDH        | 2,00 mm   | 250              | R$ 24,52             | R$ 25,95            |
| 306332 | MACLINE SDH        | 2,50 mm   | 207              | R$ 32,08             | R$ 33,95            |
| 335292 | MACLINE SDH        | 3,00 mm   | 176              | R$ 39,09             | R$ 41,36            |

**Regra de arredondamento:** a metragem calculada deve ser **sempre arredondada para cima** até o múltiplo de bobinas inteiras da espessura escolhida.  
Exemplo: área calculada 1.900 m², espessura 2,00 mm (250 m²/bobina) → 1.900 / 250 = 7,6 → **8 bobinas → 2.000 m²**

**Frete estimado:** R$ 4.000 a R$ 9.000 dependendo da quantidade de bobinas:
- Até 5 bobinas: ~R$ 4.000
- 6 a 10 bobinas: ~R$ 5.500
- 11 a 15 bobinas: ~R$ 7.000
- Acima de 15 bobinas: ~R$ 9.000

---

## Passo 1 — Coletar os dados necessários

### Campos de dimensionamento do armazém (OBRIGATÓRIOS para cálculo de área)

| Campo            | Descrição                                                                 | Exemplo  |
|------------------|---------------------------------------------------------------------------|----------|
| `largura`        | Largura do armazém (base maior do trapézio = base dos peitos)             | 24 m     |
| `comprimento`    | Comprimento total da rampa (altura do trapézio)                           | 23 m     |
| `espessura`      | Espessura da geomembrana a usar                                           | 2,00 mm  |

> **Nota sobre o comprimento da rampa:** o usuário pode fornecer diretamente o comprimento da rampa.
> Caso o usuário informe apenas o comprimento total do armazém, considere que o comprimento da rampa
> é o valor fornecido (normalmente a dimensão ao longo do telhado, não a planta).

### Campos de identificação do orçamento (OBRIGATÓRIOS)

| Campo        | Descrição                             | Exemplo         |
|--------------|---------------------------------------|-----------------|
| `cliente`    | Nome da empresa cliente               | Cargill          |
| `contato`    | Nome do responsável no cliente        | Douglas          |
| `local`      | Cidade e estado da obra               | Uberlândia, MG  |
| `referencia` | Capacidade do armazém/silo            | 60.000t (105m)  |

### Campos opcionais (use os padrões se não fornecidos)

| Campo                        | Padrão                  | Descrição                                        |
|------------------------------|-------------------------|--------------------------------------------------|
| `num_proposta`               | Sequencial XXXX-MM/AA   | Número da proposta                               |
| `data_proposta`              | Data de hoje            | Data de emissão                                  |
| `cidade_emissao`             | Marialva                | Cidade onde a proposta é emitida                 |
| `tipo_estrutura`             | Armazém graneleiro      | Armazém graneleiro / Silo / Ambos                |
| `prazo_execucao`             | 70 dias                 | Dias de obra efetiva                             |
| `validade_proposta`          | 60 dias                 | Validade da proposta                             |
| `responsavel`                | J. Wilson Santos        | Nome do responsável da empresa                   |
| `telefone`                   | (44) 99813-9141         | Telefone de contato                              |
| `incluir_faturamento_direto` | sim                     | Incluir cláusulas de faturamento direto (Cargill)|
| `valor_total`                | Calculado automaticamente | Pode ser sobrescrito manualmente se necessário |

---

## Passo 2 — Calcular a área do armazém

O armazém é composto por **2 rampas (trapézios)** + **2 peitos (triângulos)**.

### 2.1 — Dimensões derivadas

```
base_maior_rampa = comprimento                  (ex: 110 m)
base_menor_rampa = base_maior_rampa × 0,80      (20% menor — fundo do armazém)
                   ex: 110 × 0,80 = 88 m

base_peito       = largura                      (ex: 30 m)

altura_trap      = rampa                        (ex: 22 m)
altura_tri       = rampa × 0,50                 (média = 50% do comprimento da rampa)
                   ex: 22 × 0,50 = 11 m
```

### 2.2 — Área das rampas (2 trapézios)

```
area_trapezio = ((base_maior_rampa + base_menor_rampa) / 2) × altura_trap
area_rampas   = 2 × area_trapezio

Exemplo:
  area_trap = ((110 + 88) / 2) × 22 = 99 × 22 = 2.178 m²
  area_rampas = 2 × 2.178 = 4.356 m²
```

### 2.3 — Área dos peitos (2 triângulos)

```
area_triangulo = (base_peito × altura_tri) / 2
area_peitos    = 2 × area_triangulo

Exemplo:
  area_tri  = (30 × 11) / 2 = 165 m²
  area_peitos = 2 × 165 = 330 m²
```

### 2.4 — Área total calculada

```
area_calculada = area_rampas + area_peitos

Exemplo:
  area_calculada = 4.356 + 330 = 4.686 m²
```

### 2.5 — Arredondamento para bobinas inteiras

```
qtd_bobinas = TETO(area_calculada / med_bobina)   ← sempre arredondar para CIMA
area_geo    = qtd_bobinas × med_bobina

Exemplo (espessura 2,00 mm → 250 m²/bobina):
  qtd_bobinas = TETO(1.269,6 / 250) = TETO(5,078) = 6
  area_geo = 6 × 250 = 1.500 m²
```

> **IMPORTANTE:** `area_geo` é o valor real a ser declarado na proposta, pois representa
> as bobinas inteiras que efetivamente precisam ser compradas.

---

## Passo 3 — Calcular custo do material (referência interna)

Use a tabela do início desta skill para consultar o preço por m² da espessura escolhida.

```
custo_material_minimo = area_geo × preco_minimo
custo_material_ideal  = area_geo × preco_ideal
frete_estimado        = (conforme faixa de qtd_bobinas acima)

custo_total_material_min = custo_material_minimo + frete_estimado
custo_total_material_ide = custo_material_ideal  + frete_estimado
```

Este cálculo é referência interna para composição do orçamento. O `valor_total` da proposta
deve cobrir material + mão de obra + despesas. Use como base e ajuste conforme margem desejada.

---

## Passo 4 — Calcular valores de pagamento

Com o `valor_total`, calcule as parcelas padrão:
- **15%** no início da obra (mobilização) — pagamento em 45 dias
- **40%** na entrega do material (geomembrana) — pagamento em 45 dias
- **45%** saldo após conclusão — pagamento em 60 dias

Formate todos os valores em reais por extenso, ex: `R$ 393.000,00 (Trezentos e noventa e três mil reais)`.

---

## Passo 5 — Gerar o arquivo .docx

Use Node.js com a biblioteca `docx` (já instalada globalmente via `npm install -g docx`).

### 5.1 Criar o script gerador

Salve em `/home/claude/gerar_proposta.cjs` (formato CommonJS, não ESM).

Execute sempre com:
```bash
NODE_PATH=/home/claude/.npm-global/lib/node_modules node /home/claude/gerar_proposta.cjs
```

**IMPORTANTE:** Use `require('docx')` e `require('fs')` — não use `import`. O arquivo deve ter extensão `.cjs`.

### 5.2 Template do script

```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType,
        LevelFormat } = require('docx');
const fs = require('fs');

// ── DADOS DA PROPOSTA (substitua com os valores reais) ──────────────────────
const P = {
  numProposta:    "XXXX-MM/AA",
  dataFormatada:  "XX de mês de XXXX",  // ex: "19 de março de 2025"
  cidadeEmissao:  "Marialva",
  validade:       "60",

  cliente:        "Nome do Cliente",
  contato:        "Nome do Contato",
  local:          "Cidade, UF",
  referencia:     "XX.XXXt",
  tipoEstrutura:  "Armazém graneleiro",
  espessura:      "2,0",

  // Dimensões e área calculada
  largura:        "XX m",
  comprimento:    "XX m",
  areaObra:       "X.XXX m²",   // área calculada (rampas + peitos)
  areaGeo:        "X.XXX m²",   // área arredondada para bobinas inteiras
  qtdBobinas:     "X bobinas",
  prazo:          "70",

  valorTotal:     "R$ XXX.XXX,XX (Por extenso)",
  parc1:          "R$ XXX.XXX,XX",  // 15%
  parc2:          "R$ XXX.XXX,XX",  // 40%
  parc3:          "R$ XXX.XXX,XX",  // 45%

  responsavel:    "J. Wilson Santos",
  telefone:       "(44) 99813-9141",
  inclFaturamento: true,
};
// ────────────────────────────────────────────────────────────────────────────

// Helpers de estilo
const VERDE = "1B5E20";
const VERDE_CLARO = "E8F5E9";
const CINZA = "F5F5F5";
const BORDA_CINZA = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDAS = { top: BORDA_CINZA, bottom: BORDA_CINZA, left: BORDA_CINZA, right: BORDA_CINZA };
const SEM_BORDA = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const SEM_BORDAS = { top: SEM_BORDA, bottom: SEM_BORDA, left: SEM_BORDA, right: SEM_BORDA };
const W = 9360;

const para = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: "Arial", size: opts.size || 22, bold: opts.bold || false,
    color: opts.color || "000000", italics: opts.italic || false })],
  alignment: opts.align || AlignmentType.LEFT,
  spacing: { before: opts.before || 80, after: opts.after || 80 },
  ...(opts.heading ? { heading: opts.heading } : {}),
});

const paraBold = (text, opts = {}) => para(text, { ...opts, bold: true });

const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, font: "Arial", size: 22 })],
  spacing: { before: 60, after: 60 },
});

const bulletBold = (text, rest = "") => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [
    new TextRun({ text, font: "Arial", size: 22, bold: true }),
    new TextRun({ text: rest, font: "Arial", size: 22 }),
  ],
  spacing: { before: 60, after: 60 },
});

const heading = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: VERDE })],
  spacing: { before: 280, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: VERDE, space: 4 } },
});

const espacoVazio = () => new Paragraph({ children: [], spacing: { before: 80, after: 80 } });

const tabelaInfo = (rows) => new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [2400, 6960],
  rows: rows.map(([label, valor]) => new TableRow({
    children: [
      new TableCell({
        borders: BORDAS, width: { size: 2400, type: WidthType.DXA },
        shading: { fill: CINZA, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 22, bold: true })] })],
      }),
      new TableCell({
        borders: BORDAS, width: { size: 6960, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: valor, font: "Arial", size: 22 })] })],
      }),
    ],
  })),
});

const tabelaImpostos = () => new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [3000, 3000, 3360],
  rows: [
    new TableRow({
      children: ["Categoria", "Imposto", "Percentual"].map((h, i) => new TableCell({
        borders: BORDAS, width: { size: [3000, 3000, 3360][i], type: WidthType.DXA },
        shading: { fill: VERDE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 22, bold: true, color: "FFFFFF" })] })],
      })),
    }),
    ...[
      ["Serviço Federal", "DAS", "11,2%"],
      ["Serviço Municipal", "ISS", "2,79%"],
      ["Produto (Geomembrana)", "IPI", "15%"],
      ["Produto (Geomembrana)", "Difal", "6%"],
    ].map((row, idx) => new TableRow({
      children: row.map((cell, i) => new TableCell({
        borders: BORDAS, width: { size: [3000, 3000, 3360][i], type: WidthType.DXA },
        shading: { fill: idx % 2 === 0 ? CINZA : "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 22 })] })],
      })),
    })),
  ],
});

const secaoFaturamentoDireto = () => [
  heading("Faturamento Direto"),
  bullet("O faturamento será realizado diretamente ao contratante, conforme procedimento padrão."),
  bullet("Nota fiscal de serviço emitida pelo prestador após aprovação do evento de pagamento."),
  bullet("Nota fiscal de produto (geomembrana) emitida pelo fornecedor diretamente ao contratante."),
];

// ── DOCUMENTO ────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 180 } } } }],
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 180 } } } }],
      },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
    children: [
      // ── CABEÇALHO ───────────────────────────────────────────────────────
      new Paragraph({
        children: [new TextRun({ text: "PROJING & HB ENGENHARIA", font: "Arial", size: 32, bold: true, color: VERDE })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Proposta Comercial — Revestimento com Geomembrana PEAD", font: "Arial", size: 22, color: "555555" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: VERDE, space: 4 } },
      }),
      espacoVazio(),

      // ── IDENTIFICAÇÃO ───────────────────────────────────────────────────
      heading("Identificação da Proposta"),
      tabelaInfo([
        ["Proposta Nº",     P.numProposta],
        ["Data",            P.dataFormatada],
        ["Validade",        `${P.validade} dias`],
        ["Cliente",         P.cliente],
        ["Contato",         P.contato],
        ["Local da Obra",   P.local],
        ["Referência",      P.referencia],
      ]),
      espacoVazio(),

      // ── OBJETO ──────────────────────────────────────────────────────────
      heading("Objeto"),
      para(`Fornecimento e instalação de geomembrana PEAD ${P.espessura} mm em ${P.tipoEstrutura.toLowerCase()} (${P.referencia}), localizado em ${P.local}.`),
      espacoVazio(),

      // ── DIMENSIONAMENTO ─────────────────────────────────────────────────
      heading("Dimensionamento do Armazém"),
      tabelaInfo([
        ["Largura",              P.largura],
        ["Comprimento da Rampa", P.comprimento],
        ["Área Calculada",       P.areaObra],
        ["Área Geomembrana",     `${P.areaGeo} (${P.qtdBobinas})`],
        ["Espessura",            `${P.espessura} mm`],
      ]),
      espacoVazio(),

      // ── ESCOPO DOS SERVIÇOS ──────────────────────────────────────────────
      heading("Escopo dos Serviços"),
      bullet("Fornecimento de geomembrana PEAD 100% virgem, espessura " + P.espessura + " mm."),
      bullet("Instalação e fixação por termofusão com cordão de sustentação a cada 2,50 m."),
      bullet("Ancoragem por chumbadores de expansão mecânica (~60% das rampas)."),
      bullet("Revestimento de paredes verticais: 1,00 m + continuidade de 0,50 m na rampa."),
      bullet("Fornecimento de todos os materiais de aplicação, consumíveis, EPIs e equipamentos."),
      bullet("Mobilização e desmobilização de equipe especializada."),
      espacoVazio(),

      // ── ESPECIFICAÇÃO TÉCNICA ─────────────────────────────────────────
      heading("Especificação Técnica do Material"),
      tabelaInfo([
        ["Material",                "Geomembrana PEAD 100% virgem"],
        ["Espessura",               `${P.espessura} mm`],
        ["Densidade",               "0,94 a 0,96 g/cm³"],
        ["Temperatura de fusão",    "135 a 150 °C"],
        ["Resistência a rasgos",    "180 a 390 N"],
        ["Cordão de sustentação",   "Termofundido a cada 2,50 m"],
        ["Ancoragem",               "Chumbadores de expansão mecânica (~60% das rampas)"],
        ["Paredes verticais",       "1,00 m + continuidade 0,50 cm na rampa"],
      ]),
      espacoVazio(),

      // ── RESPONSABILIDADES DA CONTRATADA ──────────────────────────────
      heading("Responsabilidades da Contratada"),
      bullet("Assumir integral responsabilidade por danos causados à contratante ou a terceiros, decorrentes dos serviços contratados;"),
      bullet("Descarga e movimentação dos materiais destinados à obra;"),
      bullet("Apresentar ao departamento de pessoal da contratante os documentos de cada funcionário alocado na obra (carteira de trabalho e registro);"),
      bullet("Técnico em segurança do trabalho em tempo integral no canteiro de obras (caso necessário);"),
      bullet("Guarda de materiais, equipamentos e ferramentas;"),
      bullet("Todas as entregas CIF, inclusive de terceiros;"),
      bullet("Apresentar contratos com subcontratados para a contratante, caso exista;"),
      bullet("Após a conclusão do serviço, desmontar e desmobilizar o canteiro, bem como limpar todas as áreas utilizadas pela contratada;"),
      bullet("Retirar toda a sobra de materiais, que será de sua propriedade;"),
      bullet("Seguir rigorosamente as normas de segurança vigentes e as normas internas da contratante."),

      // ── GARANTIAS ────────────────────────────────────────────────────
      heading("Garantias"),
      bullet("5 anos contra defeitos de fabricação e instalação."),
      bullet("1 ano contra acidentes de rasgamento, ruptura e furos (garantia cobre mão de obra e deslocamento de técnicos)."),
      bullet("30 anos de expectativa de durabilidade."),
      bullet("Vistoria anual (primeiro ano)."),
      bullet("Vistoria bienal (terceiro e quinto ano)."),

      // ── FORNECIMENTO DO CLIENTE ──────────────────────────────────────
      heading("Fornecimento do Cliente"),
      bullet("Energia elétrica 220V (máximo 100 m do local da obra)."),

      // ── FATURAMENTO DIRETO (condicional) ─────────────────────────────
      ...(P.inclFaturamento ? secaoFaturamentoDireto() : []),

      // ── VALOR DA PROPOSTA ─────────────────────────────────────────────
      heading("Valor da Proposta"),
      new Paragraph({
        children: [
          new TextRun({ text: `${P.tipoEstrutura} (${P.referencia}) `, font: "Arial", size: 22, bold: true }),
          new TextRun({
            text: "Mão de obra de aplicação (geomembrana, frete, materiais de aplicação, materiais de consumo, tintas, despesas com pessoal e EPIs): ",
            font: "Arial", size: 22,
          }),
          new TextRun({ text: P.valorTotal, font: "Arial", size: 22, bold: true }),
          new TextRun({ text: ".", font: "Arial", size: 22 }),
        ],
        spacing: { before: 80, after: 80 },
        indent: { left: 360 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Total Geral: ", font: "Arial", size: 22, bold: true }),
          new TextRun({ text: P.valorTotal, font: "Arial", size: 22, bold: true }),
        ],
        spacing: { before: 80, after: 80 },
        indent: { left: 360 },
      }),

      // ── FORMA DE PAGAMENTO ────────────────────────────────────────────
      heading("Forma de Pagamento"),
      bullet(`15% no início da obra (referente à mobilização), pagamento em 45 dias — ${P.parc1}.`),
      bullet(`40% na entrega do material (geomembrana), pagamento em 45 dias — ${P.parc2}.`),
      bullet(`Saldo em 60 dias após a conclusão — ${P.parc3}.`),
      espacoVazio(),
      paraBold("Procedimento de Pagamento:", { size: 22 }),
      bullet("Notificação de finalização do evento."),
      bullet("Aprovação em até 05 dias."),
      bullet("Emissão de nota fiscal (quando cabível)."),
      bullet("Preços fixos e irreajustáveis até o final do contrato."),
      bullet("Depósito bancário."),

      // ── IMPOSTOS ─────────────────────────────────────────────────────
      heading("Impostos"),
      tabelaImpostos(),

      // ── MULTA CONTRATUAL ──────────────────────────────────────────────
      heading("Multa Contratual"),
      para("Multa por atraso na entrega da obra será de 0,3% ao dia, limitado a 10% do contrato."),

      // ── VALIDADE ─────────────────────────────────────────────────────
      heading("Validade da Proposta"),
      bullet(`${P.validade} dias.`),

      // ── PRAZO DE EXECUÇÃO ────────────────────────────────────────────
      heading("Prazo de Execução"),
      bullet(`${P.prazo} dias de obra efetiva.`),
      espacoVazio(),
      new Paragraph({
        children: [
          new TextRun({ text: "Observação: ", font: "Arial", size: 22, bold: true }),
          new TextRun({
            text: "O fator climático é determinante no cumprimento do prazo de execução, assim como os ambientes a serem revestidos devem estar isentos de conteúdos (grãos ou outros). Frentes de trabalho sem interferência de terceiros são fundamentais para o cumprimento do prazo.",
            font: "Arial", size: 22, italics: true,
          }),
        ],
        spacing: { before: 80, after: 160 },
      }),

      // ── ASSINATURA ───────────────────────────────────────────────────
      new Paragraph({
        children: [],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
        spacing: { before: 200, after: 80 },
      }),
      para(`${P.cidadeEmissao}, ${P.dataFormatada}`, { align: AlignmentType.LEFT }),
      espacoVazio(),
      new Paragraph({
        children: [
          new TextRun({
            text: "Somos gratos desde já por participarmos deste projeto na forma de proposta orçamentária. Sempre à vossa disposição.",
            font: "Arial", size: 22, bold: true, italics: true, color: VERDE,
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 200 },
      }),
      ...(P.responsavel ? [
        para(P.responsavel, { bold: true }),
        ...(P.telefone ? [para(P.telefone)] : []),
      ] : []),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const filename = `Proposta_${P.numProposta.replace(/\//g, "-")}_${P.cliente.replace(/\s+/g, "_")}.docx`;
  fs.writeFileSync(`/home/claude/${filename}`, buffer);
  console.log(`✅ Gerado: /home/claude/${filename}`);
});
```

---

## Passo 6 — Validar e entregar

```bash
# Validar o arquivo gerado
python /mnt/skills/public/docx/scripts/office/validate.py /home/claude/<nome>.docx

# Copiar para outputs
cp /home/claude/<nome>.docx /mnt/user-data/outputs/<nome>.docx
```

Use `present_files` para entregar o arquivo ao usuário.

---

## Regras de negócio fixas (nunca altere)

| Campo                  | Valor fixo                                         |
|------------------------|----------------------------------------------------|
| Material               | Geomembrana PEAD 100% virgem                       |
| Densidade              | 0,94 a 0,96 g/cm³                                  |
| Temperatura de fusão   | 135 a 150 °C                                       |
| Resistência a rasgos   | 180 a 390 N                                        |
| Cordão de sustentação  | Termofundido a cada 2,50 m                         |
| Ancoragem              | Chumbadores de expansão mecânica (~60% das rampas) |
| Paredes verticais      | 1,00 m + continuidade 0,50 cm na rampa             |
| Garantia fabricação    | 5 anos                                             |
| Garantia rasgos        | 1 ano (cobre M.O. e deslocamento)                  |
| Durabilidade esperada  | 30 anos                                            |
| Vistoria               | Anual (1º ano) + Bienal (3º e 5º ano)              |
| Fornecimento cliente   | Energia 220V, máx. 100 m da obra                   |
| Pagamento: mobilização | 15%, 45 dias                                       |
| Pagamento: material    | 40%, 45 dias                                       |
| Pagamento: saldo       | 45%, 60 dias pós-conclusão                         |
| DAS Federal            | 11,2%                                              |
| ISS                    | 2,79%                                              |
| IPI Geomembrana        | 15%                                                |
| Difal                  | 6%                                                 |
| Multa por atraso       | 0,3% ao dia, limite 10%                            |
| Aprovação pagamento    | até 05 dias                                        |
| Base_menor             | Sempre 80% da base_maior (fundo do armazém)        |
| Altura_triângulo       | Sempre 50% do comprimento da rampa                 |

---

## Exemplo completo de uso

**Usuário diz:**
> "Gera um orçamento para a Bunge, contato Marcos, armazém 80.000t em Rondonópolis MT,
> largura 24m, rampa 23m, espessura 2mm"

**Você deve:**

1. **Calcular dimensões:**
   - base_maior = 24 m | base_menor = 24 × 0,80 = 19,2 m
   - altura_trap = 23 m | altura_tri = 23 × 0,50 = 11,5 m

2. **Calcular área:**
   - area_rampas = 2 × ((24 + 19,2) / 2) × 23 = 2 × 496,8 = 993,6 m²
   - area_peitos = 2 × (24 × 11,5) / 2 = 276 m²
   - area_calculada = 993,6 + 276 = **1.269,6 m²**

3. **Arredondar para bobinas** (2,00 mm → 250 m²/bobina):
   - qtd_bobinas = TETO(1.269,6 / 250) = **6 bobinas**
   - area_geo = 6 × 250 = **1.500 m²**

4. **Custo material (referência):**
   - Mínimo: 1.500 × R$ 24,52 = R$ 36.780 + frete ~R$ 5.500 = ~R$ 42.280
   - Ideal: 1.500 × R$ 25,95 = R$ 38.925 + frete ~R$ 5.500 = ~R$ 44.425

5. **Compor valor total** com margem de M.O. + despesas e definir `valor_total`

6. **Calcular parcelas** (15% / 40% / 45%) e gerar o `.docx`