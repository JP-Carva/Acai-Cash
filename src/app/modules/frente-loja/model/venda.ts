import { ItemVenda } from "./itemVenda";
import { PagamentoVenda } from "./pagamentoVenda";

export interface Venda {
    id?: number;
    dataVenda: Date;
    horarioVenda: string;
    valorTotal: number;
    pagamentoVenda: PagamentoVenda[];
    itensVenda: ItemVenda[];
}