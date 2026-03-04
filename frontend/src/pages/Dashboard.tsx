import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import AtendimentoCard from '../components/AtendimentoCard';
import { LogOut, Search, Filter, LayoutDashboard, History, Activity } from 'lucide-react';

interface Atendimento {
    id: string;
    nome: string;
    telefone: string;
    area_juridica: string;
    prioridade: string;
    resumo: string;
    status: string;
    data_criacao: string;
    data_finalizacao?: string;
    usuario_responsavel?: string;
    telegram_chat_id?: string;
}

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<'pendente' | 'atendido'>('pendente');
    const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const [filterPrioridade, setFilterPrioridade] = useState('');

    const loadAtendimentos = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/atendimentos?status=${activeTab}`);
            setAtendimentos(response.data);
        } catch (error) {
            console.error('Erro ao carregar atendimentos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAtendimentos();
    }, [activeTab]);

    const handleFinalizar = async (id: string) => {
        try {
            await api.put(`/atendimentos/${id}/finalizar`);
            loadAtendimentos();
        } catch (error) {
            console.error('Erro ao finalizar atendimento:', error);
            alert('Não foi possível finalizar o atendimento.');
        }
    };

    const filteredAtendimentos = atendimentos.filter(a => {
        const matchSearch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.telefone.includes(searchTerm);
        const matchArea = filterArea ? a.area_juridica === filterArea : true;
        const matchPrioridade = filterPrioridade ? a.prioridade === filterPrioridade : true;

        return matchSearch && matchArea && matchPrioridade;
    });

    const areasUnicas = Array.from(new Set(atendimentos.map(a => a.area_juridica)));

    return (
        <div className="min-h-screen bg-brand-background flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-brand-blue text-white p-6 flex flex-col shrink-0 shadow-xl z-10 hidden md:flex">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-xl font-bold tracking-tight text-brand-gold uppercase">woloczyn <br /> e Schmidt</h1>
                    <p className="text-xs text-white/50 font-medium tracking-widest uppercase mt-2">Painel Jurídico</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('pendente')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'pendente' ? 'bg-white/10 text-white shadow-inner' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <Activity size={18} className={activeTab === 'pendente' ? 'text-brand-gold' : ''} />
                        Pendentes
                        {activeTab === 'pendente' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold"></div>}
                    </button>

                    <button
                        onClick={() => setActiveTab('atendido')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'atendido' ? 'bg-white/10 text-white shadow-inner' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <History size={18} className={activeTab === 'atendido' ? 'text-brand-gold' : ''} />
                        Atendidos
                        {activeTab === 'atendido' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold"></div>}
                    </button>
                </nav>

                <div className="mt-auto border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-blue flex items-center justify-center font-bold text-sm">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate text-white/90">{user?.name}</p>
                            <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm"
                    >
                        <LogOut size={16} />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-auto h-screen relative">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-6 bg-brand-blue p-4 rounded-2xl text-white shadow-lg">
                    <h1 className="font-bold text-brand-gold uppercase text-sm w-max tracking-tighter">woloczyn e Schmidt</h1>
                    <button onClick={logout} className="p-2 text-white/60 hover:text-white"><LogOut size={18} /></button>
                </div>

                <div className="max-w-6xl mx-auto pb-10">
                    <header className="mb-8 mt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-blue tracking-tight">
                                {activeTab === 'pendente' ? 'Triagem Pendente' : 'Histórico de Atendimentos'}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {activeTab === 'pendente' ? 'Gerencie os novos contatos vindos do Telegram e priorize a fila de acordo com a predição da IA.' : 'Consulte as triagens já finalizadas.'}
                            </p>
                        </div>

                        <div className="md:hidden flex bg-white p-1 rounded-lg border border-gray-200">
                            <button onClick={() => setActiveTab('pendente')} className={`flex-1 py-1.5 text-sm font-medium rounded-md ${activeTab === 'pendente' ? 'bg-brand-blue text-white' : 'text-gray-500'}`}>Pendentes</button>
                            <button onClick={() => setActiveTab('atendido')} className={`flex-1 py-1.5 text-sm font-medium rounded-md ${activeTab === 'atendido' ? 'bg-brand-blue text-white' : 'text-gray-500'}`}>Atendidos</button>
                        </div>
                    </header>

                    {/* Filters Bar */}
                    <div className="bg-white p-4 items-center rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou telefone..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm transition-shadow"
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:min-w-[160px]">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <select
                                    value={filterArea}
                                    onChange={e => setFilterArea(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm appearance-none"
                                >
                                    <option value="">Todas áreas</option>
                                    {areasUnicas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative flex-1 md:min-w-[150px]">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <select
                                    value={filterPrioridade}
                                    onChange={e => setFilterPrioridade(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm appearance-none"
                                >
                                    <option value="">Prioridade</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Média">Média</option>
                                    <option value="Baixa">Baixa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
                        </div>
                    ) : filteredAtendimentos.length === 0 ? (
                        <div className="bg-white border text-center border-dashed border-gray-300 rounded-2xl py-20 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-brand-background rounded-full mb-4 flex items-center justify-center text-gray-400">
                                <LayoutDashboard size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-brand-blue mb-1">Nenhum atendimento</h3>
                            <p className="text-gray-500 text-sm">Não foi encontrado nenhum card para os filtros selecionados.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAtendimentos.map(atendimento => (
                                <AtendimentoCard
                                    key={atendimento.id}
                                    atendimento={atendimento}
                                    onFinalizar={activeTab === 'pendente' ? handleFinalizar : undefined}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
