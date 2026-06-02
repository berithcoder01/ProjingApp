# Relatório de Discrepâncias — Modelo de Proposta Comercial

> **Referência de comparação:**
> - ✅ **Original (padrão):** `proposta_original.pdf` — Brenntag / 2025-03-01
> - ⚠️ **Gerada pelo sistema:** `Proposta_001-50-26-1.pdf` — Copacol / 001-50/26

---

## 1. CABEÇALHO E IDENTIDADE VISUAL

### ❌ Problema: Logo ausente na proposta gerada
- **Original:** Exibe o logotipo completo da **PROJINGPRO** (com ícone e slogan "SOLUÇÕES EM PEAD") no canto superior esquerdo, ao lado dos dados de contato estruturados com ícones.
- **Gerada pelo sistema:** Exibe apenas texto simples "**SOLUÇÕES EM PEAD**" sem logo, sem ícones, e os dados de contato estão em texto corrido no canto superior direito sem formatação visual.

### ✅ Solução a implementar
- Incluir o logotipo PROJINGPRO (imagem) no cabeçalho da proposta gerada.
- Estruturar os dados de contato com ícones (telefone, e-mail, site, CNPJ, endereço), espelhando o layout da proposta original.
- Adicionar o CNPJ `54.348.703/0001-34` e o endereço `Rua João Hungari, 575, Marialva PR, CEP 86990-000` ao cabeçalho — ausentes na proposta gerada.

---

## 2. SEÇÃO "DADOS DA PROPOSTA" vs. DADOS INLINE

### ❌ Problema: Ausência de seção "DADOS DA PROPOSTA" com título de seção
- **Original:** Possui um bloco destacado intitulado **"DADOS DA PROPOSTA"** em azul, com tabela de 4 linhas (Cliente / Contato / Local / Objeto).
- **Gerada pelo sistema:** Os dados (Cliente, Contato, Local, Objeto) aparecem em um bloco sem título de seção, apenas como tabela flutuante abaixo do título principal.

### ✅ Solução a implementar
- Adicionar o título de seção **"DADOS DA PROPOSTA"** (em azul, caixa alta, com linha separadora) antes da tabela de dados da proposta.

---

## 3. TÍTULOS DE SEÇÃO — CAIXA ALTA vs. CAIXA MISTA

### ❌ Problema crítico: Títulos em caixa baixa / inconsistentes na proposta gerada
Na proposta gerada, diversas seções usam títulos em caixa baixa ou mista onde o padrão exige **CAIXA ALTA**:

| Seção | Gerada pelo sistema | Padrão correto (original) |
|---|---|---|
| Garantias | `GARANTIAS` (ok) | `GARANTIAS` ✅ |
| Forma de pagamento | `FORMA DE PAGAMENTO` (ok) | `FORMA DE PAGAMENTO` ✅ |
| Multa contratual | `MULTA CONTRATUAL` (ok) | `MULTA CONTRATUAL` ✅ |
| Validade da proposta | `VALIDADE DA PROPOSTA` (ok) | `VALIDADE DA PROPOSTA` ✅ |
| Prazo de execução | `PRAZO DE EXECUÇÃO` (ok) | `PRAZO DE EXECUÇÃO` ✅ |
| **Dados da proposta** | ❌ **AUSENTE** | `DADOS DA PROPOSTA` |
| **Descrição dos serviços** | `1. DESCRIÇÃO DO SERVIÇO` | `DESCRIÇÃO DOS SERVIÇOS` (sem numeração no título principal) |
| **Escopo de fornecimento** | `2. ESCOPO DE FORNECIMENTO` | ❌ Seção inexistente na original — avaliar remoção ou posicionamento |
| **Valor da proposta** | ❌ **AUSENTE** | `VALOR DA PROPOSTA` |
| **Impostos** | ❌ **AUSENTE** | `IMPOSTOS` |

