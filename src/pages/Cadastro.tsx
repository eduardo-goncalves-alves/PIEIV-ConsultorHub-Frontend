import React, {useState} from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { LuEyeOff, LuEye } from 'react-icons/lu';

export function CadastroPage() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (senha.length < 8) {
            setError('A senha é muito curta. Use pelo menos 8 caracteres.');
            return; 
        }
        setIsLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                nome,
                cpf,
                email,
                senha
            });

            setIsLoading(false);
            const token = response.data.token;
            localStorage.setItem('authToken', token);

            window.location.href = '/';

        } catch (err) {
            setIsLoading(false);
            setError('Falha ao criar conta. Tente novamente.');
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen min-w-screen bg-slate-900">
        <div className="w-full max-w-md p-8 space-y-4 bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/80">
            
            <div className="flex flex-col items-center">
            <img src="/logo_consultorhub_white.png" alt="Logo" className="w-20" />
            <h2 className="mt-2 text-2xl font-bold text-center text-white">
                Crie sua conta
            </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div>
                <input
                type="text"
                className="w-full px-4 py-3 mt-1 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                />
            </div>

            <div>
                <IMaskInput
                mask="000.000.000-00"
                type="text"
                className="w-full px-4 py-3 mt-1 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
                placeholder="CPF"
                value={cpf}
                onAccept={(value: string) => setCpf(value)} 
                required
                />
            </div>

            <div>
                <input
                type="email"
                className="w-full px-4 py-3 mt-1 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="relative">
                <input
                type={showPassword ? 'text' : 'password'}
                minLength={8}
                className="w-full px-4 py-3 mt-1 pr-10 text-gray-900 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BEBE]"
                placeholder="Senha (no mínimo, 8 caracteres)"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                />
                <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 pt-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? (
                    <LuEyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                    <LuEye className="h-5 w-5 text-gray-600" />
                )}
                </div>
            </div>

            {error && (
                <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-lg text-sm">
                {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 font-semibold text-white rounded-lg bg-[#40BEBE] hover:bg-[#38a8a8] disabled:opacity-50 transition-colors"
            >
                {isLoading ? 'Criando conta...' : 'Cadastrar'}
            </button>
            </form>

            <div className="text-center mt-4">
            <p className="text-gray-400 text-sl">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-[#40BEBE] hover:underline font-bold">
                Faça login
                </Link>
            </p>
            </div>

        </div>
        </div>
    );
}
