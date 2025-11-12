import React, {useState} from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export function ResetarSenhaPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', {
                email: email, 
                senha: password
            });

            setIsLoading(false);
            const token = response.data.token;
            localStorage.setItem('authToken', token); 

            window.location.href = '/';

        } catch (err) {
            setIsLoading(false);
            setError('E-mail inválido. Insira um e-mail válido.');
        }
    };

    return (
    
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-slate-900">

      <div className="w-full max-w-md p-8 space-y-4 bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/80">
    
        <div className="flex flex-col items-center">
          <img src="logo_consultorhub_white.png" alt="ConsultorHub Logo" className="w-20" /> 
          <h2 className="mt-2 mb-6 text-2xl font-bold text-center text-white">
            Redefinir Senha
          </h2>
          <p className='mt-2 mb-6 text-[1.2em] text-center text-white'>
            Preencha os campos abaixo.
          </p>
        </div>

        {/* Formulário */}
        <form className="space-y-6" onSubmit={handleSubmit}> 
          
            {/* Input de Senha */}
            <div className="mb-4 relative"> 
                <input
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Nova Senha"
                    className="w-full p-3 pr-10 rounded-lg bg-gray-100 text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* O "Gatilho" (O Ícone) */}
                <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} 
                >
                {/* O ícone condicional */}
                {showPassword ? (
                    <LuEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                    <LuEye className="h-5 w-5 text-gray-400" />
                )}
                </div>
            </div>

          {/* Input de Senha */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
              placeholder="Confirme sua nova senha"
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
              {isLoading ? 'Enviando...' : 'Redefinir Senha'}
            </button>
          </div>
          <div className='w-full text-center'>
            <NavLink
              to='/login'
              className="w-full px-4 py-3 my-3 font-semibold text-white disabled:opacity-50"
            > Cancelar
            </NavLink>
            </div>
        </form>
      </div>
    </div>
  );
}