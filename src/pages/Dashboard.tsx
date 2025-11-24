import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/layout/Header";
import axios from "axios";
import { type Cliente } from "../types/cliente.types";
import { type Seguradora } from "../types/seguradora.types";
import { type Apolice } from "../types/apolice.types";
import { LuUsers, LuDollarSign, LuTriangleAlert } from "react-icons/lu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';


export function DashboardPage() {
    
    const [allApolices, setAllApolices] = useState<Apolice[]>([]); 
    const [allClientes, setAllClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                const clientesResponse = await axios.get(
                    'http://localhost:8080/api/consultores/me/clientes', 
                    { headers }
                );

                if (Array.isArray(clientesResponse.data)) {
                    setAllClientes(clientesResponse.data);
                    
                    const apolicesExtraidas = clientesResponse.data.flatMap((cliente: Cliente) => cliente.apolices || []);
                    setAllApolices(apolicesExtraidas); 
                } else {
                    setAllClientes([]); 
                    setAllApolices([]); 
                }

            } catch (err: any) { 
                console.error('Erro ao buscar dados:', err);
                if (err.response && err.response.status === 403) {
                    console.error("ERRO 403: O Backend bloqueou o acesso. Verifica o SecurityConfig.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);


    const kpis = useMemo(() => {
        const hoje = new Date();
        
        const totalPremio = allApolices.reduce((sum, apolice) => {
            if (apolice.status === 'ATIVO') {
                const valor = Number(apolice.valorPremio) || 0; 
                return sum + valor;
            }
            return sum;
        }, 0);
      
        const trintaDiasFrente = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        const totalVencendo = allApolices.filter(apolice => {
            if(!apolice.dataTerminoVigencia) return false; 
            
            const fimVigencia = new Date(apolice.dataTerminoVigencia);
            
            return fimVigencia >= hoje && fimVigencia <= trintaDiasFrente;
        }).length;
        
        return {
            totalClientes: allClientes.length,
            totalApolices: allApolices.length, 
            totalPremio: totalPremio, 
            totalVencendo: totalVencendo
        };

    }, [allClientes, allApolices]); 
    
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

    const dadosApolicesPorMes = useMemo(() => {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const dados = meses.map(mes => ({ name: mes, ativas: 0, fechadas: 0 }));

        allApolices.forEach(apolice => {
            if (!apolice.dataInicioVigencia) return; 

            const data = new Date(apolice.dataInicioVigencia); 
            
            if (data.getFullYear() === new Date().getFullYear()) {
                const mesIndex = data.getMonth();

                if (apolice.status === 'ATIVO') {
                    dados[mesIndex].ativas += 1;
                } else if (apolice.status === 'CANCELADO' || apolice.status === 'INATIVO') { 
                     dados[mesIndex].fechadas += 1; 
                }
            }
        });
        return dados;
    }, [allApolices]);


    return (
        <div className="w-full h-full ">
            <Header title="Dashboard" />
            <div className="px-2 py-6">

                {/* KPIs*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-300 relative overflow-x-hidden">
                      <div className={`absolute left-0 top-0 h-full w-1 bg-blue-600`}></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total de Clientes</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {isLoading ? <span className="animate-pulse">...</span> : kpis.totalClientes}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                            <LuUsers className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden">
                      <div className={`absolute left-0 top-0 h-full w-1 bg-emerald-500`}></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Valor Total em Prêmio</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {isLoading 
                                    ? <span className="animate-pulse">...</span> 
                                    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.totalPremio)
                                }
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                            <LuDollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden">
                        
                        <div className={`absolute left-0 top-0 h-full w-1 ${kpis.totalVencendo > 0 ? 'bg-red-500' : 'bg-gray-300'}`}></div>

                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Vencendo em 30 dias</p>
                            <h3 className={`text-3xl font-bold ${kpis.totalVencendo > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                {isLoading ? <span className="animate-pulse">...</span> : kpis.totalVencendo}
                            </h3>
                        </div>
                        
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                            kpis.totalVencendo > 0 
                                ? 'bg-red-50 border-red-100' 
                                : 'bg-gray-50 border-gray-200'
                        }`}>
                            <LuTriangleAlert className={`w-6 h-6 ${kpis.totalVencendo > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                        </div>
                    </div>

                </div> 

                {/* Gráfico de Apólices e Clientes Recentes*/}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-black">Crescimento de Apólices ({new Date().getFullYear()})</h3>
                        <div className="w-full h-[300px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dadosApolicesPorMes}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" 
                                    tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Legend iconType="circle" iconSize={9}/>
                                    <Bar dataKey="ativas" fill="#3D3E7E" name="Ativas" radius={[4, 4, 0, 0]} barSize={25} />
                                    <Bar dataKey="fechadas" fill="#F87171" name="Fechadas/Canceladas" />
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
                </div> 

                {/* Gráfico de Crescimento */}
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
                                    
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} /> 
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
    );
}