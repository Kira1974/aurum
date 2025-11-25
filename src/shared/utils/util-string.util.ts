export function addNumbers(a: number, b: number): number {
  return a + b;
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
