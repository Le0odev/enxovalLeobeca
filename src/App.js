import './global.css';
import './App.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';  // Importando o serviço de autenticação
import { Header } from './Header/Header';
import Checkitem from './Insert/Checkitem';
import { Footer } from './footer/Footer';
import PriceSection from './Insert/PriceSection';
import Login from './config/Login';

function App() {
  const [view, setView] = useState('list'); // Estado para controlar a visualização: 'list' ou 'price'
  const [user, setUser] = useState(null); // Estado para armazenar o usuário autenticado

  // Função para alternar a visualização
  const handleToggleView = (newView) => {
    setView(newView);
  };

  // Efeito para verificar se o usuário está autenticado
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);  // Atualiza o estado 'user' quando o usuário faz login ou logout
    });

    // Cleanup do listener
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    console.log('Login bem-sucedido');
  };

  const handleLogout = async () => {
    await firebase.auth().signOut();
  };

  // Se o usuário estiver logado, renderiza a aplicação principal
  if (user) {
    return (
      <div>
        <Header view={view} onToggleView={handleToggleView} /> {/* Passando view e a função de alternância para o Header */}

        {/* Renderizando o componente de acordo com o estado 'view' */}
        {view === 'list' && <Checkitem />} {/* Exibe a lista de itens (Checkitem) */}
        {view === 'price' && <PriceSection />} {/* Exibe a seção de preços */}

        <Footer />

        {/* Botão de Logout */}
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </div>
    );
  }

  // Se o usuário não estiver logado, renderiza a tela de login
  return (
    <div className="App">
      <Login onLoginSuccess={handleLoginSuccess} /> {/* Exibe a tela de login */}
    </div>
  );
}

export default App;
