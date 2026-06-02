# Lógica de Cálculo - Módulo de Armazém (Geomembrana)

Este documento detalha as fórmulas matemáticas e regras de negócio utilizadas pelo sistema **orçaAI** para calcular a área, quantidade de materiais e custos para a impermeabilização de armazéns (graneleiros/cavados).

## 1. Variáveis de Entrada (Inputs)

Os cálculos baseiam-se em três medidas principais fornecidas pelo usuário:

- **L (Comprimento):** Medida da base onde as rampas laterais se apoiam.
- **W (Largura):** Medida da base onde os "peitos" (extremidades) se apoiam.
- **C (Rampa):** Comprimento da rampa inclinada (hipotenusa do talude).
- **E (Espessura):** Espessura da geomembrana escolhida (ex: 0.50mm, 1.00mm, 2.00mm).

---

## 2. Premissas Geométricas

Para o cálculo das áreas, o sistema assume proporções padrão baseadas na engenharia de armazéns graneleiros:

1.  **Base Menor da Rampa (b):** A parte superior da rampa é calculada como 80% da base maior.
    - `b = L * 0.80`
2.  **Altura do Triângulo do Peito (hTri):** A altura vertical do triângulo que forma o peito do armazém é calculada como 70% do comprimento da rampa.
    - `hTri = C * 0.70`

---

## 3. Cálculos de Área

O armazém é dividido em 4 partes principais para o cálculo da área: 2 rampas laterais e 2 peitos (extremidades).

### 3.1 Área das Rampas (Trapézios)
Existem duas rampas laterais idênticas. Cada rampa é tratada como um trapézio.
- **Fórmula de 1 rampa:** `((Base Maior + Base Menor) / 2) * Altura (Rampa)`
- **Fórmula das 2 rampas:** `2 * ((L + b) / 2) * C`
- **Simplificado:** `areaRampas = (L + b) * C`

### 3.2 Área dos Peitos (Triângulos)
Existem dois peitos (um em cada extremidade). Cada peito é tratado como um triângulo.
- **Fórmula de 1 peito:** `(Base * Altura) / 2`
- **Fórmula dos 2 peitos:** `2 * (W * hTri) / 2`
- **Simplificado:** `areaPeitos = W * hTri`

### 3.3 Área Total e Perdas
- **Área Total da Obra:** `areaTotal = areaRampas + areaPeitos`
- **Área com Margem de Segurança (50% de sobreposição/perdas):**
    - `areaComPerdas = areaTotal * 1.50`

---

## 4. Dimensionamento de Material (Bobinas)

A geomembrana é fornecida em bobinas. O sistema calcula quantas bobinas inteiras são necessárias para cobrir a área com perdas.

1.  **Quantidade de Bobinas:** `qtdBobinas = arredondar_para_cima(areaComPerdas / m2_por_bobina)`
2.  **Área Real de Geomembrana (Faturada):** `areaGeomembrana = qtdBobinas * m2_por_bobina`

*Nota: O `m2_por_bobina` varia de acordo com a espessura escolhida.*

---

## 5. Lógica de Custos e Frete

### 5.1 Frete Estimado
O frete é calculado por faixas, baseado no peso/volume (representado pela quantidade de bobinas):
- **1 a 5 bobinas:** R$ 4.000,00
- **6 a 10 bobinas:** R$ 5.500,00
- **11 a 15 bobinas:** R$ 7.000,00
- **Acima de 15 bobinas:** R$ 9.000,00

### 5.2 Composição do Preço Final
O sistema gera dois cenários (Mínimo e Ideal):
- **Custo Material:** `areaGeomembrana * Preço_m2 (da espessura)`
- **Custo Total:** `Custo Material + Frete`

---

## 6. Resumo das Fórmulas (Cheat Sheet)

```excel
b = Comprimento * 0.8
hTri = Rampa * 0.5

Area_Rampas = (Comprimento + b) * Rampa
Area_Peitos = Largura * hTri

Area_Obra = Area_Rampas + Area_Peitos
Area_Final = Area_Obra * 1.15
```
