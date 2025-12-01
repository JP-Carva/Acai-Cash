import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { VendaService } from "@/services/venda.service";
import { Venda } from "@/modules/frente-loja/model/venda";
import { parseDateLocal } from "@/utils/date-util";

@Component({
    selector: 'app-donut-widget',
    standalone: true,
    templateUrl: './donut-widget.component.html',
    imports: [
        ChartModule,
        CommonModule,
        FormsModule,
        SelectModule
    ],
})
export class DonutWidgetComponent implements OnInit {
    data: any;

    options: any;

    chartOptions: any;

    vendaService = inject(VendaService);

    // Lista exibida abaixo do gráfico: { nome, quantidade }
    topProdutos: Array<{ nome: string; quantidade: number }> = [];
    unidade = 'Prod. em Vendas';

    // Filtros de período
    private vendasCache: Venda[] = [];
    mesesLabels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    mesesOptions: {label: string, value: number}[] = [];
    selectedMes: number = -1; // -1 = Todos
    selectedAno: number = new Date().getFullYear();
    anosOptions: {label: string, value: number}[] = [];

    constructor(private cd: ChangeDetectorRef) {}

    ngOnInit() {
        // Opções de mês
        this.mesesOptions = [{ label: 'Todos', value: -1 }, ...this.mesesLabels.map((m, i) => ({ label: m, value: i }))];
        // Carrega inicial e assina para atualizações em tempo real
        this.vendaService.refreshVendas();
        this.vendaService.vendas$.subscribe((vendas) => {
            this.vendasCache = vendas;
            this.computeYears();
            this.buildChart();
        });
    }

    onMonthChange() {
        this.buildChart();
    }

    onYearChange() {
        this.buildChart();
    }

    private buildChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color') || documentStyle.getPropertyValue('--text-color');

        // Agrega por produto considerando filtros de ano/mês
        const anoRef = this.selectedAno;
        const mesRef = this.selectedMes; // -1 = todos os meses
        const mapa: Record<string, number> = {};

        for (const v of this.vendasCache) {
            const d = parseDateLocal(v.dataVenda as any);
            if (d.getFullYear() !== anoRef) continue;
            if (mesRef >= 0 && d.getMonth() !== mesRef) continue;
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

    private computeYears() {
        const years = new Set<number>();
        for (const v of this.vendasCache) {
            const d = parseDateLocal(v.dataVenda as any);
            if (!isNaN(d.getTime())) years.add(d.getFullYear());
        }
        const sorted = Array.from(years.values()).sort((a, b) => a - b);
        const current = new Date().getFullYear();
        this.anosOptions = sorted.map(y => ({ label: String(y), value: y }));
        if (sorted.includes(current)) this.selectedAno = current; else if (sorted.length) this.selectedAno = sorted[sorted.length - 1];
    }
}