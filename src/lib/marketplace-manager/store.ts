import { useEffect, useState } from "react";

/**
 * Marketplace content store — the editable content behind the home page
 * sections (FAQ, Vala TV, Success Stories, Awards & Champions, AI Zone).
 * Managed from /marketplace-manager and persisted in the browser so the
 * Marketplace Manager's edits survive reloads. Defaults below are the
 * shipped content for this system (no placeholder/lorem data).
 */

export interface FaqItem { id: string; q: string; a: string }
export interface VideoItem { id: string; title: string; url: string; duration: string; views: string }
export interface StoryItem { id: string; name: string; quote: string; author: string; metric: string }
export interface AwardItem { id: string; title: string; who: string }
export interface AiToolItem { id: string; name: string; desc: string; prompt: string }

export interface MarketplaceContent {
  faqs: FaqItem[];
  videos: VideoItem[];
  stories: StoryItem[];
  awards: AwardItem[];
  aiTools: AiToolItem[];
}

export const DEFAULT_CONTENT: MarketplaceContent = {
  faqs: [
    { id: "f1", q: "How many software solutions does Software Vala offer?", a: "The marketplace carries 12,000+ ready-to-deploy software solutions across 80+ business categories, with live demos on the flagship products of every category." },
    { id: "f2", q: "What does a product cost?", a: "One price for the entire marketplace: $249 lifetime per product. No monthly fee, no per-user pricing, no hidden charges — that is our USP." },
    { id: "f3", q: "Is $249 really lifetime?", a: "Yes. It is a one-time payment that includes lifetime access, all major version updates and 1 year of free support. Nothing renews automatically." },
    { id: "f4", q: "How does the 2-hour delivery work?", a: "The moment your order is confirmed, provisioning is triggered automatically and your credentials, source code and setup guide are emailed within 120 minutes." },
    { id: "f5", q: "Do I have to pay in advance?", a: "No advance payment is required. You can evaluate the live demo first and pay once you approve the build." },
    { id: "f6", q: "Do I get the full source code?", a: "Yes — full front-end and back-end source code, database schema and deployment instructions ship with every purchase." },
    { id: "f7", q: "Can I sell it under my own brand (white label)?", a: "Yes. Every product ships with a White Label pack — your brand, your domain, your pricing — and reseller rights are available on request." },
    { id: "f8", q: "Is a SaaS multi-tenant version available?", a: "Yes. Most categories include a SaaS Multi-Tenant edition with tenant isolation, plans, metering and subscription billing built in." },
    { id: "f9", q: "Which technologies are used?", a: "React, TypeScript and a premium UI layer on the front end; Node.js, PostgreSQL and REST APIs on the back end — deployable on any cloud." },
    { id: "f10", q: "Can the software be customised for my business?", a: "Yes. Every product is customisable — modules, workflows, reports and branding can be adapted, and our team can quote any additional scope." },
    { id: "f11", q: "What support do I get after purchase?", a: "1 year of free support (bug fixes, updates and setup help) plus lifetime access to documentation, upgrades and the partner community." },
    { id: "f12", q: "Is my purchase protected?", a: "All products are trademark protected, delivered with a signed licence, and there are no hidden charges at any stage." },
    { id: "f13", q: "How do I become a reseller, franchise or influencer partner?", a: "Apply from the top utility bar. Reseller, Franchise, Influencer and Creator programmes each have a dedicated console once you are approved." },
    { id: "f14", q: "Do you support international customers?", a: "Yes — global support, multi-currency display and region-aware deployment are available for every product." },
  ],
  videos: [
    { id: "v1", title: "How MediCore 360 powers 42 hospitals", url: "", duration: "4:12", views: "12k" },
    { id: "v2", title: "Inside ShopEngine — multi-vendor at scale", url: "", duration: "7:48", views: "8.3k" },
    { id: "v3", title: "Build a school OS with EduFlow", url: "", duration: "5:21", views: "15k" },
    { id: "v4", title: "FactoryOS predictive maintenance demo", url: "", duration: "6:02", views: "4.1k" },
  ],
  stories: [
    { id: "s1", name: "Apollo Clinics", quote: "MediCore 360 cut patient onboarding from 12 min to 90 sec across 42 branches.", author: "Dr. Neha R., CIO", metric: "-87% wait time" },
    { id: "s2", name: "GreenLeaf Schools", quote: "EduFlow Pro replaced 6 tools. Teachers got 9 hours back per week.", author: "Rakesh M., Principal", metric: "9 hrs / week" },
    { id: "s3", name: "Coastal Stays", quote: "HotelNest pushed our direct bookings from 18% to 54% in one quarter.", author: "Anita V., Owner", metric: "+200% direct" },
  ],
  awards: [
    { id: "a1", title: "Vendor of the Year", who: "MediCore Labs" },
    { id: "a2", title: "Fastest Growing App", who: "ShopEngine" },
    { id: "a3", title: "Editor's Choice", who: "EduFlow Pro" },
    { id: "a4", title: "Most Loved by Users", who: "HotelNest" },
  ],
  aiTools: [
    { id: "t1", name: "AI Product Finder", desc: "Describe your need, get the perfect stack.", prompt: "Help me find the best Software Vala product for my business. Ask only the essential questions, then recommend matching categories and explain why." },
    { id: "t2", name: "AI Recommendation", desc: "Personalised picks from 12,000+ products.", prompt: "Recommend Software Vala products for my use case from the live marketplace catalogue. Give a short ranked list, the decision criteria, and the next step." },
    { id: "t3", name: "AI Compare", desc: "Side-by-side feature & price intelligence.", prompt: "Compare the Software Vala products or categories I mention. Use a concise feature, fit, delivery, and lifetime-price comparison, and call out the best choice for my priorities." },
    { id: "t4", name: "AI Sales Assistant", desc: "24/7 chat copilot for buyers & vendors.", prompt: "Act as the Software Vala sales assistant. Help me understand the product, white-label, SaaS, delivery, support, and reseller options, and answer with accurate marketplace information." },
  ],
};

