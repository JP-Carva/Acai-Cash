import { CarrinhoService } from "@/services/carrinho.service";
import { VendaService } from "@/services/venda.service";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { FluidModule } from "primeng/fluid";
import { InputNumberModule } from "primeng/inputnumber";
import { MessageModule } from "primeng/message";
import { SelectButtonModule } from "primeng/selectbutton";
import { ToggleSwitchModule } from "primeng/toggleswitch"; 
import { Venda } from "../model/venda";
import { FormasPagamento, TipoPagamento } from "../enums/tipo-pagamento";
import { PagamentoVenda } from "../model/pagamentoVenda";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-forma-pagamento',
    standalone: true,
    templateUrl: './forma-pagamento.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        FluidModule,
        ToggleSwitchModule,
        SelectButtonModule,
        MessageModule,
        DialogModule,
        CardModule,
        InputNumberModule
],
})
export class FormaPagamentoComponent implements OnInit {

    tiposPagamentoSelecionados = new Set<TipoPagamento>();

    formaPagamentoForm!: FormGroup;
    tipoPagamento = TipoPagamento;
    formasPagamento = FormasPagamento;
    maisOpcoesPagamento = false;
    
    carrinhoService = inject(CarrinhoService);
    vendaService = inject(VendaService);
    fb = inject(FormBuilder);
    messageService = inject(MessageService);
  
    ngOnInit(): void {
       this.formaPagamentoForm = this.fb.group({
        valorDinheiro: [],
        valorCartao: [],
        valorPix: [],
       });
    }
    
    isSelected(optionValue: TipoPagamento): boolean {
        return this.tiposPagamentoSelecionados.has(optionValue);
    }
    
    isDisabled(optionValue: TipoPagamento): boolean {
        if (this.maisOpcoesPagamento) return false;
        if (this.tiposPagamentoSelecionados.size === 0) return false;
        // se já existe seleção e esta opção não for a selecionada, desabilita
        return !this.tiposPagamentoSelecionados.has(optionValue);
    }
    
    toggleOption(optionValue: TipoPagamento): void {
        if (this.maisOpcoesPagamento) {
            // modo multi: alterna presença no set
            if (this.tiposPagamentoSelecionados.has(optionValue)) this.tiposPagamentoSelecionados.delete(optionValue);
            else this.tiposPagamentoSelecionados.add(optionValue);
        } else {
            // modo single: selecionar -> mantém apenas ele; clicar de novo -> limpa seleção
            if (this.tiposPagamentoSelecionados.has(optionValue)) {
                this.tiposPagamentoSelecionados.clear();
            } else {
                this.tiposPagamentoSelecionados.clear();
                this.tiposPagamentoSelecionados.add(optionValue);
            }
        }
    }

    onMaisOpcoesChange(value: boolean): void {
        this.maisOpcoesPagamento = value;
        // se desativou modo multi e havia >1 selecionados, mantém apenas o primeiro
        if (!value && this.tiposPagamentoSelecionados.size > 1) {
            const first = this.tiposPagamentoSelecionados.values().next().value;
            this.tiposPagamentoSelecionados.clear();
            if (first) this.tiposPagamentoSelecionados.add(first);
        }
    }
    
    get totalDoCarrinho(): number {
        return this.carrinhoService.calcularTotal();
    }

    get totalPago(): number {
    const valorDinheiro = this.formaPagamentoForm.value.valorDinheiro; 
        const valorCartao = this.formaPagamentoForm.value.valorCartao; 
        const valorPix = this.formaPagamentoForm.value.valorPix; 
        const totalPago = valorDinheiro + valorCartao + valorPix;
        return totalPago;
    }

    get troco(): number {
        const totalPago = this.totalPago;
        if (totalPago > this.totalDoCarrinho){
            return totalPago - this.totalDoCarrinho;
        }
        return 0;
    }

    get valorFinal(): number {
        const totalPago = this.totalPago;
        const valorFinal = this.totalDoCarrinho - totalPago;
        if (totalPago > this.totalDoCarrinho){
            return 0;
        }
        return valorFinal; 
    }
    

    finalizarVenda() {
        if (this.totalPago == this.totalDoCarrinho || this.troco == 0){
            const formasPagamento = Array.from(this.tiposPagamentoSelecionados).map(tipo => {
                const formaPagamento = tipo.toString();
                const valorPago = this.formaPagamentoForm.value[this.formasPagamento[tipo].control];
                return { formaPagamento, valorPago } as PagamentoVenda;
            });

            const venda = {itensVenda: this.carrinhoService.itensAdicionados().map(item => { item.id = undefined; return item; })} as Venda;
            venda.pagamentoVenda = formasPagamento;
            
            this.vendaService.createVenda(venda).subscribe({
                next: (venda) => {
                    console.log('Venda registrada com sucesso:', venda);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Venda registrada com sucesso!'
                    });
                    this.carrinhoService.limparCarrinho();
                    this.formaPagamentoForm.reset();
                    this.tiposPagamentoSelecionados.clear();
                },
                error: (error: HttpErrorResponse) => {
                    console.error('Erro ao registrar venda:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message || 'Erro ao Registrar a venda. Tente novamente após correção.'
                    });
                }
            });
        } else if( this.totalPago > this.totalDoCarrinho ) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'O valor pago excede o total da venda.'
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'O valor pago foi insuficiente.'
            });
        }
    }
    
    cancelarVenda() {
        this.carrinhoService.limparCarrinho();
        this.formaPagamentoForm.reset();
        this.tiposPagamentoSelecionados.clear();
    }
}