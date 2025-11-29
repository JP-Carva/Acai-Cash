import { PagamentoVenda } from "@/modules/frente-loja/model/pagamentoVenda";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseUrl = 'api/v1/pagamento-venda';

@Injectable({
    providedIn: 'root'
})
export class PagamentoService {

    http = inject(HttpClient);

    getAllPagamentoVendas(): Observable<PagamentoVenda[]> {
        return this.http.get<PagamentoVenda[]>(`${baseUrl}`, {responseType: 'json'});
    }

    getPagamentoVendaById(id: number) {
        return this.http.get<PagamentoVenda>(`${baseUrl}/${id}`, {responseType: 'json'});
    }

    getPagamentoByVendaId(id: number): Observable<PagamentoVenda[]> {
        return this.http.get<PagamentoVenda[]>(`${baseUrl}/venda/${id}`, {responseType: 'json'});
    }

    deletePagamentoVenda(id: number){
        return this.http.delete<PagamentoVenda>(`${baseUrl}/${id}`);
    }

}