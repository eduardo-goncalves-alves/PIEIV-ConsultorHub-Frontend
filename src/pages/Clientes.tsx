import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Header } from '../components/layout/Header';
import { LuPencil, LuTrash2, LuPlus, LuDownload, LuMail } from 'react-icons/lu'; 
import { ClienteFormModal } from '../components/ClienteFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { CSVLink } from 'react-csv';
import { type Cliente } from '../types/cliente.types';
import { StatusTag } from '../components/StatusTag';

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
    <div className="w-full h-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header title="Clientes" />
      <div className="px-2 py-8">
        
        {/* Barra de Gerenciamento */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Gerenciar Clientes</h2>
          <div className="flex space-x-4 text-black dark:text-white">
            <input 
              type="text" 
              placeholder="Buscar por nome" 
              className="px-4 py-2 border-2 rounded-lg bg-white border-gray-200 text-gray-800 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
              value={clienteSearch} 
              onChange={(e) => setClienteSearch(e.target.value)}
            />
            
            <CSVLink 
              data={clientesFiltrados}
              filename={'cliente-consultorhub.csv'}
              headers={headersCSV}
              className="px-4 py-2 font-semibold flex items-center text-white bg-[#2e2f5f] rounded-lg hover:bg-[#202042] dark:bg-[#373872] dark:hover:bg-[#494a96] transition-colors">
              <LuDownload className='mr-1'></LuDownload> Exportar CSV
            </CSVLink>

            <button 
              onClick={() => {
                setClienteParaEdit(null)
                setIsFormModalOpen(true)
              }}
              className="px-4 py-2 font-semibold flex items-center text-white bg-[#2e2f5f] rounded-lg hover:bg-[#2d2e5e] dark:bg-[#373872] dark:hover:bg-[#494a96] transition-colors">
              <LuPlus className='mr-1'></LuPlus> Adicionar Cliente
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-none border border-transparent dark:border-gray-700 transition-colors">
          <table className="w-full min-w-full table-fixed">
            <thead className="bg-[#2e2f5f] text-white dark:bg-gray-900">
              <tr>
                <th className="w-4/12 px-6 py-3 text-left text-sm font-semibold">Nome</th>
                <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold flex-row">Email</th>
                <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold">Status</th>
                <th className="w-1/12 px-6 py-3 text-center text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-black dark:text-gray-300">{cliente.nome}</td>
                  <td className="px-6 py-4 text-black dark:text-gray-300">{cliente.email}</td>
                  <td className="px-6 py-4 text-black dark:text-gray-300">{cliente.telefone}</td>
                  <td className="px-6 py-4 text-black dark:text-gray-300 text-center"><StatusTag status={cliente.status}></StatusTag></td>
                  <td className="px-6 py-4 flex space-x-3 text-center justify-center">
                    <LuPencil 
                    onClick={() =>{
                      setClienteParaEdit(cliente)
                      setIsFormModalOpen(true)
                    }}
                    className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-green-500 dark:hover:text-green-400 transition-colors" />
                    <LuTrash2 
                    onClick={() => {
                      setClienteIdParaDel(cliente.id);
                      setIsConfirmModalOpen(true)
                    }}        
                    className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors" />
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
            <h2 className='text-xl font-bold text-gray-800 dark:text-white'> Tem certeza ?</h2>
            <p className='mt-2 italic text-[0.9em] text-gray-600 dark:text-gray-300'>
              Você realmente deseja excluir este cliente? Esta ação não pode ser desfeita.
            </p>
        </ConfirmModal>

      </div>
    </div>
  );
}