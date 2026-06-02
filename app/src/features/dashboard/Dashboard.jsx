import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Users, FileText, Calendar, Edit, Download, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/Button';
import { fetchStats, fetchRecentProposals, fetchSettings } from '../../shared/services/api';
import { fmt } from '../proposal/constants';
import PdfGenerator from '../proposal/components/PdfGenerator';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companySettings, setCompanySettings] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [s, r, settings] = await Promise.all([
          fetchStats(), 
          fetchRecentProposals(),
          fetchSettings().catch(() => null)
        ]);
        setStats(s);
        setRecent(r);
        setCompanySettings(settings);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGeneratePdf = (proposal) => {
    if (generatingId) return;
    setGeneratingId(proposal.id);
  };

  if (isLoading) return <div className="text-muted font-bold p-8">Carregando painel...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Renderer de PDF oculto */}
      {generatingId && (
        <PdfGenerator
          proposal={recent.find(p => p.id === generatingId)}
          companySettings={companySettings}
          onDone={() => setGeneratingId(null)}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-syne text-white mb-2">Visão Geral</h1>
          <p className="text-muted">Dados reais extraídos diretamente do banco de dados.</p>
        </div>
        <Button onClick={() => navigate('/propostas/nova')} className="flex items-center gap-2 px-6">
          <Plus size={18} />
          Nova Proposta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Propostas Totais" 
          value={stats?.totalProposals || 0} 
          icon={<FileText size={24} />} 
          trend={`${stats?.recentProposals || 0} nos últimos 30 dias`} 
        />
        <MetricCard 
          title="Ticket Médio" 
          value={fmt(stats?.averageValue || 0)} 
          icon={<TrendingUp size={24} />} 
          trend="Baseado em todas as propostas" 
        />
        <MetricCard 
          title="Taxa de Conversão" 
          value={stats?.totalProposals > 0 ? `${Math.round((stats.approvedCount / stats.totalProposals) * 100)}%` : '0%'} 
          icon={<Users size={24} />} 
          trend={`${stats?.approvedCount || 0} de ${stats?.totalProposals || 0} aprovadas`} 
        />
        <MetricCard 
          title="Faturamento Aprovado" 
          value={fmt(stats?.approvedValue || 0)} 
          icon={<span className="font-syne font-black text-xl">R$</span>} 
          trend="Total de propostas fechadas" 
        />
      </div>

      <div className="bg-surface border-2 border-border rounded-2xl p-6 shadow-xl mt-8">
        <h2 className="text-lg font-bold text-white mb-6 font-syne">Atividades Recentes</h2>
        
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mb-4 border border-border">
              <FileText size={24} className="text-accent2" />
            </div>
            <p>Nenhuma proposta recente encontrada.</p>
            <Button variant="ghost" className="mt-4" onClick={() => navigate('/propostas/nova')}>
              Comece criando a primeira
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted border-b border-border/50">
                  <th className="pb-4 font-bold">Número</th>
                  <th className="pb-4 font-bold">Cliente</th>
                  <th className="pb-4 font-bold">Valor</th>
                  <th className="pb-4 font-bold text-center">Status</th>
                  <th className="pb-4 font-bold text-center">PDF</th>
                  <th className="pb-4 font-bold text-center">Editar</th>
                  <th className="pb-4 font-bold text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recent.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-bold text-accent2 text-sm">{p.number}</td>
                    <td className="py-4 text-white text-sm">{p.clientName}</td>
                    <td className="py-4 text-white font-bold text-sm">{fmt(p.total)}</td>
                    <td className="py-4 text-center">
                      <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'APPROVED' ? 'bg-success/20 text-success' :
                        p.status === 'SENT' ? 'bg-blue-500/20 text-blue-400' :
                        p.status === 'REJECTED' ? 'bg-danger/20 text-danger' :
                        'bg-muted/20 text-muted'
                      }`}>
                        {p.status === 'APPROVED' ? 'Aprovada' :
                         p.status === 'SENT' ? 'Enviada' :
                         p.status === 'REJECTED' ? 'Recusada' : 'Rascunho'}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleGeneratePdf(p)}
                        disabled={!!generatingId}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          generatingId === p.id 
                            ? 'bg-accent/20 border-accent text-accent2' 
                            : 'bg-bg border-border text-muted hover:border-accent2 hover:text-accent2'
                        }`}
                        title="Gerar PDF"
                      >
                        {generatingId === p.id ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
                      </button>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => {
                          const isArmazem = p.metadata?.tipo === 'armazem';
                          const path = isArmazem ? `/propostas/editar/armazem/${p.id}` : `/propostas/editar/geral/${p.id}`;
                          navigate(path);
                        }}
                        className="p-2 rounded-lg border-2 border-border bg-bg text-muted hover:border-accent hover:text-white transition-all"
                        title="Editar Proposta"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                    <td className="py-4 text-muted text-xs text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Calendar size={14} />
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;

function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-surface border border-border/50 p-6 rounded-2xl hover:border-accent/30 transition-all shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center text-accent2 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-black font-syne text-white mb-1">{value}</div>
        <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">{title}</div>
        <div className="text-[10px] text-accent font-medium">{trend}</div>
      </div>
    </div>
  );
}
