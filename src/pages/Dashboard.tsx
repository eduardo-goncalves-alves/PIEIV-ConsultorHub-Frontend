import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/layout/Header";
import axios from "axios";
import { type Cliente } from "../types/cliente.types";
import { type Seguradora } from "../types/seguradora.types";
// import {type Apolice} from "../types/apolice.types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Criando dados falsos para teste
const mockApoliceData = [
  { mes: 'Setembro', ativas: 12, vencidas: 2 },
  { mes: 'Outubro', ativas: 19, vencidas: 3 },
  { mes: 'Novembro', ativas: 25, vencidas: 1 },
];

export function DashboardPage() {
  const [periodo, setPeriodo] = useState('ultimos_30 dias');

  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
  // const [allApolices, setAllApolices] = useState<Apolice[]>(mockApoliceData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const clientesResponse = await axios.get(
          'http://localhost:8080/api/clientes',
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (Array.isArray(clientesResponse.data)) {
          setAllClientes(clientesResponse.data);
        } else {
          console.error("ERRO: A API não retornou um array!", clientesResponse.data);
          setAllClientes([]); 
        }

      } catch (err) {
        console.error('Falha ao buscar dados', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [])

  const kpis = useMemo(() => {
    // const clientesFiltrados = allClientes.filter(c => {
    //   const dataCadastro = new Date(c.dataCadastro);
    //   if (periodo === 'ultimos_7_dias'){
    //     return dataCadastro > (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    //   }
    //   return true;
    // });
    const clientesFiltrados = allClientes;

    // const apolicesFiltradas = allApolices.filter(a => {
    //   if (periodo === 'ultimos_30_dias' && a.status === 'PENDENTE'){
    //     return true;
    //   }
    //   return true;
    // });
    
    return {
      novosClientes: clientesFiltrados.length, 
      // novasApolices: apolicesFiltradas.length, 
    };

  }, [allClientes, periodo]); 

  return (
    <div className="w-full h-full">
      <Header title="Dashboard" />
      <div className="px-2 py-6">

      {/* Barra de Gerenciamento */}
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
          className="bg-gray-200 p-1.5 rounded-lg mb-4 text-black">
          <option value="ultimos_7_dias" className="text-black rounded-lg">Últimos 7 dias</option>
          <option value="ultimos_30_dias" className="text-black rounded-lg">Últimos 30 dias</option>
        </select>

        {/* CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card 1: KPI */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black">Total de Clientes</h3>
            <p className="text-3xl font-bold text-black">{isLoading ? '...' : kpis.novosClientes}</p>
          </div>

          {/* Card 2: KPI (Faltando) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-black">Total de Apólices</h3>
          {/* <p className="text-3xl font-bold">{isLoading ? '...' : kpis.novasApolices}</p> */}
        </div>
          
          {/* Card 3: Clientes Recentes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black">Clientes Recentes</h3>
            {/* ... (Aqui vai a Tarefa 2) ... */}
          </div>

        </div>

        {/* GRÁFICOS */}
        <div className="lg:col-span-2 shadow-md rounded-lg bg-white p-6 mt-4">
          <h3 className="font-bold text-black">Apólices por mês</h3>
            {/* Card 2: Gráfico de Apólices */}
            <div className="w-full h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={500} height={300} data={mockApoliceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ativas" fill="#3D3E7E" />
                      <Bar dataKey="vencidas" fill="#F87171" />
                    </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}