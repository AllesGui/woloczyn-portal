import { useState, useEffect } from 'react';
import { Plus, X, Search, Users, Phone, Map, Shield, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface Cliente {
    id: string;
    nome: string;
    telefone: string;
    area: string;
    status_triagem: string;
    created_at: string;
}

export default function ClientesList() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        nome: '',
        ddi: '+55',
        ddd: '',
        numero: '',
        area: 'Cível'
    });

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/clientes');
            setClientes(data);
        } catch (err) {
            console.error("Erro ao carregar clientes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const filteredClientes = clientes.filter(c => 
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.telefone.includes(searchTerm) ||
        c.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (cliente: Cliente) => {
        setEditingId(cliente.id);
        
        // Parse the formatted phone back to ddi, ddd, numero
        // Assuming format 55 DDD NNNNNNNNN
        let ddi = '+55';
        let ddd = '';
        let numero = cliente.telefone;
        
        if (cliente.telefone.startsWith('55') && cliente.telefone.length >= 12) {
            ddi = '+55';
            ddd = cliente.telefone.substring(2, 4);
            numero = cliente.telefone.substring(4);
        } else if (cliente.telefone.length >= 10) {
             ddd = cliente.telefone.substring(0, 2);
             numero = cliente.telefone.substring(2);
        }
        
        setFormData({
            nome: cliente.nome,
            ddi: ddi,
            ddd: ddd,
            numero: numero,
            area: cliente.area
        });
        setIsModalOpen(true);
    };

    const saveCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clean DDI to only numbers
        const cleanDdi = formData.ddi.replace(/\D/g, '');
        const cleanDdd = formData.ddd.replace(/\D/g, '');
        const cleanNumero = formData.numero.replace(/\D/g, '');
        
        const telefoneFormatado = `${cleanDdi}${cleanDdd}${cleanNumero}`;
        
        try {
            if (editingId) {
                const { data } = await api.put(`/clientes/${editingId}`, {
                    nome: formData.nome,
                    telefone: telefoneFormatado,
                    area: formData.area
                });
                setClientes(clientes.map(c => c.id === editingId ? data : c));
            } else {
                const { data } = await api.post('/clientes', {
                    nome: formData.nome,
                    telefone: telefoneFormatado,
                    area: formData.area
                });
                setClientes([data, ...clientes].sort((a, b) => Number(b.id) - Number(a.id)));
            }
            
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ nome: '', ddi: '+55', ddd: '', numero: '', area: 'Cível' });
        } catch (err) {
            alert("Erro ao salvar cliente.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-light text-brand-accent tracking-wide flex items-center gap-3">
                        Cartela de Clientes
                    </h2>
                    <p className="text-brand-silver/50 text-sm mt-2 tracking-wide font-medium">
                        Adicione clientes manualmente. A triagem será marcada como concluída para a IA.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-silver/40" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ nome: '', ddi: '+55', ddd: '', numero: '', area: 'Cível' });
                            setIsModalOpen(true);
                        }}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Plus size={18} />
                        Novo Cliente
                    </button>
                </div>
            </div>

            {/* List Grid */}
            <div className="glass-panel overflow-hidden flex-1 flex flex-col border border-white/5 shadow-2xl relative z-10 p-6">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-2 border-brand-silver/20 border-t-brand-silver rounded-full animate-spin mb-4"></div>
                        <p className="text-brand-silver/30 text-xs font-bold uppercase tracking-widest">Carregando...</p>
                    </div>
                ) : filteredClientes.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                        <Users size={48} className="text-brand-silver/20 mb-4" />
                        <p className="text-brand-silver/50 text-sm uppercase tracking-widest font-bold">Nenhum cliente encontrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar">
                        <AnimatePresence>
                            {filteredClientes.map(cliente => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={cliente.id} 
                                    className="p-5 border border-white/5 rounded-2xl bg-black/20 hover:bg-white/5 transition-all group flex flex-col gap-3"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white tracking-wide">{cliente.nome}</span>
                                            <span className="text-[10px] text-brand-silver/40 mt-0.5">ID: {cliente.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-1 bg-white/10 text-[10px] font-bold text-brand-silver uppercase tracking-widest rounded-lg border border-white/5">
                                                {cliente.area}
                                            </div>
                                            <button 
                                                onClick={() => openEditModal(cliente)}
                                                className="p-1.5 text-brand-silver/40 hover:text-brand-accent hover:bg-white/5 rounded-md transition-colors"
                                                title="Editar Cliente"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-brand-silver/60 text-sm mt-2">
                                        <Phone size={14} />
                                        <span>{cliente.telefone}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest">
                                            <Shield size={12} />
                                            Triagem {cliente.status_triagem}
                                        </div>
                                        <div className="text-[10px] text-brand-silver/30">
                                            {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-brand-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-brand-background">
                            <h3 className="text-sm font-bold text-brand-accent tracking-widest uppercase">
                                {editingId ? 'Editar Cliente' : 'Adicionar Cliente'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-brand-silver/50 hover:text-white transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveCliente} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={e => setFormData({...formData, nome: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input"
                                    placeholder="Ex: João da Silva"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Telefone</label>
                                <div className="flex gap-2">
                                    <div className="w-1/3 md:w-1/4">
                                        <select
                                            value={formData.ddi}
                                            onChange={e => setFormData({...formData, ddi: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-2 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm appearance-none glass-input cursor-pointer"
                                        >
                                            <option value="+55" className="bg-[#172229] text-white">🇧🇷 +55</option>
                                            <option value="+351" className="bg-[#172229] text-white">🇵🇹 +351</option>
                                            <option value="+1" className="bg-[#172229] text-white">🇺🇸 +1</option>
                                        </select>
                                    </div>
                                    <div className="w-1/4 md:w-1/5">
                                        <input
                                            type="text"
                                            required
                                            value={formData.ddd}
                                            onChange={e => setFormData({...formData, ddd: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input text-center"
                                            placeholder="DDD"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            required
                                            value={formData.numero}
                                            onChange={e => setFormData({...formData, numero: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input"
                                            placeholder="Ex: 999999999"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Área de Processo</label>
                                <select
                                    value={formData.area}
                                    onChange={e => setFormData({...formData, area: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm appearance-none glass-input cursor-pointer"
                                >
                                    <option value="Trabalhista" className="bg-[#172229] text-white">Trabalhista</option>
                                    <option value="Cível" className="bg-[#172229] text-white">Cível</option>
                                    <option value="Previdenciário" className="bg-[#172229] text-white">Previdenciário</option>
                                    <option value="Família" className="bg-[#172229] text-white">Família</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-all mt-6 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                {editingId ? 'Salvar Alterações' : 'Salvar Cliente'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
}
