import { CategoriaProduto } from '../enums/categoria-produto';

export interface Produto {
    id?: number;
    categoria: CategoriaProduto;
    nome: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
    photoView?: string;
    status: boolean;
    image: File | Blob;
}