import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell
} from 'recharts';
import {
    ArrowLeft, Clock,
    CalendarDays, BarChart3, Target, Zap, Wallet,
    ArrowUpRight, Info
} from 'lucide-react';

interface Stats {
    summary: {
        total: number;
        pending: number;
        attended: number;
        thisWeek: number;
        thisMonth: number;
        conversionRate: number;
        avgResponseHours: number;
        potentialValue: number;
    };
    daily: { date: string; count: number }[];
    areas: { area: string; count: number }[];
}

const COLORS = ['#0a1d37', '#c9a15b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function Analytics() {
    const { } = useContext(AuthContext);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
                    <p className="text-brand-blue font-medium animate-pulse">Carregando inteligência...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <p className="text-gray-500">Sem dados operacionais para análise</p>
            </div>
        );
    }

    const dailyFormatted = stats.daily.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }));

    const funnelData = [
        { name: 'Contatos', value: stats.summary.total, fill: '#0a1d37' },
        { name: 'Em Triagem', value: stats.summary.pending, fill: '#3b82f6' },
        { name: 'Convertidos', value: stats.summary.attended, fill: '#10b981' },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-brand-blue text-white p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-md group"
                        >
                            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-gold p-2 rounded-lg">
                                    <BarChart3 size={24} className="text-brand-blue" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight">Estatísticas Estratégicas</h1>
                            </div>
                            <p className="text-white/60 text-sm mt-1 font-medium italic">Análise de performance e potencial jurídico</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-10 -mt-6">
                {/* Advanced KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Potential Value */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Wallet size={80} className="text-brand-blue" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-brand-blue font-bold text-sm mb-4 uppercase tracking-wider">
                                <Wallet size={16} />
                                Potencial de Carteira
                            </div>
                            <p className="text-4xl font-extrabold text-brand-blue mb-2">
                                {formatCurrency(stats.summary.potentialValue ?? 0)}
                            </p>
                            <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 w-fit px-3 py-1 rounded-full">
                                <ArrowUpRight size={14} />
                                Estimativa Gerencial
                            </div>
                        </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Target size={80} className="text-brand-blue" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-brand-blue font-bold text-sm mb-4 uppercase tracking-wider">
                                <Target size={16} />
                                Taxa de Conversão
                            </div>
                            <p className="text-4xl font-extrabold text-brand-blue mb-2">
                                {stats.summary.conversionRate ?? 0}%
                            </p>
                            <p className="text-gray-400 text-xs font-medium">Contatos convertidos em atendimentos</p>
                        </div>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={80} className="text-brand-blue" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-brand-blue font-bold text-sm mb-4 uppercase tracking-wider">
                                <Zap size={16} />
                                Eficiência Operacional
                            </div>
                            <p className="text-4xl font-extrabold text-brand-blue mb-2">
                                {stats.summary.avgResponseHours ?? 0}h
                            </p>
                            <p className="text-gray-400 text-xs font-medium">Tempo médio para finalização</p>
                        </div>
                    </div>

                    {/* Funnel Recap */}
                    <div className="bg-brand-blue rounded-[2rem] p-8 shadow-xl border border-white/10 relative overflow-hidden group">
                        <div className="flex flex-col h-full justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-white/60 text-xs font-bold uppercase">
                                    <span>Funnel de hoje</span>
                                    <Clock size={14} />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-white/80 text-sm font-medium">Total Contatos</span>
                                        <span className="text-white text-xl font-bold">{stats.summary.total}</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-brand-gold h-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-white/80 text-sm font-medium">Convertidos</span>
                                        <span className="text-brand-gold text-xl font-bold">{stats.summary.attended}</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-green-400 h-full" style={{ width: `${stats.summary.conversionRate}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart: Volume Trend */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-brand-blue">Tendência de Volume</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
                                <CalendarDays size={14} />
                                ÚLTIMOS 30 DIAS
                            </div>
                        </div>
                        {dailyFormatted.length > 0 ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={dailyFormatted}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c9a15b" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#c9a15b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#0a1d37', fontWeight: 700 }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#c9a15b" strokeWidth={4} fill="url(#colorCount)" name="Leads" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[320px] flex items-center justify-center text-gray-400">Aguardando novos leads...</div>
                        )}
                    </div>

                    {/* Funnel Visual */}
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-brand-blue mb-8">Funnel de Conversão</h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={funnelData} layout="vertical" barSize={35} margin={{ left: 10, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fill: '#0a1d37', fontWeight: 600, fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 20, 20, 0]}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 pt-6 border-t border-gray-50 flex items-center gap-3 text-brand-blue/60 italic text-xs leading-relaxed">
                            <Info size={16} />
                            <p>O funil representa o fluxo vital do escritório, desde a prospecção inicial até o fechamento contratual.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Areas Ranking */}
                <div className="mt-8 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-brand-blue">Performance por Área Jurídica</h3>
                            <p className="text-gray-400 text-sm mt-1">Quais áreas estão gerando mais solicitações</p>
                        </div>
                    </div>
                    {stats.areas.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.areas}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" name="Contatos" radius={[10, 10, 0, 0]} barSize={50}>
                                    {stats.areas.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">Dados indisponíveis</div>
                    )}
                </div>
            </main>
        </div>
    );
}
