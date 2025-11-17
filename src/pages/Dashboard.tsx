import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/layout/Header";
import axios from "axios";
import { type Cliente } from "../types/cliente.types";
import { type Seguradora } from "../types/seguradora.types";
import {type Apolice} from "../types/apolice.types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Criando dados falsos para teste
const mockApoliceData = [
  { mes: 'Setembro', ativas: 12, vencidas: 2 },
  { mes: 'Outubro', ativas: 19, vencidas: 3 },
  { mes: 'Novembro', ativas: 25, vencidas: 1 },
];

export function DashboardPage() {
  const [periodo, setPeriodo] = useState('ultimos_30 dias');

  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
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
    const hoje = new Date();

    let dataCorte = new Date(0);
    if(periodo === 'ultimos_7_dias'){
      dataCorte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (periodo === 'ultimos_30_dias'){
      dataCorte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    
    const clientesFiltrados = allClientes.filter(cliente => {
      if(!cliente.createdOn) return false;

      const dataCadastro = new Date(cliente.createdOn);

      if (isNaN(dataCadastro.getTime())) return false;

      return dataCadastro >= dataCorte;
    });

    const todasApolices = allClientes.flatMap(cliente => cliente.apolices || [])

    const apolicesFiltradas = todasApolices.filter(apolice => {
      const dataCriacao = new Date(apolice.createdOn); 
      return dataCriacao >= dataCorte;
    });

    // Independente do filtro, próximos 30 dias será o padrão
    const trintaDiasFrente = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const vencendo = todasApolices.filter(apolice => {
        const fimVigencia = new Date(apolice.dataTerminoVigencia);
        return fimVigencia >= hoje && fimVigencia <= trintaDiasFrente;
    }).length;
    
    return {
      novosClientes: clientesFiltrados.length, 
      novasApolices: apolicesFiltradas.length,
      totalVencendo: vencendo
    };

  }, [allClientes, periodo]); 


  const dadosClientesPorMes = useMemo(() => {

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dados = meses.map(mes => ({ name: mes, total: 0 }));

    allClientes.forEach(cliente => {
      if (!cliente.createdOn) return;
      
      const data = new Date(cliente.createdOn); 
      
      if (data.getFullYear() === new Date().getFullYear()) {
         const mesIndex = data.getMonth();
         dados[mesIndex].total += 1;
      }
    });

    return dados;
  }, [allClientes]);


  return (
    <div className="w-full h-full ">
      <Header title="Dashboard" />
      <div className="px-2 py-6">

        {/* Barra de Filtro */}
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
          className="bg-gray-200 p-1.5 rounded-lg mb-4 text-black">
          <option value="ultimos_7_dias" className="text-black rounded-lg">Últimos 7 dias</option>
          <option value="ultimos_30_dias" className="text-black rounded-lg">Últimos 30 dias</option>

        </select>

        {/*LINHA 1: KPIs*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black">Total de Clientes</h3>
            <p className="text-3xl font-bold text-black">{isLoading ? '...' : kpis.novosClientes}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black">Total de Apólices</h3>
            <p className="text-3xl font-bold text-black">{isLoading ? '...' : kpis.novasApolices}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black">Apólices Vencendo</h3>
            <p className="text-3xl font-bold text-red-500">{isLoading ? '...' : kpis.totalVencendo}</p>
          </div>
        </div> 

        {/* LINHA 2: GRÁFICOS E LISTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black">Apólices por mês</h3>
            <div className="w-full h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockApoliceData}>
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

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black mb-4">Clientes Recentes</h3>
            <ul className="space-y-3">
               {allClientes.slice(0, 5).map(cliente => (
                 <li key={cliente.id} className="text-gray-700 border-b pb-2 border-gray-100">
                   {cliente.nome}
                 </li>
               ))}
            </ul>
          </div>
        
        {/* LINHA 3: GRÁFICO DE CRESCIMENTO */}
        <div className="w-[48.5em] grid-cols-1 mt-6">
          
          <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-black mb-4">Crescimento da Carteira (Novos Clientes em {new Date().getFullYear()})</h3>
            
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosClientesPorMes}>
                  <defs>
                    <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#40BEBE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#40BEBE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} /> {/* allowDecimals={false} para não mostrar "0.5 pessoas" */}
                  <Tooltip />
                  
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#308d8d" 
                    fillOpacity={1} 
                    fill="url(#colorClientes)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div> 
      </div>
    </div>
  );
}