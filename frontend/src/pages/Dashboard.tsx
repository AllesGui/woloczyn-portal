import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import AtendimentoCard from '../components/AtendimentoCard';
import AtendimentoModal from '../components/AtendimentoModal';
import Agenda from '../components/Agenda';
import { LogOut, Search, Filter, Hexagon, History, Activity, BarChart3, Menu, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'pendente' | 'atendido' | 'agenda'>('pendente');
    const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const [filterPrioridade, setFilterPrioridade] = useState('');

    const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const handleReabrir = async (id: string) => {
        try {
            await api.put(`/atendimentos/${id}/reabrir`);
            loadAtendimentos();
        } catch (error) {
            console.error('Erro ao reabrir atendimento:', error);
            alert('Não foi possível reabrir o atendimento.');
        }
    };

    const filteredAtendimentos = atendimentos.filter(a => {
        const matchSearch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.telefone.includes(searchTerm) ||
            a.resumo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchArea = filterArea ? a.area_juridica === filterArea : true;
        const matchPrioridade = filterPrioridade ? a.prioridade === filterPrioridade : true;

        return matchSearch && matchArea && matchPrioridade;
    });

    const areasUnicas = Array.from(new Set(atendimentos.map(a => a.area_juridica))).sort();
    const prioridadesUnicas = Array.from(new Set(atendimentos.map(a => a.prioridade)));

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="min-h-screen bg-brand-background flex flex-col md:flex-row relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-silver/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Sidebar Desktop */}
            <aside className="w-full md:w-72 bg-brand-surface border-r border-white/5 p-6 flex-col shrink-0 z-20 hidden md:flex shadow-2xl relative">
                <div className="mb-12 flex justify-center pt-4">
                    <img
                        src="/logo.png"
                        alt="Schmidt & Woloczyn"
                        className="w-[200px] h-auto object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>

                <nav className="flex-1 space-y-3">
                    <div className="px-4 mb-2">
                        <p className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest">Triagem</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('pendente')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm tracking-wide ${activeTab === 'pendente' ? 'bg-white/10 text-brand-accent shadow-inner border border-white/5' : 'text-brand-silver/50 hover:text-brand-silver hover:bg-white/5 border border-transparent'}`}
                    >
                        <Activity size={18} className={activeTab === 'pendente' ? 'text-brand-silver drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''} />
                        Pendentes
                        {activeTab === 'pendente' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-silver shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                    </button>

                    <button
                        onClick={() => setActiveTab('atendido')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm tracking-wide ${activeTab === 'atendido' ? 'bg-white/10 text-brand-accent shadow-inner border border-white/5' : 'text-brand-silver/50 hover:text-brand-silver hover:bg-white/5 border border-transparent'}`}
                    >
                        <History size={18} className={activeTab === 'atendido' ? 'text-brand-silver drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''} />
                        Atendidos
                        {activeTab === 'atendido' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-silver shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                    </button>

                    <div className="pt-4 mt-6 border-t border-white/5 space-y-3">
                        <div className="px-4 mb-2">
                            <p className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest">Gestão</p>
                        </div>
                        <button
                            onClick={() => setActiveTab('agenda')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm tracking-wide ${activeTab === 'agenda' ? 'bg-white/10 text-brand-accent shadow-inner border border-white/5' : 'text-brand-silver/50 hover:text-brand-silver hover:bg-white/5 border border-transparent'}`}
                        >
                            <Calendar size={18} className={activeTab === 'agenda' ? 'text-brand-silver drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''} />
                            Agenda
                            {activeTab === 'agenda' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-silver shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                        </button>
                        <button
                            onClick={() => navigate('/analytics')}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm tracking-wide text-brand-silver/50 hover:text-brand-silver hover:bg-white/5 border border-transparent"
                        >
                            <BarChart3 size={18} />
                            Métricas
                        </button>
                    </div>
                </nav>

                <div className="mt-auto border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 mb-5 px-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-brand-silver flex items-center justify-center font-bold text-sm shadow-inner">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate text-brand-accent">{user?.name}</p>
                            <p className="text-xs text-brand-silver/40 truncate mt-0.5 tracking-wide">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-brand-silver/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all font-medium text-xs tracking-widest uppercase"
                    >
                        <LogOut size={16} />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center bg-brand-surface border-b border-white/5 p-4 z-20 relative shadow-xl">
                <div className="flex items-center w-32 h-8">
                    <img
                        src="/logo.png"
                        alt="Schmidt & Woloczyn"
                        className="w-full h-full object-contain object-left mix-blend-screen"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-brand-silver/60 hover:text-brand-accent"><Menu size={20} /></button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-brand-surface border-b border-white/5 z-20 relative px-4 py-2"
                    >
                        <div className="flex flex-col gap-2 pb-4">
                            <div className="px-4 mt-2">
                                <p className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest">Triagem</p>
                            </div>
                            <button onClick={() => { setActiveTab('pendente'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${activeTab === 'pendente' ? 'bg-white/10 text-brand-accent' : 'text-brand-silver/50'}`}><Activity size={18} />Pendentes</button>
                            <button onClick={() => { setActiveTab('atendido'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${activeTab === 'atendido' ? 'bg-white/10 text-brand-accent' : 'text-brand-silver/50'}`}><History size={18} />Atendidos</button>
                            <div className="h-px bg-white/5 my-2"></div>
                            <div className="px-4">
                                <p className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest">Gestão</p>
                            </div>
                            <button onClick={() => { setActiveTab('agenda'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${activeTab === 'agenda' ? 'bg-white/10 text-brand-accent' : 'text-brand-silver/50'}`}><Calendar size={18} />Agenda</button>
                            <button onClick={() => { navigate('/analytics'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-silver/50`}><BarChart3 size={18} />Métricas</button>
                            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 mt-2 text-sm border border-red-500/10"><LogOut size={18} />Sair</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12 overflow-auto h-screen relative z-10">
                <div className="max-w-6xl mx-auto pb-10 h-full">
                    {activeTab === 'agenda' ? (
                        <Agenda />
                    ) : (
                        <>
                            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-3xl font-light text-brand-accent tracking-wide flex items-center gap-3">
                                {activeTab === 'pendente' ? 'Triagem Pendente' : 'Histórico de Atendimentos'}
                            </h2>
                            <p className="text-brand-silver/50 text-sm mt-2 tracking-wide font-medium">
                                {activeTab === 'pendente' ? 'Gerencie os contatos entrantes e utilize as predições da IA.' : 'Consulte as triagens já processadas e finalizadas.'}
                            </p>
                        </motion.div>
                    </header>

                    {/* Filters Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="glass-panel p-5 items-center flex flex-col md:flex-row gap-5 mb-10"
                    >
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-silver/40" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, telefone..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 glass-input text-sm"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:min-w-[170px]">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-silver/40" size={16} />
                                <select
                                    value={filterArea}
                                    onChange={e => setFilterArea(e.target.value)}
                                    className="w-full pl-11 pr-8 py-3 glass-input text-sm appearance-none bg-brand-surface text-brand-silver focus:text-white"
                                >
                                    <option value="" className="bg-[#172229] text-white">Todas áreas</option>
                                    <option value="Trabalhista" className="bg-[#172229] text-white">Trabalhista</option>
                                    <option value="Previdenciario" className="bg-[#172229] text-white">Previdenciário</option>
                                    <option value="Cível" className="bg-[#172229] text-white">Cível</option>
                                    <option value="Familia" className="bg-[#172229] text-white">Família</option>
                                    {areasUnicas.filter(a => !['Trabalhista', 'Previdenciario', 'Cível', 'Familia'].includes(a)).map(area => (
                                        <option key={area} value={area} className="bg-[#172229] text-white">{area}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative flex-1 md:min-w-[190px]">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-silver/40" size={16} />
                                <select
                                    value={filterPrioridade}
                                    onChange={e => setFilterPrioridade(e.target.value)}
                                    className="w-full pl-11 pr-8 py-3 glass-input text-sm appearance-none bg-brand-surface text-brand-silver focus:text-white"
                                >
                                    <option value="" className="bg-[#172229] text-white">Todas Prioridades</option>
                                    <option value="Alta" className="bg-[#172229] text-white">Alta</option>
                                    <option value="Media" className="bg-[#172229] text-white">Média</option>
                                    <option value="Baixa" className="bg-[#172229] text-white">Baixa</option>
                                    {prioridadesUnicas.filter(p => !['Alta', 'Media', 'Baixa'].includes(p)).map(p => (
                                        <option key={p} value={p} className="bg-[#172229] text-white">{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cards Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="w-8 h-8 border-2 border-brand-silver/20 border-t-brand-silver rounded-full animate-spin"></div>
                        </div>
                    ) : filteredAtendimentos.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="border border-white/5 bg-black/10 rounded-3xl py-32 flex flex-col items-center justify-center backdrop-blur-sm"
                        >
                            <div className="relative flex items-center justify-center w-16 h-16 mb-6">
                                <Hexagon size={64} strokeWidth={0.5} className="text-brand-silver/20 absolute" />
                                <Search size={24} className="text-brand-silver/40" />
                            </div>
                            <h3 className="text-lg font-medium text-brand-accent mb-2 tracking-wide uppercase">Nenhum registro encontrado</h3>
                            <p className="text-brand-silver/40 text-sm">Altere os filtros ou realize uma nova busca.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {filteredAtendimentos.map(atendimento => (
                                    <AtendimentoCard
                                        key={atendimento.id}
                                        atendimento={atendimento}
                                        onFinalizar={activeTab === 'pendente' ? handleFinalizar : undefined}
                                        onReabrir={activeTab === 'atendido' ? handleReabrir : undefined}
                                        onOpenDetail={setSelectedAtendimento}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    </>
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            {selectedAtendimento && (
                <AtendimentoModal
                    atendimento={selectedAtendimento}
                    onClose={() => setSelectedAtendimento(null)}
                    onFinalizar={selectedAtendimento.status === 'pendente' ? handleFinalizar : undefined}
                    onReabrir={selectedAtendimento.status === 'atendido' ? handleReabrir : undefined}
                />
            )}
        </div>
    );
}
