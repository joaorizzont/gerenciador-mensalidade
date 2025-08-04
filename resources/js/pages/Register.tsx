import { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [data, setData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/api/register', data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            window.location.href = '/';
        } catch (err) {
            console.log(err)
            const message =
                err.response?.data?.message || 'Erro ao registrar. Tente novamente.';
            setError(message);
        }
    };


    const switchToLogin = () => {
        navigate('/');
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-black via-gray-900 to-gray-800">

            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
                {error && (
                    <p className="text-red-500 text-sm mb-4 whitespace-pre-line">{error}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Nome"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
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
                    <Button type="submit">Cadastrar</Button>
                </form>
                <p className="mt-4 text-sm text-center hover:cursor-pointer">
                    Já tem conta?{' '}
                    <button onClick={switchToLogin}
                        className="text-blue-600 hover:underline hover:cursor-pointer">
                        Faça login
                    </button>
                </p>
            </div>
        </div>
    );
}
