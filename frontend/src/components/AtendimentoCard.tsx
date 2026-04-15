import { Clock, Phone, Tag, CheckCircle2, Send, RotateCcw, Eye, Hexagon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { memo } from 'react';

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

interface CardProps {
    atendimento: Atendimento;
    onFinalizar?: (id: string) => void;
    onReabrir?: (id: string) => void;
    onOpenDetail?: (atendimento: Atendimento) => void;
}

export default memo(function AtendimentoCard({ atendimento, onFinalizar, onReabrir, onOpenDetail }: CardProps) {
    const isPendente = atendimento.status === 'pendente';

    const priorityColors: Record<string, string> = {
        'Alta': 'bg-red-500/10 text-red-400 border-red-500/20',
        'Media': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Média': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Baixa': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    const priorityBadge = priorityColors[atendimento.prioridade] || 'bg-brand-silver/10 text-brand-silver border-brand-silver/20';
    const hasTelegram = !!atendimento.telegram_chat_id;

    const openTelegram = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://web.telegram.org/k/#${atendimento.telegram_chat_id}`, '_blank');
    };

    const openWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://wa.me/${atendimento.telefone}`, '_blank');
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="glass-panel p-6 hover:shadow-[0_0_30px_rgba(165,172,184,0.05)] transition-all group hover:-translate-y-1 duration-300 cursor-pointer relative overflow-hidden will-change-auto"
            onClick={() => onOpenDetail && onOpenDetail(atendimento)}
        >
            {/* Subtle background hexagon texture */}
            <Hexagon size={160} strokeWidth={0.5} className="absolute -right-10 -top-10 text-white/5 rotate-12 pointer-events-none" />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex-1 pr-4">
                    <h3 className="text-lg font-semibold text-brand-accent group-hover:text-brand-silver transition-colors tracking-tight">{atendimento.nome}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        {hasTelegram ? (
                            <button
                                onClick={openTelegram}
                                className="flex items-center gap-2 text-xs font-medium text-brand-silver/50 hover:text-blue-400 transition-colors group/btn bg-white/5 hover:bg-white/10 border border-white/5 py-1 px-2.5 rounded-lg w-max"
                            >
                                <Send size={12} className="group-hover/btn:text-blue-400" />
                                Telegram
                            </button>
                        ) : (
                            <button
                                onClick={openWhatsApp}
                                className="flex items-center gap-2 text-xs font-medium text-brand-silver/50 hover:text-green-400 transition-colors group/btn bg-white/5 hover:bg-white/10 border border-white/5 py-1 px-2.5 rounded-lg w-max"
                            >
                                <Phone size={12} className="group-hover/btn:text-green-400" />
                                WhatsApp
                            </button>
                        )}
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${priorityBadge} uppercase tracking-widest`}>
                    {atendimento.prioridade}
                </span>
            </div>

            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-silver bg-white/5 border border-white/5 w-max px-2.5 py-1 rounded-md mb-3 tracking-wide">
                    <Tag size={12} />
                    {atendimento.area_juridica}
                </div>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5 shadow-inner">
                    <p className="text-sm text-brand-silver/70 leading-relaxed line-clamp-3">
                        {atendimento.resumo}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-brand-silver/40 font-medium">
                    <Clock size={12} />
                    {format(new Date(isPendente ? atendimento.data_criacao : (atendimento.data_finalizacao || atendimento.data_criacao)), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(atendimento); }}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand-silver/50 hover:text-brand-accent py-1.5 px-2.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <Eye size={14} />
                        Ver
                    </button>

                    {isPendente && onFinalizar ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onFinalizar(atendimento.id); }}
                            className="flex items-center gap-2 text-xs font-semibold text-emerald-400/80 hover:text-emerald-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-emerald-400/10"
                        >
                            <CheckCircle2 size={16} />
                            Atendido
                        </button>
                    ) : onReabrir ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onReabrir(atendimento.id); }}
                            className="flex items-center gap-2 text-xs font-semibold text-brand-silver/80 hover:text-brand-accent transition-colors py-1.5 px-3 rounded-lg hover:bg-white/10"
                        >
                            <RotateCcw size={14} />
                            Reabrir
                        </button>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
});
