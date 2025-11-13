export type User = {
    id: number;
    nome: string;
    login?: string;
    senha?: string;
};

export type ChangePassword = {
    senhaAntiga: string;
    senhaNova: string;
};
