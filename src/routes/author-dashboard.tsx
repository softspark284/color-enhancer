import { createFileRoute } from "@tanstack/react-router";

import { ModuleDashboard } from "@/components/creator/ModuleDashboard";
import { PageShell } from "@/components/creator/PageShell";
import { authorConfig } from "@/components/creator/moduleConfigs";
import { moduleAnalyticsQueryOptions } from "@/lib/creator/analytics.functions";

export const Route = createFileRoute("/author-dashboard")({
  head: () => ({
    meta: [
      { title: "Author Dashboard — Software Vala" },
      {
        name: "description",
        content:
          "Author studio: publish products and content, track views, reach and sales, and settle author royalty.",
      },
      { property: "og:title", content: "Author Dashboard — Software Vala" },
      {
        property: "og:description",
        content: "Publish, measure and get paid — the Software Vala author studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(moduleAnalyticsQueryOptions("author", "7d")),
  component: () => <ModuleDashboard config={authorConfig} />,
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
