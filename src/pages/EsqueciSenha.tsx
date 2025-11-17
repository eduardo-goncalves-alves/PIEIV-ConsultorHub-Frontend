import React, {useState} from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export function RedefinirSenhaPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
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

            setSuccessMsg('E-mail enviado. Verifique seu email!.');

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
        </div>

        {/* Rederização condicional*/}
        {successMsg ? (
          <div className="text-center">
            <div className="p-3 text-center text-green-400 bg-green-900/30 rounded-lg">
              {successMsg}
            </div>
            <Link 
              to="/login" 
              className="block w-full px-4 py-3 mt-6 font-semibold text-white disabled:opacity-50"
            >
              Voltar para o Login
            </Link>
          </div>

        ) : (

          <>
            <p className='mt-2 mb-6 text-[1.2em] text-center text-white'>
              Informe o e-mail para o qual você deseja redefinir sua senha.
            </p>

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

          {error && (
            <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-center text-green-400 bg-green-900/30 rounded-lg">
              {successMsg}
            </div>
          )}

          <div>
            <button
            
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white rounded-lg bg-[#40BEBE] hover:bg-[#38a8a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40BEBE] disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Redefinir Senha'}
            </button>
          </div>
            </form>

            <div className='w-full text-center'>
              <Link
                to='/login'
                className="w-full px-4 py-3 my-3 font-semibold text-white disabled:opacity-50"
              >
                Cancelar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
