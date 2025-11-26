import { Venda } from "@/modules/frente-loja/model/venda";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

const baseUrl = 'api/v1/vendas';

@Injectable({
    providedIn: 'root',
})
export class FrenteLojaService {

    http = inject(HttpClient);

    createVenda(venda: Venda){
        return this.http.post<Venda>(baseUrl, venda);
    }

    getVendaById(){}

    getAllVendas(){}

    deleteVenda(id: number){
        return this.http.delete(`${baseUrl}/${id}`);
    }
}