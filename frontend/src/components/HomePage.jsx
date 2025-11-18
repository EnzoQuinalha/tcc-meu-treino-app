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
}
export default HomePage;