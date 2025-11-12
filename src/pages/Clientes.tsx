import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Header } from '../components/layout/Header';
import { LuPencil, LuTrash2, LuPlus, LuDownload } from 'react-icons/lu'; 
import { ClienteFormModal } from '../components/ClienteFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { CSVLink } from 'react-csv';
import { type Cliente } from '../types/cliente.types';

export function ClientesPage() {

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [clienteParaEdit, setClienteParaEdit] = useState<Cliente | null>(null);
  const [clienteIdParaDel, setClienteIdParaDel] = useState<string | null>(null);
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [clienteSearch, setClienteSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const headersCSV = [
  { label: "Nome", key: "nome" },
  { label: "CPF", key: "cpf" },
  { label: "Telefone", key: "telefone" },
  { label: "Email", key: "email" }
  ];

  const fetchClientes = async () => {
    setIsLoading(true); 
    setError('');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Autenticação falhou. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/clientes',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setClientesList(response.data); 

    } catch (err) {
      setError('Falha ao buscar clientes.');
      console.error(err); 
    } finally {
      setIsLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchClientes();
  }, []); 

  // Função de deletar
  const handleDelete = async (idCliente: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Autenticação falhou. Faça login novamente.');
      return;
    }

    try {
        const response = await axios.delete(`http://localhost:8080/api/clientes/${idCliente}`,
          {headers: { 'Authorization': `Bearer ${token}` }}
        );
        fetchClientes();

      } catch (err) {
        setError('Falha ao deletar cliente.');
        console.error(err); 
    };
  }

  if (isLoading) {
    return <div>Carregando clientes...</div>;
  }

 const clientesFiltrados = clientesList.filter((cliente) =>
    cliente.nome.toLowerCase().includes(clienteSearch.toLowerCase())
  );

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className="w-full h-full">
      <Header title="Clientes" />
      <div className="px-2 py-8">
        
        {/* Barra de Gerenciamento */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Gerenciar Clientes</h2>
          <div className="flex space-x-4 text-black">
            <input 
              type="text" 
              placeholder="Buscar por nome" 
              className="px-4 py-2 border-2 rounded-lg"
              value={clienteSearch} 
              onChange={(e) => setClienteSearch(e.target.value)}
            />
            
            <CSVLink 
              data={clientesFiltrados}
              filename={'cliente-consultorhub.csv'}
              headers={headersCSV}
              className="px-4 py-2 font-semibold flex items-center text-white bg-[#2e2f5f] rounded-lg hover:bg-[#202042]">
              <LuDownload className='mr-1'></LuDownload> Exportar CSV
            </CSVLink>

            <button 
              onClick={() => {
                setClienteParaEdit(null)
                setIsFormModalOpen(true)
              }}
              className="px-4 py-2 font-semibold flex items-center text-white bg-[#2e2f5f] rounded-lg hover:bg-[#2d2e5e]">
              <LuPlus className='mr-1'></LuPlus> Adicionar Cliente
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <table className="w-full min-w-full table-fixed">
            <thead className="bg-[#2e2f5f] text-white">
              <tr>
                <th className="w-4/12 px-6 py-3 text-left text-sm font-semibold">Nome</th>
                <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold">CPF</th>
                <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="w-1/12 px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="px-6 py-4 text-black">{cliente.nome}</td>
                  <td className="px-6 py-4 text-black">{cliente.cpf}</td>
                  <td className="px-6 py-4 text-black">{cliente.telefone}</td>
                  <td className="px-6 py-4 text-black">{cliente.email}</td>
                  <td className="px-6 py-4 flex space-x-3">
                    <LuPencil 
                    onClick={() =>{
                      setClienteParaEdit(cliente)
                      setIsFormModalOpen(true)
                    }}
                    className="w-10 h-7 text-black cursor-pointer hover:text-green-500" />
                    <LuTrash2 
                    onClick={() => {
                      setClienteIdParaDel(cliente.id);
                      setIsConfirmModalOpen(true)
                    }}        
                    className="w-10 h-7 text-black cursor-pointer hover:text-red-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ClienteFormModal 
          isOpen={isFormModalOpen} 
          onClose={() => {
            setClienteParaEdit(null)
            setIsFormModalOpen(false)
          }}
          clienteAtual={clienteParaEdit}
          onSuccess={() => {
            setIsFormModalOpen(false);
            setClienteParaEdit(null)
            fetchClientes();
        }}/>

        <ConfirmModal
            isOpen={isConfirmModalOpen}      
            onClose={() => setIsConfirmModalOpen(false)}     
            onConfirm={() => {
              if (clienteIdParaDel){
                handleDelete(clienteIdParaDel);
                setIsConfirmModalOpen(false);
              }
            }}
        >
            <h2 className='text-xl font-bold text-gray-800'> Tem certeza ?</h2>
            <p className='mt-2 italic text-[0.9em] text-gray-600'>
              Você realmente deseja excluir este cliente? Esta ação não pode ser desfeita.
            </p>
        </ConfirmModal>

      </div>
    </div>
  );
}