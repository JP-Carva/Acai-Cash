export enum CategoriaProduto {
    ACAI = 'Açaí',
    GELATO = 'Gelato',
    CREME = 'Creme',
    COMPLEMENTO = 'Complemento',
    COPO_300 = 'Copo 300ml',
    COPO_500 = 'Copo 500ml',
}

export const getCategoriasProduto = () => {
    return Object.values(CategoriaProduto).map(categoria => ({ label: categoria, value: categoria }));
}
