import { Venda } from "@/modules/frente-loja/model/venda";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

const baseUrl = 'api/v1/vendas';

@Injectable({
    providedIn: 'root',
})
export class VendaService {

    http = inject(HttpClient);
    private vendasSubject = new BehaviorSubject<Venda[]>([]);
    vendas$ = this.vendasSubject.asObservable();

    createVenda(venda: Venda): Observable<Venda> {
        return this.http.post<Venda>(baseUrl, venda).pipe(
            tap((nova) => {
                const atual = this.vendasSubject.value;
                this.vendasSubject.next([...atual, nova]);
            })
        );
    }

    getVendaById(id: number){
        return this.http.get<Venda>(`${baseUrl}/${id}`, {responseType: 'json'});
    }

    getAllVendas(): Observable<Venda[]> {
        return this.http.get<Venda[]>(`${baseUrl}`, {responseType: 'json'});
    }

    refreshVendas(): void {
        this.getAllVendas().subscribe((vendas) => this.vendasSubject.next(vendas));
    }

    deleteVenda(id: number){
        return this.http.delete(`${baseUrl}/${id}`);
    }
}