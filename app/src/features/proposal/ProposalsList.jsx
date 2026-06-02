import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, CheckCircle, XCircle, Send, Clock, Calendar, Download, Loader, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/Button';
import { fetchProposals, updateProposalStatus, fetchSettings } from '../../shared/services/api';
import { fmt } from './constants';
import PdfGenerator from './components/PdfGenerator';

const STATUS_COLORS = {
  DRAFT: 'bg-muted/20 text-muted border-muted/30',
  SENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  APPROVED: 'bg-success/20 text-success border-success/30',
  REJECTED: 'bg-danger/20 text-danger border-danger/30'
};

const STATUS_LABELS = {
  DRAFT: 'Rascunho',
  SENT: 'Enviada',
  APPROVED: 'Aprovada',
  REJECTED: 'Recusada'
};

const STATUS_ICONS = {
  DRAFT: <Clock size={14} />,
  SENT: <Send size={14} />,
  APPROVED: <CheckCircle size={14} />,
  REJECTED: <XCircle size={14} />
};


// ── Lista principal ────────────────────────────────────────────────────────────
const ProposalsList = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [companySettings, setCompanySettings] = useState(null);
  const [generatingId, setGeneratingId] = useState(null); // ID da proposta sendo gerada

  useEffect(() => {
    loadProposals();
    loadSettings();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await fetchProposals();
      setProposals(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const s = await fetchSettings();
      setCompanySettings(s);
    } catch {
      // silently fail — usa defaults do documento
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateProposalStatus(id, newStatus);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (error) {
      alert('Falha ao atualizar status');
    }
  };

  const handleGeneratePdf = (proposal) => {
    if (generatingId) return;
    setGeneratingId(proposal.id);
  };

  const filtered = proposals.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase()) || p.number.includes(search);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading) return <div className="p-8 text-muted">Carregando propostas...</div>;

  // Proposta sendo gerada (renderiza o documento oculto)
  const generatingProposal = generatingId ? proposals.find(p => p.id === generatingId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Renderer oculto — montado fora da tabela para não ser desmontado */}
      {generatingProposal && (
        <PdfGenerator
          proposal={generatingProposal}
          companySettings={companySettings}
          onDone={() => setGeneratingId(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-syne text-white mb-2">Propostas</h1>
          <p className="text-muted">Gerencie o ciclo de vida e status de todas as propostas geradas.</p>
        </div>
        <Button onClick={() => navigate('/propostas/nova')} className="flex items-center gap-2 px-6">
          <Plus size={18} />
          Nova Proposta
        </Button>
      </div>

      <div className="bg-surface border-2 border-border p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente ou número (ex: 2026-05-123)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-bg border-2 border-border rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'DRAFT', 'SENT', 'APPROVED', 'REJECTED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2 ${
                statusFilter === s
                  ? 'bg-accent/20 border-accent text-accent2'
                  : 'bg-bg border-border text-muted hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'Todas' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <FileText size={48} className="text-border mb-4" />
            <p className="font-bold text-white mb-1">Nenhuma proposta encontrada</p>
            <p className="text-sm">Tente ajustar seus filtros ou crie uma nova proposta.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted border-b-2 border-border/50 bg-black/20">
                  <th className="p-4 font-bold">Número</th>
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Data</th>
                  <th className="p-4 font-bold text-right">Valor Total</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-center">PDF</th>
                  <th className="p-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map(p => {
                  const isThisGenerating = generatingId === p.id;
                  const tipo = p.metadata?.tipo;
                  const editPath = tipo === 'armazem'
                    ? `/propostas/editar/armazem/${p.id}`
                    : tipo === 'material'
                      ? `/propostas/editar/material/${p.id}`
                      : `/propostas/editar/geral/${p.id}`;

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-bold text-accent2 text-sm">{p.number}</td>
                      <td className="p-4 text-white text-sm">
                        <div className="font-bold">{p.clientName}</div>
                        <div className="text-xs text-muted font-normal mt-0.5">{p.location}</div>
                      </td>
                      <td className="p-4 text-muted text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4 text-white font-black font-syne text-right text-sm">
                        {fmt(p.total)}
                      </td>
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[p.status]}`}>
                          {STATUS_ICONS[p.status]}
                          {STATUS_LABELS[p.status]}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleGeneratePdf(p)}
                          disabled={!!generatingId}
                          title="Gerar PDF"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border-2 transition-all
                            ${isThisGenerating
                              ? 'bg-accent/20 border-accent text-accent2 cursor-wait'
                              : 'bg-bg border-border text-muted hover:border-accent2 hover:text-accent2 disabled:opacity-40 disabled:cursor-not-allowed'
                            }`}
                        >
                          {isThisGenerating
                            ? <><Loader size={12} className="animate-spin" /> Gerando...</>
                            : <><Download size={12} /> PDF</>
                          }
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(editPath)}
                            title="Editar Proposta"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border-2 border-border bg-bg text-muted hover:border-accent hover:text-accent2 hover:bg-accent/10 transition-all"
                          >
                            <Edit size={12} /> Editar
                          </button>

                          <select
                            value={p.status}
                            onChange={(e) => handleStatusChange(p.id, e.target.value)}
                            className="bg-bg border-2 border-border rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase text-white outline-none focus:border-accent hover:border-accent/50 transition-all cursor-pointer min-w-[160px]"
                          >
                            <option value="DRAFT">Marcar como Rascunho</option>
                            <option value="SENT">Marcar como Enviada</option>
                            <option value="APPROVED">Marcar como Aprovada</option>
                            <option value="REJECTED">Marcar como Recusada</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProposalsList;
