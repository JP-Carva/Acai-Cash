import { Produto } from "@/modules/produtos/models/produto";
import { CarrinhoService } from "@/services/carrinho.service";
import { ProdutoService } from "@/services/produto.service";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FluidModule } from "primeng/fluid";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputNumberModule } from "primeng/inputnumber";
import { SelectModule } from "primeng/select";

@Component({
    selector: 'app-pesagem-venda',
    standalone: true,
    templateUrl: './pesagem-venda.component.html',
    imports: [
    CommonModule,
    CardModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    InputGroupAddonModule,
    InputGroupModule,
    FluidModule,
    ButtonModule,
    ReactiveFormsModule,
],
})
export class PesagemVendaComponent implements OnInit {
    
    peso: number | null = null;
    produtos: Produto[] = [];
    produtoSelecionado = {} as Produto;
    
    produtoService = inject(ProdutoService);
    fb = inject(FormBuilder);
    carrinhoService = inject(CarrinhoService);

    vendaForm!: FormGroup;

    ngOnInit(): void {
        this.carregarProdutos();
    }

    carregarProdutos(): void {
        this.produtoService.getAllProdutos().subscribe(page => {
            this.produtos = page.content.map(p => (p as Produto) );
        });
    }

    get subtotal(): number {
       const preco = Number(this.produtoSelecionado?.preco ?? 0);
       const peso = Number(this.peso) || 0;
       return Number((peso * preco).toFixed(2));
   }

    adicionarAoCarrinho(): void {
        this.carrinhoService.adicionarItem(this.produtoSelecionado, this.subtotal);
        this.limpar();
    }

    limpar(): void {
        this.produtoSelecionado = null as any;
        this.peso = null;
    }

}