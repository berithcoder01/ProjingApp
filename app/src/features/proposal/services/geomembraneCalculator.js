// Tabela de bobinas: espessura (mm) -> { m2/bobina, preço mínimo/m², preço ideal/m² }
// Mantida em sincronia com a tabela usada pelo motor do wizard de armazém.
const BOBINAS_DB = {
  '0.50': { m2: 1180, pMin: 6.08, pIdeal: 6.43 },
  '0.75': { m2: 885,  pMin: 9.26, pIdeal: 9.79 },
  '0.80': { m2: 826,  pMin: 9.70, pIdeal: 10.27 },
  '1.00': { m2: 708,  pMin: 12.14, pIdeal: 12.85 },
  '1.50': { m2: 448,  pMin: 18.24, pIdeal: 19.30 },
  '2.00': { m2: 250,  pMin: 24.52, pIdeal: 25.95 },
  '2.50': { m2: 207,  pMin: 32.08, pIdeal: 33.95 },
  '3.00': { m2: 176,  pMin: 39.09, pIdeal: 41.36 },
};

// IPI de 9% aplicado ao material (mesma regra do armazémCalculator)
const IPI_FACTOR = 1.09;

export const ESPESSURAS_DISPONIVEIS = Object.keys(BOBINAS_DB).map((esp) => ({
  value: esp,
  label: `${esp} mm — ${BOBINAS_DB[esp].m2} m²/bobina`,
}));

/**
 * Tabela de frete estimado (mesma do armazémCalculator).
 * Baseada na quantidade de bobinas necessárias.
 */
const calcularFrete = (qtdBobinas) => {
  if (qtdBobinas <= 5)  return 4000;
  if (qtdBobinas <= 10) return 5500;
  if (qtdBobinas <= 15) return 7000;
  return 9000;
};

/**
 * Calcula o preço sugerido de geomembrana a partir da metragem quadrada
 * informada pelo usuário (uso geral — ex.: lagoas, tanques, projetos avulsos).
 *
 * @param {number|string} areaM2        - Metragem quadrada de geomembrana desejada
 * @param {string}        espessura     - Espessura (ex: '1.00', '2.00')
 * @param {boolean}       incluirFrete  - Se true, soma o frete ao preço sugerido
 * @param {object}        [precosDb]    - (opcional) tabela de preços customizada vinda das configurações
 * @returns {object|null}               - Breakdown do cálculo ou null se inputs inválidos
 */
export const calcularGeomembrana = (areaM2, espessura, incluirFrete = false, precosDb = null) => {
  const A = parseFloat(areaM2);
  const E = String(espessura || '').trim();
  const db = precosDb || BOBINAS_DB;

  if (!A || A <= 0 || isNaN(A)) return null;
  if (!db[E]) return null;

  const mat = db[E];

  const qtdBobinas = Math.ceil(A / mat.m2);
  const areaFinal = qtdBobinas * mat.m2;
  const areaDesperdicio = areaFinal - A;

  const custoMaterialBruto = areaFinal * mat.pIdeal * IPI_FACTOR;
  const frete = incluirFrete ? calcularFrete(qtdBobinas) : 0;
  const custoTotal = custoMaterialBruto + frete;

  // Preço unitário (por m²) que cobre o custo real + frete diluído na área solicitada
  const precoUnitario = custoTotal / A;

  return {
    espessura: E,
    m2PorBobina: mat.m2,
    areaSolicitada: A,
    qtdBobinas,
    areaFinal,
    areaDesperdicio,
    custoMaterialBruto,
    frete,
    custoTotal,
    precoUnitario,
    precoM2Tabela: mat.pIdeal * IPI_FACTOR,
    incluirFrete,
  };
};
