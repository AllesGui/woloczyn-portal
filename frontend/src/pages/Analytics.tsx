import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { ArrowLeft, Users, Clock, CheckCircle2, TrendingUp, CalendarDays, BarChart3 } from 'lucide-react';

interface Stats {
    summary: {
        total: number;
        pending: number;
        attended: number;
        thisWeek: number;
        thisMonth: number;
    };
    daily: { date: string; count: number }[];
    areas: { area: string; count: number }[];
    priorities: { priority: string; count: number }[];
}

const COLORS = ['#0a1d37', '#c9a15b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'];
const PRIORITY_COLORS: Record<string, string> = {
    'Alta': '#ef4444',
    'Media': '#f59e0b',
    'Média': '#f59e0b',
    'Baixa': '#10b981',
};

export default function Analytics() {
    const { user } = useContext(AuthContext);
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
            <div className="min-h-screen bg-brand-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-brand-background flex items-center justify-center">
                <p className="text-gray-500">Sem dados disponíveis</p>
            </div>
        );
    }

    const dailyFormatted = stats.daily.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }));

    return (
        <div className="min-h-screen bg-brand-background">
            {/* Header */}
            <header className="bg-brand-blue text-white p-6 shadow-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 size={22} className="text-brand-gold" />
                                Painel de Métricas
                            </h1>
                            <p className="text-white/50 text-sm mt-0.5">Visão geral do desempenho</p>
                        </div>
                    </div>
                    <p className="text-sm text-white/40">{user?.name}</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Total de Contatos', value: stats.summary.total, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
                        { label: 'Pendentes', value: stats.summary.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'Atendidos', value: stats.summary.attended, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Esta Semana', value: stats.summary.thisWeek, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Este Mês', value: stats.summary.thisMonth, icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map(card => (
                        <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                            <card.icon size={20} className={`${card.color} mb-2`} />
                            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                            <p className="text-xs text-gray-500 font-medium mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daily Trend */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-semibold text-brand-blue mb-4">Contatos por Dia (Últimos 30 dias)</h3>
                        {dailyFormatted.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={dailyFormatted}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c9a15b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#c9a15b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ color: '#0a1d37', fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#c9a15b" strokeWidth={2.5} fill="url(#colorCount)" name="Contatos" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">Sem dados no período</div>
                        )}
                    </div>

                    {/* Priority Pie */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-semibold text-brand-blue mb-4">Distribuição por Prioridade</h3>
                        {stats.priorities.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={stats.priorities}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="count"
                                        nameKey="priority"
                                    >
                                        {stats.priorities.map((entry, index) => (
                                            <Cell key={index} fill={PRIORITY_COLORS[entry.priority] || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">Sem dados</div>
                        )}
                    </div>
                </div>

                {/* Areas Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-brand-blue mb-4">Assuntos Mais Procurados</h3>
                    {stats.areas.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.areas} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <YAxis dataKey="area" type="category" width={120} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" name="Contatos" radius={[0, 8, 8, 0]} barSize={28}>
                                    {stats.areas.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Sem dados</div>
                    )}
                </div>
            </main>
        </div>
    );
}
