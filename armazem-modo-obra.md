# Armazém — Modo "Só Mão de Obra" + Itens Dinâmicos

## Goal
Adicionar ao fluxo Armazém uma opção de proposta "só Mão de Obra" (sem fornecimento de geomembrana), controlada por um seletor no início do wizard. Em ambos os modos, adotar os itens dinâmicos (`data.itens`) como fonte única de valores. No modo só-M.O., incluir um novo step de **Recomendação/Estimativa de Material** (quantidade + descritivo de qualidade, ex.: 100% virgem). O documento PDF final não menciona fornecimento de geomembrana quando só-M.O.

## Tasks

- [ ] **T1 — Criar `Step0TipoProposta.jsx`** em `app/src/features/proposal/components/armazem/`. Dois cards: "Material + Mão de Obra" (padrão, `modo = 'completo'`) e "Só Mão de Obra" (`modo = 'so_obra'`). Chama `updateData('modoProposta', valor)`. Default `'completo'` se vazio. → Verify: renderiza os 2 cards; clicar em "Só M.O." seta `data.modoProposta = 'so_obra'`.

- [ ] **T2 — Integrar Step0 no `ArmazemWizard.jsx`** (`app/src/features/proposal/components/ArmazemWizard.jsx`): adicionar `{ id: 0, title: 'Tipo', icon: Layers }` no array `steps` (linha 18) e `case 0: return <Step0TipoProposta .../>` no `renderStep` (linha 130). Atualizar barra de progresso para lidar com 11 steps (linhas 167 e 145: usar `(currentStep-1)/(steps.length-1)`). Ajustar `handleNext`/`handlePrev` para permitir `currentStep=0` (mínimo 0 em vez de 1 — linhas 117-127). Importar `Layers` do lucide-react (linha 4). Esconder botão Voltar quando `currentStep === 0` (igual ao `currentStep === 1` hoje, linha 214). → Verify: wizard abre no step 0; clicar "Avançar" vai para Step1; barra mostra 11 icones.

- [ ] **T3 — Criar `Step4RecomendacaoMaterial.jsx`** (novo step, só visível no modo `so_obra`). Campos: (a) `quantidadeMaterialEstimada` — preenchido automaticamente de `data._calculo.material.areaGeomembrana` + `qtdBobinas` (read-only como sugestão, editável), (b) `descricaoRecomendacaoMaterial` — textarea livre (placeholder defaults: "Material 100% virgem, espessura X conforme cálculo técnico..."). Chama `updateData` para ambos. → Verify: ao entrar no modo `so_obra`, mostra quant. estimada sugerida e textarea; valores salvos em `data`.

- [ ] **T4 — Condicionar Step4RecomendacaoMaterial no `ArmazemWizard.jsx`** `renderStep`: o `case 4` atual (`Step4EscopoFornecimento`) só roda se `data.modoProposta !== 'so_obra'`; se for `so_obra`, `case 4` renderiza `Step4RecomendacaoMaterial`. Alternativa simples: um único `case 4` com `if/else`. Reordenar/renumerar NÃO é necessário — manter 11 steps para não quebrar progressão. → Verify: no modo completo Step4 = Escopo; no modo só-M.O. Step4 = Recomendação de Material.

- [ ] **T5 — Refatorar `Step6Custos.jsx` para usar `data.itens` (ativar `PropostasArmazemDinamico` no fluxo)** (`app/src/features/proposal/components/armazem/Step6Custos.jsx`). Substituir inputs de `valorMaterialManual`/`valorMaoDeObra` por `<PropostasArmazemDinamico data={data} updateData={updateData} />`. Sugerir itens iniciais conforme modo: se `data.modoProposta === 'so_obra'` → 1 item "Execução de revestimento em geomembrana PEAD (mão de obra e materiais de consumo)" com `valor = 0`; senão → 2 itens: "Fornecimento de geomembrana PEAD {espessura}mm" (`calc.financeiro.custoTotalIdeal`) e "Mão de obra e despesas" (0). Manter `totalGeral` derivado de `itens.reduce(...)`, quebrado em `valorMaterialManual`/`valorMaoDeObra` só para o backend herdar estrutura (ou eliminar do backend — ver T9). Importar `PropostasArmazemDinamico` (relativo: copiar de `src/.../armazem/PropostasArmazemDinamico.jsx` para `app/src/.../armazem/` se necessário). → Verify: Step6 mostra tabela editável de itens; adicionar/remover atualiza `data.itens` e `data.totalGeral`.

- [ ] **T6 — `Step9Revisao.jsx`** (`app/src/features/proposal/components/armazem/Step9Revisao.jsx` linhas 110-151): já lê `data.itens` — confirmar que funciona após T5. Ajustar bloco "Condições" linhas 186-189: ocultar linha "Material: {percentualMaterial}%" quando `modoProposta === 'so_obra'` (else mostra existing). No bloco "Opcionais" linhas 99-103: ocultar "Faturamento Direto" quando `modoProposta === 'so_obra'`. → Verify: revisão mostra tabela de itens (não mais fallback); no modo só-M.O., não mostra linha de Material nem Faturamento Direto.

