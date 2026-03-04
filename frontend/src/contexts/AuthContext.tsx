import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextData {
    signed: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('@woloczyn:user');
        const storedToken = localStorage.getItem('@woloczyn:token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }

        setLoading(false);
    }, []);

    async function login(email: string, password: string) {
        const response = await api.post('/auth/login', { email, password });

        const { user, token } = response.data;

        localStorage.setItem('@woloczyn:user', JSON.stringify(user));
        localStorage.setItem('@woloczyn:token', token);

        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(user);
    }

    function logout() {
        localStorage.removeItem('@woloczyn:user');
        localStorage.removeItem('@woloczyn:token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
