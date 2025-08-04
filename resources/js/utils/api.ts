export async function apiFetch<T>(path: string, body?: any, method = 'GET'): Promise<T> {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}${path}`, options);

    if (!response.ok) {
        // Pode lançar um erro com o JSON da resposta para tratar no catch do componente
        const errorData = await response.json();
        throw errorData;
    }

    // Se for status 204 No Content, não tenta parsear JSON
    if (response.status === 204) {
        return {} as T;
    }

    return await response.json() as T;
}
