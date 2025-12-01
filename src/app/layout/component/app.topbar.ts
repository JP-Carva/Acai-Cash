import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { AuthService } from '@/auth/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ButtonModule, Menu],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/dashboard">
                <img src="https://raw.githubusercontent.com/JP-Carva/Acai-Cash/refs/heads/master/src/logo.ico" alt="Açaí Cash" style="height:32px;width:32px;object-fit:contain">
                <span>
                    Açaí Cash
                </span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="pSplitButton" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                    </button>
                    <div class="flex justify-center">
                        <p-menu #menu [model]="items" [popup]="true" />
                        <p-button hidden text icon="pi pi-ellipsis-v"/>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    authService = inject(AuthService);
    router = inject(Router);

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    ngOnInit() {
        this.items = [
            { label: 'Perfil', icon: 'pi pi-user', routerLink: ['/profile'] },
            { separator: true },
            { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
        ];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
