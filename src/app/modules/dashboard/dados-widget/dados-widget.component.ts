import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { VendaService } from "@/services/venda.service";
import { Venda } from "@/modules/frente-loja/model/venda";

@Component({
    selector: 'app-dados-widget',
    standalone: true,
    templateUrl: './dados-widget.component.html',
    imports: [
        CommonModule
    ]
})
export class DadosWidgetComponent implements OnInit {
    vendaService = inject(VendaService);

    produtosVendidosMesAtual = 0;
    produtosVendidosMesAnterior = 0;
    crescimentoProdutosPercent = 0; // %

    faturamentoMesAtual = 0;
    faturamentoMesAnterior = 0;
    crescimentoFaturamentoPercent = 0; // %

    ngOnInit(): void {
        this.vendaService.getAllVendas().subscribe(vendas => {
            this.calcularMetricas(vendas);
        });
    }

    private calcularMetricas(vendas: Venda[]) {
        const agora = new Date();
        const anoAtual = agora.getFullYear();
        const mesAtual = agora.getMonth(); // 0..11
        const mesAnterior = (mesAtual + 11) % 12;
        const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

        let itensAtual = 0;
        let itensAnterior = 0;
        let totalAtual = 0;
        let totalAnterior = 0;

        for (const v of vendas) {
            const d = new Date(v.dataVenda as any);
            const ano = d.getFullYear();
            const mes = d.getMonth();
            const itens = v.itensVenda?.length || 0;
            const valor = (v.itensVenda || []).reduce((acc, it) => acc + (it.peso * (it.produto?.preco || 0)), 0);

            if (ano === anoAtual && mes === mesAtual) {
                itensAtual += itens;
                totalAtual += valor;
            } else if (ano === anoMesAnterior && mes === mesAnterior) {
                itensAnterior += itens;
                totalAnterior += valor;
            }
        }

        this.produtosVendidosMesAtual = itensAtual;
        this.produtosVendidosMesAnterior = itensAnterior;
        this.crescimentoProdutosPercent = this.calcPercentChange(itensAnterior, itensAtual);

        this.faturamentoMesAtual = this.round2(totalAtual);
        this.faturamentoMesAnterior = this.round2(totalAnterior);
        this.crescimentoFaturamentoPercent = this.calcPercentChange(totalAnterior, totalAtual);
    }

    private calcPercentChange(oldValue: number, newValue: number): number {
        if (!oldValue) return 100; // se não havia vendas antes, considerar 100% de crescimento
        return this.round2(((newValue - oldValue) / oldValue) * 100);
    }

    private round2(n: number): number {
        return Number(n.toFixed(2));
    }
}