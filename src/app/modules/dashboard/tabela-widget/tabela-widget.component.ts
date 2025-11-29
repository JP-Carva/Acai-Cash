import { Component, OnInit, inject } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { VendaService } from "@/services/venda.service";
import { Venda } from "@/modules/frente-loja/model/venda";

@Component({
    selector: 'app-tabela-widget',
    standalone: true,
    templateUrl: './tabela.widget.component.html',
    imports: [ChartModule, CommonModule, FormsModule, SelectModule],
})
export class TabelaWidgetComponent implements OnInit {
 chartData: any;

    chartOptions: any;
    vendaService = inject(VendaService);
    
    // Cache de vendas e filtro de mês
    private vendasCache: Venda[] = [];
    mesesLabels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    mesesOptions: {label: string, value: number}[] = [];
    selectedMes: number = -1; // -1 = Todos
    // Destaque visual de um mês quando exibindo "Todos"
    highlightMes: number = -1; // -1 = nenhum destaque
    highlightOptions: {label: string, value: number}[] = [];
    // Filtro de ano
    selectedAno: number = new Date().getFullYear();
    anosOptions: {label: string, value: number}[] = [];

    ngOnInit() {
        // preencher opções de meses e destaque
        this.mesesOptions = [{ label: 'Todos', value: -1 }, ...this.mesesLabels.map((m, i) => ({ label: m, value: i }))];
        this.highlightOptions = [{ label: 'Nenhum', value: -1 }, ...this.mesesLabels.map((m, i) => ({ label: m, value: i }))];

        this.vendaService.getAllVendas().subscribe(vendas => {
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
        const textColor = documentStyle.getPropertyValue('--text-color') || '#f3f4f6';
        const borderColor = documentStyle.getPropertyValue('--surface-border') || 'rgba(255,255,255,0.06)';
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary') || '#9CA3AF';
        const meses = this.mesesLabels;
        const anoAtual = this.selectedAno;
        const receitaPorMes = Array(12).fill(0);
        const itensPorMes = Array(12).fill(0);

        for (const v of this.vendasCache) {
            const d = new Date(v.dataVenda as any);
            if (d.getFullYear() !== anoAtual) continue;
            const mes = d.getMonth();
            const itens = v.itensVenda?.length || 0;
            const valor = (v.itensVenda || []).reduce((acc, it) => acc + (it.peso * (it.produto?.preco || 0)), 0);
            receitaPorMes[mes] += Number(valor.toFixed(2));
            itensPorMes[mes] += itens;
        }
        let labels = meses;
        let receita = receitaPorMes;
        let itens = itensPorMes;

        if (this.selectedMes >= 0) {
            labels = [meses[this.selectedMes]];
            receita = [receitaPorMes[this.selectedMes]];
            itens = [itensPorMes[this.selectedMes]];
        }
        // cores: permitir destaque quando exibindo todos os meses
        const barBase = documentStyle.getPropertyValue('--p-primary-400');
        const barHighlight = documentStyle.getPropertyValue('--p-orange-400');
        const lineColor = documentStyle.getPropertyValue('--p-primary-500');
        const backgroundColor =
          this.selectedMes === -1
            ? meses.map((_, i) => (this.highlightMes === i ? barHighlight : barBase))
            : [barBase];
        const pointBackgroundColor =
          this.selectedMes === -1
            ? meses.map((_, i) => (this.highlightMes === i ? barHighlight : lineColor))
            : [lineColor];

        this.chartData = {
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Receita (R$)',
                    backgroundColor,
                    data: receita,
                    barThickness: 32
                },
                {
                    type: 'line',
                    label: 'Qtd. Itens',
                    borderColor: lineColor,
                    borderWidth: 2,
                    fill: false,
                    data: itens,
                    tension: 0.4,
                    pointBackgroundColor,
                    pointRadius: this.selectedMes === -1 ? meses.map((_, i) => (this.highlightMes === i ? 5 : 3)) : [3]
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textMutedColor,
                        font: {
                            weight: 600
                        }
                    },
                    grid: {
                        color: borderColor,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        drawBorder: false
                    }
                }
            }
        };
    }   

    private computeYears() {
        const years = new Set<number>();
        for (const v of this.vendasCache) {
            const d = new Date(v.dataVenda as any);
            if (!isNaN(d.getTime())) years.add(d.getFullYear());
        }
        const sorted = Array.from(years.values()).sort((a, b) => a - b);
        const current = new Date().getFullYear();
        this.anosOptions = sorted.map(y => ({ label: String(y), value: y }));
        if (sorted.includes(current)) this.selectedAno = current; else if (sorted.length) this.selectedAno = sorted[sorted.length - 1];
    }
}