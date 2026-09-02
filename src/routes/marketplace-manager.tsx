import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react";
import {
  readContent,
  writeContent,
  DEFAULT_CONTENT,
  newId,
  getVideoEmbedUrl,
  getVideoProvider,
  type MarketplaceContent,
} from "@/lib/marketplace-manager/store";
import { LIFETIME_PRICE_FULL, SOFTWARE_COUNT, CATEGORY_COUNT } from "@/lib/marketplace-content/stats";

export const Route = createFileRoute("/marketplace-manager")({
  head: () => ({
    meta: [
      { title: "Marketplace Manager — Software Vala Content Console" },
      {
        name: "description",
        content:
          "Manage marketplace home page content: FAQs, Vala TV videos, success stories, awards and AI Zone tools.",
      },
      { property: "og:title", content: "Marketplace Manager — Software Vala" },
      { property: "og:description", content: "Content console for FAQs, Vala TV videos, stories and awards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketplaceManager,
});

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-cyan-400/60";

const TABS = ["FAQs", "Vala TV", "Success Stories", "Awards", "AI Zone"] as const;
type Tab = (typeof TABS)[number];

function MarketplaceManager() {
  const [draft, setDraft] = useState<MarketplaceContent>(() => readContent());
  const [tab, setTab] = useState<Tab>("FAQs");

  const save = () => {
    writeContent(draft);
    toast.success("Marketplace content published");
  };
  const reset = () => {
    setDraft(DEFAULT_CONTENT);
    writeContent(DEFAULT_CONTENT);
    toast.success("Restored default content");
  };

  const patch = <K extends keyof MarketplaceContent>(key: K, value: MarketplaceContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1e36] to-[#0a1628] text-white">
      <header className="border-b border-cyan-500/20 bg-[#0d1e36]/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-[13px] font-semibold text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div>
            <h1 className="text-xl font-bold">Marketplace Manager</h1>
            <p className="text-xs text-white/60">
              {SOFTWARE_COUNT} software · {CATEGORY_COUNT} categories · one price {LIFETIME_PRICE_FULL}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={reset} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[13px] font-semibold">
              Reset
            </button>
            <button onClick={save} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2 text-[13px] font-bold">
              <Save className="h-4 w-4" /> Publish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
                tab === t ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40" : "bg-white/5 text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "FAQs" && (
          <Section
            title="Frequently Asked Questions"
            onAdd={() => patch("faqs", [...draft.faqs, { id: newId(), q: "", a: "" }])}
          >
            {draft.faqs.map((f, i) => (
              <Row key={f.id} onRemove={() => patch("faqs", draft.faqs.filter((x) => x.id !== f.id))}>
                <input
                  className={inputCls}
                  placeholder="Question"
                  value={f.q}
                  onChange={(e) => {
                    const next = [...draft.faqs];
                    next[i] = { ...f, q: e.target.value };
                    patch("faqs", next);
                  }}
                />
                <textarea
                  className={`${inputCls} min-h-[70px]`}
                  placeholder="Answer"
                  value={f.a}
                  onChange={(e) => {
                    const next = [...draft.faqs];
                    next[i] = { ...f, a: e.target.value };
                    patch("faqs", next);
                  }}
                />
              </Row>
            ))}
          </Section>
        )}

        {tab === "Vala TV" && (
          <Section
            title="Vala TV videos"
            hint="Paste a public YouTube or Vimeo link — it is validated and plays inline on the home page."
            onAdd={() => patch("videos", [...draft.videos, { id: newId(), title: "", url: "", duration: "", views: "" }])}
          >
            {draft.videos.map((v, i) => (
              <Row key={v.id} onRemove={() => patch("videos", draft.videos.filter((x) => x.id !== v.id))}>
                <input
                  className={inputCls}
                  placeholder="Video title"
                  value={v.title}
                  onChange={(e) => {
                    const next = [...draft.videos];
                    next[i] = { ...v, title: e.target.value };
                    patch("videos", next);
                  }}
                />
                <input
                  className={inputCls}
                  placeholder="Video URL (https://youtu.be/...)"
                  value={v.url}
                  onChange={(e) => {
                    const next = [...draft.videos];
                    next[i] = { ...v, url: e.target.value };
                    patch("videos", next);
                  }}
                />
                {v.url && (
                  <div className="space-y-2">
                    <div className={`text-[11px] font-semibold ${getVideoProvider(v.url) === "unknown" ? "text-rose-300" : "text-emerald-300"}`}>
                      {getVideoProvider(v.url) === "unknown" ? "Invalid link — use a YouTube or Vimeo URL" : `Ready to play · ${getVideoProvider(v.url)}`}
                    </div>
                    {getVideoProvider(v.url) !== "file" && getVideoEmbedUrl(v.url) && (
                      <div className="aspect-video max-w-md overflow-hidden rounded-lg border border-white/10 bg-black/30">
                        <iframe src={getVideoEmbedUrl(v.url) ?? undefined} title={`${v.title || "Vala TV"} preview`} className="h-full w-full" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    placeholder="Duration (4:12)"
                    value={v.duration}
                    onChange={(e) => {
                      const next = [...draft.videos];
                      next[i] = { ...v, duration: e.target.value };
                      patch("videos", next);
                    }}
                  />
                  <input
                    className={inputCls}
                    placeholder="Views (12k)"
                    value={v.views}
                    onChange={(e) => {
                      const next = [...draft.videos];
                      next[i] = { ...v, views: e.target.value };
                      patch("videos", next);
                    }}
                  />
                </div>
              </Row>
            ))}
          </Section>
        )}

        {tab === "Success Stories" && (
          <Section
            title="Success stories"
            onAdd={() => patch("stories", [...draft.stories, { id: newId(), name: "", quote: "", author: "", metric: "" }])}
          >
            {draft.stories.map((s, i) => (
              <Row key={s.id} onRemove={() => patch("stories", draft.stories.filter((x) => x.id !== s.id))}>
                <input
                  className={inputCls}
                  placeholder="Customer name"
                  value={s.name}
                  onChange={(e) => {
                    const next = [...draft.stories];
                    next[i] = { ...s, name: e.target.value };
                    patch("stories", next);
                  }}
                />
                <textarea
                  className={`${inputCls} min-h-[70px]`}
                  placeholder="Quote"
                  value={s.quote}
                  onChange={(e) => {
                    const next = [...draft.stories];
                    next[i] = { ...s, quote: e.target.value };
                    patch("stories", next);
                  }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    placeholder="Author"
                    value={s.author}
                    onChange={(e) => {
                      const next = [...draft.stories];
                      next[i] = { ...s, author: e.target.value };
                      patch("stories", next);
                    }}
                  />
                  <input
                    className={inputCls}
                    placeholder="Metric (+200% direct)"
                    value={s.metric}
                    onChange={(e) => {
                      const next = [...draft.stories];
                      next[i] = { ...s, metric: e.target.value };
                      patch("stories", next);
                    }}
                  />
                </div>
              </Row>
            ))}
          </Section>
        )}

        {tab === "Awards" && (
          <Section
            title="Awards & Champions"
            onAdd={() => patch("awards", [...draft.awards, { id: newId(), title: "", who: "" }])}
          >
            {draft.awards.map((a, i) => (
              <Row key={a.id} onRemove={() => patch("awards", draft.awards.filter((x) => x.id !== a.id))}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    placeholder="Award title"
                    value={a.title}
                    onChange={(e) => {
                      const next = [...draft.awards];
                      next[i] = { ...a, title: e.target.value };
                      patch("awards", next);
                    }}
                  />
                  <input
                    className={inputCls}
                    placeholder="Winner"
                    value={a.who}
                    onChange={(e) => {
                      const next = [...draft.awards];
                      next[i] = { ...a, who: e.target.value };
                      patch("awards", next);
                    }}
                  />
                </div>
              </Row>
            ))}
          </Section>
        )}

        {tab === "AI Zone" && (
          <Section
            title="AI Zone tools"
            hint="Each tool opens a live Vala AI workflow. Configure the task prompt that powers it."
            onAdd={() => patch("aiTools", [...draft.aiTools, { id: newId(), name: "", desc: "", prompt: "Help the customer with their Software Vala marketplace request and recommend the right next step." }])}
          >
            {draft.aiTools.map((t, i) => (
              <Row key={t.id} onRemove={() => patch("aiTools", draft.aiTools.filter((x) => x.id !== t.id))}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    className={inputCls}
                    placeholder="Tool name"
                    value={t.name}
                    onChange={(e) => {
                      const next = [...draft.aiTools];
                      next[i] = { ...t, name: e.target.value };
                      patch("aiTools", next);
                    }}
                  />
                  <input
                    className={inputCls}
                    placeholder="Short description"
                    value={t.desc}
                    onChange={(e) => {
                      const next = [...draft.aiTools];
                      next[i] = { ...t, desc: e.target.value };
                      patch("aiTools", next);
                    }}
                  />
                </div>
                <textarea
                  className={`${inputCls} min-h-[84px]`}
                  placeholder="Live AI task prompt"
                  value={t.prompt}
                  onChange={(e) => {
                    const next = [...draft.aiTools];
                    next[i] = { ...t, prompt: e.target.value };
                    patch("aiTools", next);
                  }}
                />
              </Row>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

const Section = ({
  title,
  hint,
  onAdd,
  children,
}: {
  title: string;
  hint?: string;
  onAdd: () => void;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
    <div className="mb-4 flex items-center gap-3">
      <div>
        <h2 className="text-base font-bold">{title}</h2>
        {hint && <p className="text-[11px] text-white/50">{hint}</p>}
      </div>
      <button
        onClick={onAdd}
        className="ml-auto flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-[12px] font-semibold text-cyan-200"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Row = ({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) => (
  <div className="relative space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 pr-12">
    {children}
    <button
      onClick={onRemove}
      aria-label="Remove"
      className="absolute right-3 top-3 rounded-lg border border-rose-400/30 bg-rose-500/10 p-2 text-rose-300"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </div>
);
