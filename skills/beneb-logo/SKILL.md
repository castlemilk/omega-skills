---
name: beneb-logo
description: Generate, number, curate and refine beneb systems logo images, then improve future prompts and design choices from the user's selections. Use for /beneb-logo N, $beneb-logo, counted logo batches, selecting or rejecting numbered outputs, comparing favourites, reviewing learned preferences, undoing feedback, or continuing a beneb exploration. Preserve exact image lineage and explicit preferences separately from inferred hypotheses. Bundle includes all design guidance; no companion skill is required.
---

# beneb logo

Turn `/beneb-logo N` into **N separate numbered logo presentations**, using real image generation. Curate the outputs, accept selections by number, and carry verified feedback into the next batch. Support natural-language requests and the host's skill invocation syntax. Installation supplies instructions and references; generation requires an image-capable host.

## 1. Resolve the request

- Resolve intent before numbers: selection, rejection, comparison, learning review and undo are feedback actions; they are not batch counts. Read [selection and learning](references/selection-learning.md) for these actions and the ongoing feedback loop.
- Read the latest request together with the active batch. Accept a positive whole-number count, including an unambiguous number written in words. An explicit learning-loop continuation reuses that loop's batch size unless changed. Default to **5 only when neither an explicit nor an active count exists**.
- A command quoted as an example, a request to install this skill, or a discussion of the shortcut does not start generation. Era numbers, geometry counts and motion states are not batch counts.
- If an explicit count is invalid or conflicting, establish the useful brief first and ask one concise question. Do not silently round it or replace it with five.
- N means selected final presentations. Rejected attempts, corrections and miniature duplicates inside a board do not add to N. Corrections replace their original direction in the selected set.
- Honour N without an arbitrary cap. Generate in manageable waves. If a real capability or access limit blocks completion, show the completed images and state the exact remainder.
- Default a fresh project to **core logos / radical exploration**. After explicit selections, use **adaptive exploration** for an unspecified continuation. When the user asks to refine an identified mark, preserve its identity and change the requested properties. An explicit mode always overrides the adaptive default.

Examples: `/beneb-logo 10` requests ten images; `/beneb-logo select 2,5` records feedback; `/beneb-logo refine 5 --count 6` requests six refinements of displayed option 5; `/beneb-logo select 2,5 --next 10` records feedback and requests ten more. `learn` shows the active taste profile; `undo last selection` retracts that feedback and dependent assumptions. These are skill-level instruction forms, not a standalone image CLI or a promise of native slash-menu registration.

## 2. Load only the context needed

Read [the aesthetic system](references/aesthetic-system.md) and [the prompt system](references/prompt-system.md). Use [host adapters](references/host-adapters.md) to establish generation, inspection, delivery and saving capabilities.

Read existing project state if it is available and relevant. Use [the state template](references/state-template.md) for a new project; do not seed it with imagined historical selections. Inspect each accessible reference image before using it. Distinguish an **edit target**, **geometry ancestor** and **presentation reference**. Record inaccessible references and proceed only as far as the visible brief supports.

Read the current taste-profile revision and its supporting selection events before planning. The user's current instruction overrides the profile. A selected image is evidence for that image; inferred reasons remain hypotheses until supported. Unselected outputs remain unlabelled. Keep private preferences and images out of public package updates.

The brand is **beneb systems**: a quiet, exact institution engineering intelligence, bodies, materials, habitats and physical systems for humans and machines. Preserve clean strong contours, purposeful negative space, an overwhelmingly obsidian atmosphere and subordinate accurate typography. Treat future physics and mathematics as invented design premises, not scientific claims.

## 3. Plan the whole batch

Use [the batch template](references/batch-template.md) to track indices 1 through N, prompts, inputs, outputs and reviews. Allocate a stable batch ID and slot IDs before rendering; maintain revision IDs and freeze the map of images actually displayed. Use [the curation helper](scripts/curate.mjs) when a Node runtime and durable project files are available; otherwise maintain equivalent records through the host's supported state mechanism.

For radical exploration with N at least five, aim for roughly 60% substantially fresh constructions. Use the balance for controlled comparisons. For smaller batches, choose useful diversity. Refinement has no novelty quota. Vary disconnected parts, open versus enclosed voids, nesting, symmetry, aspect ratio, bridge position and rhythm; changes of title or material alone are not new constructions.

