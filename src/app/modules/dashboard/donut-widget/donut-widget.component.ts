import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { VendaService } from "@/services/venda.service";
import { Venda } from "@/modules/frente-loja/model/venda";

@Component({
    selector: 'app-donut-widget',
    standalone: true,
    templateUrl: './donut-widget.component.html',
    imports: [
        ChartModule,
        CommonModule
    ],
})
export class DonutWidgetComponent implements OnInit {
    data: any;

    options: any;

    chartOptions: any;

    platformId = inject(PLATFORM_ID);
    vendaService = inject(VendaService);

    // Lista exibida abaixo do gráfico: { nome, quantidade }
    topProdutos: Array<{ nome: string; quantidade: number }> = [];
    unidade = 'Prod. em Vendas';

    constructor(private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.vendaService.getAllVendas().subscribe((vendas) => {
            this.initChart(vendas);
        });
    }

    initChart(vendas: Venda[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color') || documentStyle.getPropertyValue('--text-color');

        // Agrega por produto considerando apenas o mês atual
        const agora = new Date();
        const anoAtual = agora.getFullYear();
        const mesAtual = agora.getMonth();
        const mapa: Record<string, number> = {};

        for (const v of vendas) {
            const d = new Date(v.dataVenda as any);
            if (d.getFullYear() !== anoAtual || d.getMonth() !== mesAtual) continue;
            for (const it of v.itensVenda || []) {
                const nome = it?.produto?.nome || 'Desconhecido';
                const qtd = 1; // cada item de venda conta como 1 unidade
                mapa[nome] = (mapa[nome] || 0) + qtd;
            }
        }

        // Ordena por quantidade desc e pega top 5; agrupa resto em "Outros"
        const entries = Object.entries(mapa).sort((a, b) => b[1] - a[1]);
        const topN = 5;
        const top = entries.slice(0, topN);
        const outrosTotal = entries.slice(topN).reduce((acc, [, v]) => acc + v, 0);
        const labels = top.map(([k]) => k);
        const values = top.map(([, v]) => Math.round(v));
        if (outrosTotal > 0) {
            labels.push('Outros');
            values.push(Math.round(outrosTotal));
        }

        this.topProdutos = top.map(([nome, quantidade]) => ({ nome, quantidade: Math.round(quantidade) }));

        // Paleta de cores
        const baseColors = [
            '--p-cyan-500',
            '--p-orange-500',
            '--p-purple-500',
            '--p-blue-500',
            '--p-green-500',
            '--p-pink-500'
        ];
        const hoverColors = [
            '--p-cyan-400',
            '--p-orange-400',
            '--p-purple-400',
            '--p-blue-400',
            '--p-green-400',
            '--p-pink-400'
        ];
        const bg = labels.map((_, i) => documentStyle.getPropertyValue(baseColors[i % baseColors.length]));
        const hoverBg = labels.map((_, i) => documentStyle.getPropertyValue(hoverColors[i % hoverColors.length]));

        this.data = {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: bg,
                    hoverBackgroundColor: hoverBg
                }
            ]
        };

        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };

        this.cd.markForCheck();
    }
}