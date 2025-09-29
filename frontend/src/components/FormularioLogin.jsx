import React, { useState } from 'react';
import axios from 'axios';

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dadosLogin = {
      email: email,
      senha: senha,
    };

    try {
      // Faz a requisição POST para o endpoint de login
      const response = await axios.post('http://127.0.0.1:5000/api/login', dadosLogin);

      // Pega o token da resposta
      const token = response.data.access_token;

      // **IMPORTANTE: Salva o token no navegador**
      // O localStorage é um "cofre" no navegador para guardar informações.
      localStorage.setItem('token', token);

      alert('Login realizado com sucesso!');

      // Limpa os campos
      setEmail('');
      setSenha('');

    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro no login. Verifique suas credenciais.');
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
      <button type="submit">Entrar</button>
    </form>
  );
}

export default FormularioLogin;