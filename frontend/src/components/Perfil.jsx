import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Importa os estilos da página
import '../styles/conta.css';
import '../styles/header.css';
import '../styles/base.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState('Carregando perfil...');
  const navigate = useNavigate();

  // 2. Lógica para o botão de Logout (continua a mesma)
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 3. Lógica para buscar os dados do perfil (continua a mesma)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Se não tem token, nem tenta carregar
      return;
    }

    const buscarPerfil = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsuario(response.data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setMensagem('Não foi possível carregar o perfil.');
        if (error.response && error.response.status === 401) {
          // Se o token for inválido/expirado, força o logout
          handleLogout();
        }
      }
    };

    buscarPerfil();
    // eslint-disable-next-line
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  // 4. Renderização de Loading
  if (!usuario) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>{mensagem}</p>
        </div>
    );
  }

  // 5. "Tradução" do HTML para JSX (quando o usuário já foi carregado)
  return (
    <>
      <header className="page-header">
        <h1>Minha Conta</h1>
        {/* Você pode adicionar um botão de salvar aqui se um dia implementar a edição de perfil */}
      </header>

      <main className="main-content" style={{height: '84.4%'}}>
        <div className="conta-container">
          
          {/* Seção do Cabeçalho do Perfil (com avatar) */}
          <div className="profile-header">
            <div className="avatar-placeholder">
            </div>
            <h2>{usuario.nome}</h2>
            <p>{usuario.email}</p>
          </div>

          {/* Botão de Logout */}
          <button 
            onClick={handleLogout} 
            className="btn-danger" // Classe do seu base.css
            style={{ width: '100%', marginTop: '1.5rem' }} // Estilo para ocupar 100% da largura
          >
            Sair (Logout)
          </button>

        </div>
      </main>
    </>
  );
}

export default Perfil;