// Creator Manager analytics domain models (ported from Creator's Launchpad).
// Backend implementations MUST conform to these shapes.

export type MetricKey =
  | "followers"
  | "reach"
  | "views"
  | "clicks"
  | "leads"
  | "sales"
  | "commissions";

export type TimeRange = "1d" | "7d" | "30d" | "90d";

export interface MetricSeriesPoint {
  /** ISO-8601 timestamp (UTC) of the bucket. */
  t: string;
  /** Numeric value for the bucket. */
  v: number;
}

export interface MetricSnapshot {
  key: MetricKey;
  value: number;
  previousValue: number;
  /** Signed decimal delta vs previousValue, e.g. 0.124 = +12.4%. `null` when no baseline. */
  deltaPct: number | null;
  series: MetricSeriesPoint[];
  unit?: string;
}

export interface DashboardAnalytics {
  range: TimeRange;
  generatedAt: string;
  connected: boolean;
  source: string;
  metrics: Record<MetricKey, MetricSnapshot>;
}

export const METRIC_KEYS: MetricKey[] = [
  "followers",
  "reach",
  "views",
  "clicks",
  "leads",
  "sales",
  "commissions",
];

export function emptyMetric(key: MetricKey): MetricSnapshot {
  return {
    key,
    value: 0,
    previousValue: 0,
    deltaPct: null,
    series: [],
    ...(key === "commissions" ? { unit: "USD" } : {}),
  };
}

export function emptyDashboardAnalytics(range: TimeRange): DashboardAnalytics {
  return {
    range,
    generatedAt: new Date().toISOString(),
    connected: false,
    source: "none",
    metrics: METRIC_KEYS.reduce(
      (acc, k) => {
        acc[k] = emptyMetric(k);
        return acc;
      },
      {} as Record<MetricKey, MetricSnapshot>,
    ),
  };
}
