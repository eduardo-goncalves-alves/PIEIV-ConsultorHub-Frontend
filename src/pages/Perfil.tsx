import React, { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import axios from "axios";
import { LuUser, LuMail, LuSave, LuCircleCheck, LuCamera } from 'react-icons/lu';  

export function PerfilPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Busca dados iniciais
    useEffect(() => {
        const fetchPerfil = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8080/api/consultores/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setNome(response.data.nome || '');
                setEmail(response.data.email || '');
            } catch (err) {
                console.error('Falha ao buscar perfil', err);
            }
        };
        fetchPerfil();
    }, []);

    // Salvar dados
    const handleSalvarPerfil = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); 
        setSuccessMsg('');
        const token = localStorage.getItem('authToken');

        try {
            const dadosDoFormulario = { nome: nome };

            await axios.put(
                'http://localhost:8080/api/consultores/me',
                dadosDoFormulario,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setIsLoading(false);
            setSuccessMsg('Perfil atualizado com sucesso!');
            
            setTimeout(() => setSuccessMsg(''), 3000);

        } catch (err) {
            setIsLoading(false);
            console.error("Falha ao salvar perfil", err);
        }
    }

    // Helper para pegar iniciais
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="w-full h-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header title="Meu Perfil" />
            
            <div className="px-2 py-8 flex justify-center">
                
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800 transition-colors duration-300">
                    

                    <div className="h-32 bg-gradient-to-r from-[#2e2f5f] to-[#40BEBE]"></div>

                    <div className="px-8 pb-8">
                        
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500 dark:text-gray-300 shadow-md">
                                    {nome ? getInitials(nome) : <LuUser size={32}/>}
                                </div>
                                {/* Botão decorativo de editar foto (sem função por enquanto) */}
                                {/* <div className="absolute bottom-0 right-0 p-1.5 bg-[#40BEBE] rounded-full border-2 border-white dark:border-gray-800 text-white cursor-pointer hover:bg-[#359d9d] transition">
                                    <LuCamera size={14} />
                                </div> */}
                            </div>
                            
                            <div className="mb-2 hidden sm:block">
                                <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                                    Consultor Verificado
                                </span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{nome || 'Usuário'}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie suas informações pessoais e de acesso.</p>
                        </div>

                        <form onSubmit={handleSalvarPerfil} className="space-y-6">
                            
                            <div>
                                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D3E7E] focus:border-transparent outline-none transition-all bg-white text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email <span className="text-xs font-normal text-gray-400 ml-1">(Não editável)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Mensagem de Sucesso */}
                            {successMsg && (
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 animate-fade-in dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                    <LuCircleCheck className="w-5 h-5" />
                                    <span className="text-sm font-medium">{successMsg}</span>
                                </div>
                            )}

                            {/* Botão de Ação */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-[#2e2f5f] rounded-xl hover:bg-[#232449] focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 dark:bg-[#373872] dark:hover:bg-[#494a96] dark:focus:ring-indigo-900"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Salvando...
                                        </span>
                                    ) : (
                                        <>
                                            <LuSave size={18} />
                                            Salvar Alterações
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}