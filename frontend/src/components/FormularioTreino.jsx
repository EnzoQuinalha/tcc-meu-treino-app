import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioTreino() {
  // Estado para os dados gerais do treino
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaTreino, setDiaTreino] = useState('');

  // Estado para a lista de exercícios que estamos montando no formulário
  const [exercicios, setExercicios] = useState([{ exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  
  // Estado para guardar o catálogo de exercícios vindo do backend
  const [catalogoExercicios, setCatalogoExercicios] = useState([]);

  // useEffect para buscar o catálogo de exercícios quando o componente carregar
  useEffect(() => {
    const buscarCatalogo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/exercicios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCatalogoExercicios(response.data);
      } catch (error) {
        console.error("Erro ao buscar catálogo de exercícios", error);
      }
    };
    buscarCatalogo();
  }, []);

  // Função para lidar com a mudança nos campos de um exercício específico
  const handleExercicioChange = (index, event) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index][event.target.name] = event.target.value;
    setExercicios(novosExercicios);
  };

  // Função para adicionar um novo campo de exercício ao formulário
  const adicionarExercicio = () => {
    setExercicios([...exercicios, { exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  };

  // Função para remover um campo de exercício
  const removerExercicio = (index) => {
    const novosExercicios = [...exercicios];
    novosExercicios.splice(index, 1);
    setExercicios(novosExercicios);
  };

  // Função para enviar o formulário completo para o backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const novoTreino = {
      nome: nomeTreino,
      dia: diaTreino,
      exercicios: exercicios,
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/treinos', novoTreino, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Treino criado com sucesso!');
      // O ideal aqui seria também recarregar a lista de treinos na página
      window.location.reload(); // Recarrega a página para ver o novo treino
    } catch (error) {
      console.error("Erro ao criar treino", error);
      alert('Erro ao criar treino.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid green', padding: '15px', margin: '10px' }}>
      <h2>Criar Nova Ficha de Treino</h2>
      <input type="text" placeholder="Nome do Treino (Ex: Treino A)" value={nomeTreino} onChange={(e) => setNomeTreino(e.target.value)} required />
      <input type="text" placeholder="Dia/Grupo (Ex: Segunda-feira)" value={diaTreino} onChange={(e) => setDiaTreino(e.target.value)} />
      
      <hr/>
      <h3>Exercícios</h3>
      {exercicios.map((ex, index) => (
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
          {index > 0 && <button type="button" onClick={() => removerExercicio(index)}>Remover</button>}
        </div>
      ))}
      <button type="button" onClick={adicionarExercicio}>+ Adicionar Exercício</button>
      <hr/>
      <button type="submit" style={{backgroundColor: 'green', color: 'white'}}>Salvar Treino Completo</button>
    </form>
  );
}

export default FormularioTreino;