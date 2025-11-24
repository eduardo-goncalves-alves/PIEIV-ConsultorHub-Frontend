import React, { useEffect, useState, useMemo } from 'react'; 
import axios from 'axios';
import { Header } from '../components/layout/Header';
import { LuPencil, LuTrash2, LuPlus, LuDownload, LuUser } from 'react-icons/lu'; 
import { ConfirmModal } from '../components/ConfirmModal';
import { CSVLink } from 'react-csv';
import { StatusTag } from '../components/StatusTag';

import { ApoliceFormModal } from '../components/ApoliceFormModal';
import type { Apolice } from '../types/apolice.types';

interface Cliente { id: string; nome: string; }
interface Seguradora { id: string; nome: string; }

export function ApolicesPage() {

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [apoliceParaEdit, setApoliceParaEdit] = useState<Apolice | null>(null);
  const [apoliceIdParaDel, setApoliceIdParaDel] = useState<string | null>(null);

  const [clientesOpcoes, setClientesOpcoes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  
  const [apoliceList, setApolicesList] = useState<Apolice[]>([]);
  const [apoliceSearch, setApoliceSearch] = useState('');
  const [isLoadingApolices, setIsLoadingApolices] = useState(false);
  
  const [seguradorasList, setSeguradorasList] = useState<Seguradora[]>([]);

  const [error, setError] = useState('');

  const headersCSV = [
    { label: "Nº Apólice", key: "numeroApolice" },
    { label: "Vigência Fim", key: "dataTerminoVigencia" },
    { label: "Valor", key: "valorPremio" },
    { label: "Seguradora", key: "seguradora"},
    { label: "Status", key: "status" }
  ];

  // Função para buscar o nome da seguradora baseado na ID
  const getSeguradoraNome = (id: string | undefined): string => {
      if (!id) return 'N/A';   
      const seguradora = seguradorasList.find(s => s.id === id);
      return seguradora ? seguradora.nome : 'Seguradora Desconhecida';
  };

  useEffect(() => {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        async function fetchInitialData() {
            try {
                const clientesResp = await axios.get("http://localhost:8080/api/clientes", { headers });
                setClientesOpcoes(clientesResp.data);

                const seguradorasResp = await axios.get("http://localhost:8080/api/seguradoras", { headers });
                setSeguradorasList(seguradorasResp.data);

            } catch (err) {
            }
        }
        fetchInitialData();
    }, [])

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoadingClientes(true);
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:8080/api/clientes', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        setClientesOpcoes(response.data);
      } catch (err) {
        console.error("Erro ao buscar clientes", err);
        setError('Falha ao carregar lista de clientes.');
      } finally {
        setIsLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  const fetchApolicesDoCliente = async (idCliente: string) => {
    if (!idCliente) {
      setApolicesList([]); 
      return;
    }

    setIsLoadingApolices(true);
    setError('');
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get(
        `http://localhost:8080/api/apolices/client_docs/${idCliente}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setApolicesList(response.data);
    } catch (err) {
      console.error(err);
      setApolicesList([]); 
      setError('Não foi possível carregar as apólices (ou cliente sem apólices).');
    } finally {
      setIsLoadingApolices(false);
    }
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoId = e.target.value;
    setSelectedClienteId(novoId);
    if(novoId) {
        fetchApolicesDoCliente(novoId);
    } else {
        setApolicesList([]);
    }
  };

  const handleDelete = async (idApolice: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        await axios.delete(`http://localhost:8080/api/apolices/doc_delete/${idApolice}`,
          {headers: { 'Authorization': `Bearer ${token}` }}
        );

        if (selectedClienteId) {
            fetchApolicesDoCliente(selectedClienteId); 
        }
        setIsConfirmModalOpen(false); 

      } catch (err) {
        setError('Falha ao deletar apólice.');
        console.error(err); 
    };
  }

  const apolicesFiltradas = useMemo(() => {
    return apoliceList.filter((apolice) =>
        apolice.id?.toLowerCase().includes(apoliceSearch.toLowerCase())
    );
  }, [apoliceList, apoliceSearch]);

  
  return (
    <div className="w-full h-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header title="Apólices" />
      <div className="px-2 py-8">

        {/* Barra de Gerenciamento */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Gerenciar Apólices</h2>
          <div className="flex space-x-4 text-black">
            
          </div>
        </div>
        
        {/* Filtros */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center w-full md:w-1/3">
                    <LuUser className="text-gray-500 mr-2 dark:text-gray-400" size={20} />
                    <select 
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2e2f5f] outline-none text-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                        value={selectedClienteId}
                        onChange={handleClienteChange}
                        disabled={isLoadingClientes}
                    >
                        <option value="">Selecione um Cliente</option>
                        {clientesOpcoes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-4 text-black w-full md:w-auto justify-end">
                    <input 
                      type="text" 
                      placeholder="Filtrar nº apólice..." 
                      className="px-4 py-2 border-2 rounded-lg w-full md:w-auto bg-white border-gray-300 text-gray-700 outline-none focus:border-[#2e2f5f] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
                      value={apoliceSearch} 
                      onChange={(e) => setApoliceSearch(e.target.value)}
                      disabled={!selectedClienteId} 
                    />
                    
                    <CSVLink 
                      data={apolicesFiltradas}
                      filename={'apolices-consultorhub.csv'}
                      headers={headersCSV}
                      className={`px-4 py-2 font-semibold flex items-center text-white rounded-lg transition-colors ${
                        !selectedClienteId 
                          ? 'bg-gray-400 cursor-not-allowed pointer-events-none dark:bg-gray-600' 
                          : 'bg-[#2e2f5f] hover:bg-[#202042] dark:bg-[#373872] dark:hover:bg-[#494a96]'
                      }`}>
                      <LuDownload className='mr-1'></LuDownload> Exportar CSV
                    </CSVLink>

                    <button 
                      disabled={!selectedClienteId}
                      onClick={() => {
                        setApoliceParaEdit(null)
                        setIsFormModalOpen(true)
                      }}
                      className={`px-4 py-2 font-semibold flex items-center text-white rounded-lg transition-colors ${
                        !selectedClienteId 
                            ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600' 
                            : 'bg-[#2e2f5f] hover:bg-[#202042] dark:bg-[#373872] dark:hover:bg-[#494a96]'
                        }`}>
                      <LuPlus className='mr-1'></LuPlus> Nova Apólice
                    </button>
                  </div>
            </div>
        </div>

        {error && <div className="mb-4 p-3 text-red-700 bg-red-100 rounded border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">{error}</div>}

        {/* TABELA */}
        {isLoadingApolices ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Carregando apólices do cliente...</div>
        ) : !selectedClienteId ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-[#2e2f5f] dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-400">
                Selecione um cliente acima para visualizar as apólices.
            </div>
        ) : apolicesFiltradas.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400">
                Nenhuma apólice encontrada para este cliente.
            </div>
        ) : (
            <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-none border border-transparent dark:border-gray-700 transition-colors">
              <table className="w-full min-w-full table-fixed">
                <thead className="bg-[#2e2f5f] text-white dark:bg-gray-900">
                  <tr>
                    <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold">Nº Apólice</th>
                    <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                    <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Vigência Fim</th>
                    <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Valor</th>
                    <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold">Seguradora</th>
                    <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold">Status</th>
                    <th className="w-1/12 px-6 py-3 text-center text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {apolicesFiltradas.map((apolice) => (
                    <tr key={apolice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-black dark:text-gray-300">{apolice.numeroApolice}</td>
                      <td className="px-6 py-4 text-black dark:text-gray-300">{apolice.tipo || 'N/D'}</td>
                      <td className="px-6 py-4 text-black dark:text-gray-300">{apolice.dataTerminoVigencia}</td>
                      <td className="px-6 py-4 text-black dark:text-gray-300">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apolice.valorPremio || 0)}
                      </td>
                      <td className="px-6 py-4 text-black dark:text-gray-300">{getSeguradoraNome(apolice.seguradoraId)}
                      </td>
                      <td className="px-6 py-4 text-black text-center">
                        <StatusTag status={apolice.status} />
                      </td>
                      <td className="px-3 py-3 flex justify-center space-x-3">
                        <LuPencil 
                          onClick={() =>{
                            setApoliceParaEdit(apolice)
                            setIsFormModalOpen(true)
                          }}
                          className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        />
                        <LuTrash2 
                          onClick={() => {
                            setApoliceIdParaDel(apolice.id || ''); 
                            setIsConfirmModalOpen(true)
                          }}        
                          className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}

        <ApoliceFormModal 
           isOpen={isFormModalOpen} 
           onClose={() => {
             setApoliceParaEdit(null);
             setIsFormModalOpen(false);
           }}
           clienteIdPreSelecionado={selectedClienteId}
           apoliceParaEdit={apoliceParaEdit}
           onSuccess={() => {
             setIsFormModalOpen(false);
             setApoliceParaEdit(null);
             fetchApolicesDoCliente(selectedClienteId);
           }}
         />

        <ConfirmModal
            isOpen={isConfirmModalOpen}      
            onClose={() => setIsConfirmModalOpen(false)}     
            onConfirm={() => {
              if (apoliceIdParaDel){
                handleDelete(apoliceIdParaDel);
              }
            }}
        >
            <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Tem certeza?</h2>
            <p className='mt-2 italic text-[0.9em] text-gray-600 dark:text-gray-300'>
              Você realmente deseja excluir esta apólice? Esta ação não pode ser desfeita.
            </p>
        </ConfirmModal>

      </div>
    </div>
  );
}