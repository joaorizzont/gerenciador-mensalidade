export interface PlanoAtivo {
    id: number;
    aluno_id: number;
    plano_id: number;
    grupo_id?: number | null; // pode ser null ou ausente
    dia_vencimento: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    plano?: {
        id: number;
        nome: string;
        valor: number;
    };
}

export interface Aluno {
    id: number;
    professor_id: number;
    nome: string;
    rg: string;
    cpf: string;
    data_nascimento: string;
    endereco: string;
    cidade: string;
    celular: string;
    email: string;
    responsavel: string;
    responsavel_telefone: string;
    observacao: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    professor?: {
        id: number;
        nome: string;
    };

    atividades?: {
        id: number;
        nome: string;
    }[];

    planosAtivos?: PlanoAtivo[];

    vencimentos?: {
        id: number;
        valor: number;
        vencimento: string;
    }[];

    plano_ativo?: PlanoAtivo;
}
