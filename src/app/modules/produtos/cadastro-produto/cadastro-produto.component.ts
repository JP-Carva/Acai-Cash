import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FluidModule } from "primeng/fluid";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { ActivatedRoute, Router } from "@angular/router";
import { getCategoriasProduto } from "../enums/categoria-produto";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from "primeng/api";
import { ProdutoService } from "@/services/produto.service";
import { Produto } from "../models/produto";
import { HttpErrorResponse } from "@angular/common/http";
import { UploadImageLayoutComponent } from "@/shared/components/upload-image/upload-image-layout.component";
import { ImageModule } from "primeng/image";
import { DialogModule } from "primeng/dialog";
import { MessageModule } from "primeng/message";
import { CheckboxModule } from "primeng/checkbox";
import { FormFieldStateClassDirective } from "@/directive/form-field-state-class";

@Component({
    selector: 'app-cadastro-produto',
    standalone: true,
    templateUrl: './cadastro-produto.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        DialogModule,
        MessageModule,
        FluidModule,
        CheckboxModule,
        CardModule,
        FormFieldStateClassDirective,
        ImageModule,
        UploadImageLayoutComponent,
        ],
})
export class CadastroProdutoComponent implements OnInit {

    produtoForm!: FormGroup;
    image!: File;
    photoView!: string;
    categoriasProduto = getCategoriasProduto();
    check = false;
    dialogVisible = false;

    produto = {} as Produto;

    fb = inject(FormBuilder);
    router = inject(Router);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    produtoService = inject(ProdutoService);

    ngOnInit() {
        this.constroiFormulario();
        this.carregaProdutoURL();
    }

    private carregaProdutoURL(): void {
        this.activatedRoute.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadProduto(id);
            }
        });
    }

    onChildPhotoChange(file: File | null): void {
        if (file) {
        this.image = file;
        this.photoView = URL.createObjectURL(file);
        }
    }

    loadProduto(id: number): void {
        this.produtoService.getProdutoById(id).subscribe((res: Produto) => {
            this.produto = res;
            this.produtoForm.patchValue(res);
            this.image = res.image as File;
        });
    }

    constroiFormulario() {
        this.produtoForm = this.fb.group({
            id: null,
            nome: ['', Validators.required],
            categoria: [null, Validators.required],
            descricao: [''],
            quantidadeEstoque: ['', Validators.required],
            preco: ['', Validators.required],
            ativo: [],
        });
    }

    showDialogSubmit(): void {
        if (this.produtoForm.valid) {
            this.dialogVisible = true;
            this.onSubmit();
        } else {
            this.produtoForm.markAllAsTouched();
            this.produtoForm.markAsDirty();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor preencha todos os campos obrigatórios.'
            });
        }
    }

    onSubmit(): void {
        if (this.produtoForm.valid) {
            const produto = this.produtoForm.getRawValue() as Produto;
            const formData = new FormData();

            if(this.image) {
                formData.append('image', this.image);
            }

            formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));

            produto.id ? this.atualizarProduto(formData) : this.criarProduto(formData);
        }
    }

    criarProduto(formData: FormData): void {
        this.produtoService.createProduto(formData).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Produto criado com sucesso!'
                });
                this.produtoForm.reset();
                this.router.navigate(['/produtos']);
            },
            error: (error: HttpErrorResponse) => {
                console.error('Erro ao criar produto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'Erro ao criar produto. Tente novamente mais tarde.'
                });
            }
        });
    }

    atualizarProduto(formData: FormData): void {
        this.produtoService.updateProduto(formData).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Produto atualizado com sucesso!'
                });
                this.router.navigate(['/produtos']);
            },
            error: (error: HttpErrorResponse) => {
                console.error('Erro ao atualizar produto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message || 'Erro ao atualizar produto. Tente novamente mais tarde.'
                });
            }
        });
            
    }

    cancelar(): void {
        this.router.navigate(['/produtos']);
    }

}