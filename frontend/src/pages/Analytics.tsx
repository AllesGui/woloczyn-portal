import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell
} from 'recharts';
import {
    ArrowLeft, Clock,
    CalendarDays, Target, Zap, Wallet,
    ArrowUpRight, Info, Hexagon
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

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

const COLORS = ['#e5e7eb', '#9ca3af', '#d1d5db', '#6b7280', '#f3f4f6', '#4b5563'];

export default function Analytics() {
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
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center">
                        <Hexagon size={64} strokeWidth={0.5} className="text-brand-silver animate-[spin_4s_linear_infinite]" />
                        <div className="w-8 h-8 rounded-full border-t-2 border-brand-accent animate-spin absolute"></div>
                    </div>
                    <p className="text-brand-silver/50 font-medium tracking-[0.2em] uppercase text-xs animate-pulse">Carregando inteligência...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-brand-background flex items-center justify-center">
                <p className="text-brand-silver/40 tracking-wider">Sem dados operacionais para análise</p>
            </div>
        );
    }

    const dailyFormatted = stats.daily.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }));

    const funnelData = [
        { name: 'Contatos', value: stats.summary.total, fill: '#ffffff' },
        { name: 'Em Triagem', value: stats.summary.pending, fill: '#9ca3af' },
        { name: 'Convertidos', value: stats.summary.attended, fill: '#4b5563' },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        }).format(value);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-brand-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-silver/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-silver/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Header */}
            <header className="relative z-10 p-6 lg:p-10 border-b border-white/5 bg-brand-background backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/5 text-brand-silver group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-light text-brand-accent tracking-wide">Inteligência Operacional</h1>
                            </div>
                            <p className="text-brand-silver/50 text-sm mt-1 font-medium tracking-wide">Análise de performance e potencial jurídico da banca.</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <img 
                            src="/logo.png" 
                            alt="Schmidt & Woloczyn" 
                            className="w-32 object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="h-8 w-px bg-white/10"></div>
                        <span className="text-[10px] text-brand-silver/40 font-bold tracking-[0.2em] uppercase">Analytics</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-10 relative z-10">
                {/* Advanced KPI Cards */}
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 will-change-auto">
                    {/* Potential Value */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                            <Wallet size={100} className="text-brand-silver" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-brand-silver/60 font-bold text-xs mb-4 uppercase tracking-widest">
                                <Wallet size={16} />
                                Potencial de Carteira
                            </div>
                            <p className="text-3xl font-light text-brand-accent mb-2 tracking-tight">
                                {formatCurrency(stats.summary.potentialValue ?? 0)}
                            </p>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 border border-emerald-500/20 w-fit px-3 py-1.5 rounded-full uppercase tracking-widest">
                                <ArrowUpRight size={12} />
                                Estimativa Gerencial
                            </div>
                        </div>
                    </motion.div>

                    {/* Conversion Rate */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                            <Target size={100} className="text-brand-silver" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-brand-silver/60 font-bold text-xs mb-4 uppercase tracking-widest">
                                <Target size={16} />
                                Taxa de Conversão
                            </div>
                            <p className="text-3xl font-light text-brand-accent mb-2 tracking-tight">
                                {stats.summary.conversionRate ?? 0}%
                            </p>
                            <p className="text-brand-silver/40 text-xs font-medium tracking-wide">Contatos convertidos em atendimentos</p>
                        </div>
                    </motion.div>

                    {/* Efficiency */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                            <Zap size={100} className="text-brand-silver" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-brand-silver/60 font-bold text-xs mb-4 uppercase tracking-widest">
                                <Zap size={16} />
                                Eficiência Média
                            </div>
                            <p className="text-3xl font-light text-brand-accent mb-2 tracking-tight">
                                {stats.summary.avgResponseHours ?? 0}h
                            </p>
                            <p className="text-brand-silver/40 text-xs font-medium tracking-wide">Tempo médio para finalização</p>
                        </div>
                    </motion.div>

                    {/* Funnel Recap */}
                    <motion.div variants={itemVariants} className="glass-panel bg-white/5 border border-white/20 p-8 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                        <div className="flex flex-col h-full justify-between">
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-brand-silver/60 text-[10px] font-bold uppercase tracking-widest">
                                    <span>Funil de hoje</span>
                                    <Clock size={14} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-brand-silver/80 text-sm font-medium">Total Contatos</span>
                                        <span className="text-brand-accent text-xl font-light">{stats.summary.total}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-brand-silver h-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-brand-silver/80 text-sm font-medium">Convertidos</span>
                                        <span className="text-brand-silver text-xl font-light">{stats.summary.attended}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-400/80 h-full" style={{ width: `${stats.summary.conversionRate}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-8 will-change-auto">
                    {/* Main Chart: Volume Trend */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-8 lg:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-light text-brand-accent tracking-wide flex items-center gap-3">
                                <Hexagon size={18} className="text-brand-silver/40"/>
                                Tendência de Volume
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-silver/60 bg-white/5 border border-white/10 px-4 py-2 rounded-xl uppercase tracking-widest">
                                <CalendarDays size={14} />
                                ÚLTIMOS 30 DIAS
                            </div>
                        </div>
                        {dailyFormatted.length > 0 ? (
                            <div className="w-full h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailyFormatted}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                            tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                                backdropFilter: 'blur(12px)',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                padding: '12px 16px',
                                                color: '#e2e8f0'
                                            }}
                                            itemStyle={{ color: '#fff', fontWeight: 600 }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#ffffff" strokeWidth={3} fill="url(#colorCount)" name="Leads" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[320px] flex items-center justify-center text-brand-silver/40">Aguardando novos leads...</div>
                        )}
                    </motion.div>

                    {/* Funnel Visual */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 lg:p-10 flex flex-col">
                        <h3 className="text-xl font-light text-brand-accent tracking-wide flex items-center gap-3 mb-8">
                            <Hexagon size={18} className="text-brand-silver/40"/>
                            Funil de Conversão
                        </h3>
                        <div className="flex-1 w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData} layout="vertical" barSize={24} margin={{ left: 0, right: 30, top: 20, bottom: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={90}
                                        tick={{ fill: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 11 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{ 
                                            borderRadius: '12px', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                            backdropFilter: 'blur(12px)',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                                        {funnelData.map((entry, index) => (
                                            <Cell key={index} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3 text-brand-silver/40 italic text-xs leading-relaxed">
                            <Info size={16} className="shrink-0" />
                            <p>O funil representa o fluxo vital do escritório, desde a prospecção inicial até o fechamento contratual.</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Row: Areas Ranking */}
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="mt-8 glass-panel p-8 lg:p-10 mb-10 will-change-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-light text-brand-accent tracking-wide flex items-center gap-3">
                                <Hexagon size={18} className="text-brand-silver/40"/>
                                Performance por Área Jurídica
                            </h3>
                            <p className="text-brand-silver/40 text-sm mt-2 font-medium tracking-wide">Volume absoluto de solicitações segmentado por especialidade</p>
                        </div>
                    </div>
                    {stats.areas.length > 0 ? (
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.areas} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 500 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{ 
                                            borderRadius: '16px', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                            backdropFilter: 'blur(12px)',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="count" name="Contatos" radius={[8, 8, 0, 0]} barSize={40}>
                                        {stats.areas.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-brand-silver/40">Dados indisponíveis</div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
