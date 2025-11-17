import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';

// Importe todos os seus componentes de página
import FormularioCadastro from './components/FormularioCadastro';
import FormularioLogin from './components/FormularioLogin';
import Perfil from './components/Perfil';
import ListaTreinos from './components/ListaTreinos';
import FormularioTreino from './components/FormularioTreino';
// O FormularioEdicaoTreino será chamado de dentro do ListaTreinos por enquanto
import Sidebar from './components/Sidebar';
import FormularioEdicaoTreino from './components/FormularioEdicaoTreino';

// Componente para proteger rotas (continua igual)
function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// Layout Principal (com Sidebar e BottomNav)
function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <Outlet /> {/* Renderiza a página atual (Início, Treinos ou Perfil) */}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/login" element={<FormularioLogin />} />
          <Route path="/cadastro" element={<FormularioCadastro />} />

          {/* --- ROTAS PROTEGIDAS --- */}
          <Route element={<ProtectedRoute />}>
            
            {/* Rotas COM o layout principal (Sidebar/BottomNav) */}
            <Route element={<MainLayout />}> 
              <Route path="/" element={<h2>Página Inicial (Dashboard)</h2>} />
              <Route path="/treinos" element={<ListaTreinos />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
            
            {/* Rotas SEM o layout principal (Telas Cheias) */}
            <Route path="/criar-treino" element={<FormularioTreino />} /> 
            
            {/* --- ★★★ NOVA ROTA DE EDIÇÃO ADICIONADA AQUI ★★★ --- */}
            {/* Ela pega o ID do treino pela URL */}
            <Route path="/treinos/:treinoId/editar" element={<FormularioEdicaoTreino />} />
            {/* -------------------------------------------------- */}
            
          </Route>

          {/* Rota Padrão */}
          <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;