### ✅ Solução a implementar
- Padronizar **todos os títulos de seção em CAIXA ALTA**, sem numeração prefixada (ex: remover "1.", "2.", "3.").
- A numeração de seções existe apenas para sub-itens de serviço (ex: `Item 01.01`, `Item 01.02`), **não** nos títulos principais.
- Adicionar as seções ausentes: `DADOS DA PROPOSTA`, `VALOR DA PROPOSTA`, `IMPOSTOS`.

---

## 4. SEÇÃO DE VALOR / TABELA DE ITENS

### ❌ Problema: Tabela de preços ausente na proposta gerada
- **Original:** Possui uma **tabela completa de itens** com colunas: `ITEM | DESCRIÇÃO | UNID. | QTD. | VALOR (R$)` e linha de `TOTAL GERAL`.
- **Gerada pelo sistema:** Não apresenta tabela de valores — a proposta 001-50/26 não tem precificação itemizada visível.

### ✅ Solução a implementar
- O modelo deve gerar obrigatoriamente a **tabela de itens com preços** quando os valores estiverem preenchidos no sistema.
- Incluir linha de `TOTAL GERAL` com destaque visual (fundo cinza ou negrito).
- Verificar se a proposta 001-50/26 tem valores no sistema e não os está renderizando — possível bug de dados.

---

## 5. SEÇÃO DE IMPOSTOS

### ❌ Problema: Seção "IMPOSTOS" ausente na proposta gerada
- **Original:** Apresenta tabela de impostos com colunas `CATEGORIA | IMPOSTO | PERCENTUAL`, listando DAS Federal (11,2%), ISS (2,79%), IPI (15%) e DIFAL (6%).
- **Gerada pelo sistema:** Seção completamente ausente.

### ✅ Solução a implementar
- Adicionar seção **`IMPOSTOS`** ao template com tabela de três colunas.
- Tornar os percentuais configuráveis por tipo de proposta (serviço vs. material vs. misto).

---

## 6. QUEBRAS DE PÁGINA

### ❌ Problema: Quebras de página incorretas na proposta gerada
- **Original (4 páginas):** Estrutura lógica e bem distribuída:
  - Página 1: Cabeçalho + Dados + Descrição dos serviços (itens 01.01–01.05)
  - Página 2: Descrição (itens 01.06–01.11) + Tabela de valores (01.01–01.08)
  - Página 3: Tabela de valores (01.09–01.11 + TOTAL) + Forma de pagamento + Garantias
  - Página 4: Impostos + Multa + Validade + Prazo + Assinatura
- **Gerada pelo sistema (3 páginas):** Estrutura inconsistente. A seção "GARANTIAS" inicia diretamente após o escopo de fornecimento, sem a tabela de preços entre elas. A seção "CONDIÇÕES DE FATURAMENTO DIRETO" ocupa a maior parte da página 2, causando desbalanceamento.

### ✅ Solução a implementar
- Implementar **quebra de página forçada** (`PageBreak`) antes das seções: `VALOR DA PROPOSTA`, `IMPOSTOS`.
- Garantir que a tabela de itens não quebre no meio de uma linha (usar `KeepTogether` no ReportLab).
- Revisar a ordem das seções para espelhar o fluxo da proposta original:
  1. Cabeçalho
  2. Dados da proposta
  3. Descrição dos serviços
  4. Escopo / Responsabilidades
  5. Garantias
  6. **Valor da proposta (tabela)**
  7. Forma de pagamento
  8. Impostos
  9. Multa contratual
  10. Validade + Prazo
  11. Assinatura

---

## 7. SUBTÍTULOS DOS ITENS DE SERVIÇO

### ❌ Problema: Formatação dos sub-itens inconsistente
- **Original:** Cada item de serviço tem título em **azul, negrito** (ex: `Item 01.01 — Retirada de lona existente na lagoa`) seguido de parágrafo de descrição em texto normal.
- **Gerada pelo sistema:** Os itens são apresentados como lista simples com traço (`-`), sem negrito, sem cor, sem o padrão `Item XX.XX —`.

