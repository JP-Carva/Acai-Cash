import { CategoriaProduto } from '../enums/categoria-produto';

export interface Produto {
    id?: number;
    categoria: CategoriaProduto;
    nome: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
    photoView?: string;
    ativo: boolean;
    image: File | Blob;
}