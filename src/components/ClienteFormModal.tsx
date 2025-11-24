import React, {useEffect, useState} from "react";
import axios from "axios";
import { type Cliente } from "../types/cliente.types";
import { IMaskInput } from "react-imask";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clienteAtual?: Cliente | null; 
}

export function ClienteFormModal({ isOpen, onClose, onSuccess, clienteAtual }: ModalProps) {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('ATIVO');
    const [notas, setNotas] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        if (isOpen && clienteAtual){
            setNome(clienteAtual.nome || '');
            setCpf(clienteAtual.cpf || '');
            setTelefone(clienteAtual.telefone || '');
            setEmail(clienteAtual.email || '');
            setStatus(clienteAtual.status || 'ATIVO')
            setNotas(clienteAtual.notas || '');
        } else if (isOpen && !clienteAtual) {
            setNome('');
            setCpf('');
            setTelefone('');
            setEmail('');
            setStatus('ATIVO');
            setNotas('');
        }
    }, [isOpen, clienteAtual])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const token = localStorage.getItem('authToken');
        const headers = {'Authorization':`Bearer ${token}`};
        const dadosDoFormulario = {nome, cpf, telefone, email, status, notas};

        console.log("[FRONTEND] Enviando o pacote: ", dadosDoFormulario)

        try {
            let response;

            if (clienteAtual) {
                console.log(`[FRONTEND] Modo Edição - ID: ${clienteAtual.id}`);
                response = await axios.put(
                `http://localhost:8080/api/clientes/${clienteAtual.id}`, 
                dadosDoFormulario,
                { headers }
                );
            } else {
                response = await axios.post(
                'http://localhost:8080/api/clientes',
                dadosDoFormulario,
                { headers }
                );
            }
        console.log("[BACKEND] O servidor respondeu com:", response.data);

        setIsLoading(false);
        setNome('');
        setCpf('');
        setTelefone('');
        setEmail('');
        setStatus('ATIVO')
        setNotas('');

        onClose(); 
        onSuccess();
        

        } catch (err: any) {
        setIsLoading(false);
        console.error("[ERRO] Aconteceu um problema:", err.response?.data || err.message);
        setError('Falha ao criar cliente. Verifique os dados.');
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
    
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Adicionar/Editar Cliente</h2>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            {/* Nome */}
            <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome*</label>
            <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
            />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                <IMaskInput
                    mask="000.000.000-00"
                    type="text"
                    id="cpf"
                    value={cpf}
                    onAccept={(value: any) => setCpf(value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                />
            </div>
            <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                <IMaskInput
                    mask="(00) 00000-0000"
                    type="text"
                    id="telefone"
                    value={telefone}
                    onAccept={(value: any) => setTelefone(value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                />
            </div>
            </div>

            {/* Email */}
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
            />
            </div>

            {/* Status */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select 
                value={status} 
                id="status"
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="ATIVO">Ativo</option>
                    <option value="CANCELADO">Cancelado</option>
                </select>
            </div>

            {/* Notas */}
            <div>
                <label htmlFor="notas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                <textarea 
                value={notas} 
                id="notas"
                rows={4}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-white resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 transition-colors">
                </textarea>
            </div>

            {/* Mensagem de Erro */}
            {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
        
        {/* Botões de Ação */}
        <div className="flex justify-end mt-6 space-x-3">
            <button
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-white bg-[#40BEBE] rounded-lg hover:bg-[#2d8888] transition-colors"
            >
            Cancelar
            </button>
            <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 font-semibold text-white bg-[#3D3E7E] rounded-lg hover:bg-[#303162] disabled:opacity-50 dark:bg-[#373872] dark:hover:bg-[#494a96] transition-colors"
            >
            {isLoading ? 'Salvando...' : 'Confirmar'}
            </button>
        </div>
        </form>
    </div>
    </div>
);
}