import { Clock, Phone, Tag, CheckCircle2, Send, RotateCcw, Eye } from 'lucide-react';
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

interface CardProps {
    atendimento: Atendimento;
    onFinalizar?: (id: string) => void;
    onReabrir?: (id: string) => void;
    onOpenDetail?: (atendimento: Atendimento) => void;
}

export default function AtendimentoCard({ atendimento, onFinalizar, onReabrir, onOpenDetail }: CardProps) {
    const isPendente = atendimento.status === 'pendente';

    const priorityColors: Record<string, string> = {
        'Alta': 'bg-red-50 text-red-700 border-red-200',
        'Media': 'bg-orange-50 text-orange-700 border-orange-200',
        'Média': 'bg-orange-50 text-orange-700 border-orange-200',
        'Baixa': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    const priorityBadge = priorityColors[atendimento.prioridade] || 'bg-gray-50 text-gray-700 border-gray-200';

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
        <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group hover:-translate-y-1 duration-300 cursor-pointer"
            onClick={() => onOpenDetail && onOpenDetail(atendimento)}
        >
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h3 className="text-lg font-semibold text-brand-blue group-hover:text-brand-gold transition-colors">{atendimento.nome}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {hasTelegram ? (
                            <button
                                onClick={openTelegram}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors group/btn bg-gray-50 px-3 py-1.5 rounded-lg w-max"
                            >
                                <Send size={14} className="group-hover/btn:text-blue-500" />
                                Telegram
                            </button>
                        ) : (
                            <button
                                onClick={openWhatsApp}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors group/btn bg-gray-50 px-3 py-1.5 rounded-lg w-max"
                            >
                                <Phone size={14} className="group-hover/btn:text-green-500" />
                                WhatsApp
                            </button>
                        )}
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityBadge} uppercase tracking-wide`}>
                    {atendimento.prioridade}
                </span>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold bg-brand-gold/10 w-max px-2.5 py-1 rounded mb-3">
                    <Tag size={12} />
                    {atendimento.area_juridica}
                </div>
                <div className="bg-brand-background rounded-xl p-4 border border-gray-100/50">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {atendimento.resumo}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock size={14} />
                    {format(new Date(isPendente ? atendimento.data_criacao : (atendimento.data_finalizacao || atendimento.data_criacao)), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(atendimento); }}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-brand-blue py-1.5 px-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Eye size={14} />
                        Ver
                    </button>

                    {isPendente && onFinalizar ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onFinalizar(atendimento.id); }}
                            className="flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-gold transition-colors py-1.5 px-3 rounded-lg hover:bg-brand-gold/10"
                        >
                            <CheckCircle2 size={16} />
                            Atendido
                        </button>
                    ) : onReabrir ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onReabrir(atendimento.id); }}
                            className="flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-orange-50"
                        >
                            <RotateCcw size={16} />
                            Reabrir
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
