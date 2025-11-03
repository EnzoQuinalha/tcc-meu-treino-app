import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/criarTreino.css'; // O CSS que você já importou

function FormularioTreino() {
  const navigate = useNavigate();
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaTreino, setDiaTreino] = useState('');
  const [exercicios, setExercicios] = useState([{ exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  
  // Agora esperamos que o catálogo contenha o gif_url
  const [catalogoExercicios, setCatalogoExercicios] = useState([]); 

  // --- LÓGICA (Tudo isso continua igual) ---
  useEffect(() => {
    const buscarCatalogo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        // Graças ao Passo 1, a API agora envia o gif_url
        const response = await axios.get('http://127.0.0.1:5000/api/exercicios', { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCatalogoExercicios(response.data); 
      } catch (error) { console.error("Erro ao buscar catálogo", error); }
    };
    buscarCatalogo();
  }, []);

  const handleExercicioChange = (index, event) => {
    const { name, value } = event.target;
    const novosExercicios = [...exercicios];
    novosExercicios[index][name] = value;
    setExercicios(novosExercicios);
  };

  const adicionarExercicio = () => {
    setExercicios([...exercicios, { exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  };

  const removerExercicio = (index) => {
    const novosExercicios = [...exercicios];
    novosExercicios.splice(index, 1);
    setExercicios(novosExercicios);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const novoTreino = { nome: nomeTreino, dia: diaTreino, exercicios };
    try {
      await axios.post('http://127.0.0.1:5000/api/treinos', novoTreino, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Treino criado com sucesso!');
      navigate('/treinos');
    } catch (error) {
      console.error("Erro ao criar treino", error);
      alert('Erro ao criar treino.');
    }
  };

  // --- ★★★ 1. ADICIONE O ESTILO INLINE PARA O GIF ★★★ ---
  const gifStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '8px',
    display: 'block',
    margin: '15px auto 5px auto', // Centraliza e dá espaçamento
    backgroundColor: '#f0f0f0' // Fundo cinza claro enquanto carrega
  };
  // ----------------------------------------------------

  return (
    <>
      <header className="page-header" style={{borderRadius: '0.75rem 0.75rem 0 0'}}>
        <Link to="/treinos" className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </Link>
        <h1>Criar Novo Treino</h1>
      </header>

      <form id="criar-treino-form" className="form-container" onSubmit={handleSubmit}>
        
        <section className="form-section" style={{borderRadius: '0 0 0.75rem 0.75rem'}}>
          <label htmlFor="treino-nome" className="form-label">Nome do Treino</label>
          <input 
            type="text" 
            id="treino-nome" 
            className="form-input" 
            placeholder="Ex: Treino A - Foco em Peito"
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
            required
          />
          
          <label htmlFor="treino-dia" className="form-label">Dia/Grupo</label>
          <input 
            type="text" 
            id="treino-dia" 
            className="form-input" 
            placeholder="Ex: Segunda-feira ou Peito/Tríceps"
            value={diaTreino}
            onChange={(e) => setDiaTreino(e.target.value)}
          />
        </section>

        <h2 className="section-title">Exercícios</h2>
        <div id="exercicio-lista">
          
          {exercicios.map((ex, index) => {
          //eslint-disable-next-line
            const exercicioSelecionado = catalogoExercicios.find(catEx => catEx.id == ex.exercicio_id); //NÃO TROCAR == PARA === ACABA COM O GIF
            // ----------------------------------------------------
            
            return (
              <div className="exercicio-card" key={index}>
                <div className="form-group">
                  <label htmlFor={`exercicio-select-${index}`} className="form-label-sm">Exercício</label>
                  <select 
                    id={`exercicio-select-${index}`}
                    name="exercicio_id" 
                    className="form-select"
                    value={ex.exercicio_id} 
                    onChange={(e) => handleExercicioChange(index, e)} 
                    required
                  >
                    <option value="">Selecione um exercício...</option>
                    {catalogoExercicios.map(catEx => (
                      <option key={catEx.id} value={catEx.id}>{catEx.nome}</option>
                    ))}
                  </select>
                </div>

                {/* --- ★★★ 3. ADICIONE A EXIBIÇÃO DO GIF ★★★ --- */}
                {exercicioSelecionado && exercicioSelecionado.gif_url && (
                  <img 
                    src={exercicioSelecionado.gif_url} 
                    alt={exercicioSelecionado.nome} 
                    style={gifStyle} 
                  />
                )}
                {/* ------------------------------------------- */}

                <div className="form-row"> 
                  <div className="form-group"> 
                    <label htmlFor={`series-${index}`} className="form-label-sm">Séries</label> 
                    <input type="text" id={`series-${index}`} 
                    name="series" className="form-input" placeholder="Ex: 3" value={ex.series} onChange={(e) => 
                    handleExercicioChange(index, e)} /> 
                    </div> 
                    <div className="form-group"> 
                      <label htmlFor={`repeticoes-${index}`} 
                      className="form-label-sm">Repetições</label> 
                      <input type="text" id={`repeticoes-${index}`} name="repeticoes" className="form-input" placeholder="Ex: 10-12" value={ex.repeticoes} onChange={(e) => 
                        handleExercicioChange(index, e)} /> </div> </div> 
                        <div className="form-group"> 
                          <label htmlFor={`descanso-${index}`} className="form-label-sm">Descanso (segundos)</label> 
                          <input type="number" id={`descanso-${index}`} name="descanso_seg" className="form-input" placeholder="Ex: 60" value={ex.descanso_seg} onChange={(e) => handleExercicioChange(index, e)} /> 
                          </div> 
                          <div className="form-group"> 
                            <label htmlFor={`peso-${index}`} className="form-label-sm">Peso (opcional)</label> 
                            <input type="text" id={`peso-${index}`} name="peso" className="form-input" placeholder="Ex: 20kg" value={ex.peso} onChange={(e) => handleExercicioChange(index, e)} /> 
                            </div>
                
                {index > 0 && (
                  <button 
                    type="button" 
                    className="btn-remover"
                    onClick={() => removerExercicio(index)}
                  >
                    Remover Exercício
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <button 
          type="button" 
          id="add-exercicio-btn" 
          className="btn-secondary-outline"
          onClick={adicionarExercicio}
        >
          + Adicionar Exercício
        </button>
        <button type="submit" className="btn btn-primary">
          Salvar Treino
        </button>
      </form>
    </>
  );
}

export default FormularioTreino;