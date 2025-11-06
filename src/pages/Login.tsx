import React, {useState} from 'react';
import axios from 'axios';

export function LoginPage() {
    // Criando estados para armazenar o email e a senha
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('https://localhost:8080/api/auth/login', {
                email: email, 
                senha: password,
            });

            setIsLoading(false);
            const token = response.data.token;
            localStorage.setItem('authToken', token); // Salva o Token no Navegador

            window.location.href = '/';

        } catch (err) {
            setIsLoading(false);
            setError('Email ou senha inválidos. Tente novamente.');
        }
    };

    return (
    
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-slate-900">

      <div className="w-full max-w-md p-8 space-y-4 bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/80">
    
        <div className="flex flex-col items-center">
          <img src="logo_consultorhub_white.png" alt="ConsultorHub Logo" className="w-20" /> 
          <h2 className="mt-2 mb-6 text-2xl font-bold text-center text-white">
            Olá, seja bem vindo!
          </h2>
        </div>

        {/* Formulário */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Input de Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
              placeholder="Email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Input de Senha */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
              placeholder="Senha"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          {/* Mensagem de Erro*/}
          {error && (
            <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          {/* Botão de Entrar */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white rounded-lg bg-[#40BEBE] hover:bg-[#38a8a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40BEBE] disabled:opacity-50"
            >
              {/* Mostra "Entrar" ou "Carregando..." */}
              {isLoading ? 'Carregando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}