import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { LuMoon, LuSun, LuBell, LuPartyPopper, LuCircleAlert } from "react-icons/lu";

interface Notificacao {
    id: string;
    titulo: string;
    mensagem: string;
    lida: boolean;
    data: string;
    tipo: 'alerta' | 'info';
    link?: string;
}

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [nomeConsultor, setNomeConsultor] = useState('');
    
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [showNotificacoes, setShowNotificacoes] = useState(false);

    useEffect(() => {
        const fetchDadosEGerarNotificacoes = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8080/api/consultores/me/clientes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const clientes = response.data;
                const novasNotificacoes: Notificacao[] = [];
                const idsLidos = JSON.parse(localStorage.getItem('notificacoes_lidas_ids') || '[]');

                // Datas de referência
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const daqui30Dias = new Date(hoje);
                daqui30Dias.setDate(hoje.getDate() + 30);

                if (Array.isArray(clientes)) {
                    clientes.forEach((cliente: any) => {
                        if (cliente.apolices && Array.isArray(cliente.apolices)) {
                            cliente.apolices.forEach((apolice: any) => {
                                
                                if (apolice.status !== 'ATIVO') return;

                                if (apolice.dataTerminoVigencia) {
                                    const dataFim = new Date(apolice.dataTerminoVigencia + 'T00:00:00');
                                    
                                    if (dataFim >= hoje && dataFim <= daqui30Dias) {
                                        const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                                        const idNotificacao = `venc-${apolice.id}`;

                                        novasNotificacoes.push({
                                            id: idNotificacao,
                                            titulo: diasRestantes === 0 ? 'Vence Hoje!' : `Vence em ${diasRestantes} dias`,
                                            mensagem: `Apólice #${apolice.numeroApolice} de ${cliente.nome}.`,
                                            lida: idsLidos.includes(idNotificacao),
                                            data: new Date().toLocaleDateString('pt-BR'),
                                            tipo: 'alerta',
                                            link: `/apolices?search=${cliente.id}`
                                        });
                                    }
                                }

                                if (apolice.dataInicioVigencia) {
                                    const dataInicio = new Date(apolice.dataInicioVigencia + 'T00:00:00');
                                    if (dataInicio.getDate() === hoje.getDate() && 
                                        dataInicio.getMonth() === hoje.getMonth() &&
                                        dataInicio.getFullYear() !== hoje.getFullYear()) {
                                        
                                        const idNotificacao = `niver-${apolice.id}-${hoje.getFullYear()}`;

                                        novasNotificacoes.push({
                                            id: idNotificacao,
                                            titulo: 'Aniversário de Apólice',
                                            mensagem: `Apólice de ${cliente.nome} completa mais um ano hoje!`,
                                            lida: idsLidos.includes(idNotificacao),
                                            data: 'Hoje',
                                            tipo: 'info',
                                            link: `/apolices?search=${cliente.id}`
                                        });
                                    }
                                }
                            });
                        }
                    });
                }

                setNotificacoes(novasNotificacoes);

                const fetchUsuario = async () => {
                    const token = localStorage.getItem('authToken');
                    if(!token){
                        setNomeConsultor('Visitante');
                        return;
                    } 

                    try {
                        const response = await axios.get('http://localhost:8080/api/consultores/me', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        
                        const nomeCompleto = response.data.nome || 'Consultor';
                        
                        if (nomeCompleto){
                            const primeiroNome = nomeCompleto.split(' ')[0];
                            setNomeConsultor(primeiroNome)
                        } else {
                            setNomeConsultor('Consultor')
                        }
                    } catch (error) {
                        console.error("Erro ao buscar nome do usuário", error);
                        setNomeConsultor('Consultor');
                    }
                };

                fetchUsuario();

            } catch (error) {
                console.error("Erro ao gerar notificações", error);
            }
        };

        fetchDadosEGerarNotificacoes();
    }, []);

    const naoLidas = notificacoes.filter(n => !n.lida).length;

    const handleNotificacaoClick = (notificacaoItem: Notificacao) => {
        setNotificacoes(prev => prev.map(n => 
            n.id === notificacaoItem.id ? { ...n, lida: true } : n
        ));
        
        const idsLidos = JSON.parse(localStorage.getItem('notificacoes_lidas_ids') || '[]');
        if (!idsLidos.includes(notificacaoItem.id)) {
            idsLidos.push(notificacaoItem.id);
            localStorage.setItem('notificacoes_lidas_ids', JSON.stringify(idsLidos));
        }

        if (notificacaoItem.link) {
            navigate(notificacaoItem.link);
            setShowNotificacoes(false);  
        }
    };

    return (
        <header className="flex items-center justify-between w-full px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 relative">
            <h1 className="text-2xl font-bold dark:text-white">{title}</h1>

            <div className="flex items-center gap-4">
                
                <div className="relative">
                    <button 
                        onClick={() => setShowNotificacoes(!showNotificacoes)}
                        className="p-2 relative rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <LuBell size={20} className="text-gray-600 dark:text-gray-300" />
                        {naoLidas > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                                {naoLidas}
                            </span>
                        )}
                    </button>

                    {showNotificacoes && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowNotificacoes(false)}></div>
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-fade-in-down">
                                <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Notificações</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{naoLidas} novas</span>
                                </div>
                                
                                <div className="max-h-80 overflow-y-auto">
                                    {notificacoes.length === 0 ? (
                                        <p className="p-6 text-center text-sm text-gray-500">Nenhum alerta pendente.</p>
                                    ) : (
                                        notificacoes.map(n => (
                                            <div key={n.id} onClick={() => handleNotificacaoClick(n)}
                                                className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 flex gap-3 ${!n.lida ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className="mt-1">
                                                    {n.tipo === 'alerta' 
                                                        ? <LuCircleAlert className="text-red-500" size={18}/> 
                                                        : <LuPartyPopper className="text-blue-500" size={18}/>
                                                    }
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm mb-1 ${!n.lida ? 'font-bold text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {n.titulo}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                        {n.mensagem}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 mt-2 block">{n.data}</span>
                                                </div>
                                                {!n.lida && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Botão Tema e Perfil */}
                <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-yellow-500 dark:text-cyan-500 hover:scale-110 transition-all shadow-sm">
                    {theme === 'light' ? <LuSun size={20} /> : <LuMoon size={20} />}
                </button>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right sm:block">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Olá, </span>
                        <Link to="/perfil" className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-[#40BEBE]">
                            {nomeConsultor || 'Carregando...'}
                        </Link>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#3D3E7E] flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white dark:border-gray-600">
                        {nomeConsultor.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}