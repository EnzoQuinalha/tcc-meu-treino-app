import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Importa os estilos da página
import '../styles/index.css'; 
import '../styles/header.css'; 
import '../styles/base.css'; 

function HomePage() {
  const [mensagem, setMensagem] = useState('Carregando dados...');
  const navigate = useNavigate();

  return (
    <>
      <header className="page-header">
        <h1>Bem vindo</h1>
      </header>
      <main className="page-content" style={{height: 'calc(100% - 23.7vh)', borderRadius: '0 0 0.75rem 0'}}>
      </main>
    </>
  );
}



export default HomePage;