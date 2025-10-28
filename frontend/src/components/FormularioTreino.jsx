import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTE useNavigate

function FormularioTreino() {
  const navigate = useNavigate(); // <-- 2. INICIALIZE useNavigate
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaTreino, setDiaTreino] = useState('');
  const [exercicios, setExercicios] = useState([{ exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  const [catalogoExercicios, setCatalogoExercicios] = useState([]);

  useEffect(() => {
    const buscarCatalogo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
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
      navigate('/treinos'); // <-- 3. NAVEGA DE VOLTA PARA A LISTA
    } catch (error) {
      console.error("Erro ao criar treino", error);
      alert('Erro ao criar treino.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid green', padding: '15px', margin: '10px' }}>
      <h2>Criar Nova Ficha de Treino</h2>
      <input type="text" placeholder="Nome do Treino" value={nomeTreino} onChange={(e) => setNomeTreino(e.target.value)} required />
      <input type="text" placeholder="Dia/Grupo" value={diaTreino} onChange={(e) => setDiaTreino(e.target.value)} />
      
      <h3>Exercícios</h3>
      {exercicios.map((ex, index) => (
        <div key={index} style={{marginBottom: '10px'}}>
          <select name="exercicio_id" value={ex.exercicio_id} onChange={(e) => handleExercicioChange(index, e)} required>
            <option value="">Selecione...</option>
            {catalogoExercicios.map(catEx => (
              <option key={catEx.id} value={catEx.id}>{catEx.nome}</option>
            ))}
          </select>
          <input type="text" name="series" placeholder="Séries" value={ex.series} onChange={(e) => handleExercicioChange(index, e)} />
          <input type="text" name="repeticoes" placeholder="Reps" value={ex.repeticoes} onChange={(e) => handleExercicioChange(index, e)} />
          <input type="number" name="descanso_seg" placeholder="Descanso (s)" value={ex.descanso_seg} onChange={(e) => handleExercicioChange(index, e)} />
          <input type="text" name="peso" placeholder="Peso" value={ex.peso} onChange={(e) => handleExercicioChange(index, e)} />
          {index > 0 && <button type="button" onClick={() => removerExercicio(index)}>Remover</button>}
        </div>
      ))}
      <button type="button" onClick={adicionarExercicio}>+ Adicionar Exercício</button>
      <hr/>
      <button type="submit">Salvar Treino</button>
    </form>
  );
}

export default FormularioTreino;