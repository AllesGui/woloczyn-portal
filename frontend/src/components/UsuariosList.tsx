import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Shield, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Usuario {
    id: string;
    name: string;
    email: string;
    created_at: string;
    locked_until: string | null;
}

export default function UsuariosList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', must_change_password: true });

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    const saveUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/usuarios/${editingId}`, formData);
            } else {
                await api.post('/usuarios', formData);
            }
            loadUsuarios();
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', email: '', password: '', must_change_password: true });
        } catch (err: any) {
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert("Erro ao salvar usuário.");
            }
        }
    };

    const deleteUsuario = async (id: string, name: string) => {
        if (!confirm(`Deseja realmente remover o usuário ${name}?`)) return;
        try {
            await api.delete(`/usuarios/${id}`);
            loadUsuarios();
        } catch (error) {
            alert("Erro ao excluir usuário.");
        }
    };

    const unlockUsuario = async (id: string, name: string) => {
        if (!confirm(`Deseja desbloquear a conta de ${name}?`)) return;
        try {
            const user = usuarios.find(u => u.id === id);
            await api.put(`/usuarios/${id}`, { name: user?.name, email: user?.email, unlock: true });
            loadUsuarios();
        } catch (error) {
            alert("Erro ao desbloquear usuário.");
        }
    };

    const openEdit = (user: Usuario) => {
        setEditingId(user.id);
        setFormData({ name: user.name, email: user.email, password: '', must_change_password: false });
        setIsModalOpen(true);
    };

    const isLocked = (locked_until: string | null) => {
        if (!locked_until) return false;
        return new Date(locked_until) > new Date();
    };

    const filteredUsuarios = usuarios.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full animate-fade-in pb-20">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-3xl font-light text-brand-accent tracking-wide flex items-center gap-3">
                        <Shield size={28} className="text-brand-silver" />
                        Gestão de Usuários
                    </h2>
                    <p className="text-brand-silver/50 text-sm mt-2 tracking-wide font-medium">
                        Adicione novos membros, altere permissões e desbloqueie contas.
                    </p>
                </motion.div>
                <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', email: '', password: '', must_change_password: true });
                        setIsModalOpen(true);
                    }}
                    className="glass-button px-6 py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-bold whitespace-nowrap"
                >
                    <Plus size={18} /> Novo Usuário
                </motion.button>
            </header>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-5 items-center flex gap-5 mb-8">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-silver/40" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 glass-input text-sm"
                    />
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <div className="w-8 h-8 border-2 border-brand-silver/20 border-t-brand-silver rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredUsuarios.map(user => {
                        const locked = isLocked(user.locked_until);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={user.id} 
                                className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-silver font-bold text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium text-lg flex items-center gap-2">
                                            {user.name} 
                                            {locked ? (
                                                <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 uppercase tracking-wider font-bold flex items-center gap-1"><Lock size={10} /> Bloqueado</span>
                                            ) : (
                                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Ativo</span>
                                            )}
                                        </h3>
                                        <p className="text-brand-silver/60 text-sm mt-0.5">{user.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 sm:ml-auto">
                                    {locked && (
                                        <button onClick={() => unlockUsuario(user.id, user.name)} className="p-2.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 rounded-xl transition-colors" title="Desbloquear Conta">
                                            <Unlock size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => openEdit(user)} className="p-2.5 bg-white/5 text-brand-silver/60 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/10 rounded-xl transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => deleteUsuario(user.id, user.name)} className="p-2.5 bg-white/5 text-brand-silver/60 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 rounded-xl transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass-panel w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="border-b border-white/10 bg-white/5 p-6 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-brand-accent tracking-tight">{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 text-brand-silver/60 hover:text-white rounded-xl transition-colors"><X size={20} /></button>
                            </div>
                            
                            <form onSubmit={saveUsuario} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver outline-none text-sm glass-input" placeholder="Ex: João Silva" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2 ml-1">E-mail Profissional</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver outline-none text-sm glass-input" placeholder="Ex: joao@woloczyn.com.br" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2 ml-1">
                                        {editingId ? 'Nova Senha (deixe em branco para manter)' : 'Senha de Acesso'}
                                    </label>
                                    <input type="password" required={!editingId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver outline-none text-sm glass-input" placeholder="Mínimo 6 caracteres (Letras, Números e Símbolos)" />
                                    <p className="text-[10px] text-brand-silver/40 mt-2 px-1">A senha deve ter no mínimo 6 caracteres, contendo letras, números e caracteres especiais.</p>
                                </div>

                                {!editingId && (
                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-black/30 group-hover:border-brand-silver/50 transition-colors">
                                                <input type="checkbox" checked={formData.must_change_password} onChange={e => setFormData({...formData, must_change_password: e.target.checked})} className="opacity-0 absolute inset-0 cursor-pointer" />
                                                {formData.must_change_password && <CheckCircle2 size={14} className="text-brand-accent absolute pointer-events-none" />}
                                            </div>
                                            <span className="text-sm text-brand-silver/80 group-hover:text-white transition-colors">Forçar troca de senha no primeiro acesso</span>
                                        </label>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-brand-silver/60 hover:bg-white/5 hover:text-white transition-colors">Cancelar</button>
                                    <button type="submit" className="glass-button px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2">Salvar Usuário</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
