import { useEffect, useState } from 'react';
import { getToken, clearToken } from '../../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { User } from '../../types/User';

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) {
        return <p>Carregando usuário...</p>;
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="font-bold text-lg">M4</div>
                <ul className="flex space-x-6">
                    <li>
                        <Link
                            to="/dashboard/alunos"
                            className="hover:text-gray-400"
                        >
                            Alunos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/planos"
                            className="hover:text-gray-400"
                        >
                            Planos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/vencimentos"
                            className="hover:text-gray-400"
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

            {/* Conteúdo */}
            <main className="p-6">
                {user ? (
                    <div className="space-y-2">
                        <p>
                            Bem-vindo, <strong>{user.name}</strong>!
                        </p>
                        <p>Email: {user.email}</p>
                    </div>
                ) : (
                    <p>Usuário não encontrado</p>
                )}
            </main>
        </div>
    );
}
