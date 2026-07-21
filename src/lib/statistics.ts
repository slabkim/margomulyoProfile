export type PopulationStatistic = {
  category?: string;
  label: string;
  value: number | string;
  year: number;
  updated_at?: string | null;
};

export const HOME_STATISTIC_OPTIONS = [
  { label: 'Jumlah Penduduk', displayLabel: 'Penduduk', summaryLabel: 'Jiwa penduduk', note: 'jiwa', aliases: ['jumlah penduduk', 'penduduk'] },
  { label: 'Kepala Keluarga', displayLabel: 'Kepala keluarga', summaryLabel: 'Kepala keluarga', note: 'KK', aliases: ['kepala keluarga', 'jumlah kepala keluarga'] },
  { label: 'Jumlah Dusun', displayLabel: 'Wilayah', summaryLabel: 'Dusun', note: 'dusun', aliases: ['jumlah dusun', 'dusun'] },
  { label: 'Luas Wilayah (km²)', displayLabel: 'Luas desa', summaryLabel: 'km² luas wilayah', note: 'km²', aliases: ['luas wilayah', 'luas desa'] },
] as const;

export const AGE_GROUP_OPTIONS = [
  { field: 'age_0_5', label: '0–5 tahun', aliases: ['0 5 tahun'] },
  { field: 'age_6_12', label: '6–12 tahun', aliases: ['6 12 tahun'] },
  { field: 'age_13_17', label: '13–17 tahun', aliases: ['13 17 tahun'] },
  { field: 'age_18_21', label: '18–21 tahun', aliases: ['18 21 tahun'] },
  { field: 'age_22_59', label: '22–59 tahun', aliases: ['22 59 tahun'] },
  { field: 'age_60_plus', label: 'Di atas 60 tahun', aliases: ['di atas 60 tahun', '60 tahun', '60 plus tahun'] },
] as const;

function normalizeLabel(label: string) {
  return label.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function isHomepageStatisticLabel(label: string) {
  return HOME_STATISTIC_OPTIONS.some((definition) => matchesLabel(label, definition.aliases));
}

export function canonicalManagedStatisticLabel(label: string) {
  const homepage = HOME_STATISTIC_OPTIONS.find((definition) => matchesLabel(label, definition.aliases));
  if (homepage) return homepage.label;
  const ageGroup = AGE_GROUP_OPTIONS.find((definition) => matchesLabel(label, definition.aliases));
  return ageGroup?.label;
}

export function isManagedStatisticLabel(label: string) {
  return Boolean(canonicalManagedStatisticLabel(label));
}

export function calculateAgeGroupCounts(totalPopulation: number, percentages: number[]) {
  const percentageTotal = percentages.reduce((sum, percentage) => sum + percentage, 0);
  if (!Number.isInteger(totalPopulation) || totalPopulation < 0 || percentageTotal <= 0) {
    return percentages.map(() => 0);
  }

  const rawCounts = percentages.map((percentage) => (totalPopulation * percentage) / percentageTotal);
  const counts = rawCounts.map(Math.floor);
  const remainder = totalPopulation - counts.reduce((sum, count) => sum + count, 0);
  const remainderOrder = rawCounts
    .map((rawCount, index) => ({ index, fraction: rawCount - Math.floor(rawCount) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let index = 0; index < remainder; index += 1) {
    counts[remainderOrder[index % remainderOrder.length].index] += 1;
  }
  return counts;
}

export function formatStatisticValue(value: number | string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(numericValue)
    : '—';
}

function matchesLabel(label: string, aliases: readonly string[]) {
  const normalized = normalizeLabel(label);
  return aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias} `));
}

export function buildHomepageStatistics(rows: PopulationStatistic[]) {
  return HOME_STATISTIC_OPTIONS.map((definition) => {
    const row = rows.find((item) => matchesLabel(item.label, definition.aliases));
    return {
      value: row ? formatStatisticValue(row.value) : '—',
      label: definition.displayLabel,
      summaryLabel: definition.summaryLabel,
      note: definition.note,
      year: row?.year,
    };
  });
}

export function buildDetailedStatisticGroups(rows: PopulationStatistic[]) {
  const categories = new Map<string, PopulationStatistic[]>();

  for (const row of rows) {
    const category = row.category?.trim();
    if (!category || category === 'Ringkasan' || isHomepageStatisticLabel(row.label)) continue;
    const categoryRows = categories.get(category) ?? [];
    categoryRows.push(row);
    categories.set(category, categoryRows);
  }

  return Array.from(categories, ([category, categoryRows]) => {
    const latestYear = Math.max(...categoryRows.map((row) => Number(row.year)));
    const latestRows = categoryRows.filter((row) => Number(row.year) === latestYear);
    const maximumValue = Math.max(...latestRows.map((row) => Number(row.value)), 0);

    return {
      category,
      year: latestYear,
      items: latestRows.map((row) => {
        const numericValue = Number(row.value);
        return {
          label: row.label,
          value: formatStatisticValue(row.value),
          width: maximumValue > 0 && Number.isFinite(numericValue) ? Math.max((numericValue / maximumValue) * 100, 2) : 0,
        };
      }),
    };
  }).sort((a, b) => a.category.localeCompare(b.category, 'id'));
}
