import React, { useState } from 'react';
import firebase from 'firebase/compat/app';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      onLoginSuccess();  // Chama a função passada via props quando o login é bem-sucedido
    } catch (err) {
      setError(err.message); // Exibe mensagem de erro, se houver
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">Entrada do sonho</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-emerald-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-4 py-2 border border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-emerald-700">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 px-4 py-2 border border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Mensagem de erro */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