### ✅ Solução a implementar
- Padronizar os sub-itens de serviço com estilo: **cor azul + negrito** para o título, texto normal para a descrição.
- Usar o formato `Item XX.XX — [Título do serviço]` consistentemente.

---

## 8. BLOCO "CARACTERÍSTICAS DO MATERIAL"

### ❌ Problema: Bloco de características com fundo cinza aparece na gerada, mas não existe na original
- **Gerada pelo sistema:** Apresenta um bloco cinza com "Características do material" (densidade, temperatura, resistência etc.) dentro da seção de descrição do serviço.
- **Original:** Não possui esse bloco — as características técnicas do material **não são expostas** diretamente no corpo da proposta.

### ✅ Solução a implementar
- Avaliar se esse bloco deve ser mantido como componente opcional (toggle no sistema) ou removido do template padrão.
- Se mantido, padronizar o estilo visual (cor do título, borda, fundo) para consistência com o design da original.

---

## 9. SEÇÃO "CONDIÇÕES DE FATURAMENTO DIRETO"

### ❌ Problema: Seção exclusiva da proposta gerada, ausente na original
- **Gerada pelo sistema:** Possui uma longa seção "3. CONDIÇÕES DE FATURAMENTO DIRETO" com múltiplos parágrafos e bullets, que ocupa quase uma página inteira.
- **Original:** Não possui essa seção — as condições similares são cobertas de forma concisa em "FORMA DE PAGAMENTO" e "GARANTIAS".

### ✅ Solução a implementar
- Verificar se essa seção é **específica de clientes Copacol** (condições de faturamento direto são comuns em cooperativas agroindustriais) e, em caso afirmativo, torná-la **condicional** no template (exibida somente quando o tipo de contrato for "faturamento direto").
- Caso seja padrão, condensar e posicioná-la **após** a tabela de valores, não antes.

---

## 10. RODAPÉ / BLOCO DE ASSINATURA

### ❌ Problema: Estrutura do rodapé difere
- **Original:** Localidade + data → Nome do responsável em destaque (azul, negrito, maior) → Telefone em cinza → Frase em itálico → Linha separadora → Bloco final da empresa em azul/laranja.
- **Gerada pelo sistema:** Localidade + data → Nome do responsável centralizado (sem diferenciação visual relevante) → Telefone → Frase em itálico. Sem bloco final institucional.

### ✅ Solução a implementar
- Aplicar estilo destacado ao nome do responsável (azul + negrito + fonte maior).
- Adicionar o **bloco institucional final** com texto da empresa (ex: "PROJING — 15 ANOS DE EXPERIÊNCIA" com subtítulo descritivo), espelhando o rodapé da proposta original.

---

## Resumo Executivo das Implementações

| # | Área | Prioridade | Tipo |
|---|---|---|---|
| 1 | Logo e cabeçalho completo com ícones e CNPJ | 🔴 Alta | Visual |
| 2 | Seção "DADOS DA PROPOSTA" com título | 🔴 Alta | Estrutura |
| 3 | Remoção de numeração dos títulos de seção | 🔴 Alta | Estrutura |
| 4 | Tabela de itens com valores e TOTAL GERAL | 🔴 Alta | Conteúdo |
| 5 | Seção IMPOSTOS com tabela | 🟠 Média | Conteúdo |
| 6 | Quebras de página e ordem das seções | 🔴 Alta | Layout |
| 7 | Estilo azul+negrito nos sub-itens de serviço | 🟠 Média | Visual |
| 8 | Bloco "Características do material" condicional | 🟡 Baixa | Conteúdo |
| 9 | Seção "Faturamento Direto" condicional por tipo | 🟠 Média | Estrutura |
| 10 | Bloco de assinatura e rodapé institucional | 🟠 Média | Visual |
