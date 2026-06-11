Objection Handler — Live Call Companion

A real-time sales objection handler for reps on live calls. Type (or tap) what the prospect just said, and the matching rebuttal appears instantly as a three-beat talk track: Acknowledge → Respond → Pivot.

Built as a single-file React app with keyword detection, an editable objection library, and persistent storage.

Why

Reps lose deals in the two seconds after a prospect says "we're not interested" or "just send me a quote." Scripts buried in a PDF or wiki don't help mid-call. This tool puts the right response on screen the moment a trigger phrase is detected, formatted big enough to read while talking.

How it works

1. Keyword detection

As the rep types what they're hearing, the input is normalized (lowercase, punctuation and apostrophes stripped) and checked against every objection's trigger phrases. The strongest match leads; secondary matches appear as "Also detected" links for when prospects stack objections in one breath:


"Honestly we're not interested, we already have a contract."



Both objections are caught — the higher-scoring one displays first.

2. The three-beat talk track

Every objection response follows the same structure:

BeatJob1. AcknowledgeLower the guard. Agree with the feeling, never argue.2. RespondReframe with value. One proof point, not a pitch.3. PivotTake back control. End with a question or next step.

Words in [brackets] are placeholders for your team's specific proof points — savings figures, services, renewal language. Fill them in via the Library before reps go live.

3. One-tap chips

When typing is too slow, every objection in the library is available as a tappable chip below the input.

Default objection library

Ships with 15 objections written for a broker-style B2B sale:


Not interested
We already have a contract
Send me an email
We don't work with brokers
We don't share invoices
Just send me a quote
We aren't looking for a change
Our rates are fine
Happy with our current provider
Long-standing relationship
It's not all about price
Too expensive / no budget
I don't have time
Call me back later
I'm not the decision maker


Every script, title, and trigger list is editable in-app.

Customizing the library

Open the Library tab to:


Add a new objection (name, comma-separated trigger phrases, and the three beats)
Edit any existing script or its triggers
Delete objections that don't apply to your sale
Reset to defaults to restore the shipped library (overwrites custom edits)


Trigger tips: keep phrases short and lowercase. Matching is substring-based on normalized text, so not interested catches "we're really not interested right now." Punctuation and apostrophes are ignored (dont and don't both match).

Persistence

Edits are saved through a key-value storage API (window.storage) under the key objection-handler:library, so a customized library survives page reloads. If storage is unavailable, the app falls back to the in-memory defaults without breaking.

Tech


React (hooks only, single file, default export)
No external state or UI libraries
Fonts: Space Grotesk (display/body) and JetBrains Mono (trigger chips, labels)
Respects prefers-reduced-motion; keyboard focus states throughout
Responsive down to mobile — the two-column call view stacks below 880px


File structure

objection-handler.jsx   # the entire app: data, matching, UI, styles

Key pieces inside:

SectionPurposeDEFAULT_LIBRARYThe shipped objections (id, title, triggers, three beats)normalize() / findMatches()Text normalization and trigger scoringObjectionHandlerMain component: live view, library view, edit formsCSSAll styles, injected as a template string

Adding objections in code

To ship new defaults, add an entry to DEFAULT_LIBRARY:

js{
  id: "in-house",
  title: "We handle this in-house",
  triggers: ["in house", "handle it ourselves", "internal team"],
  acknowledge: "Makes sense — nobody knows your business like your own people.",
  respond: "Most in-house teams are great at [X] but stretched thin on [Y]. We're not a replacement; we're the part they don't have time for.",
  pivot: "What does your team spend the most time on today? If I could take [one task] off their plate, would that be worth a look?",
}

Note: users who have saved a customized library will load their saved version, not new code defaults — they'll need to hit Reset to defaults to pick up changes.

Roadmap ideas


Per-beat copy buttons
Usage analytics (which objections fire most)
Fuzzy matching for typos
Team-shared libraries
Practice mode with randomized objections


License

MIT
