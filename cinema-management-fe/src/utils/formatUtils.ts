export function formatToDateInput(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
