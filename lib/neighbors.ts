import { listContentDates } from "./content";

export async function getNeighborDates(date: string): Promise<{
  prev?: string;
  next?: string;
}> {
  const dates = await listContentDates();
  const i = dates.indexOf(date);
  if (i === -1) return {};
  return {
    prev: i > 0 ? dates[i - 1] : undefined,
    next: i < dates.length - 1 ? dates[i + 1] : undefined,
  };
}
