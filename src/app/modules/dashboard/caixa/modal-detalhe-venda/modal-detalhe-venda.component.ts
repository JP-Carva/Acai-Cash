import { ItemVenda } from "@/modules/frente-loja/model/itemVenda";
import { PagamentoVenda } from "@/modules/frente-loja/model/pagamentoVenda";
import { Venda } from "@/modules/frente-loja/model/venda";
import { ItemVendaService } from "@/services/item-venda.service";
import { PagamentoService } from "@/services/pagamento.service";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";

@Component({
    selector: 'app-modal-detalhe-venda',
    templateUrl: './modal-detalhe-venda.component.html',
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TableModule
    ],
})
export class ModalDetalheVenda implements OnInit {

    @Input() eventMostraModalDetalheVenda = new EventEmitter<Venda>();
    @Output() mostraModalDetalheVenda = false;

    vendaSelecionada = {} as Venda;

    itensVenda: ItemVenda[] = [];
    pagamentosVenda: PagamentoVenda[] = [];

    itemVendaService = inject(ItemVendaService);
    pagamentoService = inject(PagamentoService);

    ngOnInit(): void {
        this.visualizaModal();
    }
    
    private visualizaModal() {
        this.eventMostraModalDetalheVenda.subscribe(venda => {
            this.mostraModalDetalheVenda = !this.mostraModalDetalheVenda;
            this.vendaSelecionada = {...venda};
            this.carregaItensVendaSelecionada();
            this.carregaPagamentosVendaSelecionada();
        });
        
    }
    
    private carregaItensVendaSelecionada(){
        this.itemVendaService.getItemByVendaId(this.vendaSelecionada.id!).subscribe({
            next: (itensVenda) => {
                this.itensVenda = [...itensVenda];
            }
        });
    }

    private carregaPagamentosVendaSelecionada(){
        this.pagamentoService.getPagamentoByVendaId(this.vendaSelecionada.id!).subscribe({
            next: (pagamentos) => {
                this.pagamentosVenda = [...pagamentos];
            }
        });
    }

    subtotalItem(it: ItemVenda): number {
        const precoUnit = Number(it.produto.preco) || 0;
        const pesoItem = Number(it.peso) || 0;
        return Number((precoUnit * pesoItem).toFixed(2));
    }

    get totalItens(): number {
        // total correto: soma de (preço unitário do produto x peso do item) para cada item
        return (this.itensVenda || []).reduce((acc, it) => {
            const precoUnit = Number(it?.produto?.preco) || 0;
            const pesoItem = Number(it?.peso) || 0;
            return acc + precoUnit * pesoItem;
        }, 0);
    }

    totalPagamentos(): number {
        return (this.pagamentosVenda || []).reduce((acc, pg) => acc + (Number(pg.valorPago) || 0), 0);
    }
    
    fecharModal() {
        this.mostraModalDetalheVenda = false;
    }
}