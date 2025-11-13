import { Page } from "@/modules/produtos/models/page";
import { Produto } from "@/modules/produtos/models/produto";
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

const baseUrl = "/api/v1/produtos";

@Injectable({
    providedIn: "root",
})
export class ProdutoService {

    http = inject(HttpClient);

    createProduto(produto: FormData): Observable<Produto> {
        return this.http.post<Produto>(`${baseUrl}`, produto).pipe(
            map(res => res as Produto)
        );
    }

    deleteProduto(id: number): Observable<Produto> {
        return this.http.delete<Produto>(`${baseUrl}/${id}`);
    }

    getProdutoById(id: number): Observable<Produto> {
        return this.http.get<Produto>(`${baseUrl}/${id}`).pipe(
            map(res => res as Produto)
        );
    }

    updateProduto(produto: FormData): Observable<Produto> {
        return this.http.put<Produto>(`${baseUrl}`, produto).pipe(
            map(res => res as Produto)
        );
    }

    getAllProdutos(page: number = 0, size: number = 10): Observable<Page<Produto>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<Page<Produto>>(`${baseUrl}`, {
            params,
            responseType: 'json'
        });
    }

}