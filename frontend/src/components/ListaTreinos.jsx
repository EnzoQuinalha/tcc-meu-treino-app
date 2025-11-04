import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FormularioEdicaoTreino from './FormularioEdicaoTreino';

// Importa os estilos da página
import '../styles/meus-treinos.css'; 
import '../styles/header.css'; 
import '../styles/base.css'; 

function ListaTreinos() {
  const [treinos, setTreinos] = useState([]);//eslint-disable-next-line
  const [mensagem, setMensagem] = useState('Carregando treinos...'); 
  const [editandoTreinoId, setEditandoTreinoId] = useState(null);
  
  const [openTreinoId, setOpenTreinoId] = useState(null);
  // ---------------------------------------------

  useEffect(() => {
    const buscarTreinos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/treinos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.length === 0) {
          setMensagem('Você ainda não criou nenhum treino.');
        }
        setTreinos(response.data);
      } catch (error) { 
        console.error("Erro ao buscar treinos", error); 
        setMensagem('Não foi possível carregar seus treinos.');
      }
    };
    if (!editandoTreinoId) {
      buscarTreinos();
    }
  }, [editandoTreinoId]); 

  // --- ★★★ NOVA FUNÇÃO ADICIONADA AQUI ★★★ ---
  // Função para abrir ou fechar a lista de exercícios de um card
  const handleToggleExercicios = (treinoId) => {
    if (openTreinoId === treinoId) {
      // Se o card clicado já está aberto, fecha ele
      setOpenTreinoId(null);
    } else {
      // Se o card clicado está fechado, abre ele (e fecha qualquer outro)
      setOpenTreinoId(treinoId);
    }
  };
  // ---------------------------------------------

  // ... (As funções handleApagarTreino, handleMarcarFeito, handleEdicaoConcluida continuam as mesmas) ...
  const handleApagarTreino = async (treinoId) => {
    if (!window.confirm('Tem certeza que deseja apagar este treino?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:5000/api/treinos/${treinoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Treino apagado com sucesso!');
      setTreinos(treinos.filter(treino => treino.id !== treinoId));
    } catch (error) {
      console.error('Erro ao apagar treino:', error);
      alert('Não foi possível apagar o treino.');
    }
  };

  const handleMarcarFeito = async (treinoId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/registros', 
      { treino_id: treinoId }, 
      { headers: { 'Authorization': `Bearer ${token}` } });
      alert('Parabéns! Treino de hoje registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar treino:', error);
      alert('Não foi possível registrar o treino.');
    }
  };
  
  const handleEdicaoConcluida = () => { setEditandoTreinoId(null); };

  
  if (editandoTreinoId) {
    return <FormularioEdicaoTreino treinoId={editandoTreinoId} onEdicaoConcluida={handleEdicaoConcluida} />;
  }

  return (
    <>
      <header className="page-header">
        <h1>Meus Treinos</h1>
        <Link to="/criar-treino" className="btn btn-primary">
          + Criar Treino
        </Link>
      </header>
  
      <main className="main-content" style={{height: 'calc(100% - 23.7vh)', borderRadius: '0 0 0.75rem 0'}}>
        <section id="meus-treinos" className="meus-treinos-section">

          {treinos.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" height="40vh">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
              </svg>
              <h3>Nenhum treino encontrado</h3>
              <p>Comece criando seu primeiro plano de treino para vê-lo aqui.</p>
              <Link to="/criar-treino" className="btn btn-primary empty-state-btn">
                Criar meu primeiro treino
              </Link>
            </div>
          ) : (
            treinos.map(treino => (
              <div className="treino-card" key={treino.id}>
                
                {/* --- ★★★ MUDANÇA AQUI ★★★ --- */}
                {/* Adicionamos o onClick no cabeçalho para abrir/fechar */}
                <div 
                  className="treino-card-header" 
                  onClick={() => handleToggleExercicios(treino.id)}
                >
                  <h3>{treino.nome}</h3>
                  <span>{treino.dia}</span>
                  {/* Podemos adicionar um ícone de seta aqui no futuro */}
                </div>
                {/* ------------------------------- */}
                
                {/* --- ★★★ MUDANÇA AQUI ★★★ --- */}
                {/* A lista de exercícios agora só é renderizada SE o openTreinoId for igual ao treino.id */}
                {openTreinoId === treino.id && (
                  <div className="treino-card-body">
                    <ul className="exercicio-lista-detalhes">
                      {treino.exercicios.map(ex => (
                        <li key={ex.id_exercicio}>
                          <div className="exercicio-detalhe">
                            <span className="exercicio-nome">{ex.nome_exercicio}</span>
                            <span className="exercicio-specs">
                              {ex.series}x{ex.repeticoes} | Desc: {ex.descanso_seg}s | Peso: {ex.peso || 'N/A'}
                            </span>
                          </div>
                          {ex.gif_url && (
                             <img src={ex.gif_url} alt={ex.nome_exercicio} className="exercicio-gif-thumb" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* --- FIM DAS MUDANÇAS --- */}

                <div className="treino-card-footer" style={{height: '4vh '}}>
                  <button 
                    onClick={() => handleMarcarFeito(treino.id)}
                    className="btn-card btn-card-primary"
                    style={{borderRadius: '1rem', padding: '1rem', color: 'rgb(0,200,0)', backgroundColor: 'white', fontWeight: '700', borderColor: 'rgba(13, 195, 13, 1)', height: '5vh'}}
                  >
                    Marcar Feito
                  </button>
                  <button 
                    onClick={() => setEditandoTreinoId(treino.id)}
                    className="btn-card btn-card-secondary"
                    style={{backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', position: 'relative', fontWeight: '700', height: '5vh'}}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleApagarTreino(treino.id)}
                    className="btn-card"
                    style={{borderRadius: '1rem', padding: '1rem', color: 'rgb(255,0,0)', backgroundColor: 'white', fontWeight: '700', borderColor: 'rgba(255, 0, 0, 1)', height: '5vh'}}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))
          )}

        </section>
      </main>
    </>
  );
}

export default ListaTreinos;