import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track $index;) {
                @if(!item.separator) {
                    <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
                }
                @else {
                    <li class="menu-separator"></li>
                }
        }
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                label: 'Menus',
                items: [
                    {
                        label: 'Frente de Loja',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/frente-loja']
                    },
                    {
                        label: 'Caixa',
                        icon: 'pi pi-fw pi-dollar',
                        routerLink: ['/caixa'],
                        items: [
                            {
                                label: 'Listar Vendas',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/caixa']
                            }
                        ]
                    },
                    {
                        label: 'Produtos',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: ['/produtos'],
                        items: [
                            {
                                label: 'Listar Produtos',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/produtos']

                            },
                            {
                                label: 'Cadastrar Produto',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/produtos/cadastrar']
                            }
                        ]
                    },
                    {
                        label: 'Vendedores',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/vendedores'],
                        items: [
                            {
                                label: 'Listar Vendedores',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/vendedores']
                            },
                            {
                                label: 'Cadastrar Vendedor',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/vendedores/cadastrar']
                            }
                        ]
                    }

                ]
            },
        ];
    }
}
