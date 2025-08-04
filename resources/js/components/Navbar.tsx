import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import { apiFetch } from '../utils/api';
import { clearToken } from '../utils/auth';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function getUser() {
            try {
                const user = await apiFetch<User>('/me');
                setUser(user);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                clearToken();
                navigate('/');
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, [navigate]);

    const logout = () => {
        clearToken();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow h-16">
            <div className="font-bold text-lg">M4</div>
            <ul className="flex space-x-6">
                <li>
                    <Link
                        to="/dashboard"
                        className={isActive('/dashboard') && !isActive('/dashboard/alunos') && !isActive('/dashboard/professores') && !isActive('/dashboard/planos') && !isActive('/dashboard/vencimentos') && !isActive('/dashboard/atividades')
                            ? 'text-blue-500'
                            : 'hover:text-gray-400'}
                    >
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard/alunos"
                        className={isActive('/dashboard/alunos') ? 'text-blue-500' : 'hover:text-gray-400'}
                    >
                        Alunos
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard/professores"
                        className={isActive('/dashboard/professores') ? 'text-blue-500' : 'hover:text-gray-400'}
                    >
                        Professores
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard/atividades"
                        className={isActive('/dashboard/atividades') ? 'text-blue-500' : 'hover:text-gray-400'}
                    >
                        Atividades
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard/planos"
                        className={isActive('/dashboard/planos') ? 'text-blue-500' : 'hover:text-gray-400'}
                    >
                        Planos
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard/vencimentos"
                        className={isActive('/dashboard/vencimentos') ? 'text-blue-500' : 'hover:text-gray-400'}
                    >
                        Vencimentos
                    </Link>
                </li>
            </ul>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
                Sair
            </button>
        </nav>
    );
}
