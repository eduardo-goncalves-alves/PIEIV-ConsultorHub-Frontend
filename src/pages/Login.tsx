import React, {useState} from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
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
          <div className='mb-4 relative'>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder='Senha'
              className="w-full px-4 py-3 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required
            />
            <div
              className='absolute inset-y-0 right-0 flex items-center pr-3'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (<LuEye className='text-gray-800 cursor-pointer'/>) : (<LuEyeOff className='text-gray-800 cursor-pointer'/>)}
            </div>
          </div>


          {/* Mensagem de Erro*/}
          {error && (
            <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          {/* Esqueci minha senha */}
          <NavLink 
          to='/redefinir-senha'
          className=' text-center text-white opacity-60 hover:opacity-100 cursor-pointer'>
            Esqueci minha senha
          </NavLink>

          {/* Botão de Entrar */}
          <div className='space-y-3'>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 mt-5 font-semibold text-white rounded-lg bg-[#40BEBE] hover:bg-[#38a8a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40BEBE] disabled:opacity-50"
            >
              {/* Mostra "Entrar" ou "Carregando..." */}
              {isLoading ? 'Carregando...' : 'Entrar'}
            </button>
            <div className="text-center mt-3">
            <p className="text-gray-400 text-sl">
                Não tem uma uma conta?{' '}
                <NavLink to="/cadastro" className="text-[#40BEBE] hover:underline font-bold">
                Cadastre-se
                </NavLink>
            </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}