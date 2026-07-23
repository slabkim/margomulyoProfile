export const VILLAGE_TIME_ZONE = 'Asia/Jakarta';

export type NewsEventStatus = 'upcoming' | 'completed';

export function getNewsEventStatus(eventAt: string, now = Date.now()): NewsEventStatus {
  return new Date(eventAt).getTime() > now ? 'upcoming' : 'completed';
}

export function getNewsEventStatusLabel(status: NewsEventStatus) {
  return status === 'upcoming' ? 'Akan Datang' : 'Terlaksana';
}

export function formatNewsEventDate(eventAt: string) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: VILLAGE_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(eventAt));
}

export function toDateTimeLocalValue(eventAt: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: VILLAGE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(eventAt));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}T${value.hour}:${value.minute}`;
}

export function parseVillageDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+07:00`);
  if (Number.isNaN(date.getTime()) || toDateTimeLocalValue(date.toISOString()) !== value) return null;
  return date.toISOString();
}

export function sortNewsByEventStatus<T extends { event_at: string }>(articles: T[], now = Date.now()) {
  return articles.sort((first, second) => {
    const firstTime = new Date(first.event_at).getTime();
    const secondTime = new Date(second.event_at).getTime();
    const firstUpcoming = firstTime > now;
    const secondUpcoming = secondTime > now;

    if (firstUpcoming !== secondUpcoming) return firstUpcoming ? -1 : 1;
    return firstUpcoming ? firstTime - secondTime : secondTime - firstTime;
  });
}
