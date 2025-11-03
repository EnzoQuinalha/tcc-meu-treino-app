import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css'; // <-- 1. Importa o CSS específico do login

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 2. EFEITO PARA MUDAR O FUNDO (O GRADIENTE)
  // O seu CSS aplica o gradiente na tag <body>,
  // então usamos o useEffect para adicionar essa classe quando
  // o componente de login é montado, e remover quando ele é desmontado.
  useEffect(() => {
    document.body.classList.add('login-body'); // Adiciona a classe do gradiente
    return () => {
      document.body.classList.remove('login-body'); // Remove ao sair da página
    };
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // 3. LÓGICA DE LOGIN (continua a mesma)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', {
        email: email, // O HTML pedia 'email', a API pedia 'email'. Perfeito.
        senha: senha, // O HTML pedia 'senha', a API pedia 'senha'. Perfeito.
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/'); // Redireciona para a página principal
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro no login. Verifique suas credenciais.';
      setError(errorMessage);
    }
  };

  // 4. "TRADUÇÃO" DO HTML PARA JSX
  // Copiamos a estrutura do login-role.html e adaptamos:
  // - 'class' vira 'className'
  // - 'for' vira 'htmlFor'
  // - inputs são auto-fechados com '/>'
  // - inputs são controlados pelo React (value={} e onChange={})
  return (
    <div className="login-container">
      <header className="login-header-role">
        {/* Este é o botão de voltar que tinha no seu HTML. 
            Podemos fazer ele voltar para uma página de "escolha" ou para o cadastro.
            Por enquanto, vou linkar para a página de cadastro. */}
        <Link to="/cadastro" className="role-back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="logo-title-role">Login</h1>
      </header>

      <form id="login-form" className="form-container" onSubmit={handleSubmit}>
        <section className="form-section">
          {/* Mostra o erro da API aqui */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" // O 'name' não é usado pelo React, mas é bom ter
            className="form-input" 
            placeholder="seuemail@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <label htmlFor="senha" className="form-label">Senha</label>
          <div className="password-wrapper">
            <input 
              type="password" 
              id="senha" 
              name="senha"
              className="form-input" 
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            {/* O ícone de olho (opcional) pode ser adicionado aqui depois */}
          </div>
        </section>

        <div className="button-group-role">
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
          <Link to="/cadastro" className="btn btn-secondary">
            Criar conta
          </Link>
        </div>
      </form>
    </div>
  );
}

export default FormularioLogin;