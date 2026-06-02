import { useState, useRef } from "react";

// ─── Paleta e estilos globais injetados ───────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d0f14;
      --surface: #14171f;
      --card: #1a1e28;
      --border: #252a38;
      --accent: #2563EB;
      --accent2: #38bdf8;
      --gold: #f59e0b;
      --text: #e8eaf0;
      --muted: #6b7280;
      --success: #10b981;
      --danger: #ef4444;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      min-height: 100vh;
    }

    h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

    input, select, textarea {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      border: 1.5px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      padding: 12px 16px;
      width: 100%;
      font-size: 14px;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37,99,235,.15);
    }
    input::placeholder, textarea::placeholder { color: var(--muted); }

    select option { background: var(--surface); }

    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }

    button { cursor: pointer; font-family: 'DM Sans', sans-serif; border: none; }

    .btn-primary {
      background: var(--accent);
      color: #fff;
      border-radius: 10px;
      padding: 13px 28px;
      font-size: 14px;
      font-weight: 600;
      transition: background .2s, transform .1s;
    }
    .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost {
      background: transparent;
      color: var(--muted);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      padding: 13px 24px;
      font-size: 14px;
      font-weight: 500;
      transition: color .2s, border-color .2s;
    }
    .btn-ghost:hover { color: var(--text); border-color: var(--accent); }

    .btn-success {
      background: var(--success);
      color: #fff;
      border-radius: 10px;
      padding: 13px 28px;
      font-size: 14px;
      font-weight: 600;
      transition: background .2s, transform .1s;
    }
    .btn-success:hover { background: #059669; transform: translateY(-1px); }

    .field { margin-bottom: 20px; }

    @keyframes fadeUp {
      from { opacity:0; transform: translateY(18px); }
      to   { opacity:1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp .35s ease both; }

    @media (max-width: 640px) {
      .grid-2 { grid-template-columns: 1fr !important; }
      .grid-3 { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ─── Dados dos itens de serviço (baseados na proposta Brenntag) ──────────────
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

// ─── Utilitários ─────────────────────────────────────────────────────────────
const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

let propCounter = (() => {
  const saved = parseInt(localStorage.getItem("projing_counter") || "0", 10);
  return saved;
})();
function nextProposalNumber() {
  propCounter++;
  localStorage.setItem("projing_counter", String(propCounter));
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-${String(propCounter).padStart(2, "0")}`;
}

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepBar({ current, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: i < current ? "var(--success)" : i === current ? "var(--accent)" : "var(--border)",
            color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, flexShrink: 0,
            fontFamily: "Syne, sans-serif",
            transition: "background .3s",
            boxShadow: i === current ? "0 0 0 4px rgba(37,99,235,.25)" : "none",
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: i === current ? "var(--text)" : "var(--muted)",
            marginLeft: 8, whiteSpace: "nowrap", letterSpacing: ".04em", textTransform: "uppercase",
          }}>{s}</span>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1.5, background: i < current ? "var(--success)" : "var(--border)", margin: "0 16px", minWidth: 20, transition: "background .3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STEP 1: Dados do Cliente ────────────────────────────────────────────────
function StepCliente({ data, onChange, onNext }) {
  const ok = data.nome && data.contato && data.local;
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Dados do Cliente</h2>
      <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>Preencha as informações do cliente para identificação da proposta.</p>

      <div className="field">
        <label>Empresa / Cliente *</label>
        <input placeholder="Ex.: Brenntag Ltda." value={data.nome} onChange={e => onChange({ ...data, nome: e.target.value })} />
      </div>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="field">
          <label>Nome do Contato *</label>
          <input placeholder="Ex.: Lauro Ney" value={data.contato} onChange={e => onChange({ ...data, contato: e.target.value })} />
        </div>
        <div className="field">
          <label>Cargo / Função</label>
          <input placeholder="Ex.: Gerente de Obras" value={data.cargo} onChange={e => onChange({ ...data, cargo: e.target.value })} />
        </div>
      </div>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="field">
          <label>Local da Obra *</label>
          <input placeholder="Ex.: Nova Esperança, PR" value={data.local} onChange={e => onChange({ ...data, local: e.target.value })} />
        </div>
        <div className="field">
          <label>Telefone / WhatsApp</label>
          <input placeholder="(44) 9 9999-0000" value={data.tel} onChange={e => onChange({ ...data, tel: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>Objeto / Descrição geral do projeto</label>
        <textarea rows={3} placeholder="Ex.: Execução de serviços na bacia pluvial / lagoa Brenntag" value={data.objeto} onChange={e => onChange({ ...data, objeto: e.target.value })} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-primary" onClick={onNext} disabled={!ok} style={{ opacity: ok ? 1 : .45 }}>
          Próximo →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 2: Seleção e configuração dos serviços ─────────────────────────────
function StepServicos({ items, onChange, onNext, onBack }) {
  const toggle = (id) => {
    if (items.find(i => i.id === id)) {
      onChange(items.filter(i => i.id !== id));
    } else {
      const cat = CATALOG.find(c => c.id === id);
      onChange([...items, { ...cat, qty: cat.defaultQty, price: cat.defaultPrice }]);
    }
  };

  const update = (id, field, val) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Serviços</h2>
      <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14 }}>Selecione os itens e ajuste quantidades e valores unitários.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {CATALOG.map(cat => {
          const sel = items.find(i => i.id === cat.id);
          return (
            <div key={cat.id} style={{
              border: sel ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              background: sel ? "rgba(37,99,235,.06)" : "var(--card)",
              transition: "border-color .2s, background .2s",
            }}>
              {/* Header do item */}
              <div
                onClick={() => toggle(cat.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer" }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: sel ? "none" : "2px solid var(--border)",
                  background: sel ? "var(--accent)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background .2s",
                }}>
                  {sel && <span style={{ color: "#fff", fontSize: 13 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: sel ? "var(--text)" : "var(--muted)" }}>
                    <span style={{ color: "var(--accent2)", marginRight: 8, fontFamily: "Syne" }}>{cat.id}</span>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Unidade: {cat.unit} · Ref.: {fmt(cat.defaultPrice)}/{cat.unit}</div>
                </div>
              </div>

              {/* Expandido quando selecionado */}
              {sel && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px" }}
                  className="grid-2"
                  style2={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderTop: "1px solid var(--border)", padding: "14px 18px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label>Quantidade ({cat.unit})</label>
                      <input type="number" min="0" value={sel.qty}
                        onChange={e => update(cat.id, "qty", e.target.value)} />
                    </div>
                    <div>
                      <label>Valor Unit. (R$)</label>
                      <input type="number" min="0" step="0.01" value={sel.price}
                        onChange={e => update(cat.id, "price", e.target.value)} />
                    </div>
                    <div>
                      <label>Subtotal</label>
                      <input readOnly value={fmt((parseFloat(sel.qty) || 0) * (parseFloat(sel.price) || 0))}
                        style={{ background: "var(--surface)", color: "var(--accent2)", fontWeight: 600 }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total flutuante */}
      <div style={{
        position: "sticky", bottom: 0,
        background: "var(--surface)", border: "1.5px solid var(--border)",
        borderRadius: 12, padding: "16px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(8px)",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".05em", textTransform: "uppercase" }}>Total Geral (antes de impostos)</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Syne", color: "var(--gold)" }}>{fmt(total)}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" onClick={onBack}>← Voltar</button>
          <button className="btn-primary" onClick={onNext} disabled={items.length === 0} style={{ opacity: items.length ? 1 : .45 }}>
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: Condições comerciais ───────────────────────────────────────────
function StepCondicoes({ data, onChange, onNext, onBack }) {
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Condições Comerciais</h2>
      <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>Defina pagamento, prazo e observações da proposta.</p>

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="field">
          <label>Entrada (%)</label>
          <input type="number" min={0} max={100} value={data.entrada} onChange={e => onChange({ ...data, entrada: e.target.value })} />
        </div>
        <div className="field">
          <label>Prazo pagamento entrada (dias)</label>
          <input type="number" value={data.prazoEntrada} onChange={e => onChange({ ...data, prazoEntrada: e.target.value })} />
        </div>
        <div className="field">
          <label>Medição a cada (dias de avanço)</label>
          <input type="number" value={data.medicao} onChange={e => onChange({ ...data, medicao: e.target.value })} />
        </div>
        <div className="field">
          <label>Pagamento após NF (dias)</label>
          <input type="number" value={data.prazoNF} onChange={e => onChange({ ...data, prazoNF: e.target.value })} />
        </div>
        <div className="field">
          <label>Validade da proposta (dias)</label>
          <input type="number" value={data.validade} onChange={e => onChange({ ...data, validade: e.target.value })} />
        </div>
        <div className="field">
          <label>Prazo de execução</label>
          <input placeholder="Ex.: 45 dias corridos" value={data.prazoExec} onChange={e => onChange({ ...data, prazoExec: e.target.value })} />
        </div>
      </div>

      <div className="field">
        <label>Forma de pagamento (detalhes)</label>
        <textarea rows={3} value={data.formaPagamento} onChange={e => onChange({ ...data, formaPagamento: e.target.value })}
          placeholder="Ex.: Depósito bancário, PIX, boleto..." />
      </div>

      <div className="field">
        <label>Observações / Condições especiais</label>
        <textarea rows={4} value={data.obs} onChange={e => onChange({ ...data, obs: e.target.value })}
          placeholder="Ex.: Fator climático é determinante no cumprimento do prazo..." />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button className="btn-ghost" onClick={onBack}>← Voltar</button>
        <button className="btn-primary" onClick={onNext}>Revisar proposta →</button>
      </div>
    </div>
  );
}

// ─── STEP 4: Revisão + Preview ───────────────────────────────────────────────
function StepRevisao({ cliente, items, cond, propNum, onBack, onGenerate }) {
  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Revisão da Proposta</h2>
      <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 14 }}>Confira todos os dados antes de gerar o PDF.</p>

      {/* Preview card */}
      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "28px 32px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--accent2)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Projing Pro · Soluções em PEAD</div>
              <div style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 800 }}>PROPOSTA COMERCIAL</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Nº {propNum}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)", lineHeight: 2 }}>
              <div>{today}</div>
              <div>(44) 9 9813-9141</div>
              <div>projingehbengenharia@hotmail.com</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Cliente */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            {[
              ["Cliente", cliente.nome],
              ["Contato", cliente.contato + (cliente.cargo ? ` — ${cliente.cargo}` : "")],
              ["Local", cliente.local],
              ["Objeto", cliente.objeto || "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 3 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Itens */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: 14 }}>Itens da Proposta</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Item", "Descrição", "Unid.", "Qtd.", "V. Unit.", "Subtotal"].map(h => (
                    <th key={h} style={{ textAlign: h === "Descrição" ? "left" : "right", padding: "6px 10px", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id} style={{ borderBottom: "1px solid var(--border)", background: idx % 2 ? "rgba(255,255,255,.015)" : "transparent" }}>
                    <td style={{ padding: "9px 10px", color: "var(--accent2)", fontWeight: 700, whiteSpace: "nowrap" }}>{it.id}</td>
                    <td style={{ padding: "9px 10px" }}>{it.label}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: "var(--muted)" }}>{it.unit}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{it.qty}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{fmt(it.price)}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 600 }}>{fmt((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ padding: "12px 10px", textAlign: "right", fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>TOTAL GERAL</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: "var(--gold)" }}>{fmt(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Condições */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <div><span style={{ color: "var(--muted)" }}>Entrada:</span> {cond.entrada}% em {cond.prazoEntrada} dias</div>
            <div><span style={{ color: "var(--muted)" }}>Pagamento NF:</span> {cond.prazoNF} dias</div>
            <div><span style={{ color: "var(--muted)" }}>Medição:</span> a cada {cond.medicao} dias de avanço</div>
            <div><span style={{ color: "var(--muted)" }}>Validade:</span> {cond.validade} dias</div>
            {cond.prazoExec && <div><span style={{ color: "var(--muted)" }}>Prazo exec.:</span> {cond.prazoExec}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-ghost" onClick={onBack}>← Voltar</button>
        <button className="btn-success" onClick={onGenerate}>
          ⬇ Gerar PDF
        </button>
      </div>
    </div>
  );
}

// ─── Geração do PDF via HTML → print ────────────────────────────────────────
function generatePDF(cliente, items, cond, propNum) {
  const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const rows = items.map((it, idx) => `
    <tr style="background:${idx % 2 ? "#f8fafc" : "#fff"}">
      <td style="padding:9px 10px;color:#2563EB;font-weight:700;white-space:nowrap;border-bottom:1px solid #e2e8f0">${it.id}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0">${it.label}</td>
      <td style="padding:9px 10px;text-align:center;border-bottom:1px solid #e2e8f0;color:#64748b">${it.unit}</td>
      <td style="padding:9px 10px;text-align:center;border-bottom:1px solid #e2e8f0">${it.qty}</td>
      <td style="padding:9px 10px;text-align:right;border-bottom:1px solid #e2e8f0">${fmt(it.price)}</td>
      <td style="padding:9px 10px;text-align:right;font-weight:700;border-bottom:1px solid #e2e8f0">${fmt((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0))}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Proposta ${propNum}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans',sans-serif; font-size:13px; color:#1e293b; background:#fff; }
  .page { max-width:860px; margin:0 auto; padding:0; }

  .header { background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%); color:#fff; padding:36px 40px; display:flex; justify-content:space-between; align-items:flex-start; }
  .logo-area h1 { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; letter-spacing:-.5px; }
  .logo-area .sub { font-size:11px; letter-spacing:.12em; color:#7dd3fc; text-transform:uppercase; margin-bottom:10px; }
  .logo-area .prop-num { font-size:13px; color:#94a3b8; margin-top:6px; }
  .contact-info { text-align:right; font-size:12px; color:#cbd5e1; line-height:2; }

  .section { padding:30px 40px; }
  .section-title { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#2563EB; margin-bottom:16px; padding-bottom:8px; border-bottom:2px solid #2563EB; }

  .data-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px 32px; margin-bottom:0; }
  .data-item label { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#64748b; display:block; margin-bottom:3px; }
  .data-item span { font-weight:500; font-size:13px; }

  table { width:100%; border-collapse:collapse; font-size:12.5px; }
  thead th { background:#f1f5f9; padding:9px 10px; font-size:10px; text-transform:uppercase; letter-spacing:.06em; color:#475569; font-weight:700; }
  tfoot td { background:#f8fafc; font-family:'Syne',sans-serif; }

  .total-row td:last-child { color:#d97706; font-size:20px; font-weight:800; }

  .cond-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px 32px; font-size:12.5px; }
  .cond-grid div span:first-child { color:#64748b; }

  .garantias ul { list-style:disc; padding-left:20px; font-size:12.5px; line-height:2; }

  .impostos table td, .impostos table th { border:1px solid #e2e8f0; padding:8px 12px; font-size:12px; }
  .impostos table th { background:#f1f5f9; font-weight:700; }

  .footer { background:#0f172a; color:#94a3b8; padding:24px 40px; display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-top:0; }
  .footer strong { color:#e2e8f0; font-family:'Syne',sans-serif; }

  .divider { height:1px; background:#e2e8f0; margin:0 40px; }
  .obs-box { background:#fffbeb; border-left:4px solid #f59e0b; padding:12px 16px; border-radius:0 8px 8px 0; font-size:12px; color:#92400e; margin-top:12px; line-height:1.7; }

  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- CABEÇALHO -->
  <div class="header">
    <div class="logo-area">
      <div class="sub">Projing Pro · Soluções em PEAD</div>
      <h1>PROPOSTA COMERCIAL</h1>
      <div class="prop-num">Nº ${propNum}</div>
    </div>
    <div class="contact-info">
      <div>${today}</div>
      <div>(44) 9 9813-9141</div>
      <div>projingehbengenharia@hotmail.com</div>
      <div>www.projing.pro</div>
      <div>CNPJ 54.348.703/0001-34</div>
    </div>
  </div>

  <!-- DADOS DA PROPOSTA -->
  <div class="section">
    <div class="section-title">Dados da Proposta</div>
    <div class="data-grid">
      <div class="data-item"><label>Cliente</label><span>${cliente.nome}</span></div>
      <div class="data-item"><label>Contato</label><span>${cliente.contato}${cliente.cargo ? " — " + cliente.cargo : ""}</span></div>
      <div class="data-item"><label>Local</label><span>${cliente.local}</span></div>
      <div class="data-item"><label>Telefone</label><span>${cliente.tel || "—"}</span></div>
      <div class="data-item" style="grid-column:1/-1"><label>Objeto</label><span>${cliente.objeto || "—"}</span></div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- SERVIÇOS -->
  <div class="section">
    <div class="section-title">Descrição dos Serviços e Valores</div>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;width:70px">Item</th>
          <th style="text-align:left">Descrição</th>
          <th style="text-align:center;width:60px">Unid.</th>
          <th style="text-align:center;width:60px">Qtd.</th>
          <th style="text-align:right;width:110px">Valor Unit.</th>
          <th style="text-align:right;width:120px">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="5" style="padding:13px 10px;text-align:right;font-size:14px;font-weight:700;color:#334155">TOTAL GERAL</td>
          <td style="padding:13px 10px;text-align:right;">${fmt(total)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="divider"></div>

  <!-- FORMA DE PAGAMENTO -->
  <div class="section">
    <div class="section-title">Forma de Pagamento</div>
    <div class="cond-grid">
      <div><span>Entrada: </span><span style="font-weight:600">${cond.entrada}% (mobilização) — em ${cond.prazoEntrada} dias</span></div>
      <div><span>Medição: </span><span style="font-weight:600">a cada ${cond.medicao} dias de avanço</span></div>
      <div><span>Pagamento após NF: </span><span style="font-weight:600">até ${cond.prazoNF} dias</span></div>
      <div><span>Validade da proposta: </span><span style="font-weight:600">${cond.validade} dias</span></div>
      ${cond.prazoExec ? `<div style="grid-column:1/-1"><span>Prazo de execução: </span><span style="font-weight:600">${cond.prazoExec}</span></div>` : ""}
    </div>
    ${cond.formaPagamento ? `<div style="margin-top:12px;font-size:12.5px;color:#475569">${cond.formaPagamento}</div>` : ""}
    <div style="margin-top:10px;font-size:12px;color:#64748b">• Preços fixos e irreajustáveis até o final do contrato &nbsp;·&nbsp; Pagamento via depósito bancário</div>
  </div>

  <div class="divider"></div>

  <!-- GARANTIAS -->
  <div class="section">
    <div class="section-title">Garantias</div>
    <ul class="garantias" style="list-style:disc;padding-left:20px;font-size:12.5px;line-height:2.1">
      <li>5 anos contra defeitos de fabricação e instalação (geomembrana)</li>
      <li>1 ano contra acidentes de rasgamento, ruptura e furos</li>
      <li>30 anos de expectativa de durabilidade da geomembrana</li>
      <li>1 ano contra defeitos de instalação (demais itens)</li>
      <li>Vistoria anual no primeiro ano</li>
    </ul>
  </div>

  <div class="divider"></div>

  <!-- IMPOSTOS -->
  <div class="section impostos">
    <div class="section-title">Impostos</div>
    <table style="width:auto">
      <thead><tr><th>Categoria</th><th>Imposto</th><th>Percentual</th></tr></thead>
      <tbody>
        <tr><td>Serviço</td><td>DAS Federal</td><td>11,2%</td></tr>
        <tr><td>Serviço</td><td>ISS</td><td>2,79%</td></tr>
        <tr><td>Materiais — Geomembrana</td><td>IPI</td><td>15%</td></tr>
        <tr><td>Materiais — Geomembrana</td><td>DIFAL</td><td>6%</td></tr>
      </tbody>
    </table>
  </div>

  <div class="divider"></div>

  <!-- MULTA / OBS -->
  <div class="section">
    <div class="section-title">Condições Gerais</div>
    <div style="font-size:12.5px;line-height:1.8;color:#334155">
      <strong>Multa por atraso na entrega:</strong> 0,3% ao dia, limitado a 10% do valor do contrato.
    </div>
    ${cond.obs ? `<div class="obs-box"><strong>Obs.:</strong> ${cond.obs}</div>` : ""}
  </div>

  <!-- RODAPÉ -->
  <div class="footer">
    <div>
      <strong>J. Wilson Santos</strong><br/>
      (44) 9 9813-9141 · projingehbengenharia@hotmail.com
    </div>
    <div style="text-align:right">
      Somos gratos por participarmos deste projeto.<br/>
      <span style="color:#38bdf8">Sempre à vossa disposição.</span>
    </div>
  </div>

</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.addEventListener("load", () => {
    setTimeout(() => {
      win.print();
    }, 600);
  });
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [propNum] = useState(() => {
    const y = new Date().getFullYear();
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    const n = String(Math.floor(Math.random() * 900) + 100);
    return `${y}-${m}-${n}`;
  });

  const [cliente, setCliente] = useState({ nome: "", contato: "", cargo: "", local: "", tel: "", objeto: "" });
  const [items, setItems] = useState([]);
  const [cond, setCond] = useState({ entrada: "20", prazoEntrada: "45", medicao: "10", prazoNF: "60", validade: "60", prazoExec: "", formaPagamento: "", obs: "" });
  const [done, setDone] = useState(false);

  const STEPS = ["Cliente", "Serviços", "Condições", "Revisão"];

  const handleGenerate = () => {
    generatePDF(cliente, items, cond, propNum);
    setDone(true);
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>P</div>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16, letterSpacing: "-.3px" }}>Projing<span style={{ color: "var(--accent2)" }}>Pro</span></div>
              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>Gerador de Orçamentos</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Proposta nº <strong style={{ color: "var(--text)" }}>{propNum}</strong></div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 24px" }}>
          <div style={{ width: "100%", maxWidth: 760 }}>

            {!done ? (
              <>
                <StepBar current={step} steps={STEPS} />
                {step === 0 && <StepCliente data={cliente} onChange={setCliente} onNext={() => setStep(1)} />}
                {step === 1 && <StepServicos items={items} onChange={setItems} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                {step === 2 && <StepCondicoes data={cond} onChange={setCond} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                {step === 3 && <StepRevisao cliente={cliente} items={items} cond={cond} propNum={propNum} onBack={() => setStep(2)} onGenerate={handleGenerate} />}
              </>
            ) : (
              <div className="fade-up" style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h2 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Proposta gerada!</h2>
                <p style={{ color: "var(--muted)", marginBottom: 36, maxWidth: 400, margin: "0 auto 32px" }}>
                  O PDF foi aberto em nova aba. Use <strong>Ctrl+P</strong> (ou o diálogo de impressão) para salvar como PDF.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-success" onClick={() => generatePDF(cliente, items, cond, propNum)}>
                    ⬇ Baixar novamente
                  </button>
                  <button className="btn-ghost" onClick={() => {
                    setStep(0); setDone(false);
                    setCliente({ nome: "", contato: "", cargo: "", local: "", tel: "", objeto: "" });
                    setItems([]);
                    setCond({ entrada: "20", prazoEntrada: "45", medicao: "10", prazoNF: "60", validade: "60", prazoExec: "", formaPagamento: "", obs: "" });
                  }}>
                    + Nova Proposta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--border)", padding: "14px 32px", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
          Projing Pro · Soluções em PEAD · CNPJ 54.348.703/0001-34 · Marialva, PR
        </div>
      </div>
    </>
  );
}
