import { Venda } from "@/modules/frente-loja/model/venda";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseUrl = 'api/v1/vendas';

@Injectable({
    providedIn: 'root',
})
export class VendaService {

    http = inject(HttpClient);

    createVenda(venda: Venda): Observable<Venda> {
        return this.http.post<Venda>(baseUrl, venda);
    }

    getVendaById(id: number){
        return this.http.get<Venda>(`${baseUrl}/${id}`, {responseType: 'json'});
    }

    getAllVendas(): Observable<Venda[]> {
        return this.http.get<Venda[]>(`${baseUrl}`, {responseType: 'json'});
    }

    deleteVenda(id: number){
        return this.http.delete(`${baseUrl}/${id}`);
    }
}