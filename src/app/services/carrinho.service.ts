import { ItemVenda } from "@/modules/frente-loja/model/itemVenda";
import { Produto } from "@/modules/produtos/models/produto";
import { computed, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {

    itensAdicionados = signal<ItemVenda[]>([]);

    adicionarItem(itemVenda: ItemVenda): void {
        this.itensAdicionados.update(itens => [...itens, itemVenda]);
    }

    removerItem(itemVenda: ItemVenda): void {
        this.itensAdicionados.update(itens => itens.filter(item => item.id !== itemVenda.id));
    }

    limparCarrinho(): void {
        this.itensAdicionados.set([]);
    }

    calcularTotal(): number {
        return this.itensAdicionados().reduce((total, item) => total + item.peso * item.produto.preco, 0);
    }
}
