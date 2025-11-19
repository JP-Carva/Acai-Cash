import { Produto } from "@/modules/produtos/models/produto";
import { computed, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {

    itensAdicionados = signal<Produto[]>([]);

    adicionarItem(produto: Produto, subtotal: number): void {
        this.itensAdicionados.update(itens => [...itens, { ...produto, preco: subtotal }]);
    }

    removerItem(produto: Produto): void {
        this.itensAdicionados.update(itens => itens.filter(item => item.id !== produto.id));
    }

    limparCarrinho(): void {
        this.itensAdicionados.set([]);
    }

    calcularTotal(): number {
        return this.itensAdicionados().reduce((total, item) => total + item.preco, 0);
    }
}
