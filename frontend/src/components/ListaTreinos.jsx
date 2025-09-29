import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioEdicaoTreino from './FormularioEdicaoTreino'; // <-- NOVO: Importamos o formulário que vamos criar

function ListaTreinos() {
  const [treinos, setTreinos] = useState([]);
  const [mensagem, setMensagem] = useState('Carregando treinos...');
  const [editandoTreinoId, setEditandoTreinoId] = useState(null); // <-- NOVO: Estado para controlar qual treino está sendo editado

  const buscarTreinos = async () => {
    // ... (a função buscarTreinos continua igual a antes)
    const token = localStorage.getItem('token');
    if (!token) {
      setMensagem('Faça o login para ver seus treinos.');
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/treinos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.length === 0) {
        setMensagem('Você ainda não criou nenhum treino.');
        setTreinos([]); // Garante que a lista fique vazia
      } else {
        setTreinos(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      setMensagem('Não foi possível carregar os treinos.');
    }
  };

  useEffect(() => {
    buscarTreinos();
  }, []);

  const handleApagarTreino = async (treinoId) => {
    // ... (a função handleApagarTreino continua igual a antes)
    if (!window.confirm('Tem certeza que deseja apagar este treino?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:5000/api/treinos/${treinoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTreinos(treinos.filter(treino => treino.id !== treinoId));
      alert('Treino apagado com sucesso!');
    } catch (error) {
      console.error('Erro ao apagar treino:', error);
      alert('Não foi possível apagar o treino.');
    }
  };

  // <-- NOVO: Função para fechar o formulário de edição e atualizar a lista
  const handleEdicaoConcluida = () => {
    setEditandoTreinoId(null); // Fecha o formulário
    buscarTreinos(); // Busca os treinos novamente para mostrar os dados atualizados
  };

  // <-- NOVO: Lógica de renderização condicional
  if (editandoTreinoId) {
    // Se um treino está sendo editado, mostra o formulário de edição
    return <FormularioEdicaoTreino treinoId={editandoTreinoId} onEdicaoConcluida={handleEdicaoConcluida} />;
  }

  // Se não, mostra a lista de treinos (código que já tínhamos)
  return (
    <div>
      <h2>Minhas Fichas de Treino</h2>
      {treinos.length === 0 ? <p>{mensagem}</p> : treinos.map(treino => (
        <div key={treino.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{treino.nome} - ({treino.dia})</h3>
          
          {/* --- BOTÃO NOVO DE EDITAR --- */}
          <button onClick={() => setEditandoTreinoId(treino.id)} style={{marginRight: '10px'}}>
            Editar
          </button>
          
          <button onClick={() => handleApagarTreino(treino.id)} style={{backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer'}}>
            Apagar Treino
          </button>
          
          <ul>
            {/* ... (o map dos exercícios continua igual) ... */}
            {treino.exercicios.map(exercicio => (
              <li key={exercicio.id_exercicio}>
                <strong>{exercicio.nome_exercicio}</strong>: {exercicio.series} séries de {exercicio.repeticoes} reps.
                (Descanso: {exercicio.descanso_seg}s)
                {exercicio.peso && <span> | Peso: {exercicio.peso}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ListaTreinos;