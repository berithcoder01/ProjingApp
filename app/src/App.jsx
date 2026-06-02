import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProposalsList from './features/proposal/ProposalsList';
import ClientsList from './features/clients/ClientsList';
import Settings from './features/settings/Settings';
import Login from './features/auth/Login';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { AuthProvider } from './shared/context/AuthContext';
import Layout from './shared/Layout';
import Dashboard from './features/dashboard/Dashboard';
import ProposalWizard from './features/proposal/components/ProposalWizard';
import ArmazemWizard from './features/proposal/components/ArmazemWizard';
import SelectProposalType from './features/proposal/SelectProposalType';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="propostas" element={<ProposalsList />} />
              <Route path="propostas/nova" element={<SelectProposalType />} />
              <Route path="propostas/nova/geral" element={<ProposalWizard />} />
              <Route path="propostas/nova/armazem" element={<ArmazemWizard />} />
              <Route path="propostas/editar/geral/:id" element={<ProposalWizard />} />
              <Route path="propostas/editar/armazem/:id" element={<ArmazemWizard />} />
              <Route path="clientes" element={<ClientsList />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
