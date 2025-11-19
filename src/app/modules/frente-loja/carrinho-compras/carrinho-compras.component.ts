import { CarrinhoService } from "@/services/carrinho.service";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { Divider } from "primeng/divider";
import { FluidModule } from "primeng/fluid";

@Component({
    selector: 'app-carrinho-compras',
    standalone: true,
    templateUrl: './carrinho-compras.component.html',
    imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FluidModule,
],
})
export class CarrinhoComprasComponent {

    carrinhoService = inject(CarrinhoService);

}