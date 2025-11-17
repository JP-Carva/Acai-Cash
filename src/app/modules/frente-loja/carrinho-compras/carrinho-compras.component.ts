import { CarrinhoService } from "@/services/carrinho.service";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";

@Component({
    selector: 'app-carrinho-compras',
    standalone: true,
    templateUrl: './carrinho-compras.component.html',
})
export class CarrinhoComprasComponent {

    carrinhoService = inject(CarrinhoService);

}