import React, { useState, useEffect, useMemo, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Default objection library                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_LIBRARY = [
  {
    id: "not-interested",
    title: "Not interested",
    triggers: ["not interested", "no interest", "not for us", "no thanks", "we're good"],
    acknowledge:
      "Totally fair — I'm calling you out of the blue, so I'd honestly be surprised if you were.",
    respond:
      "Most of the people we work with said the exact same thing on the first call. What changed their mind was seeing [specific result — e.g. a 15–20% reduction at renewal without switching carriers].",
    pivot:
      "Out of curiosity — when does your current plan renew? If I sent over one idea worth keeping on file, would a 15-minute call next week be unreasonable?",
  },
  {
    id: "have-contract",
    title: "We already have a contract",
    triggers: ["already have a contract", "under contract", "locked in", "signed a contract", "in a contract", "contract with"],
    acknowledge:
      "That makes sense — most companies your size are under contract, and I wouldn't ask you to break it.",
    respond:
      "This isn't about replacing anything today. It's about having a benchmark in hand before your renewal, so when that contract comes up you're negotiating from strength instead of accepting the increase.",
    pivot:
      "When does that contract actually expire? The best time to compare is 60–90 days out — can I put a short call on the calendar ahead of that window?",
  },
  {
    id: "send-email",
    title: "Send me an email",
    triggers: ["send me an email", "send me some information", "send me something", "shoot me an email", "email me", "send over some info", "send me info"],
    acknowledge:
      "Happy to — I'll get something over to you today.",
    respond:
      "So I don't send you a generic brochure that goes straight to trash: the useful version is tailored to your situation. Two quick questions and I can send something actually worth your time.",
    pivot:
      "What's the biggest headache with your current setup — [cost, service, claims, admin]? And what's the best email? I'll send it today and follow up Thursday to see if it landed.",
  },
  {
    id: "no-brokers",
    title: "We don't work with brokers",
    triggers: ["don't work with brokers", "no brokers", "not using a broker", "don't use brokers", "deal direct", "go direct", "third party"],
    acknowledge:
      "I hear that a lot — and usually it comes from a bad experience with a broker who disappeared after the sale.",
    respond:
      "The difference is what you get for the same dollar. Carriers price the same whether you go direct or not — with us, that built-in cost buys you [an advocate at claims time, annual market comparisons, compliance support] instead of nothing.",
    pivot:
      "Can I ask what soured you on brokers before? If I could show you exactly what we'd handle that you're doing yourself right now, would that be worth 15 minutes?",
  },
  {
    id: "no-invoices",
    title: "We don't share invoices",
    triggers: ["don't share invoices", "don't share our invoices", "can't share invoices", "won't send invoices", "not sharing our invoice", "that's confidential", "don't give out invoices"],
    acknowledge:
      "Completely understandable — that's sensitive information, and you don't know me yet.",
    respond:
      "Here's why I ask: the invoice is the only place you can see the [fees, surcharges, and rate creep] you're actually paying versus what you were originally sold. Anything you share stays confidential, and most clients find [savings or hidden charges] sitting in line items nobody had looked at in years.",
    pivot:
      "What if we start smaller — just [the rate page, a redacted copy, or your renewal letter]? If I can't find you anything with that, I'll tell you straight and get out of your hair.",
  },
  {
    id: "just-quote",
    title: "Just send me a quote",
    triggers: ["send me a quote", "just send a quote", "give me a quote", "shoot me a quote", "just quote", "send a ballpark", "give me a ballpark", "just give me a price"],
    acknowledge:
      "Happy to get you a number — that's literally what I'm here for.",
    respond:
      "A blind quote would be a guess, and a guess wastes your time: it either looks artificially cheap or wrongly expensive, and you can't act on either. With [2–3 details about your current setup], the number I send is a real apples-to-apples comparison.",
    pivot:
      "Can you pull up [your current dec page, latest invoice, or renewal terms]? Give me ten minutes with that and you'll have a quote you can actually use by [day].",
  },
  {
    id: "not-looking-change",
    title: "We aren't looking for a change",
    triggers: ["not looking for a change", "not looking to change", "aren't looking for a change", "not looking to switch", "no plans to change", "not making a change", "not switching"],
    acknowledge:
      "Good — honestly, the companies actively shopping are usually the ones with a problem.",
    respond:
      "This isn't about changing anything. It's about knowing what the market looks like so your current provider keeps earning the business. Companies that benchmark regularly almost always get better treatment from the incumbent — silence is what lets rates drift.",
    pivot:
      "When's your renewal? A 15-minute look 60–90 days before it costs you nothing and gives you leverage either way.",
  },
  {
    id: "rates-fine",
    title: "Our rates are fine",
    triggers: ["rates are fine", "rate is fine", "our rate is good", "rates are good", "good rate", "competitive rate", "rates are competitive", "pricing is fine"],
    acknowledge:
      "That might be true — some companies genuinely do have a great deal.",
    respond:
      "But 'fine' compared to what? The market has moved [X% over the last 12 months], and the only way to know your rate is fine is to put it next to today's number. If you're right, you've lost ten minutes. If you're not, that's real money back every month.",
    pivot:
      "Want to settle it? Tell me [roughly what you're paying now] and I'll tell you honestly whether you should stay put.",
  },
  {
    id: "long-relationship",
    title: "Long-standing relationship",
    triggers: ["long standing relationship", "longstanding relationship", "been with them for years", "been with them forever", "known them for years", "relationship for years", "loyal to", "great relationship with"],
    acknowledge:
      "I respect that — loyalty like that is rare, and a good relationship is genuinely worth something.",
    respond:
      "I'm not asking you to end it. But long relationships are exactly where rate creep hides — incumbents stop sharpening the pencil when they know you'll never look around. A benchmark either confirms they're taking care of you, or hands you what you need to hold them accountable.",
    pivot:
      "If I found a [meaningful gap], wouldn't you at least want to bring it to them? Worst case, they match it and you keep the relationship at a better number.",
  },
  {
    id: "not-about-price",
    title: "It's not all about price",
    triggers: ["not all about price", "not just about price", "not about the price", "not just price", "more than price", "more than just price", "price isn't everything"],
    acknowledge:
      "Couldn't agree more — the cheapest option is often the most expensive mistake.",
    respond:
      "That's actually why I called. Beyond price, we compete on [service, claims advocacy, response time, reporting] — the things you only feel when something goes wrong. Price just happens to be the easiest thing to compare on a first call.",
    pivot:
      "So what matters most to you — [service, coverage, stability]? Tell me that, and I'll show you exactly how we stack up where it counts.",
  },
  {
    id: "happy-current",
    title: "Happy with our current provider",
    triggers: ["happy with", "satisfied with", "current provider", "works fine", "no complaints", "like who we have", "happy with who", "who we're with", "happy where we are"],
    acknowledge:
      "That's great to hear — a relationship that works is genuinely worth something.",
    respond:
      "I'm not asking you to leave them. Companies that benchmark every year or two keep their current provider honest — and most find out they're either overpaying or missing [a service, coverage, or technology] they didn't know existed.",
    pivot:
      "If a quick side-by-side showed you were getting full value, you'd have peace of mind. If it showed a gap, you'd want to know. Either way you win — can we look at it after your busy season?",
  },
  {
    id: "too-expensive",
    title: "Too expensive / no budget",
    triggers: ["too expensive", "no budget", "can't afford", "costs too much", "don't have the budget", "too much money"],
    acknowledge:
      "Budget pressure is real — especially this year, I get it.",
    respond:
      "That's actually why this conversation exists. Most of our clients came to us because of cost — we found them an average of [$X or X%] in savings or recovered value. The expensive thing is usually the status quo nobody has audited.",
    pivot:
      "If I could show you where the money is leaking at no cost to look, what would stop you from at least seeing the number?",
  },
  {
    id: "no-time",
    title: "I don't have time",
    triggers: ["don't have time", "no time", "i'm busy", "too busy", "really busy", "in a meeting", "bad time", "swamped", "running into a meeting"],
    acknowledge:
      "Sounds like I caught you mid-fire-drill — I'll be quick.",
    respond:
      "I only need one thing right now: thirty seconds to tell you why I called, so you can decide if it's ever worth more. [One-sentence value statement.]",
    pivot:
      "If that's even mildly relevant, when's a real time this week — Thursday morning or Friday after lunch?",
  },
  {
    id: "call-later",
    title: "Call me back later",
    triggers: ["call me back", "call back later", "call me later", "next quarter", "reach out later", "try me next", "circle back"],
    acknowledge:
      "Absolutely — timing matters and I'd rather catch you when this is actually useful.",
    respond:
      "So the callback isn't a cold call all over again: what's changing between now and then — [renewal, budget cycle, hiring]? That tells me what to bring to the table.",
    pivot:
      "Let's pin it down so neither of us has to chase: does [specific date/time] work? I'll send a calendar hold you can move if you need to.",
  },
  {
    id: "not-decision-maker",
    title: "I'm not the decision maker",
    triggers: ["not the decision maker", "not my call", "not my decision", "talk to my boss", "above my pay grade", "someone else handles"],
    acknowledge:
      "Thanks for being straight with me — that saves us both time.",
    respond:
      "You still know more about how this works day-to-day than anyone. The decision maker will ask your opinion anyway, so it's worth you seeing this first.",
    pivot:
      "Who actually owns this decision — and would it help if I sent you a one-pager you could forward, or should the three of us grab 15 minutes together?",
  },
];

/* ------------------------------------------------------------------ */
/*  Matching                                                           */
/* ------------------------------------------------------------------ */

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function findMatches(input, library) {
  const text = normalize(input);
  if (!text) return [];
  const results = [];
  for (const obj of library) {
    let score = 0;
    const hits = [];
    for (const trig of obj.triggers) {
      const t = normalize(trig);
      if (t && text.includes(t)) {
        score += t.length;
        hits.push(trig);
      }
    }
    if (score > 0) results.push({ obj, score, hits });
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

/* ------------------------------------------------------------------ */
/*  Script text with [placeholder] highlighting                        */
/* ------------------------------------------------------------------ */

function ScriptText({ text }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="oh-placeholder">{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "objection-handler:library";
const BEATS = [
  { key: "acknowledge", n: "1", label: "Acknowledge", hint: "Lower the guard. Agree with the feeling, never argue." },
  { key: "respond", n: "2", label: "Respond", hint: "Reframe with value. One proof point, not a pitch." },
  { key: "pivot", n: "3", label: "Pivot", hint: "Take back control. End with a question or next step." },
];

export default function ObjectionHandler() {
  const [library, setLibrary] = useState(DEFAULT_LIBRARY);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [pinnedId, setPinnedId] = useState(null);
  const [view, setView] = useState("live"); // live | library
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const inputRef = useRef(null);

  /* Load saved library */
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          if (Array.isArray(parsed) && parsed.length) setLibrary(parsed);
        }
      } catch (e) {
        /* no saved library yet — use defaults */
      }
      setLoaded(true);
    })();
  }, []);

  const persist = async (lib) => {
    setLibrary(lib);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(lib));
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (e) {
      console.error("Could not save library", e);
    }
  };

  const matches = useMemo(() => findMatches(input, library), [input, library]);
  const active =
    (pinnedId && library.find((o) => o.id === pinnedId)) ||
    (matches[0] && matches[0].obj) ||
    null;
  const activeHits = !pinnedId && matches[0] ? matches[0].hits : [];

  /* ------------- library editing ------------- */
  const startEdit = (obj) => {
    setEditingId(obj.id);
    setDraft({ ...obj, triggersText: obj.triggers.join(", ") });
  };
  const startNew = () => {
    const fresh = {
      id: "obj-" + Date.now(),
      title: "",
      triggersText: "",
      acknowledge: "",
      respond: "",
      pivot: "",
    };
    setEditingId(fresh.id);
    setDraft(fresh);
  };
  const saveDraft = () => {
    if (!draft.title.trim()) return;
    const obj = {
      id: draft.id,
      title: draft.title.trim(),
      triggers: draft.triggersText.split(",").map((t) => t.trim()).filter(Boolean),
      acknowledge: draft.acknowledge,
      respond: draft.respond,
      pivot: draft.pivot,
    };
    const exists = library.some((o) => o.id === obj.id);
    persist(exists ? library.map((o) => (o.id === obj.id ? obj : o)) : [...library, obj]);
    setEditingId(null);
    setDraft(null);
  };
  const deleteObj = (id) => {
    persist(library.filter((o) => o.id !== id));
    if (pinnedId === id) setPinnedId(null);
    if (editingId === id) { setEditingId(null); setDraft(null); }
  };
  const resetDefaults = () => {
    persist(DEFAULT_LIBRARY);
    setEditingId(null);
    setDraft(null);
  };

  return (
    <div className="oh-root">
      <style>{CSS}</style>

      {/* Header */}
      <header className="oh-header">
        <div className="oh-brand">
          <span className="oh-dot" />
          <h1>Objection Handler</h1>
          <span className="oh-sub">live call companion</span>
        </div>
        <nav className="oh-nav">
          <button className={view === "live" ? "on" : ""} onClick={() => setView("live")}>On the call</button>
          <button className={view === "library" ? "on" : ""} onClick={() => setView("library")}>
            Library ({library.length})
          </button>
          {savedFlash && <span className="oh-saved">Saved</span>}
        </nav>
      </header>

      {view === "live" ? (
        <main className="oh-live">
          {/* Left: listener */}
          <section className="oh-listen">
            <label className="oh-eyebrow" htmlFor="oh-input">What did the prospect just say?</label>
            <textarea
              id="oh-input"
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); setPinnedId(null); }}
              placeholder={'Type or paste it — e.g. "honestly we\'re not interested, we already have a contract"'}
              rows={4}
            />
            {activeHits.length > 0 && (
              <div className="oh-hits">
                Matched on{" "}
                {activeHits.map((h, i) => (
                  <code key={i}>{h}</code>
                ))}
              </div>
            )}

            <div className="oh-quick">
              <span className="oh-eyebrow">Or tap the objection</span>
              <div className="oh-chips">
                {library.map((o) => (
                  <button
                    key={o.id}
                    className={"oh-chip" + (active && active.id === o.id ? " hot" : "")}
                    onClick={() => { setPinnedId(o.id); setInput(""); }}
                  >
                    {o.title}
                  </button>
                ))}
              </div>
            </div>

            {matches.length > 1 && !pinnedId && (
              <div className="oh-also">
                <span className="oh-eyebrow">Also detected</span>
                {matches.slice(1, 4).map((m) => (
                  <button key={m.obj.id} className="oh-also-btn" onClick={() => setPinnedId(m.obj.id)}>
                    {m.obj.title} →
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right: talk track */}
          <section className="oh-track" aria-live="polite">
            {active ? (
              <div className="oh-card" key={active.id}>
                <div className="oh-card-head">
                  <span className="oh-eyebrow">Objection</span>
                  <h2>{active.title}</h2>
                </div>
                {BEATS.map((b) => (
                  <div className="oh-beat" key={b.key}>
                    <div className="oh-beat-rail">
                      <span className="oh-beat-n">{b.n}</span>
                    </div>
                    <div className="oh-beat-body">
                      <div className="oh-beat-label">
                        {b.label}
                        <span className="oh-beat-hint">{b.hint}</span>
                      </div>
                      <p className="oh-script"><ScriptText text={active[b.key]} /></p>
                    </div>
                  </div>
                ))}
                <div className="oh-card-foot">
                  Words in <span className="oh-placeholder">[brackets]</span> are yours to fill — edit them in the Library.
                </div>
              </div>
            ) : (
              <div className="oh-empty">
                <div className="oh-empty-mark">"</div>
                <p>Start typing what you hear, or tap an objection.</p>
                <p className="oh-empty-sub">
                  The talk track appears here the moment a trigger phrase like{" "}
                  <code>not interested</code> or <code>send me an email</code> is detected.
                </p>
              </div>
            )}
          </section>
        </main>
      ) : (
        /* ------------- Library view ------------- */
        <main className="oh-lib">
          <div className="oh-lib-bar">
            <p>Each objection fires when any of its trigger phrases appears in what you type. Keep triggers short and lowercase — punctuation and apostrophes are ignored.</p>
            <div className="oh-lib-actions">
              <button className="oh-btn primary" onClick={startNew}>+ Add objection</button>
              <button className="oh-btn ghost" onClick={resetDefaults}>Reset to defaults</button>
            </div>
          </div>

          {editingId && draft && (
            <div className="oh-edit">
              <div className="oh-edit-grid">
                <label>Objection name
                  <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder='e.g. "We handle this in-house"' />
                </label>
                <label>Trigger phrases <span className="oh-muted">(comma-separated)</span>
                  <input value={draft.triggersText} onChange={(e) => setDraft({ ...draft, triggersText: e.target.value })} placeholder="in house, handle it ourselves, internal team" />
                </label>
                {BEATS.map((b) => (
                  <label key={b.key} className="wide">{b.n}. {b.label} <span className="oh-muted">— {b.hint}</span>
                    <textarea rows={2} value={draft[b.key]} onChange={(e) => setDraft({ ...draft, [b.key]: e.target.value })} />
                  </label>
                ))}
              </div>
              <div className="oh-edit-foot">
                <button className="oh-btn primary" onClick={saveDraft} disabled={!draft.title.trim()}>Save objection</button>
                <button className="oh-btn ghost" onClick={() => { setEditingId(null); setDraft(null); }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="oh-lib-list">
            {library.map((o) => (
              <div className="oh-lib-row" key={o.id}>
                <div className="oh-lib-main">
                  <h3>{o.title}</h3>
                  <div className="oh-lib-trigs">
                    {o.triggers.map((t, i) => <code key={i}>{t}</code>)}
                  </div>
                </div>
                <div className="oh-lib-btns">
                  <button className="oh-btn ghost" onClick={() => startEdit(o)}>Edit</button>
                  <button className="oh-btn danger" onClick={() => deleteObj(o.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          {!loaded && <p className="oh-muted">Loading saved library…</p>}
        </main>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

:root{
  --paper:#EDF0F3;
  --ink:#17222E;
  --ink-soft:#4B5A68;
  --line:#C9D2DA;
  --cobalt:#2545D9;
  --cobalt-soft:#E3E8FB;
  --card:#FFFFFF;
  --gold:#9A6A0B;
  --gold-bg:#F6EDD8;
}
*{box-sizing:border-box}
.oh-root{
  min-height:100vh;background:var(--paper);color:var(--ink);
  font-family:'Space Grotesk',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
}
code{font-family:'JetBrains Mono',monospace;font-size:.78em;background:var(--cobalt-soft);color:var(--cobalt);padding:2px 7px;border-radius:4px;font-weight:600}

/* header */
.oh-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
  padding:18px 28px;border-bottom:1px solid var(--line);background:var(--card)}
.oh-brand{display:flex;align-items:baseline;gap:12px}
.oh-dot{width:10px;height:10px;border-radius:50%;background:var(--cobalt);align-self:center;animation:pulse 2.4s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(37,69,217,.35)}50%{box-shadow:0 0 0 7px rgba(37,69,217,0)}}
@media (prefers-reduced-motion: reduce){.oh-dot{animation:none}.oh-card{animation:none!important}}
.oh-brand h1{font-size:1.15rem;font-weight:700;margin:0;letter-spacing:-.01em}
.oh-sub{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.12em}
.oh-nav{display:flex;align-items:center;gap:8px}
.oh-nav button{font-family:inherit;font-weight:600;font-size:.85rem;padding:8px 16px;border-radius:999px;
  border:1px solid var(--line);background:transparent;color:var(--ink-soft);cursor:pointer}
.oh-nav button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.oh-nav button:focus-visible,.oh-btn:focus-visible,.oh-chip:focus-visible{outline:2px solid var(--cobalt);outline-offset:2px}
.oh-saved{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--cobalt)}

/* live layout */
.oh-live{display:grid;grid-template-columns:minmax(300px,420px) 1fr;gap:26px;padding:26px 28px;max-width:1240px;margin:0 auto}
@media(max-width:880px){.oh-live{grid-template-columns:1fr}}

.oh-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:.68rem;text-transform:uppercase;
  letter-spacing:.14em;color:var(--ink-soft);margin-bottom:8px}
.oh-listen textarea{width:100%;font-family:inherit;font-size:1.05rem;line-height:1.5;padding:14px 16px;
  border:1.5px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);resize:vertical}
.oh-listen textarea:focus{outline:none;border-color:var(--cobalt);box-shadow:0 0 0 3px var(--cobalt-soft)}
.oh-hits{margin-top:10px;font-size:.85rem;color:var(--ink-soft);display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.oh-quick{margin-top:26px}
.oh-chips{display:flex;flex-wrap:wrap;gap:8px}
.oh-chip{font-family:inherit;font-size:.83rem;font-weight:600;padding:8px 13px;border-radius:9px;cursor:pointer;
  border:1px solid var(--line);background:var(--card);color:var(--ink)}
.oh-chip:hover{border-color:var(--cobalt);color:var(--cobalt)}
.oh-chip.hot{background:var(--cobalt);border-color:var(--cobalt);color:#fff}
.oh-also{margin-top:22px;display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.oh-also-btn{font-family:inherit;font-size:.85rem;font-weight:600;color:var(--cobalt);background:none;border:none;cursor:pointer;padding:2px 0}

/* talk track card */
.oh-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:6px 0 0;
  box-shadow:0 10px 30px -18px rgba(23,34,46,.35);animation:rise .25s ease}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.oh-card-head{padding:20px 26px 6px;border-bottom:1px solid var(--line)}
.oh-card-head h2{margin:2px 0 14px;font-size:1.6rem;letter-spacing:-.02em;font-weight:700}
.oh-beat{display:grid;grid-template-columns:58px 1fr;border-bottom:1px solid var(--line)}
.oh-beat:last-of-type{border-bottom:none}
.oh-beat-rail{display:flex;justify-content:center;padding-top:22px;border-right:1px solid var(--line)}
.oh-beat-n{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:.8rem;color:var(--cobalt);
  width:28px;height:28px;border:1.5px solid var(--cobalt);border-radius:50%;display:flex;align-items:center;justify-content:center}
.oh-beat-body{padding:18px 26px 20px}
.oh-beat-label{font-weight:700;font-size:.92rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
.oh-beat-hint{font-weight:500;font-size:.75rem;text-transform:none;letter-spacing:0;color:var(--ink-soft)}
.oh-script{margin:0;font-size:1.12rem;line-height:1.55;color:var(--ink)}
.oh-placeholder{background:var(--gold-bg);color:var(--gold);border-radius:5px;padding:1px 5px;font-weight:600}
.oh-card-foot{padding:12px 26px 16px;font-size:.78rem;color:var(--ink-soft);border-top:1px dashed var(--line)}

/* empty state */
.oh-empty{border:1.5px dashed var(--line);border-radius:16px;padding:48px 32px;text-align:center;color:var(--ink-soft)}
.oh-empty-mark{font-size:4rem;line-height:1;color:var(--cobalt);font-weight:700}
.oh-empty p{font-size:1.05rem;margin:10px 0 6px;color:var(--ink)}
.oh-empty-sub{font-size:.88rem!important;color:var(--ink-soft)!important}

/* library */
.oh-lib{max-width:980px;margin:0 auto;padding:26px 28px}
.oh-lib-bar{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;flex-wrap:wrap;margin-bottom:20px}
.oh-lib-bar p{margin:0;max-width:560px;color:var(--ink-soft);font-size:.92rem;line-height:1.5}
.oh-lib-actions{display:flex;gap:8px}
.oh-btn{font-family:inherit;font-weight:600;font-size:.85rem;padding:9px 16px;border-radius:9px;cursor:pointer;border:1px solid var(--line)}
.oh-btn.primary{background:var(--cobalt);border-color:var(--cobalt);color:#fff}
.oh-btn.primary:disabled{opacity:.45;cursor:not-allowed}
.oh-btn.ghost{background:var(--card);color:var(--ink)}
.oh-btn.danger{background:transparent;color:#A52A2A;border-color:#E0C4C4}
.oh-edit{background:var(--card);border:1.5px solid var(--cobalt);border-radius:14px;padding:20px;margin-bottom:22px}
.oh-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.oh-edit-grid label{display:flex;flex-direction:column;gap:6px;font-size:.82rem;font-weight:700}
.oh-edit-grid label.wide{grid-column:1/-1}
.oh-edit-grid input,.oh-edit-grid textarea{font-family:inherit;font-size:.95rem;font-weight:400;padding:10px 12px;
  border:1px solid var(--line);border-radius:8px;background:var(--paper)}
.oh-edit-grid input:focus,.oh-edit-grid textarea:focus{outline:none;border-color:var(--cobalt)}
.oh-edit-foot{display:flex;gap:8px;margin-top:16px}
@media(max-width:680px){.oh-edit-grid{grid-template-columns:1fr}}
.oh-muted{color:var(--ink-soft);font-weight:500}
.oh-lib-list{display:flex;flex-direction:column;gap:10px}
.oh-lib-row{display:flex;justify-content:space-between;gap:14px;align-items:center;background:var(--card);
  border:1px solid var(--line);border-radius:12px;padding:14px 18px;flex-wrap:wrap}
.oh-lib-row h3{margin:0 0 8px;font-size:1rem}
.oh-lib-trigs{display:flex;flex-wrap:wrap;gap:6px}
.oh-lib-btns{display:flex;gap:8px}
`;
