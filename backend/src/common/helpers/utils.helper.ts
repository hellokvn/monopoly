export function isSet(value: number): boolean {
  return (value && value >= 0) || value !== null || value !== undefined;
}
