
import { SortEvent } from 'primeng/api'; 
import { Table } from 'primeng/table';
/**
 * Custom sort function for PrimeNG table.
 * @param evento - The sort event containing data and sorting parameters.
 * @param isSorted - The current sorting state.
 * @param dt - The PrimeNG table instance.
 */

export function customSort(evento: SortEvent, isSorted: boolean | null, dt: Table){
    if (isSorted ==  null || isSorted === undefined){
      isSorted = true;
      sortTableData(evento);
    } else if (isSorted === true){
      isSorted = false;
      sortTableData(evento);
    } 
}

function sortTableData(evento: SortEvent) {
  if (evento.data) {
    evento.data.sort((data1, data2) => {
      let value1 = data1[evento.field || ''];
      let value2 = data2[evento.field || ''];
      let result = null;
      if (value1 != null && value2 == null) result = 1;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = (value1 ?? 0) < (value2 ?? 0) ? -1 : (value1 ?? 0) > (value2 ?? 0) ? 1 : 0;

      return (evento.order || 0) * result;
    });
  }
}