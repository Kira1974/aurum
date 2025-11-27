export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-CO').format(amount);
}
