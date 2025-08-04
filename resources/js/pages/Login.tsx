import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useState } from 'react';

export default function Login() {
    const [data, setData] = useState({ email: 'joaorizzont@hotmail.com', password: '123456' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onLogin = async () => {
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao fazer login');
            }

            localStorage.setItem('token', result.token);

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    const switchToRegister = () => {
        navigate('/cadastro');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-black via-gray-900 to-gray-800">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
                <img
                    src="/images/logo.jpeg"
                    alt="Logo M4"
                    className="mx-auto mb-6 w-32 h-auto"
                />

                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                    <Input
                        type="password"
                        placeholder="Senha"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                    <Button type="submit">Entrar</Button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Não tem conta?{' '}
                    <button
                        onClick={switchToRegister}
                        className="text-blue-600 hover:underline hover:cursor-pointer"
                        type="button"
                    >
                        Cadastre-se
                    </button>
                </p>
            </div>
        </div>

    );
}
