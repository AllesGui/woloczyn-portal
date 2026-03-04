import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Scale, Lock, Mail } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

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
            {/* Abstract Background Design */}
            <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md mx-4 glass p-10 rounded-2xl relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-blue rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-brand-blue/30 text-brand-gold">
                        <Scale size={32} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-blue uppercase">woloczyn e Schmidt</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Portal de Triagem Jurídica</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all outline-none"
                                placeholder="advogado@woloczyn.com.br"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-brand-blue/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-6 uppercase text-sm tracking-wide"
                    >
                        {loading ? 'Acessando...' : 'Entrar no Portal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
