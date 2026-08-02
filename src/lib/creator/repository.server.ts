// Server-only repository for Creator Manager analytics. Talks to the configured
// Software Vala backend over HTTP. When env is not configured it returns a
// well-formed empty snapshot so the UI renders a true zero-state — never
// fake or demo data.
//
// Environment contract (all optional; absence = not connected):
//   SOFTWARE_VALA_API_URL          Base URL of the analytics API.
//   SOFTWARE_VALA_API_KEY          Bearer token for the Authorization header.
//   SOFTWARE_VALA_ANALYTICS_PATH   Path appended to base URL
//                                  (default: /v1/influencer/analytics).

import {
  emptyDashboardAnalytics,
  METRIC_KEYS,
  type DashboardAnalytics,
  type MetricKey,
  type MetricSnapshot,
  type TimeRange,
} from "./types";

export interface FetchAnalyticsParams {
  range: TimeRange;
  influencerId?: string | undefined;
}

export async function fetchDashboardAnalytics(
  params: FetchAnalyticsParams,
): Promise<DashboardAnalytics> {
  const baseUrl = process.env["SOFTWARE_VALA_API_URL"];
  const apiKey = process.env["SOFTWARE_VALA_API_KEY"];

  if (!baseUrl || !apiKey) {
    return emptyDashboardAnalytics(params.range);
  }

  const path = process.env["SOFTWARE_VALA_ANALYTICS_PATH"] ?? "/v1/influencer/analytics";
  const url = new URL(path, baseUrl);
  url.searchParams.set("range", params.range);
  if (params.influencerId) url.searchParams.set("influencerId", params.influencerId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Software Vala analytics API ${res.status} ${res.statusText}`);
  }

  return normalizeAnalytics((await res.json()) as unknown, params.range);
}

function normalizeAnalytics(raw: unknown, range: TimeRange): DashboardAnalytics {
  if (!raw || typeof raw !== "object") throw new Error("Invalid analytics payload");
  const r = raw as Partial<DashboardAnalytics>;
  const base = emptyDashboardAnalytics(range);

  const metrics = { ...base.metrics };
  for (const key of METRIC_KEYS) {
    const m = (r.metrics as Record<MetricKey, MetricSnapshot> | undefined)?.[key];
    if (m) metrics[key] = { ...base.metrics[key], ...m, key };
  }

  return {
    range: r.range ?? range,
    generatedAt: r.generatedAt ?? new Date().toISOString(),
    connected: true,
    source: r.source ?? "software-vala",
    metrics,
  };
}
