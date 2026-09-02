import { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import type { AiToolItem } from "@/lib/marketplace-manager/store";

type Props = {
  tool: AiToolItem | null;
  onClose: () => void;
};

type RunState = "idle" | "running" | "error";

export function MarketplaceAiToolDialog({ tool, onClose }: Props) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!tool) return;
    setInput("");
    setAnswer("");
    setError(null);
    setRunState("idle");
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => abortRef.current?.abort();
  }, [tool]);

  if (!tool) return null;

  const runTool = async () => {
    if (runState === "running") return;
    const request = input.trim() || "Start by asking me the key questions you need.";
    setAnswer("");
    setError(null);
    setRunState("running");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [{ role: "user", content: `${tool.prompt}\n\nUser request: ${request}` }],
        }),
      });

      if (!response.ok || !response.body) {
        const message = await response.text().catch(() => "");
        throw new Error(message || `The AI tool could not start (${response.status}).`);
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let fullAnswer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim().startsWith("data:") ? line.trim().slice(5).trim() : "";
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            fullAnswer += delta;
            setAnswer(fullAnswer);
          } catch {
            // Ignore incomplete SSE frames; the next frame contains the rest.
          }
        }
      }
      setRunState("idle");
    } catch (caught) {
      if ((caught as Error).name === "AbortError") return;
      setError((caught as Error).message || "The AI tool could not respond.");
      setRunState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="marketplace-ai-tool-title"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/30 bg-[oklch(0.12_0.04_265)] shadow-2xl"
      >
        <header className="flex items-start gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">Vala AI tool</p>
            <h2 id="marketplace-ai-tool-title" className="mt-1 text-lg font-bold text-white">{tool.name}</h2>
            <p className="mt-1 text-xs text-white/60">{tool.desc}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close AI tool" className="rounded-lg border border-white/10 p-2 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 p-5">
          {answer && (
            <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-cyan-400/20 bg-cyan-500/[0.06] p-4 text-sm leading-relaxed text-white/90">
              {answer}
            </div>
          )}
          {error && <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-200">{error}</p>}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void runTool();
              }
            }}
            rows={3}
            placeholder="Tell Vala what you need…"
            className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/60"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-white/45">Powered by the live Vala AI assistant</p>
            <button type="button" onClick={() => void runTool()} disabled={runState === "running"} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-opacity disabled:opacity-50">
              {runState === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {runState === "running" ? "Working…" : "Run tool"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}