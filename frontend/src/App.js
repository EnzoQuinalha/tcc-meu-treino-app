import React from 'react';
import FormularioCadastro from './components/formularioCadastro';
import FormularioLogin from './components/FormularioLogin';
import Perfil from './components/Perfil';
import ListaTreinos from './components/ListaTreinos';
import FormularioTreino from './components/FormularioTreino';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Meu Treino App</h1>
      </header>
      <main>
        <Perfil />
        <hr />
        <FormularioTreino />
        <hr />
        <ListaTreinos />
        <hr />
        <FormularioCadastro />
        <hr />
        <FormularioLogin />
      </main>
    </div>
  );
}

export default App;