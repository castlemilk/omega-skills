# Deliberate departures for futuristic worlds

## Contents

- [Source and integration boundary](#source-and-integration-boundary)
- [Run one bounded creative pass](#run-one-bounded-creative-pass)
- [Connect organic and technological functions](#connect-organic-and-technological-functions)
- [Choose a visual method](#choose-a-visual-method)
- [Remember moves without inventing memory](#remember-moves-without-inventing-memory)
- [Protect diagram meaning](#protect-diagram-meaning)
- [Source utility limits](#source-utility-limits)

## Source and integration boundary

Adapt the creative-choice principles of [mankidev/antialgorithm](https://github.com/mankidev/antialgorithm/tree/766e30411195a9198afad38f3d76e08701ed4516), inspected at commit `766e30411195a9198afad38f3d76e08701ed4516` on 19 November 2026. Its [skill](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/SKILL.md) and [visual guidance](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/visuals.md) motivate deliberate departures, respect for fixed choices, varied methods, recent-move comparison and visual review. Preserve the [MIT attribution and license](antialgorithm-LICENSE.txt).

This integration adds original science-fiction examples, structured planning fields, a deterministic SVG renderer and an offline atlas. Those are extensions in this package, not demonstrated upstream capabilities. Antialgorithm itself is a creative skill with small Python helpers; it is not a simulation, diagram engine or image-generation service. Its selected showcase is not a controlled benchmark of originality. Keep later upstream revisions separate until inspected.

## Run one bounded creative pass

Use this pass inside the existing worldbuilding loop, before final concept selection. Preserve the user's fixed subject, theme, reference anchors, medium, format and requested information.

1. **Identify the easy answer.** Note the familiar construction likely to emerge: another centered portal, a familiar ship covered in vines, a planet wrapped in identical rings, or an interchangeable grid of boxes. This is a design diagnosis, not a ban on those forms when the brief needs them.
2. **Find a reason to depart.** Connect the departure to the world's purpose or a question the diagram must answer. A heat-exchange network might become the hull's structural hierarchy; a planetary organism might expose circulation only where its plates separate. Avoid changing everything merely to be strange.
3. **Make two or three alternatives differ in kind.** Change mechanism, topology, scale relationship, viewpoint or construction logic before changing colors. For a set, compare these dimensions across the selected scenes. A familiar opposite can still be a default.
4. **Choose one organizing move.** State the visual consequence in concrete terms. For example, “the growth front crosses the load path and leaves a visible transition from porous roots to aligned structural fibers.” Let that move determine detail, crop and emphasis.
5. **Select a compatible visual method.** Keep the marks consistent with the chosen method and the brief. Do not add decorative noise to rescue a weak composition.
6. **Apply theme and meaning checks.** For monumental art, inspect scale, mass, depth and material coherence. For a requested diagram, check whether the intended relationship can be read, then check its world identity. A diagram is not a substitute for requested cinematic artwork, and diagram labels do not need a painterly treatment.
7. **Render, inspect, revise once if needed.** Inspect thumbnail structure and a full-size result. Record what actually appeared and the main design move. Do not treat a seed, a novel title, or a changed palette as proof of global uniqueness.

Skip invention that would violate a precise brief. For an edit, make the requested change while retaining its invariants. Keep the pass internal or present a short concept slate; avoid forcing the user through a creativity questionnaire.

## Connect organic and technological functions

Use [convergent organic technology](concept-space.md#convergent-organic-technology) to connect form to function. Consider alternatives such as these, then invent beyond them:

| Familiar construction | Subject-specific departure | Relationship to make visible |
| --- | --- | --- |
| Engine with decorative tendrils | A contractile circulation system shares structure with a drive chamber | Fine branching exchange paths converge into rigid field lamellae; the chamber and transport paths occupy one sectional body |
| Steel bridge with vegetation | A span grows its tension members along an inhabited valley | Mineral roots, aligned fibers and the manufactured deck share a continuous path; the growth front is distinct from the applied-load annotation |
| Planet with luminous orbital ribbons | A tectonic climate shell opens selected regions around a living ocean | Plate margins, apertures, circulation and planetary curvature organize different layers at different scales |
| Weapon with a larger glowing barrel | A fictional defense organ rearranges local protection | A bounded protective response changes the silhouette; keep its capability narrative and non-operational |
| Monolith covered in symbols | A sensing structure records events through the organization of its material | A readable change in surface orientation or internal layering carries the premise without invented UI glyphs |

These are original prompts, not claims about a source video or real technology. “Heat” can mean visual intensity; choose a literal thermal view only when it serves the request. Do not funnel every organic-techno idea into heat maps, tendrils, shells or the same three examples.

## Choose a visual method

Let the method carry evidence about the subject. A clean sectional plate can explain joints; a broad orbital view can establish planetary scale; a photographic or painterly scene can communicate weather and distance. Use false color only with a legend that says what it represents. In fictional studies label the field as synthetic or illustrative and give normalized units rather than inventing measured temperatures.

Distinguish intentional construction from arbitrary distress. If the medium is print, selective registration and ink behavior may be appropriate. If it is an instrument image, a sampling grid may have a purpose. If it is a material render, thickness, seams and reflection should explain the surface. Clean CAD and precise typography should remain clean. Do not copy an upstream seed list that sends a monumental brief toward miniature clay scenes, playgrounds or unrelated visual genres.

Review a set across **function, topology, composition, material, scale evidence and palette**. Preserve requested continuity while changing open dimensions. Do not apply a numeric originality score or claim an exhaustive comparison against all prior art.

## Remember moves without inventing memory

Add these optional fields to the [world notebook](world-notebook.md):

```text
Design move:
  familiar construction considered
  chosen departure and its reason
  function / topology / composition / material / scale evidence
  protected user choices and exact diagram semantics
  visual method and marks it permits
Recent comparison: [actual available entries, or “no prior ledger available”]
Observed outcome: [visible successes and remaining mismatch]
```

Keep a compact recent-move ledger in the current conversation or authorized private project storage. Never write runtime histories into the installed/public skill. Use the host's versioning or a single writer if several agents share a notebook; a fixed temporary filename is not concurrency control. Save only when authorized, preserve source identity, and state when no prior notebook is available. The supplied renderer does not secretly maintain history or guarantee novelty; concept selection and comparison remain part of the creative process.

## Protect diagram meaning

Choose [diagram-studies.md](diagram-studies.md) for editable SVGs and repeatable parameter exploration. Write down the exact connections, values, labels, directions and units that must survive styling. Keep those semantic elements separate from illustrative geometry. Never roughen text, move a data point, change a connection, or relabel a synthetic field as measured evidence to make the image feel more unusual.

For real data, preserve and cite the actual source; do not place it in these fictional study templates without implementing and validating the appropriate mapping. When a request needs a small exact topology diagram, a clear Mermaid diagram may be sufficient. When a request needs rendered artwork, use the available image-generation tool and inspect the output. SVG seeds apply only to this renderer, not to an image model.

## Source utility limits

The upstream executables are not vendored or invoked by this integration. If a later task proposes using them, inspect the pinned version and the available runtime first; do not install dependencies automatically.

| Source utility | Relevant boundary at the pinned version |
| --- | --- |
| [seed.py](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/scripts/seed.py) | Uses `SystemRandom`, not a replayable numeric seed; `--no-log` still reads recent history. Its general-purpose choices do not enforce the monumental theme. |
| [history.py](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/scripts/history.py) and [moves.py](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/scripts/moves.py) | Store/display recent records, not a similarity metric. The default history location is inside the skill and the fixed temporary-file write has no lock; use private host storage and explicit coordination instead. |
| [rough.py](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/scripts/rough.py) | Perturbs SVG geometry and supports its own seed. It has no `--amount` validation; zero or near-zero amounts can cause excessive subdivision. It is not a general organic-form generator and must not distort exact diagram semantics. |
| [check.py](https://github.com/mankidev/antialgorithm/blob/766e30411195a9198afad38f3d76e08701ed4516/scripts/check.py) | Requires NumPy, Pillow and an SVG renderer. Defaults to 800-pixel and 64-pixel renders. Its text heuristics are not a WCAG audit, semantic validator, physics check or originality assessment. |

Use installed rendering capabilities and inspect actual output. Keep automated structural checks, visual review and physical validation distinct.
