import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Header } from '../components/layout/Header';
import { LuPencil, LuTrash2, LuPlus } from 'react-icons/lu'; 
import { SeguradoraFormModal } from '../components/SeguradoraFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { type Seguradora } from '../types/seguradora.types';
import { StatusTag } from '../components/StatusTag';

export function SeguradoraPage() {

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [seguradoraParaEdit, setSeguradoraParaEdit] = useState<Seguradora | null>(null);
  const [seguradoraIdParaDel, setSeguradoraIdParaDel] = useState<string | null>(null);
  const [seguradorasList, setSeguradorasList] = useState<Seguradora[]>([]);
  const [seguradoraSearch, setSeguradoraSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSeguradoras = async () => {
    setIsLoading(true); 
    setError('');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Autenticação falhou. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/seguradoras',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setSeguradorasList(response.data); 

    } catch (err) {
      setError('Falha ao buscar seguradoras.');
      console.error(err); 
    } finally {
      setIsLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchSeguradoras();
  }, []); 

  // Função de deletar
  const handleDelete = async (idSeguradora: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Autenticação falhou. Faça login novamente.');
      return;
    }

    try {
        const response = await axios.delete(`http://localhost:8080/api/seguradoras/${idSeguradora}`,
          {headers: { 'Authorization': `Bearer ${token}` }}
        );
        fetchSeguradoras();

      } catch (err) {
        setError('Falha ao deletar seguradora.');
        console.error(err); 
    };
  }

  if (isLoading) {
    return <div>Carregando seguradoras...</div>;
  }

 const seguradorasFiltrados = seguradorasList.filter((seguradora) =>
    seguradora.nome.toLowerCase().includes(seguradoraSearch.toLowerCase())
  );

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className="w-full h-full">
      <Header title="Seguradoras" />
      <div className="px-2 py-8">
        
        {/* Barra de Gerenciamento */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Gerenciar Seguradoras</h2>
          <div className="flex space-x-4 text-black">
            <input 
              type="text" 
              placeholder="Buscar por nome" 
              className="px-4 py-2 border-2 rounded-lg"
              value={seguradoraSearch} 
              onChange={(e) => setSeguradoraSearch(e.target.value)}
            />
            <button 
              onClick={() => {
                setSeguradoraParaEdit(null)
                setIsFormModalOpen(true)
              }}
              className="px-4 py-2 font-semibold flex items-center text-white bg-[#2e2f5f] rounded-lg hover:bg-[#202042]">
              <LuPlus className='mr-1'></LuPlus> Adicionar Seguradora
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <table className="w-full min-w-full table-fixed">
            <thead className="bg-[#2e2f5f] text-white">
              <tr>
                <th className="w-4/12 px-6 py-3 text-left text-sm font-semibold">Nome</th>
                <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold">CNPJ</th>
                <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="w-1/12 px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {seguradorasFiltrados.map((seguradora) => (
                <tr key={seguradora.id}>
                  <td className="px-6 py-4 text-black">{seguradora.nome}</td>
                  <td className="px-6 py-4 text-black">{seguradora.email}</td>
                  <td className="px-6 py-4 text-black">{seguradora.cnpj}</td>
                  <td className="px-6 py-4"><StatusTag status={seguradora.status} /></td>
                  <td className="px-6 py-4 flex space-x-3">
                    <LuPencil 
                    onClick={() =>{
                      setSeguradoraParaEdit(seguradora)
                      setIsFormModalOpen(true)
                    }}
                    className="w-10 h-7 text-black cursor-pointer hover:text-green-500" />
                    <LuTrash2 
                    onClick={() => {
                      setSeguradoraIdParaDel(seguradora.id);
                      setIsConfirmModalOpen(true)
                    }}        
                    className="w-10 h-7 text-black cursor-pointer hover:text-red-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SeguradoraFormModal 
          isOpen={isFormModalOpen} 
          onClose={() => {
            setSeguradoraParaEdit(null)
            setIsFormModalOpen(false)
          }}
          seguradoraAtual={seguradoraParaEdit}
          onSuccess={() => {
            setIsFormModalOpen(false);
            setSeguradoraParaEdit(null)
            fetchSeguradoras();
        }}/>

        <ConfirmModal
            isOpen={isConfirmModalOpen}      
            onClose={() => setIsConfirmModalOpen(false)}     
            onConfirm={() => {
              if (seguradoraIdParaDel){
                handleDelete(seguradoraIdParaDel);
                setIsConfirmModalOpen(false);
              }
            }}
        >
            <h2 className='text-xl font-bold text-gray-800'> Tem certeza ?</h2>
            <p className='mt-2 italic text-gray-600'>
              Você realmente deseja excluir esta seguradora? Esta ação não pode ser desfeita.
            </p>
        </ConfirmModal>

      </div>
    </div>
  );
}