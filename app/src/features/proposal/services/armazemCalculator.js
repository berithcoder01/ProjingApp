// Constantes de Bobinas: { [espessura]: [m2_bobina, preco_minimo, preco_ideal] }
const BOBINAS_DB = {
  '0.50': { m2: 1180, pMin: 6.08, pIdeal: 6.43 },
  '0.75': { m2: 885, pMin: 9.26, pIdeal: 9.79 },
  '0.80': { m2: 826, pMin: 9.70, pIdeal: 10.27 },
  '1.00': { m2: 708, pMin: 12.14, pIdeal: 12.85 },
  '1.50': { m2: 448, pMin: 18.24, pIdeal: 19.30 },
  '2.00': { m2: 250, pMin: 24.52, pIdeal: 25.95 },
  '2.50': { m2: 207, pMin: 32.08, pIdeal: 33.95 },
  '3.00': { m2: 176, pMin: 39.09, pIdeal: 41.36 }
};

/**
 * Calcula a área total, quantidade de material e custos de um armazém.
 * 
 * @param {number} comprimento Comprimento do armazém (base das rampas)
 * @param {number} largura Largura do armazém (base dos peitos)
 * @param {number} rampa Comprimento da rampa inclinada
 * @param {string} espessura Espessura escolhida (E) ex: '2.00'
 * @returns {object} Objeto com todos os cálculos detalhados
 */
export const calcularArmazem = (comprimento, largura, rampa, espessura, precosDb = null, options = {}) => {
  const L = parseFloat(comprimento); // Comprimento (Base das rampas)
  const W = parseFloat(largura);     // Largura (Base dos peitos)
  const C = parseFloat(rampa);       // Comprimento da rampa
  const E = espessura;
  const { incluirLinhaVida = false, materialSafetyMargin = 1.15 } = options;

  const db = precosDb || BOBINAS_DB;

  if (!L || !W || !C || !E || !db[E]) {
    throw new Error('Parâmetros inválidos para cálculo de armazém');
  }

  const mat = db[E];

  // 1. Geometria e Área
  const b = L * 0.80; // Base menor da rampa (sempre 80% do comprimento)
  const hTri = C * 0.70; // Altura do triângulo do peito (atualizado para 70% da rampa)

  // Área das 2 rampas (Trapézios): 2 * ((L + b) / 2) * C = (L + b) * C
  const areaRampas = (L + b) * C;
  
  // Área dos 2 peitos (Triângulos): 2 * (W * hTri) / 2 = W * hTri
  const areaPeitos = W * hTri;
  
  const areaTotal = areaRampas + areaPeitos;
  const areaComPerdas = areaTotal * materialSafetyMargin; // Margem de segurança configurável

  // 2. Dimensionamento de Material (Bobinas)
  const qtdBobinas = Math.ceil(areaComPerdas / mat.m2);
  const areaGeo = qtdBobinas * mat.m2; 

  // 3. Frete Estimado
  let frete = 0;
  if (qtdBobinas <= 5) frete = 4000;
  else if (qtdBobinas <= 10) frete = 5500;
  else if (qtdBobinas <= 15) frete = 7000;
  else frete = 9000;

  // 4. Custos
  // O valor do material (bobinas) agora recebe +9% de IPI
  let custoMaterialMinimo = (areaGeo * mat.pMin) * 1.09;
  let custoMaterialIdeal = (areaGeo * mat.pIdeal) * 1.09;

  // Se incluir Linha de Vida, adiciona 10.000 ao material (embutido)
  if (incluirLinhaVida) {
    custoMaterialMinimo += 10000;
    custoMaterialIdeal += 10000;
  }

  const custoTotalMinimo = custoMaterialMinimo + frete;
  const custoTotalIdeal = custoMaterialIdeal + frete;

  return {
    geometria: {
      comprimento: L,
      largura: W,
      rampa: C,
      baseMenor: b,
      alturaTriangulo: hTri
    },
    areas: {
      rampas: areaRampas,
      peitos: areaPeitos,
      totalObra: areaTotal,
      totalObraComFolga: areaComPerdas
    },
    material: {
      espessura: E,
      m2PorBobina: mat.m2,
      qtdBobinas,
      areaGeomembrana: areaGeo
    },
    financeiro: {
      precoM2Minimo: mat.pMin,
      precoM2Ideal: mat.pIdeal,
      custoMaterialMinimo,
      custoMaterialIdeal,
      frete,
      custoTotalMinimo,
      custoTotalIdeal
    }
  };
};
