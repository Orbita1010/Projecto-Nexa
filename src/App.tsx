/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './components/DashboardLayout';
import { EntrepreneurDashboard } from './pages/EntrepreneurDashboard';
import { SubmitProject } from './pages/SubmitProject';
import { InvestorPortal } from './pages/InvestorPortal';
import { MessagesPage } from './pages/MessagesPage';

const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<EntrepreneurDashboard />} />
      <Route path="/submit" element={<SubmitProject />} />
      <Route path="/projects" element={<div className="p-10 bg-white rounded-2xl border border-gray-100 text-center font-bold">Meus Projetos (Página de Detalhes)</div>} />
      <Route path="/business-plan" element={<div className="p-10 bg-white rounded-2xl border border-gray-100 text-center font-bold">Gerador de Plano de Negócio</div>} />
      <Route path="/mentorship" element={<div className="p-10 bg-white rounded-2xl border border-gray-100 text-center font-bold">Portal de Mentoria</div>} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/calendar" element={<div className="p-10 bg-white rounded-2xl border border-gray-100 text-center font-bold">Agendamentos</div>} />
      <Route path="/settings" element={<div className="p-10 bg-white rounded-2xl border border-gray-100 text-center font-bold">Configurações de Perfil</div>} />
    </Routes>
  </DashboardLayout>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="/investors" element={<InvestorPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
