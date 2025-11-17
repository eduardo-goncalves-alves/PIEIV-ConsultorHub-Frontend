import React, { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import axios from "axios";

export function PerfilPage(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(()=>{
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

    const handleSalvarPerfil = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(false);
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

        } catch (err) {
        setIsLoading(false);
        console.error("Falha ao salvar perfil", err);
        }
    }


    return(
        <div className="w-full h-full">
            <Header title="Meu Perfil"/>
            <div className="px-2 py-4">
                {/* Card 1 */}
                <div className="max-w-lg p-6 bg-white rounded-lg shadow-md">
                    <form onSubmit={handleSalvarPerfil} className="space-y-4">
                        <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black"
                        />
                        </div>

                        <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            disabled
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-gray-500 bg-gray-100"
                        />
                        </div>
                        <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 font-semibold text-white bg-[#2e2f5f] rounded-lg hover:bg-[#232449]"
                        >
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        {successMsg && <p className="text-green-600">{successMsg}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}