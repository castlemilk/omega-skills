# Compact world and image notebook

Use this as a flexible working format, not a tool API schema or required user-facing form. Keep only fields that help the task. A note in the current conversation is not automatically persistent memory; save a notebook only through an authorized available file workflow and describe its actual status.

## Batch header

```yaml
mode: exploration # or connected_world, single_scene, edit, prompts_only
requested_images: 3
brief_constraints: []
speculative_regime: unbounded # or grounded, far_future
visual_direction: monumental_science_fiction # explicit user overrides take priority
requested_subject_domains: [] # preserve the user's ships, structures, propulsion, etc.
shared_traits: [] # only what the user wants shared
qualities_to_preserve: [] # concrete visible strengths from approved work, or clearly marked proposals
forms_to_explore: [] # construction processes, silhouettes and viewpoints to vary
established_world_facts: [] # connected_world only
recent_motifs_to_vary: []
```

Treat this YAML as illustrative planning notation. It does not impose generation-tool settings or claim reproducible seeds.

## Candidate slate

Use one row per short candidate before developing the selections:

| ID | Causal premise | Inhabitants and purpose | Visible moment | Distinctive form | Decision |
| --- | --- | --- | --- | --- | --- |
| A | Because capability, inhabitants choose practice, producing consequence | One short clause | One event or relationship | A concrete silhouette or spatial organization | Select, revise or defer |

Check theme fit before comparing candidates for variety. Record only the reason for a meaningful rejection, such as toy-scale drift, missing requested subject, repeated purpose or the same ring silhouette; do not maintain elaborate numeric rankings.

## Selected concept card

```text
ID and title:
Premise and consistent observable relationship:
Known agents, values and purpose, OR condition and emergent process:
Unknown creators, motives or mechanisms: [leave unresolved when appropriate]
History or ecological relationship:
Scene paragraph: [usually 60–120 words when useful]
Visible consequences: [two or three concrete features]
Theme evidence: [science-fiction identity, material/spatial character]
Scale and depth evidence: [compatible relationships visible without the caption]
Spatial construction: [mass and void; occlusion; thickness; detail focus and quiet region]
Reference relationships: [selected visible qualities; source names only when actually inspected]
Functional fusion, when requested:
  biological process / technological role / convergence stage
  shared structure or material continuity / visible event
  intended capabilities not established by the image
Open question: [optional mystery or next story direction]
Design move:
  familiar construction considered / chosen departure and reason
  visual method / protected choices and exact diagram meaning
  recent moves actually compared, or no prior ledger available
Design fingerprint:
  subject / construction process / silhouette / exposed interior / setting / scale
  viewpoint / composition / materials / palette / mood
Must preserve:
Exact final image prompt: [when useful or requested]
```

Use the observable relationship to retain coherence, not to invent artificial scarcity or explanations for every mystery. Avoid recording sensitive user data or irrelevant background.

## Render record

| Field | Record |
| --- | --- |
| Status | Planned, requested, generated, inspected, revised, failed |
| Actual output | Tool-provided image handle or exact local file path if exposed; never invent one |
| Theme fit | What the actual image communicates before its title or lore; identify genre or scale drift |
| Visible successes | Features actually seen in the output |
| Visible mismatch | A concrete missing or altered feature |
| Series comparison | Actual differences in silhouette, interior organization and camera; repetitions that remain |
| Lore not visually established | Intended concepts that the image cannot verify |
| Focused revision | One change, preserved invariants and the actual source image |
| User feedback | Specific preferences; do not generalize one favored image into a universal rule |

Do not count a prompt as a generated image or a generated image as inspected until it has been viewed. Do not claim tool settings, seeds, deterministic geometry, stored memory or cross-session continuity that were not actually supported and verified.

## Next-scene handoff

Keep established facts, unresolved questions, motifs already used, the user's latest preferences, and the next genuinely different scene opportunity. Separate qualities to preserve from forms to explore; attach an actual image handle or accessible reference only when available. Preserve these in the conversation or an explicitly saved artifact as appropriate. Update the skill itself only when authorized.

## Optional diagram recipe record

For the bundled SVG renderer, retain the returned recipe with its generator version, study kind, seed, canvas dimensions and resolved parameters. Record synthetic field labels, exported file identity, inspection results and any custom semantic constraints. This supports replay of that renderer only; do not promise deterministic raster image generation. Keep completed recipes and recent-move histories in authorized private project storage, outside the installed/public skill. See [diagram-studies.md](diagram-studies.md).
