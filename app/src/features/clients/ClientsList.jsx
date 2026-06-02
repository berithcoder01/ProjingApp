import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, MapPin, Phone, Building2 } from 'lucide-react';
import { fetchClients, createClient, deleteClient } from '../../shared/services/api';
import Button from '../../shared/Button';
import Input from '../../shared/Input';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: '', contact: '', role: '', location: '', phone: '' });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createClient(formData);
      setIsFormOpen(false);
      setFormData({ name: '', contact: '', role: '', location: '', phone: '' });
      loadClients();
    } catch (error) {
      alert('Erro ao criar cliente.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteClient(id);
        loadClients();
      } catch (error) {
        alert('Erro ao deletar cliente.');
      }
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-syne text-white mb-2">Clientes</h1>
          <p className="text-muted">Gerencie sua base de clientes e contatos.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-6">
          <Plus size={18} />
          Novo Cliente
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-surface border-2 border-accent/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
          <h2 className="text-xl font-bold font-syne text-white mb-6">Cadastrar Cliente</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Empresa / Razão Social *" placeholder="Ex.: Indústria Alfa" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="Nome do Contato *" placeholder="Ex.: Carlos Silva" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} required />
              <Input label="Cargo" placeholder="Ex.: Engenheiro Chefe" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
              <Input label="Localidade *" placeholder="Ex.: Maringá, PR" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
              <Input label="Telefone / WhatsApp" placeholder="Ex.: (44) 9 9999-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar Cliente</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border-2 border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar clientes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg border-2 border-border rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg text-[10px] uppercase tracking-widest text-muted">
                <th className="p-4 font-bold border-b border-border/50">Empresa / Cliente</th>
                <th className="p-4 font-bold border-b border-border/50">Contato</th>
                <th className="p-4 font-bold border-b border-border/50">Localidade</th>
                <th className="p-4 font-bold border-b border-border/50 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-muted">Carregando...</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-muted">Nenhum cliente encontrado.</td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="border-b border-border/50 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                          <Building2 size={20} />
                        </div>
                        <div className="font-bold text-white text-sm">{client.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted">
                      <div className="text-white font-medium mb-1">{client.contact}</div>
                      {client.phone && <div className="flex items-center gap-1.5 text-xs"><Phone size={12}/> {client.phone}</div>}
                    </td>
                    <td className="p-4 text-sm text-muted">
                      <div className="flex items-center gap-1.5"><MapPin size={14}/> {client.location}</div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientsList;
