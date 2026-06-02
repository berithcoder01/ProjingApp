import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, FileText, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Layout = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg text-text font-inter overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-border/50 flex-col">
        <div className="p-6 border-b border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-accent/20">P</div>
          <div>
            <div className="font-jakarta font-black text-lg leading-none text-white">PROJING<span className="text-accent2">PRO</span></div>
            <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">SaaS de Orçamentos</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <MenuLinks />
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2">
          <div className="px-4 py-2 mb-2">
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Usuário</div>
            <div className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</div>
          </div>
          
          <NavLink 
            to="/configuracoes"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all w-full text-left ${
                isActive ? 'bg-accent/10 text-accent2' : 'text-muted hover:bg-surface-hover hover:text-white'
              }`
            }
          >
            <Settings size={20} />
            <span className="text-sm">Configurações</span>
          </NavLink>
          
          <button 
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-danger hover:bg-danger/10 hover:text-danger transition-all w-full text-left mt-2"
          >
            <LogOut size={20} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="flex md:hidden bg-surface border-b border-border/50 p-4 items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-black text-sm text-white">P</div>
          <div className="font-jakarta font-black text-sm text-white uppercase tracking-tight">PROJING<span className="text-accent2">PRO</span></div>
        </div>
        <div className="text-[10px] font-bold text-muted bg-bg px-3 py-1 rounded-full border border-border/50 uppercase">Android v1.0</div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
        
        <footer className="hidden md:block py-4 px-8 border-t border-border/50 text-[10px] font-bold text-muted text-center uppercase tracking-[0.2em] bg-bg/95 backdrop-blur-md z-10 relative">
          Projing Pro · Soluções em PEAD · Marialva, PR
        </footer>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 justify-between items-center z-40 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
          <BottomNavLink to="/" icon={<Home size={22} />} label="Início" />
          <BottomNavLink to="/propostas" icon={<FileText size={22} />} label="Propostas" />
          <BottomNavLink to="/clientes" icon={<Users size={22} />} label="Clientes" />
          <BottomNavLink to="/configuracoes" icon={<Settings size={22} />} label="Ajustes" />
        </nav>
      </main>
    </div>
  );
};

const MenuLinks = () => (
  <>
    <NavLink 
      to="/" 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          isActive ? 'bg-accent/10 text-accent2' : 'text-muted hover:bg-surface-hover hover:text-white'
        }`
      }
    >
      <Home size={20} />
      <span className="text-sm">Dashboard</span>
    </NavLink>
    
    <NavLink 
      to="/propostas" 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          isActive ? 'bg-accent/10 text-accent2' : 'text-muted hover:bg-surface-hover hover:text-white'
        }`
      }
    >
      <FileText size={20} />
      <span className="text-sm">Propostas</span>
    </NavLink>

    <NavLink 
      to="/clientes" 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          isActive ? 'bg-accent/10 text-accent2' : 'text-muted hover:bg-surface-hover hover:text-white'
        }`
      }
    >
      <Users size={20} />
      <span className="text-sm">Clientes</span>
    </NavLink>
  </>
);

const BottomNavLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 transition-all ${
        isActive ? 'text-accent2 scale-110' : 'text-muted'
      }`
    }
  >
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </NavLink>
);

export default Layout;
