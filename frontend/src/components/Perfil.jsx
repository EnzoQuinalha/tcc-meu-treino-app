import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Perfil() {
  // Estado para guardar os dados do usuário
  const [usuario, setUsuario] = useState(null);
  // Estado para mensagens de erro ou carregamento
  const [mensagem, setMensagem] = useState('Carregando perfil...');

  // O useEffect é executado uma vez, quando o componente é montado na tela
  useEffect(() => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('token');

    // Se não houver token, o usuário não está logado
    if (!token) {
      setMensagem('Você não está logado. Faça o login para ver seu perfil.');
      return;
    }

    // 2. Se houver um token, faz a requisição para a rota protegida
    const buscarPerfil = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/perfil', {
          // 3. **MUITO IMPORTANTE:** Envia o token no cabeçalho da requisição
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // 4. Salva os dados do usuário no estado
        setUsuario(response.data);
      } catch (error) {
        // Se o token for inválido ou expirado, o backend retornará um erro
        console.error('Erro ao buscar perfil:', error);
        setMensagem('Não foi possível carregar o perfil. Seu token pode ter expirado. Faça o login novamente.');
        // Opcional: remover o token inválido
        localStorage.removeItem('token');
      }
    };

    buscarPerfil();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  // Se ainda não temos os dados do usuário, mostramos a mensagem
  if (!usuario) {
    return <div>{mensagem}</div>;
  }

  // Se temos os dados, mostramos o perfil
  return (
    <div>
      <h2>Perfil do Usuário</h2>
      <p><strong>ID:</strong> {usuario.id}</p>
      <p><strong>Nome:</strong> {usuario.nome}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
    </div>
  );
}

export default Perfil;