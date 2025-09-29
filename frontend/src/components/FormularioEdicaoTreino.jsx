import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Recebe o ID do treino a ser editado e uma função para ser chamada quando a edição acabar
function FormularioEdicaoTreino({ treinoId, onEdicaoConcluida }) {
  // Estado para guardar os dados do treino que estão sendo editados
  const [treino, setTreino] = useState(null); // Começa como nulo
  // Estado para guardar o catálogo de exercícios para o <select>
  const [catalogoExercicios, setCatalogoExercicios] = useState([]);
  const [mensagem, setMensagem] = useState('Carregando dados do treino...');

  // useEffect para buscar os dados do treino específico E o catálogo de exercícios
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const buscarDados = async () => {
      try {
        // Faz as duas requisições em paralelo para ser mais rápido
        const [resTreino, resCatalogo] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/api/treinos/${treinoId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://127.0.0.1:5000/api/exercicios', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setTreino(resTreino.data);
        setCatalogoExercicios(resCatalogo.data);
      } catch (error) {
        console.error("Erro ao buscar dados para edição", error);
        setMensagem("Erro ao carregar dados. Tente novamente.");
      }
    };
    buscarDados();
  }, [treinoId]);

  // --- LÓGICA COMPLETA PARA GERENCIAR O FORMULÁRIO ---

  // Atualiza os campos de nome e dia do treino
  const handleInputChange = (event) => {
    setTreino({ ...treino, [event.target.name]: event.target.value });
  };

  // Atualiza os campos de um exercício específico na lista
  const handleExercicioChange = (index, event) => {
    const novosExercicios = [...treino.exercicios];
    novosExercicios[index][event.target.name] = event.target.value;
    setTreino({ ...treino, exercicios: novosExercicios });
  };

  // Adiciona um novo campo de exercício em branco
  const adicionarExercicio = () => {
    const novosExercicios = [...treino.exercicios, { exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }];
    setTreino({ ...treino, exercicios: novosExercicios });
  };

  // Remove um campo de exercício pelo seu índice
  const removerExercicio = (index) => {
    const novosExercicios = [...treino.exercicios];
    novosExercicios.splice(index, 1);
    setTreino({ ...treino, exercicios: novosExercicios });
  };

  // Envia os dados atualizados para o backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    // Prepara os dados para serem enviados (sem campos extras que o backend não precisa)
    const dadosParaEnviar = {
      nome: treino.nome,
      dia: treino.dia,
      exercicios: treino.exercicios.map(ex => ({
        exercicio_id: ex.exercicio_id,
        series: ex.series,
        repeticoes: ex.repeticoes,
        descanso_seg: ex.descanso_seg,
        peso: ex.peso
      }))
    };

    try {
      await axios.put(`http://127.0.0.1:5000/api/treinos/${treinoId}`, dadosParaEnviar, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Treino atualizado com sucesso!');
      onEdicaoConcluida(); // Avisa o componente pai que a edição terminou
    } catch (error) {
      console.error("Erro ao atualizar treino", error);
      alert('Erro ao atualizar treino.');
    }
  };

  // Se os dados ainda não carregaram, mostra uma mensagem
  if (!treino) {
    return <div>{mensagem}</div>;
  }

  // --- RENDERIZAÇÃO COMPLETA DO FORMULÁRIO ---
  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid blue', padding: '15px', margin: '10px' }}>
      <h2>Editando Treino</h2>
      <input type="text" name="nome" placeholder="Nome do Treino" value={treino.nome} onChange={handleInputChange} required />
      <input type="text" name="dia" placeholder="Dia/Grupo" value={treino.dia} onChange={handleInputChange} />
      
      <hr/>
      <h3>Exercícios</h3>
      {treino.exercicios.map((ex, index) => (
        <div key={index} style={{marginBottom: '10px'}}>
          <select name="exercicio_id" value={ex.exercicio_id} onChange={(e) => handleExercicioChange(index, e)} required>
            <option value="">Selecione um exercício</option>
            {catalogoExercicios.map(catEx => (
              <option key={catEx.id} value={catEx.id}>{catEx.nome}</option>
            ))}
          </select>
          <input type="text" name="series" placeholder="Séries" value={ex.series} onChange={(e) => handleExercicioChange(index, e)} />
          <input type="text" name="repeticoes" placeholder="Repetições" value={ex.repeticoes} onChange={(e) => handleExercicioChange(index, e)} />
          <input type="number" name="descanso_seg" placeholder="Descanso (s)" value={ex.descanso_seg} onChange={(e) => handleExercicioChange(index, e)} />
          <input type="text" name="peso" placeholder="Peso (opcional)" value={ex.peso} onChange={(e) => handleExercicioChange(index, e)} />
          <button type="button" onClick={() => removerExercicio(index)}>Remover</button>
        </div>
      ))}
      <button type="button" onClick={adicionarExercicio}>+ Adicionar Exercício</button>
      <hr/>
      <button type="submit" style={{backgroundColor: 'blue', color: 'white'}}>Salvar Alterações</button>
      <button type="button" onClick={onEdicaoConcluida} style={{marginLeft: '10px'}}>Cancelar</button>
    </form>
  );
}

export default FormularioEdicaoTreino;