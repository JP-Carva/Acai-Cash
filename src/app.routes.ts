import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('@/modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'frente-loja',
                loadComponent: () => import('@/modules/frente-loja/frente-loja.component').then(m => m.FrenteLojaComponent)
            },
            {
                path: 'produtos',
                loadComponent: () => import('@/modules/produtos/produtos.component').then(m => m.ProdutosComponent)
            },
            {
                path: 'produtos/cadastrar',
                loadComponent: () => import('@/modules/produtos/cadastro-produto/cadastro-produto.component').then(m => m.CadastroProdutoComponent)
            },
            {
                path: 'vendedores',
                loadComponent: () => import('@/modules/vendedor/vendedor.component').then(m => m.VendedoresComponent)
            },
            {
                path: 'vendedores/cadastrar',
                loadComponent: () => import('@/modules/vendedor/cadastro-vendedor/cadastro-vendedor.component').then(m => m.CadastroVendedorComponent)
            },
        ]
    },
    {
        path: 'login',
        data: { breadcrumb: 'Autorização' },
        loadChildren: () => import('@/auth/auth.routes')
    },
];
