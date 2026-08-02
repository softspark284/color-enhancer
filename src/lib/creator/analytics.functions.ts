// Client-safe server-function entry point for Creator Manager analytics.
// Components import this module; the repository (.server.ts) is loaded only
// inside the handler body and is stripped from the client bundle.

import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import type { DashboardAnalytics, TimeRange } from "./types";

export const getCreatorAnalytics = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({
        range: z.enum(["1d", "7d", "30d", "90d"]).default("7d"),
        influencerId: z.string().min(1).optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }): Promise<DashboardAnalytics> => {
    const { fetchDashboardAnalytics } = await import("./repository.server");
    return fetchDashboardAnalytics(data);
  });

export const creatorAnalyticsQueryOptions = (range: TimeRange = "7d") =>
  queryOptions({
    queryKey: ["creator-analytics", range] as const,
    queryFn: () => getCreatorAnalytics({ data: { range } }),
    staleTime: 60_000,
  });
