import { ItemVenda } from "@/modules/frente-loja/model/itemVenda";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseUrl = 'api/v1/item-venda';

@Injectable({
    providedIn: 'root'
})
export class ItemVendaService {

    http = inject(HttpClient);

    getAllItemVendas(): Observable<ItemVenda[]> {
        return this.http.get<ItemVenda[]>(`${baseUrl}`, {responseType: 'json'});
    }
    
    getItemVendaById(id: number){
        return this.http.get<ItemVenda>(`${baseUrl}/${id}`, {responseType: 'json'});
    }

    getItemByVendaId(id: number): Observable<ItemVenda[]> {
        return this.http.get<ItemVenda[]>(`${baseUrl}/venda/${id}`, {responseType: 'json'});
    }

    deleteItemVenda(id: number){
        return this.http.delete<ItemVenda>(`${baseUrl}/${id}`);
    }
}