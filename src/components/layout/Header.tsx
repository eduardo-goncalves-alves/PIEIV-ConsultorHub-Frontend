import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface HeaderProps {
    title: string;
}

export function Header({title}: HeaderProps){
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

                const nomeCompleto = response.data.nome || 'Consultor';
                
                if (nomeCompleto){
                    const primeiroNome = nomeCompleto.split(' ')[0];
                    setNomeConsultor(primeiroNome)
                } else {
                    setNomeConsultor('Consultor')
                }
            } catch (error) {
                console.error("Erro ao buscar nome do usuário", error);
            }
        };
        fetchUsuario();
    }, [])

    return(
        <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">

            <div className="w-10 h-10 rounded-full bg-[#3D3E7E] flex items-center justify-center text-white font-bold text-sm">
            {nomeConsultor ? nomeConsultor.charAt(0).toUpperCase() : 'C'}
            </div>

            <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500">Olá,</span>
            <Link 
                to="/perfil" 
                className="text-md font-semibold text-gray-800 hover:text-[#40BEBE] transition-colors"
            >
                {nomeConsultor || 'Carregando...'}
            </Link>
        </div>
        </header>
    );
}