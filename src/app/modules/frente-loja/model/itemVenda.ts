import { Produto } from "@/modules/produtos/models/produto";

export interface ItemVenda{
    id?: number;
    peso: number;
    produto: Produto;
}