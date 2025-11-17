import { Produto } from "@/modules/produtos/models/produto";
import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {

    itensAdicionados = signal<Produto[]>([]);

    adicionarItem(produto: Produto): void {
        this.itensAdicionados.update(itens => [...itens, produto]);
    }


}