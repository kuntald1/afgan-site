import { useMemo } from "react";
import CustomSelect2 from "./CustomSelect2";

const ALL = "All";

// Generic over anything shaped like a project item (type/year/org) — used
// by both the API-backed useProjects() list and, previously, the static
// content.ts projectsList — so this file doesn't need to change if the
// data source changes again later.
type FilterableItem = { type: string; year: string; org: string };

export function useProjectFilters<T extends FilterableItem>(items: T[]) {
  const types = useMemo(() => [ALL, ...Array.from(new Set(items.map((p) => p.type)))], [items]);
  const years = useMemo(
    () => [ALL, ...Array.from(new Set(items.map((p) => p.year))).sort().reverse()],
    [items]
  );
  const clients = useMemo(() => [ALL, ...Array.from(new Set(items.map((p) => p.org)))], [items]);
  return { types, years, clients, ALL };
}

export default function ProjectsFilterBar2({
  types,
  years,
  clients,
  type,
  year,
  client,
  onType,
  onYear,
  onClient,
}: {
  types: string[];
  years: string[];
  clients: string[];
  type: string;
  year: string;
  client: string;
  onType: (v: string) => void;
  onYear: (v: string) => void;
  onClient: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CustomSelect2 label="Type" value={type} options={types} onChange={onType} />
      <CustomSelect2 label="Year" value={year} options={years} onChange={onYear} />
      <CustomSelect2 label="Client" value={client} options={clients} onChange={onClient} />
    </div>
  );
}