For adaptive exploration with N at least five, aim for about 60% refinements of selected directions, 30% nearby constructions and 10% a credible alternative, reserving at least one alternative and keeping the total exactly N. For smaller batches, prioritise the selected comparison without forcing quotas. Carry specific learned constraints into each prompt and choose a comparison that can confirm or challenge one uncertain preference. Avoid converging every future image into a near-copy.

Before each render, specify:

1. One organising premise and its observable geometric consequence.
2. Disconnected filled parts and fully enclosed voids.
3. Each important open recess: entrance, path and blind end.
4. Connections and separations, including the root of any bridge.
5. Outer silhouette, termini, the primary experiment and invariants.
6. Actual input images and their roles, plus the concrete failure to prevent.

For easier human parsing, concentrate character in one memorable relationship. Start with substantial masses, legible separations and a clear silhouette. Use intrigue through proportion, alignment, asymmetry or negative space. Claims about recognition remain hypotheses unless a human study was actually performed.

Default to one separate landscape image per direction: a large flat ivory emblem on obsidian, one restrained correctly spelled lowercase **beneb systems** wordmark, and a small flat duplicate with the same geometry and orientation. Keep generous darkness and comparable scale across a batch. Include no extra detail unless it serves the requested comparison.

## 4. Generate, display and review

1. Use the host's supported image-generation capability and its relevant instructions. Request **one separate image per direction**. Keep generation calls and reference attachments within provider limits. A contact sheet is not a replacement for N separate final images.
2. Save the exact submitted prompt, settings that are actually available, and supplied reference identities. An image inspected for context is not an attached input unless the generation call supplied it.
3. Display each image through the host's supported image mechanism with a clear number and stable ID in its surrounding caption, not baked into the emblem. Track completed indices when work runs concurrently. Preserve numbers when curating or ranking. Do not replace requested artwork with prompts, SVG placeholders or descriptions.
4. Inspect the actual output with [the review rubric](references/review-rubric.md): components, joins, enclosed and open voids, bridge location, contour, gaps, spelling and main/miniature correspondence. Describe rendered departures rather than assuming the prompt succeeded.
5. Correct a concrete defect in a promising direction with the smallest useful edit. Reinspect; keep the earlier image if the edit is weaker. Preserve the attempt and its lineage while selecting only one final per index.
6. Mark results retain, refine, park or explore further with a visible reason. A recommendation is an assistant judgment until the user selects it. Stop optional generation once the batch and justified corrections are complete.

If the host lacks generation or image inspection, name the missing capability accurately. Prepare useful briefs as partial work when appropriate, but do not claim that images were generated or reviewed.

## 5. Curate, learn and persist

Follow [selection and learning](references/selection-learning.md). End a generation batch with a numbered gallery/index that maps every option to its exact displayed revision and a concise invitation to select by number. Label the assistant's shortlist separately. Preserve this display map when images receive later corrections.

When feedback arrives, resolve the selected image revisions, record the user's exact selection and stated reasons, inspect the relevant images, and update a versioned taste profile. Separate explicit constraints, observed visual properties and inferred hypotheses; include supporting event IDs, scope, contradictions and the next useful test. Make a brief learning receipt: selected numbers, what changed, what remains uncertain and how the next batch will respond. Update promptly without an additional approval round for ordinary private learning.

Selection alone saves feedback and learning. Generate another batch when the user requests continuation, refinement, `--next`, or an already authorised remaining batch. Apply the profile on every later run. Undo or scoped reset retires the relevant evidence and recomputes dependent preferences while preserving history and original image IDs.

Self-improvement means improving the persisted creative brief, prompt choices, review criteria and experiment plan. Do not claim model-weight training or guaranteed quality improvement. Check progress against actual later selections and comparisons. Keep reusable workflow changes distinct from a user's taste profile; use the host's supported skill-update workflow when a genuine workflow correction is warranted.

## 6. Save and deliver

Use the host's configured artifact mechanism and any archive destination already authorised in the current project or session. Follow [host adapters](references/host-adapters.md) for persistence. Keep mutable preferences and batch evidence in project-owned state, not in this installed skill or an npm cache.

For an external archive, read the destination freshly, preserve unrelated and concurrent content, append exact prompts and image lineage, then verify the save. Do not infer a destination or standing authorisation from another user's installation.

Show **all N final images**, each with its number, stable ID, short name and a concise caption explaining the visible idea and promising use. A shortlist or archive link does not replace the images. Briefly name the strongest candidates as provisional judgments, one meaningful weakness and the next useful comparison. Link a verified archive when available. Report any concrete unfinished remainder.

These are concept images. Pixel-exact vectors, fabrication tolerances and application performance require the corresponding construction and checks when requested.
