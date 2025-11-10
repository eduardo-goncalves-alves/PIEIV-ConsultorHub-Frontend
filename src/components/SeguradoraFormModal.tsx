import React, {useEffect, useState} from "react";
import axios from "axios";
import { IMaskInput } from "react-imask";
import type { Seguradora } from "../types/seguradora.types";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    seguradoraAtual?: Seguradora | null; 
}

export function SeguradoraFormModal({ isOpen, onClose, onSuccess, seguradoraAtual }: ModalProps) {
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && seguradoraAtual){
            setNome(seguradoraAtual.nome || '');
            setCnpj(seguradoraAtual.cnpj || '');
            setEmail(seguradoraAtual.email || '');
        } else if (isOpen && !seguradoraAtual) {
            setNome('');
            setCnpj('');
            setEmail('');
        }
    }, [isOpen, seguradoraAtual])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const token = localStorage.getItem('authToken');
        const headers = {'Authorization':`Bearer ${token}`};
        const dadosDoFormulario = {nome, cnpj, email, status};

        try {
            if (seguradoraAtual) {
                await axios.put(
                `http://localhost:8080/api/seguradoras/${seguradoraAtual.id}`, 
                dadosDoFormulario,
                { headers }
                );
            } else {
                await axios.post(
                'http://localhost:8080/api/seguradoras',
                dadosDoFormulario,
                { headers }
                );
            }
      

        setIsLoading(false);
        setNome('');
        setCnpj('');
        setEmail('');
        onClose(); 
        onSuccess();

        } catch (err) {
        setIsLoading(false);
        setError('Falha ao criar seguradora. Verifique os dados.');
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Adicionar/Editar Seguradora</h2>
            
            {/* Formulário */}
            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {/* Nome */}
                <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome*</label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black"
                    required
                />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
                    <IMaskInput
                        mask="00.000.000/0000-00"
                        type="text"
                        id="cnpj"
                        value={cnpj}
                        onAccept={(value) => setCnpj(value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black"
                    required
                />
                </div>

                {/* Mensagem de Erro */}
                {error && (
                <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex justify-end mt-6 space-x-3">
                <button
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-white bg-[#40BEBE] rounded-lg hover:bg-[#2d8888]"
                >
                Cancelar
                </button>
                <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 font-semibold text-white bg-[#3D3E7E] rounded-lg hover:bg-[#303162] disabled:opacity-50"
                >
                {isLoading ? 'Salvando...' : 'Confirmar'}
                </button>
            </div>
            </form>
        </div>
        </div>
  );
}