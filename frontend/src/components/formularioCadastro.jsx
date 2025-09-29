import React, { useState } from 'react';
import axios from 'axios';

function FormularioCadastro() {
  // Cria um "estado" para cada campo do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função que será chamada quando o formulário for enviado
  const handleSubmit = async (event) => {
    // Previne o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // Monta o objeto com os dados do usuário a partir do estado
    const novoUsuario = {
      nome: nome,
      email: email,
      senha: senha,
    };

    try {
      // Faz a requisição POST para o backend usando Axios
      const response = await axios.post('http://127.0.0.1:5000/api/usuarios', novoUsuario);

      // Se a requisição for bem-sucedida, exibe a resposta no console e um alerta
      console.log('Resposta do servidor:', response.data);
      alert('Usuário cadastrado com sucesso!');

      // Limpa os campos do formulário
      setNome('');
      setEmail('');
      setSenha('');

    } catch (error) {
      // Se houver um erro, exibe o erro no console e um alerta
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário. Verifique o console para mais detalhes.');
    }
  };

  // O JSX que renderiza o formulário na tela
  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro de Novo Usuário</h2>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
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
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default FormularioCadastro;