- [ ] **T7 — `ArmazemDocumentPDF.jsx`** seção "VALORES DA PROPOSTA" (linhas 522-542): substituir linha hardcoded de `ArmazemDocumentPDF.jsx:533` por iteração `data.itens.map((item, i) => ...)`. Cabeçalho igual; cada item vira uma linha `<View style={styles.valuesRow}>` com `index+1`, `item.descricao`, "UN", `fmt(item.valor)`. Manter total ao final `fmt(data.totalGeral)`. Condicional por modo nas seções abaixo:
  - **"DESCRIÇÃO DOS SERVIÇOS"** (455-463): manter `descricaoServico`.
  - **"Características Técnicas do Material"** (465-470): se `modoProposta === 'so_obra'`, trocar título por "Recomendação de Material (Estimativa)" e usar `data.descricaoRecomendacaoMaterial` em vez de `caracteristicasMaterial`.
  - **"ESCOPO E RESPONSABILIDADES"** (472-481): se só-M.O., omitir "Itens Inclusos no Fornecimento" (linhas 479-480) e ajustar `escopoResponsabilidades` default para refletir só M.O.
  - **Objeto** (linha 450): se só-M.O. e `data.objeto` vazio, default "Execução de revestimento em geomembrana PEAD (mão de obra)".
  - **Garantias** (490-520): em só-M.O., recalibrar texto (sem "fornecimento") — `garantiaDefeitos` continua mas reescrever para "garantia de instalação" em vez de "fabricação e instalação".
  - **Condições de pagamento** (544+): ocultar `showMaterial`/`percentualMaterial`/`prazoMaterial` no só-M.O. (linhas 558-561).
  - **Impostos sobre materiais** (612): em só-M.O., omitir a linha de IPI/DIFAL (que são de material) — manter só DAS/ISS.
  → Verify: o PDF gerado no modo só-M.O. não tem menção a "fornecimento" de geomembrana; valores iteram itens dinâmicos; tem seção "Recomendação de Material".

- [ ] **T8 — `Step8Condicoes.jsx`** (`app/src/features/proposal/components/armazem/Step8Condicoes.jsx` linhas 125-153): envolver o bronco "Entrega de Material" (checkbox `showMaterial`, inputs `percentualMaterial`/`prazoMaterial`) em `{data.modoProposta !== 'so_obra' && (...)}`. Recalcular o "Saldo" no `Step10Documento` (linha 84-87) — quando só-M.O., não subtrair `percentualMaterial`. → Verify: no modo só-M.O., step condições não exibe bronco de Material; saldo recalculado sem o percentual de material.

- [ ] **T9 — `Step10Documento.jsx`** (`app/src/features/proposal/components/armazem/Step10Documento.jsx`): incluir `itens: data.itens`, `modoProposta: data.modoProposta`, `quantidadeMaterialEstimada`, `descricaoRecomendacaoMaterial` no `metadata` (linhas 28-98). No resumo visual UI (linhas 186-198), substituir a quebra "Material + M.O." por iteração de itens quando existirem. Recalcular `saldo` (linhas 84-87) condicional a `modoProposta === 'so_obra'`. → Verify: payload salvo tem `itens`/`modoProposta`/recomendação; saldo correto.

- [ ] **T10 — Edição de propostas antigas**: no `ArmazemWizard.jsx` `useEffect` (linhas 45-100) adicionar mapeamentos: `modoProposta: m.modoProposta || 'completo'`, `itens: m.itens`, `quantidadeMaterialEstimada: m.quantidadeMaterialEstimada`, `descricaoRecomendacaoMaterial: m.descricaoRecomendacao`. Propostas antigas default para `'completo'` e mantêm `valorMaterialManual`/`valorMaoDeObra` (compat). → Verify: abrir uma proposta salva carrega `modoProposta` e `itens` corretamente; antiga sem `itens` funciona com fallback.

## Done When
- [ ] Wizard abre com Step0 (seletor de tipo).
- [ ] Modo só-M.O. mostra Step4 de Recomendação de Material (quant. + descritivo) e omite Escopo de Fornecimento.
- [ ] Step6 usa itens dinâmicos em ambos modos; Step9 mostra tabela de itens (não fallback).
- [ ] PDF no modo só-M.O. não cita "fornecimento" de geomembrana; valores iteram `data.itens`; tem seção "Recomendação de Material".
- [ ] Step8/Step10 omitem bronco "Entrega de Material" e recalculam saldo no só-M.O.
- [ ] Edição de proposta persiste/recupera `modoProposta`, `itens`, e campos de recomendação.

## Notes
- `PropostasArmazemDinamico.jsx` existe em `src/...` mas `Step4Custos` em `app/src/...` importa via `./PropostasArmazemDinamico` (resolução cruzada). Verificar em T5 se resolve ou se é preciso copiar o arquivo para `app/src/.../armazem/`.
- `_calculo` (de `Step2Dimensoes`) continua sempre ativo — entenderá "estimativa" mesmo no só-M.O. (baseia a sugestão de quantidade de material em T3).
- Steps órfãos legados (`Step3Escopo`, `Step4Custos`, `Step5Documento`) — não tocar nesta feature; podem ser removidos em task futura.
- Não há framework de testes; verificação é manual via `npm run dev`. Confirmar appType React/Vite — ler package.json antes.
