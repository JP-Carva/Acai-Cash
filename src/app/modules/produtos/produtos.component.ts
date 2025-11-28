import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Table, TableModule, TablePageEvent } from "primeng/table";
import { newPage, Page } from "./models/page";
import { Produto } from "./models/produto";
import { customSort } from "@/utils/sort-util";
import { MessageService, SortEvent } from "primeng/api";
import { Router, RouterModule } from "@angular/router";
import { ProdutoService } from "@/services/produto.service";
import { ImageModule } from "primeng/image";
import { MessageModule } from "primeng/message";
import { DialogModule } from "primeng/dialog";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-produtos',
    standalone: true,
    templateUrl: './produtos.component.html',
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TableModule,
        RouterModule,
        ProgressBarModule,
        ImageModule,
        MessageModule,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        ToastModule,
        DialogModule,
        ImageModule,
    ],
})
export class ProdutosComponent implements OnInit{
  @ViewChild('dt') dt!: Table;
  
  route = inject(Router);
  produtoService = inject(ProdutoService);
  cdRef = inject(ChangeDetectorRef);
  messageService = inject(MessageService);
  
  isSorted: boolean | null = null;
  dialogDeleteVisible = false;
  page = newPage;
  
  produtosIniciais: Produto[] = [];
  produtos: Produto[] = [];
  
  produtoSelecionado = {} as Produto;
    
  ngOnInit(): void {
    this.loadProdutos();
  }
  
  loadPage(event: TablePageEvent): void {
    this.page.pageable.pageNumber = event.first / event.rows;
    this.page.pageable.pageSize = event.rows;
    this.loadProdutos();
  }
  
  loadProdutos(): void {
    this.produtoService.getAllProdutos(this.page.pageable.pageNumber, this.page.pageable.pageSize)
      .subscribe((page: Page<Produto>) => {
        this.page = page;
        this.produtos = page.content;
        this.produtosIniciais = [...page.content];
        this.produtos.forEach(produto => {
          if (produto.image) {
                produto.photoView = 'data:image/jpeg;base64,' + produto.image;
            } else {
                produto.photoView = '/images/default-product.jpg';
            }
        });
      });
  }
  
  customSort(event: SortEvent){
    event.data = this.produtos;
    customSort(event, this.isSorted, this.dt);
  }
  
  cadastrarProduto(): void {
    this.route.navigate(['/produtos/cadastrar']);
  }

  editarProduto(produto: Produto): void {
    this.route.navigate(['/produtos/cadastrar', produto.id]);
  }
  
  excluirProduto(): void {
    if(!this.produtoSelecionado.id) return;
    this.produtoService.deleteProduto(this.produtoSelecionado.id).subscribe(() => {
      this.onDialogDeleteHide();
      this.loadProdutos();
      this.messageService.add({
        severity:'success', 
        summary: 'Sucesso', 
        detail: 'Produto excluído com sucesso!'
      });
    });
  }

  onDialogDeleteShow(produto: Produto): void {
    this.dialogDeleteVisible = true;
    this.produtoSelecionado = produto;
    this.cdRef.detectChanges();
  }

  onDialogDeleteHide(): void {
    this.dialogDeleteVisible = false;
    this.cdRef.detectChanges();
  }
}