import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';

// Importe seus componentes de página/formulário
import FormularioCadastro from './components/FormularioCadastro'; // Atenção ao nome do arquivo, o seu estava com 'f' minúsculo
import FormularioLogin from './components/FormularioLogin';
import Perfil from './components/Perfil';
import ListaTreinos from './components/ListaTreinos';
import FormularioTreino from './components/FormularioTreino';
import BottomNav from './components/BottomNav';
// O FormularioEdicaoTreino será chamado de dentro do ListaTreinos

// Componente para proteger rotas que exigem login
function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const location = useLocation(); // Hook para saber a URL atual

  if (!token) {
    // Se não tem token, redireciona para o login, guardando a página que ele tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se tem token, renderiza o conteúdo da rota protegida (usando Outlet)
  return <Outlet />;
}

// Layout Principal para a área logada (Opcional, mas recomendado)
function MainLayout() {
  return (
    <div style={{ paddingBottom: '70px' }}> {/* Adiciona espaço embaixo para a barra não cobrir conteúdo */}
      {/* O Outlet renderiza o componente da rota filha (Início, Treinos ou Perfil) */}
      <Outlet /> 
      
      {/* 2. ADICIONA A BARRA DE NAVEGAÇÃO FIXA */}
      <BottomNav />
    </div>
  );
}


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Meu Treino App</h1>
      </header> */}
      <main>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<FormularioLogin />} />
          <Route path="/cadastro" element={<FormularioCadastro />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}> 
              <Route path="/" element={<h2>Página Inicial (Dashboard)</h2>} />
              <Route path="/treinos" element={<ListaTreinos />} /> 
              <Route path="/perfil" element={<Perfil />} />
              
              {/* --- 2. NOVA ROTA ADICIONADA AQUI --- */}
              <Route path="/criar-treino" element={<FormularioTreino />} /> 
              {/* ----------------------------------- */}
            </Route>
          </Route>

          {/* Rota Padrão */}
          <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;