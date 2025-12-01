import { Injectable } from "@angular/core";
import { Venda } from "@/modules/frente-loja/model/venda";

@Injectable({ providedIn: 'root' })
export class PdfService {
  printVenda(venda: Venda) {
    const win = window.open('', '_blank');
    if (!win) return;
    const itensHtml = (venda.itensVenda || [])
      .map(it => `<tr><td>${it.produto?.nome ?? ''}</td><td>${(it.peso ?? 0).toFixed(2)} kg</td><td>R$ ${(it.produto?.preco ?? 0).toFixed(2)}</td><td>R$ ${( (it.peso ?? 0) * (it.produto?.preco ?? 0) ).toFixed(2)}</td></tr>`)
      .join('');
    const pagamentosHtml = (venda.pagamentoVenda || [])
      .map(p => `<tr><td>${p.formaPagamento}</td><td>R$ ${(p.valorPago ?? 0).toFixed(2)}</td></tr>`)
      .join('');
    const total = (venda.itensVenda || []).reduce((acc,it)=> acc + (it.peso * (it.produto?.preco ?? 0)), 0);
    const html = `
      <html>
      <head>
        <title>Nota Fiscal - Venda ${venda.id ?? ''}</title>
        <style>
          body{ font-family: Arial, sans-serif; padding:16px; }
          h1{ font-size:18px; margin-bottom:8px; }
          table{ width:100%; border-collapse: collapse; margin-top:8px; }
          th, td{ border:1px solid #ccc; padding:6px; font-size:12px; }
          .totais{ margin-top:12px; font-weight: bold; }
          .small{ font-size:12px; color:#555; }
        </style>
      </head>
      <body>
        <h1>Açaí Cash - Nota Fiscal</h1>
        <div class="small">ID: ${venda.id ?? ''} | Data: ${new Date(venda.dataVenda).toLocaleDateString()} ${venda.horaVenda ?? ''}</div>
        <h2 class="small">Itens</h2>
        <table>
          <thead><tr><th>Produto</th><th>Peso</th><th>Preço/kg</th><th>Subtotal</th></tr></thead>
          <tbody>${itensHtml}</tbody>
        </table>
        <h2 class="small">Formas de pagamento</h2>
        <table>
          <thead><tr><th>Forma</th><th>Valor</th></tr></thead>
          <tbody>${pagamentosHtml}</tbody>
        </table>
        <div class="totais">Total: R$ ${total.toFixed(2)}</div>
        <script>window.print();</script>
      </body>
      </html>`;
    win.document.write(html);
    win.document.close();
  }

  printRelatorio(vendas: Venda[], titulo: string) {
    const win = window.open('', '_blank');
    if (!win) return;
    const linhas = vendas.map(v => {
      const total = (v.itensVenda || []).reduce((acc,it)=> acc + (it.peso * (it.produto?.preco ?? 0)), 0);
      return `<tr><td>${v.id ?? ''}</td><td>${new Date(v.dataVenda).toLocaleDateString()}</td><td>${v.horaVenda ?? ''}</td><td>R$ ${total.toFixed(2)}</td></tr>`;
    }).join('');
    const html = `
      <html>
      <head>
        <title>${titulo}</title>
        <style>
          body{ font-family: Arial, sans-serif; padding:16px; }
          h1{ font-size:18px; margin-bottom:8px; }
          table{ width:100%; border-collapse: collapse; margin-top:8px; }
          th, td{ border:1px solid #ccc; padding:6px; font-size:12px; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <thead><tr><th>ID</th><th>Data</th><th>Hora</th><th>Total</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
        <script>window.print();</script>
      </body>
      </html>`;
    win.document.write(html);
    win.document.close();
  }
}