import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/cadastro.css'; // <-- 1. Importa o CSS específico do cadastro

function FormularioCadastro() {
  const navigate = useNavigate();

  // 2. ESTADOS PARA TODOS OS CAMPOS DO SEU HTML
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [endereco, setEndereco] = useState(''); // Campos extras
  const [cidade, setCidade] = useState('');     // Campos extras

  const [error, setError] = useState(null);

  // 3. EFEITO PARA MUDAR O FUNDO (GRADIENTE)
  // Reutiliza a classe 'login-body' que está no 'login.css' (importado pelo 'cadastro.css')
  useEffect(() => {
    document.body.classList.add('login-body');
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  // 4. LÓGICA DE CADASTRO
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // 5. ★★★ O PULO DO GATO ★★★
    // Criamos o objeto 'dadosParaApi' APENAS com o que o backend espera.
    // As variáveis 'nascimento', 'endereco' e 'cidade' são ignoradas aqui.
    const dadosParaApi = {
      nome: nome,
      email: email,
      senha: senha 
    };
    
    // O seu backend espera 'senha', não 'senha_hash'. O hash é feito lá.
    // Se o seu backend espera 'senha_hash', mude a chave para: senha_hash: senha

    try {
      await axios.post('http://127.0.0.1:5000/api/usuarios', dadosParaApi);
      
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login'); // Redireciona para o login após o sucesso

    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao cadastrar. Verifique seus dados.';
      setError(errorMessage);
    }
  };

  // 6. "TRADUÇÃO" DO HTML PARA JSX
  return (
    <div className="login-container">
      <div className="content-wrapper">
        <header className="login-header-role">
          <Link to="/login" className="role-back-button"> {/* Link para voltar ao login */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="logo-title-role">Criar Conta</h1>
        </header>

        <p className="page-subtitle-cadastro">
          Precisamos de algumas informações para começar.
        </p>

        {/* Mostra o erro da API aqui */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <form id="cadastro-form" className="form-container" onSubmit={handleSubmit}>
          
          {/* Seção 1: Dados de Acesso */}
          <section id="dados-acesso-section" className="form-section">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
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
                className="form-input" 
                placeholder="Pelo menos 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
              />
              {/* Ícone de olho pode ser adicionado aqui depois */}
            </div>
          </section>

          {/* Seção 2: Dados Pessoais */}
          <section id="dados-pessoais-section" className="form-section">
            <label htmlFor="nome" className="form-label">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              className="form-input" 
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required 
            />

            <label htmlFor="nascimento" className="form-label">Data de nascimento</label>
            <input 
              type="date" 
              id="nascimento" 
              className="form-input"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
            />

            <label htmlFor="endereco" className="form-label">Endereço (Opcional)</label>
            <input 
              type="text" 
              id="endereco" 
              className="form-input" 
              placeholder="Ex: Rua das Flores, 123"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <label htmlFor="cidade" className="form-label">Cidade (Opcional)</label>
            <input 
              type="text" 
              id="cidade" 
              className="form-input" 
              placeholder="Ex: São Paulo"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </section>

          <div className="button-group-role">
            <button type="submit" className="btn btn-primary">
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioCadastro;