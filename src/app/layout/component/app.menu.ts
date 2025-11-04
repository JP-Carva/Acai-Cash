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
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
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
