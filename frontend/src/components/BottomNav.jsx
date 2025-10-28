import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaDumbbell, FaUser } from 'react-icons/fa'; // Importa os ícones do Font Awesome
import './BottomNav.css'; // Criaremos este arquivo para estilizar a barra

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <FaHome size={24} /> {/* Ícone de Casa */}
        <span>Início</span>
      </NavLink>
      
      {/* ATENÇÃO: A rota para treinos precisa ser definida no App.js. 
          Usarei "/treinos" como exemplo, mas ajuste se necessário. */}
      <NavLink 
        to="/treinos" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <FaDumbbell size={24} /> {/* Ícone de Halter */}
        <span>Treinos</span>
      </NavLink>
      
      {/* ATENÇÃO: A rota para perfil precisa ser definida no App.js. 
          Usarei "/perfil" como exemplo. */}
      <NavLink 
        to="/perfil" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <FaUser size={24} /> {/* Ícone de Perfil */}
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;