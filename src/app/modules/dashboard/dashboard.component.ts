import { Component } from "@angular/core";
import { TabelaWidgetComponent } from "./tabela-widget/tabela-widget.component";
import { DonutWidgetComponent } from "./donut-widget/donut-widget.component";
import { DadosWidgetComponent } from "./dados-widget/dados-widget.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    imports: [
    TabelaWidgetComponent,
    DonutWidgetComponent,
    DadosWidgetComponent
]
})
export class DashboardComponent{
    
}