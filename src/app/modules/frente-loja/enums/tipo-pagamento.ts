export enum TipoPagamento {
    DINHEIRO = 'DINHEIRO',
    CARTAO= 'CARTAO',
    PIX = 'PIX'
}

export const FormasPagamento = {
  [TipoPagamento.DINHEIRO]: { control: "valorDinheiro", placeHolder: "Digite o valor em dinheiro" },
  [TipoPagamento.CARTAO]: { control: "valorCartao", placeHolder: "Digite o valor no cartão" },
  [TipoPagamento.PIX]: { control: "valorPix", placeHolder: "Digite o valor no Pix" },
};