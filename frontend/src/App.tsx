// Build Version: 1.0.1 - Update branding to Schmidt & Woloczyn
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import LandingBpcLoas from './pages/LandingBpcLoas';
import LandingInsalubridade from './pages/LandingInsalubridade';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { signed, loading } = useContext(AuthContext);

    if (loading) return <div className="h-screen flex items-center justify-center bg-brand-background text-brand-blue">Carregando...</div>;

    return signed ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/landingpage/bpc-loas" element={<LandingBpcLoas />} />
                    <Route path="/landingpage/insalubridade" element={<LandingInsalubridade />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <PrivateRoute>
                                <Analytics />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
