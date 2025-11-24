import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/home.css'; // Importa o estilo que acabamos de criar
import '../styles/header.css'; // Para manter o estilo do header consistente

function HomePage() {
  const [datasTreinadas, setDatasTreinadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // 1. Busca o Resumo da Semana
        const resRegistros = await axios.get('http://127.0.0.1:5000/api/registros/semana', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDatasTreinadas(resRegistros.data);

        // 2. Busca o Perfil para pegar o nome (opcional, para dar 'Olá')
        const resPerfil = await axios.get('http://127.0.0.1:5000/api/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNomeUsuario(resPerfil.data.nome.split(' ')[0]); // Pega só o primeiro nome

      } catch (error) {
        console.error("Erro ao carregar dados da home", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gera os últimos 7 dias para exibição (do hoje para trás)
  const diasDaSemana = Array.from({ length: 7 }).map((_, i) => {
    const data = new Date();
    data.setDate(data.getDate() - i);
    return data;
  }).reverse(); // Inverte para mostrar do mais antigo para o mais novo (Hoje no final)

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Carregando seu progresso...</div>;
  }

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Olá, {nomeUsuario}! 👋</h1>
        <p>Aqui está o seu resumo de treinos dos últimos 7 dias.</p>
      </header>

      <div className="semana-container">
        {diasDaSemana.map((dia, index) => {
          // Formata a data para comparar com o que vem do banco (YYYY-MM-DD)
          const diaString = dia.toISOString().split('T')[0];
          const treinou = datasTreinadas.includes(diaString);
          
          // Pega o nome do dia (Seg, Ter, Qua...)
          const nomeDia = dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
          // Pega o dia do mês (01, 02...)
          const diaMes = dia.getDate();

          return (
            <div key={index} className="dia-card">
              <span className="dia-label">{nomeDia} {diaMes}</span>
              
              {/* Renderiza a bolinha com classe condicional */}
              <div className={`status-bolinha ${treinou ? 'treinado' : 'nao-treinado'}`}>
                {treinou ? '✔' : ''} {/* Mostra check ou vazio */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Se quiser adicionar um botão de ação rápida aqui embaixo depois, pode */}
    </div>
  );
}

export default HomePage;