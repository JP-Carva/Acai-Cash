export function parseDateLocal(dateLike: any): Date {
  if (dateLike == null) return new Date(NaN);
  if (typeof dateLike === 'string') {
    // Corresponde a 'YYYY-MM-DD' ou 'YYYY-MM-DDZ' etc. Tratar data simples como data local para evitar deslocamento de fuso horário
    const m = dateLike.match(/^\d{4}-\d{2}-\d{2}$/);
    if (m) {
      const [y, mo, d] = dateLike.split('-').map(Number);
      return new Date(y, (mo - 1), d, 0, 0, 0, 0);
    }
  }
  return new Date(dateLike);
}
