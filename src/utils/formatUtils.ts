export function formatToDateInput(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  // Convert to UTC+7
  const utcPlus7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return utcPlus7.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function toUTCPlus7(utcDateTimeString: string): string {
  const utc = new Date(utcDateTimeString + "Z");
  const utcPlus7 = new Date(utc.getTime() + 7 * 60 * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${utcPlus7.getFullYear()}-${pad(utcPlus7.getMonth() + 1)}-${pad(utcPlus7.getDate())}T${pad(utcPlus7.getHours())}:${pad(utcPlus7.getMinutes())}`;
}

export const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  // Convert to UTC+7
  const utcPlus7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return utcPlus7.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
