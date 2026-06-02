const CATALOG = [
  { id: "01.01", label: "Retirada de lona existente na lagoa", unit: "UNID.", defaultQty: 1, defaultPrice: 900 },
  { id: "01.02", label: "Reconstrução de taludes e fundo da lagoa", unit: "UNID.", defaultQty: 1, defaultPrice: 4800 },
  { id: "01.03", label: "Terraplanagem com retroescavadeira (corte, aterro, nivelamento)", unit: "HRS", defaultQty: 30, defaultPrice: 420 },
  { id: "01.04", label: "Rede com tubo PEAD Ø 160 mm soldado (c/ berço e estacas)", unit: "MTS", defaultQty: 1, defaultPrice: 184 },
  { id: "01.05", label: "Geomembrana PEAD 2,00 mm — fornecimento e instalação", unit: "VB", defaultQty: 1, defaultPrice: 31200 },
  { id: "01.06", label: "Calçada concreto armado em volta da lagoa (7 cm, ferro 4,2 mm)", unit: "M²", defaultQty: 1, defaultPrice: 146 },
  { id: "01.07", label: "Calçada concreto armado do asfalto até a lagoa (7 cm)", unit: "M²", defaultQty: 1, defaultPrice: 146 },
  { id: "01.08", label: "Guarda-corpo perimetral (tubo metálico, amarelo-segurança, 1 m)", unit: "MTS", defaultQty: 1, defaultPrice: 63.33 },
  { id: "01.09", label: "Calçada concreto armado da lagoa até dissipador (7 cm)", unit: "M²", defaultQty: 1, defaultPrice: 146 },
  { id: "01.10", label: "Dissipador de energia em concreto armado (completo)", unit: "UNID.", defaultQty: 1, defaultPrice: 21280 },
  { id: "01.11", label: "Limpeza de terreno — remoção de entulhos e resíduos", unit: "UNID.", defaultQty: 1, defaultPrice: 1800 },
];

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return CATALOG
  })
}
