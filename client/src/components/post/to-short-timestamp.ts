import dayjs from "dayjs";

export function toShortTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const currentDate = dayjs();

  const differenceInSeconds = currentDate.diff(date, "second");
  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s`;
  }
  const differenceInMinutes = currentDate.diff(date, "minute");
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m`;
  }
  const differenceInHours = currentDate.diff(date, "hour");
  if (differenceInHours < 24) {
    return `${differenceInHours}h`;
  }
  const differenceInYears = currentDate.diff(date, "year");
  if (differenceInYears < 1) {
    const dateParts = Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).formatToParts(date);
    return `${dateParts[0].value} ${dateParts[2].value}`;
  }
  return Intl.DateTimeFormat("en-us", { dateStyle: "medium" }).format(date);
}
