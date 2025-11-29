import { Venda } from "@/modules/frente-loja/model/venda";
import { newPage } from "@/modules/produtos/models/page";
import { VendaService } from "@/services/venda.service";
import { ItemVendaService } from "@/services/item-venda.service";
import { customSort } from "@/utils/sort-util";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MessageService, SortEvent } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { ProgressBarModule } from "primeng/progressbar";
import { Table, TableModule } from "primeng/table";
import { ModalDetalheVenda } from "./modal-detalhe-venda/modal-detalhe-venda.component";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { PagamentoService } from "@/services/pagamento.service";

@Component({
    selector: 'app-caixa',
    standalone: true,
    templateUrl: './caixa.component.html',
    imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ProgressBarModule,
    RouterModule,
    DialogModule,
    ModalDetalheVenda,
],
})
export class CaixaComponent implements OnInit{

    @ViewChild('dt') dt!: Table;

    eventMostraModalDetalheVenda = new EventEmitter<Venda>();

    router = inject(Router);
    vendaService = inject(VendaService);
    cdRef = inject(ChangeDetectorRef);
    messageService = inject(MessageService);

    
    isSorted: boolean | null = null;
    dialogDeleteVisible = false;

    page = newPage;
    vendas: Venda[] = [];
    vendasIniciais: Venda[] = [];
    vendaSelecionada = {} as Venda;

    filtrar = false;
    
    ngOnInit(): void {
        this.loadVendas();
    }

    filtrarVendas(): void {
        this.filtrar = true;
    }

    cancelarFiltro(): void {
        this.filtrar = false;
    }

    customSort(event: SortEvent){
        event.data = this.vendas;
        customSort(event, this.isSorted, this.dt);
    }

    loadVendas(): void {
        this.vendaService.getAllVendas()
        .subscribe((vendas: Venda[]) => {
            this.page.content = vendas;
            this.vendas = vendas;
            this.vendasIniciais = [...vendas];
        });
    }

    verDetalhesVenda(venda: Venda): void {
        this.eventMostraModalDetalheVenda.emit(venda);
    }

    onDialogDeleteShow(venda: Venda): void {
        this.dialogDeleteVisible = true;
        this.vendaSelecionada = venda;
        this.cdRef.detectChanges();
    }

    onDialogDeleteHide(): void {
        this.dialogDeleteVisible = false;
        this.vendaSelecionada = {} as Venda;
    }

    excluirVenda(): void{
        if(!this.vendaSelecionada.id) return;

        this.vendaService.deleteVenda(this.vendaSelecionada.id).subscribe(() => {
            this.onDialogDeleteHide();
            this.loadVendas();
            this.messageService.add({
                severity:'success', 
                summary: 'Sucesso', 
                detail: 'Venda excluída com sucesso!'});
        });
    }

    iniciarVenda() {
        this.router.navigate(['/frente-loja']);
    }
}