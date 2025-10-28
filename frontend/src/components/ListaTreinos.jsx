import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioEdicaoTreino from './FormularioEdicaoTreino';
import { Link } from 'react-router-dom';

function ListaTreinos() {
  const [treinos, setTreinos] = useState([]);
  const [mensagem, setMensagem] = useState('Carregando treinos...');
  const [editandoTreinoId, setEditandoTreinoId] = useState(null);

  const buscarTreinos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMensagem('Faça o login para ver seus treinos.');
      return;
    }
    try {
      // ATENÇÃO: Verifique se a URL está correta para o seu projeto web
      const response = await axios.get('http://127.0.0.1:5000/api/treinos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.length === 0) {
        setMensagem('Você ainda não criou nenhum treino.');
        setTreinos([]);
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

  // --- NOVA FUNÇÃO ADICIONADA AQUI ---
  const handleMarcarFeito = async (treinoId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      // ATENÇÃO: Verifique se a URL está correta para o seu projeto web
      await axios.post('http://127.0.0.1:5000/api/registros', 
      { treino_id: treinoId }, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Parabéns! Treino de hoje registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar treino:', error);
      alert('Não foi possível registrar o treino.');
    }
  };
  // ------------------------------------

  const handleEdicaoConcluida = () => {
    setEditandoTreinoId(null);
    buscarTreinos();
  };

  if (editandoTreinoId) {
    return <FormularioEdicaoTreino treinoId={editandoTreinoId} onEdicaoConcluida={handleEdicaoConcluida} />;
  }

  return (
    <div>
      <h2>Minhas Fichas de Treino</h2>
      
      {treinos.length === 0 ? <p>{mensagem}</p> : treinos.map(treino => (
        <div key={treino.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{treino.nome} - ({treino.dia})</h3>
          
          <button onClick={() => setEditandoTreinoId(treino.id)} style={{marginRight: '10px'}}>
            Editar
          </button>
          
          <button onClick={() => handleApagarTreino(treino.id)} style={{backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px'}}>
            Apagar Treino
          </button>
          
          {/* --- NOVO BOTÃO ADICIONADO AQUI --- */}
          <button onClick={() => handleMarcarFeito(treino.id)} style={{backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer'}}>
            Marcar como Feito Hoje
          </button>
          {/* ------------------------------------ */}
          
          <ul>
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        {/* --- 2. BOTÃO/LINK ADICIONADO AQUI --- */}
        <Link to="/criar-treino">
          <button>+ Novo Treino</button>
        </Link>
        {/* ------------------------------------ */}
      </div>
    </div>
  );
}

export default ListaTreinos;