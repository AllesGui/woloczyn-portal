import { X, Clock, Tag, Send, Phone, CheckCircle2, RotateCcw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    const hasTelegram = !!atendimento.telegram_chat_id;

    const priorityColors: Record<string, string> = {
        'Alta': 'bg-red-50 text-red-700 border-red-200',
        'Media': 'bg-orange-50 text-orange-700 border-orange-200',
        'Média': 'bg-orange-50 text-orange-700 border-orange-200',
        'Baixa': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    const priorityDot: Record<string, string> = {
        'Alta': 'bg-red-500',
        'Media': 'bg-orange-500',
        'Média': 'bg-orange-500',
        'Baixa': 'bg-emerald-500',
    };

    const priorityBadge = priorityColors[atendimento.prioridade] || 'bg-gray-50 text-gray-700 border-gray-200';

    const openTelegram = () => window.open(`https://web.telegram.org/k/#${atendimento.telegram_chat_id}`, '_blank');
    const openWhatsApp = () => window.open(`https://wa.me/${atendimento.telefone}`, '_blank');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Modal */}
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-brand-blue text-white p-6 rounded-t-3xl flex items-start justify-between z-10">
                    <div className="flex-1 pr-4">
                        <h2 className="text-xl font-bold">{atendimento.nome}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${priorityBadge} uppercase tracking-wide`}>
                                {atendimento.prioridade}
                            </span>
                            <span className="text-white/60 text-xs flex items-center gap-1">
                                <Tag size={12} />
                                {atendimento.area_juridica}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contato</h4>
                        <div className="flex gap-3">
                            {hasTelegram ? (
                                <button onClick={openTelegram} className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
                                    <Send size={16} />
                                    Abrir no Telegram
                                </button>
                            ) : (
                                <button onClick={openWhatsApp} className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
                                    <Phone size={16} />
                                    Abrir no WhatsApp
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resumo da IA</h4>
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{atendimento.resumo}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalhes</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium">Data de Contato</span>
                                </div>
                                <p className="text-sm font-semibold text-brand-blue">
                                    {format(new Date(atendimento.data_criacao), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${priorityDot[atendimento.prioridade] || 'bg-gray-400'}`}></div>
                                    <span className="text-xs font-medium">Prioridade</span>
                                </div>
                                <p className="text-sm font-semibold text-brand-blue">{atendimento.prioridade}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Tag size={14} />
                                    <span className="text-xs font-medium">Área Jurídica</span>
                                </div>
                                <p className="text-sm font-semibold text-brand-blue">{atendimento.area_juridica}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Clock size={14} />
                                    <span className="text-xs font-medium">Status</span>
                                </div>
                                <p className={`text-sm font-semibold ${isPendente ? 'text-orange-600' : 'text-green-600'}`}>
                                    {isPendente ? 'Pendente' : 'Atendido'}
                                </p>
                            </div>

                            {atendimento.data_finalizacao && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <CheckCircle2 size={14} />
                                        <span className="text-xs font-medium">Data de Finalização</span>
                                    </div>
                                    <p className="text-sm font-semibold text-green-600">
                                        {format(new Date(atendimento.data_finalizacao), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 rounded-b-3xl flex justify-end gap-3">
                    {isPendente && onFinalizar ? (
                        <button
                            onClick={() => { onFinalizar(atendimento.id); onClose(); }}
                            className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors"
                        >
                            <CheckCircle2 size={16} />
                            Marcar como Atendido
                        </button>
                    ) : onReabrir ? (
                        <button
                            onClick={() => { onReabrir(atendimento.id); onClose(); }}
                            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
                        >
                            <RotateCcw size={16} />
                            Reabrir como Pendente
                        </button>
                    ) : null}
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                        Fechar
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
