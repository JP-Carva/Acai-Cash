import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DashboardFilterService {
  private readonly currentYear = new Date().getFullYear();

  private anoSubject = new BehaviorSubject<number>(this.currentYear);
  private mesSubject = new BehaviorSubject<number>(-1); // -1 = Todos

  selectedAno$ = this.anoSubject.asObservable();
  selectedMes$ = this.mesSubject.asObservable();

  get selectedAno(): number { return this.anoSubject.value; }
  get selectedMes(): number { return this.mesSubject.value; }

  setSelectedAno(ano: number) {
    if (ano !== this.anoSubject.value) this.anoSubject.next(ano);
  }

  setSelectedMes(mes: number) {
    if (mes !== this.mesSubject.value) this.mesSubject.next(mes);
  }
}
