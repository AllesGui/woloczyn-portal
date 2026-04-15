import { X, Clock, Tag, Phone, CheckCircle2, RotateCcw, Calendar, Hexagon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

interface ModalProps {
    atendimento: Atendimento;
    onClose: () => void;
    onFinalizar?: (id: string) => void;
    onReabrir?: (id: string) => void;
}

export default function AtendimentoModal({ atendimento, onClose, onFinalizar, onReabrir }: ModalProps) {
    const isPendente = atendimento.status === 'pendente';
    
    // Extrair número do WhatsApp JID (ex: 555196723396@s.whatsapp.net -> 555196723396)
    // telegram_chat_id armazena o JID do WhatsApp (ex: 555196723396@s.whatsapp.net)
    const whatsappNumber = atendimento.telegram_chat_id?.split('@')[0] || atendimento.telefone;

    const priorityColors: Record<string, string> = {
        'Alta': 'bg-red-500/10 text-red-400 border-red-500/20',
        'Media': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Média': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Baixa': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    const priorityDot: Record<string, string> = {
        'Alta': 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
        'Media': 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]',
        'Média': 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]',
        'Baixa': 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    };

    const priorityBadge = priorityColors[atendimento.prioridade] || 'bg-brand-silver/10 text-brand-silver border-brand-silver/20';

    const openWhatsApp = () => window.open(`https://wa.me/${whatsappNumber}`, '_blank');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                ></motion.div>

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <Hexagon size={300} strokeWidth={0.2} className="absolute -left-20 -top-20 text-brand-silver/5 rotate-12 pointer-events-none" />

                    {/* Header */}
                    <div className="relative border-b border-white/10 bg-white/5 p-6 flex items-start justify-between z-10 shrink-0">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xl font-bold text-brand-accent tracking-tight">{atendimento.nome}</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${priorityBadge} uppercase tracking-widest`}>
                                    {atendimento.prioridade}
                                </span>
                                <span className="text-brand-silver/60 text-xs flex items-center gap-1.5 font-medium tracking-wide">
                                    <Tag size={12} />
                                    {atendimento.area_juridica}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 text-brand-silver/60 hover:text-brand-accent rounded-xl transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-8 overflow-y-auto relative z-10">
                        {/* Summary */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h4 className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon size={10} /> Resumo Gerado pela IA
                            </h4>
                            <div className="bg-black/30 rounded-2xl p-5 border border-white/5 shadow-inner">
                                <p className="text-sm text-brand-silver/80 leading-relaxed whitespace-pre-wrap">{atendimento.resumo}</p>
                            </div>
                        </motion.div>

                        {/* Contact */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h4 className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon size={10} /> Ações de Contato
                            </h4>
                            <div className="flex gap-3">
                                <button onClick={openWhatsApp} className="flex items-center justify-center gap-2 flex-1 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 px-4 py-3 rounded-xl font-medium text-sm transition-colors shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                    <Phone size={16} />
                                    Abrir Conversa no WhatsApp
                                </button>
                            </div>
                        </motion.div>

                        {/* Details Grid */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h4 className="text-[10px] font-bold text-brand-silver/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon size={10} /> Detalhes do Registro
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-brand-silver/50 mb-1.5">
                                        <Calendar size={14} />
                                        <span className="text-[10px] uppercase tracking-wider font-semibold">Data de Contato</span>
                                    </div>
                                    <p className="text-sm font-medium text-brand-accent">
                                        {format(new Date(atendimento.data_criacao), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                    </p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-brand-silver/50 mb-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${priorityDot[atendimento.prioridade] || 'bg-gray-400'}`}></div>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold">Prioridade</span>
                                    </div>
                                    <p className="text-sm font-medium text-brand-accent">{atendimento.prioridade}</p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-brand-silver/50 mb-1.5">
                                        <Tag size={14} />
                                        <span className="text-[10px] uppercase tracking-wider font-semibold">Área Jurídica</span>
                                    </div>
                                    <p className="text-sm font-medium text-brand-accent">{atendimento.area_juridica}</p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-brand-silver/50 mb-1.5">
                                        <Clock size={14} />
                                        <span className="text-[10px] uppercase tracking-wider font-semibold">Status</span>
                                    </div>
                                    <p className={`text-sm font-medium ${isPendente ? 'text-orange-400' : 'text-emerald-400'}`}>
                                        {isPendente ? 'Pendente' : 'Atendido'}
                                    </p>
                                </div>

                                {atendimento.data_finalizacao && (
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 col-span-2">
                                        <div className="flex items-center gap-2 text-brand-silver/50 mb-1.5">
                                            <CheckCircle2 size={14} />
                                            <span className="text-[10px] uppercase tracking-wider font-semibold">Data de Finalização</span>
                                        </div>
                                        <p className="text-sm font-medium text-emerald-400">
                                            {format(new Date(atendimento.data_finalizacao), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-white/10 bg-black/20 p-5 flex justify-end gap-3 shrink-0 z-10 w-full backdrop-blur-md">
                        {isPendente && onFinalizar ? (
                            <button
                                onClick={() => { onFinalizar(atendimento.id); onClose(); }}
                                className="flex items-center gap-2 bg-white/10 text-brand-accent border border-white/10 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                            >
                                <CheckCircle2 size={16} />
                                Marcar como Atendido
                            </button>
                        ) : onReabrir ? (
                            <button
                                onClick={() => { onReabrir(atendimento.id); onClose(); }}
                                className="flex items-center gap-2 bg-white/10 text-brand-accent border border-white/10 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all"
                            >
                                <RotateCcw size={16} />
                                Reabrir como Pendente
                            </button>
                        ) : null}
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase text-brand-silver/60 hover:bg-white/5 hover:text-brand-silver transition-colors">
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
