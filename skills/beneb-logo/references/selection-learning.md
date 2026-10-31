# Numbered curation and learning

## Contents

- [Present a selectable gallery](#present-a-selectable-gallery)
- [Interpret feedback](#interpret-feedback)
- [Update the design profile](#update-the-design-profile)
- [Plan the next iteration](#plan-the-next-iteration)
- [Persist and revise learning](#persist-and-revise-learning)
- [Use the local curation helper](#use-the-local-curation-helper)

Use this loop to improve the design process from the user's actual choices. Persist selections, tested observations and revisable prompt or review rules. This adapts a project workflow; it does not train model weights or guarantee that every new image is better.

## Present a selectable gallery

1. Allocate a stable batch ID such as `B001`, then assign direction numbers `1` through `N`. The stable slot for number 2 is `B001-02`; a concrete rendered revision is `B001-02-r1`.
2. Display every final image with its number, short name and revision ID **outside the artwork**. Keep the emblem and wordmark free of tracking labels. Use the same numbering in captions, the curation table and the archive.
3. Freeze a gallery record such as `G001` that maps each displayed number to the exact revision, name and actual image reference. Publish the mapping with the images; an internal record alone does not make a gallery user-visible.
4. Keep numbering stable when sorting recommendations or displaying a shortlist. A correction creates `r2` in the same slot and a new gallery snapshot. It never silently changes the meaning of a number in an earlier gallery.
5. Keep old outputs and their IDs available. When importing historical work, retain its original numbering and create an explicit mapping to new IDs. Never claim an old number had a new identity all along.

IDs belong to one configured collection. The local helper assigns an immutable collection UUID; preserve it alongside batch, gallery and feedback IDs when combining archives. Independent projects may both contain `B001`; do not merge their number spaces. Without the helper, allocate unique scoped IDs through the host's supported state and conflict controls.

A compact curation table can contain **number / name / revision ID / assistant review / user choice**. The table supplements the actual images. Label assistant recommendations separately; leave user choice **unrated** until there is feedback.

For partial generation waves, show only completed slots and identify the missing numbers. The requested total remains N. Once complete, the final gallery contains exactly N separate selected presentations.

## Interpret feedback

Treat these as skill-level instructions, not a promise of native slash-menu registration:

| User instruction | Meaning |
| --- | --- |
| `/beneb-logo select 2 5 8` | Favourite these exact displayed revisions as candidates or parents. |
| `I prefer 5 over 2` | Record a relative preference within that comparison. The other image is not thereby rejected. |
| `/beneb-logo reject 4` | Record an explicit rejection and any stated reason. |
| `Clear my rating for 4` | Return the specified choice to neutral without inventing a dislike. |
| `/beneb-logo refine B001-05 --count 6` | Generate six refinements of the resolved parent, preserving its identity. |
| `/beneb-logo select 2 5 --next 10` | Save the choices and learning, then generate ten images informed by them. |
| `Show what you have learned` | Show active preferences, their evidence, uncertainty and resulting prompt changes. |
| `Undo my last selection` | Retract that feedback event and recompute affected active learning. |
| `Reset learned preferences` | Deactivate learned preference rules; retain images and history, and preserve the current explicit brief. |

These examples are illustrative, not actual selections or instructions to run a batch.

Resolve bare numbers against the single unambiguous user-visible gallery in the active conversation. Pass its explicit gallery ID to the local helper. A slot ID without a revision also needs a displayed-gallery context. When two galleries could reasonably fit, show the relevant IDs and ask one concise disambiguation question before saving a choice. Do not guess a revision from the newest file on disk.

Resolve intent before interpreting numbers: `select 2,5` identifies choices, not an image count. Bare `2,5` can identify choices directly after a clearly scoped selection invitation. An isolated number with no clear generation or selection context needs clarification. `refine 5 --count 6` distinguishes the selected slot from six requested outputs.

Capture the user's exact feedback text, affected revision IDs, gallery, event identity and any explicit rationale. Reject unknown IDs without saving a partial selection. Retries of the same feedback event must be idempotent. “Continue,” general approval, silence and images omitted from a selection are not ratings.

A selection identifies a preference or refinement parent. Record final identity approval only when the user says so. Selection alone updates the memory and next plan; it does not start another render batch. An explicit continuation, refinement, `--next` request or already authorised generation task controls the next images.

## Update the design profile

After valid feedback, inspect the selected images and any explicit comparison or rejection. If an image is inaccessible, save the choice but defer visual inference. Keep these evidence classes separate:

| Evidence class | Example and treatment |
| --- | --- |
| Explicit instruction | “Keep the gap broad.” Apply within the stated scope immediately. |
| Exact selection | The user chose a specific revision. Preserve that choice without inventing why. |
| Visual observation | The inspected mark has two disconnected masses and one open passage. Record what is visible. |
| Preference hypothesis | The shared open passage may explain the choices. Test it; do not state it as the user's reason. |
| Working preference | A hypothesis supported by distinct comparisons across different batches. Keep the supporting and contrary event IDs. |

For each candidate lesson, record **claim, scope, evidence events, observed assets, contrary evidence, status and next test**. Use qualitative status such as **explicit**, **tentative**, **supported**, **contested** or **inactive**; do not invent statistical confidence.

One selected image can choose a parent, but cannot establish all its properties as permanent preferences. Multiple near-identical corrections from one batch are not independent confirmations. Promote an inferred rule only after repeated evidence across distinct batches or an explicit user statement. Shared material, framing or wordmark changes can confound a geometry preference; isolate the relevant property in the next comparison.

On conflicting feedback, narrow the rule's scope, mark it contested or retire it. Current explicit instructions override history. A newly preferred complex mark does not erase an earlier preference for clear silhouettes; inspect whether both share an underlying relationship before generalising.

Translate useful learning into concrete next-run decisions: which parent to use, what to preserve, which edge or interval to vary, what to avoid within the stated scope, and which review criterion deserves attention. Do not promote a catchy narrative or a speculative mathematical story merely because its image was selected.

Report a short learning delta after each selection: **chosen IDs; explicit reasons; provisional inference; next comparison**. State when no reliable new trait can be inferred. Save the update without asking the user to approve the act of remembering feedback already supplied for this loop.

## Plan the next iteration

Use **adaptive** mode after selections when the user asks to continue without specifying a mode. For N at least five, use approximately **60% refinements / 30% nearby branches / 10% credible alternatives**, rounding to exactly N and preserving at least one alternative. For smaller batches, allocate useful comparisons without forcing percentages. Name the plan before rendering.

- Refinements preserve a chosen identity and test specific weaknesses.
- Nearby branches retain an evidenced relationship while changing construction.
- Alternatives test whether the emerging preference generalises beyond the leading family.

Use explicit radical exploration or refinement instructions instead when supplied. The radical mode's freshness quota applies only in radical mode. Pure refinement does not acquire a mandatory alternative. Resolve N using the skill's count contract; a selection count is not the next image count.

Within an explicit active selection-and-learning loop, “continue” reuses that loop's previous batch size unless the user changes it. A fresh unrelated generation request with no count defaults to five. Feedback-only turns do not change the loop's batch size.

Keep comparison layout, type, material and approximate visual weight stable when geometry is the experiment. Carry the strongest prior image into the comparison as a referenced baseline; a repeated baseline is not an additional new variation. Record subsequent user choices as evidence about the experiment. Do not declare an improvement solely because the assistant ranks its own new image higher.

## Persist and revise learning

Keep the project profile, selection events, image references and exact prompts in the current user's configured durable state. Use [state-template.md](state-template.md) and [batch-template.md](batch-template.md). Keep the distributed skill and its package cache free of private selections and asset history.

Version each semantic profile update with a parent revision and supporting feedback IDs. Preserve inactive and superseded lessons for audit without continuing to apply them. Undo a feedback event non-destructively, then recompute any dependent lesson and future plan from the still-active evidence. An undo does not delete generated images or reverse unrelated user instructions. A reset establishes a new learning boundary; do not silently rebuild the reset profile from old events.

Apply established session authorisation to save and maintain the personal learning memory. Hosts with an editable personal companion skill may store compact current lessons there through their supported save workflow. Treat general workflow fixes separately from personal aesthetic evidence: validate reusable improvements before saving the installed workflow, and do not publish a user's private profile into a shared package.

## Use the local curation helper

When Node and an authorised project filesystem are available, use [curate.mjs](../scripts/curate.mjs) for identity and feedback bookkeeping. Run it with Node and a `--state` path in the project's durable output area, such as `beneb/curation.json`, outside the installed skill. Read `--help` for supported flags.

| Operation | Helper arguments after the script path |
| --- | --- |
| Initialise | `init --state PATH` |
| Allocate a batch | `batch --state PATH --count 10` |
| Register an output | `register --state PATH --batch B001 --number 2 --name NAME --image REF` |
| Freeze a displayed gallery | `present --state PATH --batch B001` |
| Record choices | `feedback --state PATH --kind select --ids 2,5 --gallery G001 --key MESSAGE_KEY --text EXACT_TEXT` |
| Record a comparison | `feedback --state PATH --kind prefer --ids 5 --over 2 --gallery G001 --key MESSAGE_KEY --text EXACT_TEXT` |
| Retract feedback | `undo --state PATH --event F001 --key MESSAGE_KEY --text EXACT_TEXT` |
| Inspect records | `show --state PATH --gallery G001` |

Use a stable event key per resolved feedback action; reuse it on retry, not on a new action. Prefer the host's real message identifier plus a deterministic action suffix when a message contains several actions; otherwise allocate and persist a unique local key. Preserve the shared source message so its actions are not counted as independent confirmations. Preflight all references in a compound message before saving its actions. Never invent a host-provided identifier.

The helper preserves IDs, revisions, gallery snapshots and feedback. It accepts image references as opaque nonempty strings; the host must verify actual file or provider access and inspect the images. Save semantic profile revisions, observations, exact generation prompts and input provenance in the accompanying project records. The helper does not inspect pixels or infer aesthetic preferences.

Without Node or local files, preserve the same identity, frozen mapping, event and profile semantics through the host's supported durable artifact or personal-memory mechanism. State any saving limit accurately; do not claim cross-session learning when only conversation context is available.
