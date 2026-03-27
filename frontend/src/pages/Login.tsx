import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Lock, Mail, Hexagon } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signed } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (signed) {
        return <Navigate to="/" />;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Credenciais inválidas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] -left-[10%] w-[40rem] h-[40rem] bg-brand-silver/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-[20%] -right-[10%] w-[50rem] h-[50rem] bg-brand-surface rounded-full blur-[100px] pointer-events-none"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md mx-4 glass-panel p-10 relative z-10 before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/10 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:-z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                        className="relative mb-6"
                    >
                        {/* Custom SW Hexagon Logo Representation */}
                        <div className="relative flex items-center justify-center w-20 h-20">
                            <Hexagon size={80} strokeWidth={1} className="text-brand-silver absolute animate-glow" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-bold text-2xl tracking-tighter text-brand-silver ml-1">S<span className="text-brand-silver/70 -ml-1">W</span></span>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-2xl font-light tracking-[0.15em] text-brand-silver uppercase text-center leading-tight mb-2"
                    >
                        Schmidt &<br />Woloczyn
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-[0.65rem] font-medium text-brand-silver/40 tracking-[0.3em] uppercase"
                    >
                        Sociedade de Advogados
                    </motion.p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-500/20 text-center backdrop-blur-md"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-brand-silver/40 group-focus-within:text-brand-silver transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 glass-input text-sm"
                                placeholder="E-mail profissional"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-brand-silver/40 group-focus-within:text-brand-silver transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 glass-input text-sm"
                                placeholder="Senha"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        type="submit"
                        disabled={loading}
                        className="w-full glass-button py-3.5 px-4 flex items-center justify-center mt-8 uppercase text-xs tracking-widest font-semibold disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
                        ) : 'Acessar Portal'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
