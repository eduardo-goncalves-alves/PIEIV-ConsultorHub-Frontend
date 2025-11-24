import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import { LuMoon, LuSun } from "react-icons/lu";

interface HeaderProps {
    title: string;
}

export function Header({title}: HeaderProps){
    const {theme, toggleTheme} = useTheme();
    const [nomeConsultor, setNomeConsultor] = useState('');

    useEffect(()=>{
        const fetchUsuario = async () => {
            const token = localStorage.getItem('authToken');
            if(!token){
                setNomeConsultor('Visitante');
                return;
            } 

            try {
                const response = await axios.get('http://localhost:8080/api/consultores/me', {
                headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const dados = response.data;
                const nomeCompleto = response.data.nome || 'Consultor';
                
                if (nomeCompleto){
                    const primeiroNome = nomeCompleto.split(' ')[0];
                    setNomeConsultor(primeiroNome)
                } else {
                    setNomeConsultor('Consultor')
                }
            } catch (error) {
                console.error("Erro ao buscar nome do usuário", error);
                setNomeConsultor('Consultor');
            }
        };
        fetchUsuario();
    }, [])

    return(
        <header className="flex items-center justify-between w-full p-4 border-b border-gray-200 dark:border-gray-700">

            <div className="w-10 h-10 rounded-full bg-[#3D3E7E] flex items-center justify-center text-white font-bold text-sm dark:text-white dark:bg-gray-700">
            {nomeConsultor ? nomeConsultor.charAt(0).toUpperCase() : 'C'}
            </div>

            <div className="flex items-center gap-4">
                
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-yellow-600 dark:text-[#40BEBE] hover:scale-110 transition-all shadow-sm"
                    title={theme === 'light' ? "Mudar para Tema Escuro" : "Mudar para Tema Claro"}
                >
                    {theme === 'light' ? <LuSun size={20} /> : <LuMoon size={20} />}
                </button>

                <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right hidden sm:block">
                        <span className="text-xs text-gray-900 dark:text-gray-400">Olá, </span>
                        <Link 
                            to="/perfil" 
                            className="text-sm font-semibold text-gray-800 dark:text-gray-400 hover:text-[#40BEBE] transition-colors"
                        >
                            {nomeConsultor || 'Carregando...'}
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}