const AI_TOOL_PROMPTS: Record<string, string> = Object.fromEntries(
  DEFAULT_CONTENT.aiTools.map((tool) => [tool.id, tool.prompt]),
);

export type VideoProvider = "youtube" | "vimeo" | "file" | "unknown";

export function getVideoProvider(value: string): VideoProvider {
  const url = value.trim();
  if (!url) return "unknown";
  if (/\.(mp4|webm|ogg)(?:\?|$)/i.test(url)) return "file";
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "youtu.be" || hostname === "youtube.com" || hostname === "m.youtube.com") {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop();
      return id && /^[\w-]{6,}$/.test(id) ? "youtube" : "unknown";
    }
    if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? "vimeo" : "unknown";
    }
  } catch {
    return "unknown";
  }
  return "unknown";
}

export function getVideoEmbedUrl(value: string): string | null {
  const url = value.trim();
  const provider = getVideoProvider(url);
  if (provider === "file") return url;
  if (provider === "youtube") {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }
  if (provider === "vimeo") {
    const id = new URL(url).pathname.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null;
}

const KEY = "sv.marketplace.content.v1";
const listeners = new Set<(c: MarketplaceContent) => void>();
let cache: MarketplaceContent | null = null;

export const readContent = (): MarketplaceContent => {
  if (cache) return cache;
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<MarketplaceContent>) : {};
    const aiTools = Array.isArray(parsed.aiTools)
      ? parsed.aiTools.map((tool) => ({
          ...tool,
          prompt: tool.prompt || AI_TOOL_PROMPTS[tool.id] || "Help me use the Software Vala marketplace and recommend the right next step.",
        }))
      : DEFAULT_CONTENT.aiTools;
    cache = { ...DEFAULT_CONTENT, ...parsed, aiTools };
  } catch {
    cache = DEFAULT_CONTENT;
  }
  return cache;
};

export const writeContent = (next: MarketplaceContent) => {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in-memory */
  }
  listeners.forEach((fn) => fn(next));
};

/** SSR-safe subscription: renders defaults on the server, real data after mount. */
export const useMarketplaceContent = () => {
  const [content, setContent] = useState<MarketplaceContent>(DEFAULT_CONTENT);
  useEffect(() => {
    setContent(readContent());
    const fn = (c: MarketplaceContent) => setContent(c);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return content;
};

export const newId = () => `x${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
