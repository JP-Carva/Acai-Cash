import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CardModule } from "primeng/card";
import { FormaPagamentoComponent } from "./forma-pagamento/forma-pagamento.component";
import { ProdutoService } from "@/services/produto.service";
import { PesagemVendaComponent } from "./pesagem-venda/pesagem-venda.component";
import { CarrinhoComprasComponent } from "./carrinho-compras/carrinho-compras.component";

@Component({
     selector: "app-frente-loja",
     standalone: true,
     templateUrl: "./frente-loja.component.html",
     styleUrls: ["./frente-loja.component.css"],
     imports: [
     CommonModule,
     CardModule,
     PesagemVendaComponent,
     FormaPagamentoComponent,
     CarrinhoComprasComponent
     ],
})
export class FrenteLojaComponent {
}