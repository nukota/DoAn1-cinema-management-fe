export function formatToDateInput(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}