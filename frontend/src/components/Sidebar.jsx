import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaDumbbell, FaUser } from 'react-icons/fa'; // Ícones que já usamos

// Importa os estilos que definem a sidebar.
// Pelo que vi nos seus arquivos, os estilos da sidebar
// estão principalmente em 'base.css' e 'header.css'.
import '../styles/base.css';
import '../styles/header.css'; 

function Sidebar() {
  return (
    // Esta estrutura foi copiada do seu 'meus-treinos.html'
    <nav className="sidebar-nav">
      <div className="logo">Meu App</div>
      <ul className="sidebar-nav-list">
        <li>
          {/* O NavLink é a versão do React Router para o <a>.
              Ele adiciona a classe 'active' automaticamente. */}
          <NavLink to="/">
            <FaHome /> {/* Ícone */}
            <span>Início</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/treinos">
            <FaDumbbell /> {/* Ícone */}
            <span>Meus Treinos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/perfil">
            <FaUser /> {/* Ícone */}
            <span>Minha Conta</span>
          </NavLink>
        </li>
        {/* Adicione outros links aqui se precisar */}
      </ul>
    </nav>
  );
}

export default Sidebar;