import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Paperclip, Mic, Sparkles, Bot } from 'lucide-react';

type Msg = { id: string; from: 'ai' | 'user' | 'agent'; text: string; time: string };

const seed: Msg[] = [
  { id: '1', from: 'ai', text: "Hi 👋 I'm your AI concierge. Ask about apps, pricing, deployment, or reseller programs.", time: 'now' },
];

const suggestions = [
  'Recommend an AI tool for education',
  'How does the reseller program work?',
  'Compare top 3 dashboards',
];

export const LiveChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener('saashub:open-chat', h);
    return () => window.removeEventListener('saashub:open-chat', h);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs(m => [...m, { id: crypto.randomUUID(), from: 'user', text: t, time: now }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [
        ...m,
        {
          id: crypto.randomUUID(),
          from: 'ai',
          text: "Got it — I'm pulling the best matches from 900+ categories. A live specialist will join if you need deeper help.",
          time: now,
        },
      ]);
    }, 1100);
  };

  return (
    <>
      {/* Floating dock button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white shadow-[0_0_40px_-8px_rgba(34,211,238,0.8)] transition-transform hover:scale-110"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-background ring-2 ring-background">2</span>
          <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in">
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-600 shadow-[0_0_18px_rgba(34,211,238,0.5)]">
                <Bot className="h-4.5 w-4.5 text-white" />
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Concierge</p>
                <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Online · Avg reply 12s
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white shadow-[0_4px_20px_-4px_rgba(34,211,238,0.5)]'
                      : 'border border-white/10 bg-white/5 text-foreground'
                  }`}
                >
                  {m.text}
                  <div className={`mt-1 text-[9px] ${m.from === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>{m.time}</div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '120ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* AI suggestions */}
          {msgs.length <= 2 && (
            <div className="border-t border-white/10 px-3 py-2">
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-cyan-300" /> AI Suggestions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:border-cyan-400/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/10 p-3">
            <form
              onSubmit={e => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md focus-within:border-cyan-400/40 focus-within:shadow-[0_0_20px_-6px_rgba(34,211,238,0.45)]"
            >
              <button type="button" className="text-muted-foreground transition-colors hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button type="button" className="text-muted-foreground transition-colors hover:text-foreground">
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white shadow-[0_0_14px_-3px_rgba(34,211,238,0.6)] transition-all hover:scale-105 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
              Multilingual · Realtime · End-to-end encrypted
            </p>
          </div>
        </div>
      )}
    </>
  );
};
