import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTE O useNavigate

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null); // Estado para erros, se precisar
  
  const navigate = useNavigate(); // <-- 2. INICIALIZE O HOOK

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Limpa erros anteriores

    const dadosLogin = {
      email: email,
      senha: senha,
    };

    try {
      // Use a URL correta do seu backend Flask (porta 5000)
      const response = await axios.post('http://127.0.0.1:5000/api/login', dadosLogin); 
      
      const token = response.data.access_token;
      localStorage.setItem('token', token); // Salva o token no navegador

      // <-- 3. AÇÃO DE REDIRECIONAMENTO -->
      // Após salvar o token, navega para a página principal (rota "/")
      navigate('/'); 
      // ----------------------------------

      // Limpa os campos após o sucesso (opcional, pode ser feito pela navegação)
      // setEmail('');
      // setSenha('');

    } catch (error) {
      console.error('Erro no login:', error);
      // Pega a mensagem de erro da resposta da API, se existir
      const errorMessage = error.response?.data?.erro || 'Erro no login. Verifique suas credenciais.';
      setError(errorMessage); // Mostra o erro para o usuário
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </div>
      {/* Mostra a mensagem de erro, se houver */}
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <button type="submit">Entrar</button>
      {/* Você pode adicionar um Link aqui para a página de cadastro */}
      {/* Ex: <Link to="/cadastro">Não tem conta? Cadastre-se</Link> */}
    </form>
  );
}

export default FormularioLogin;