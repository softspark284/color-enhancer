import { createFileRoute } from "@tanstack/react-router";

import { requireSession } from "@/lib/auth-guard";

import { ModuleDashboard } from "@/components/creator/ModuleDashboard";
import { PageShell } from "@/components/creator/PageShell";
import { affiliateConfig } from "@/components/creator/moduleConfigs";
import { moduleAnalyticsQueryOptions } from "@/lib/creator/analytics.functions";

export const Route = createFileRoute("/affiliate-dashboard")({
  ssr: false,
  beforeLoad: () => requireSession("/affiliate-dashboard"),
  head: () => ({
    meta: [
      { title: "Affiliate Dashboard — Software Vala" },
      {
        name: "description",
        content:
          "Affiliate console: tracking links, clicks, conversions, campaign performance, payouts and lifetime commission.",
      },
      { property: "og:title", content: "Affiliate Dashboard — Software Vala" },
      {
        property: "og:description",
        content: "Track every link, conversion and commission payout in one affiliate console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(moduleAnalyticsQueryOptions("affiliate", "7d")),
  component: () => <ModuleDashboard config={affiliateConfig} />,
  errorComponent: ({ error }) => (
    <div className="creator-theme min-h-screen">
      <PageShell>
        <div className="bento-card py-16 text-center">
          <h2 className="text-lg font-semibold">Analytics unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </PageShell>
    </div>
  ),
});
