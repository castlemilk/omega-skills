---
name: generate-futuristic-art
description: Invent original monumental science-fiction worlds, civilizations, ships, monoliths, planetary and stellar structures, propulsion and fictional weapons, then generate their artwork. Use for creative worldbuilding, organic-techno fusion, unlimited-energy speculation, exploratory visual series, reference-driven image generation, intricate art direction, cinematic cutaways, art-led sci-fi diagrams and prompts. Run a bounded concept-to-image loop, Antialgorithm-informed creative departures and a reference-grounded theme gate before diversity and rendering. Preserve epic scale, convincing spatial construction, atmospheric depth and selective material detail while inventing varied worlds. Respect specific briefs and edits.
---

# Futuristic Artwork

Invent something worth depicting, then make it visible. Create original worlds whose **conditions, capabilities, histories and agents, when present, cause their forms**. The default direction is **monumental science-fiction art**: extraordinary worlds, immense structures and vessels, tactile construction, atmospheric depth and a strong sense of awe or mystery. Preserve that direction as ideas diversify. Use supplied references and the bundled construction atlas as visual anchors without copying compositions or limiting invention to familiar objects.

## Preserve the theme while inventing

For open artwork and exploratory series, read [monumental-direction.md](references/monumental-direction.md) before ideation. When reference images are supplied, inspect a scene sheet or overview and two or three relevant full images when available; retain their source boundaries. This portable bundle contains original text guidance, not source footage or captured artwork. Do not claim to have inspected unavailable images. Keep four anchors in each selected scene: a legible science-fiction subject or phenomenon, convincing large-scale spatial relationships, purposeful material/detail hierarchy, and the atmospheric or painterly character of the requested direction. Bright, peaceful, organic and unfamiliar worlds all fit these anchors.

Treat novelty and theme fit as separate checks. A clever story cannot rescue an image that reads as a toy course, decorative plaza, bead arrangement, generic abstract sculpture or product render when the brief calls for epic worlds. Replace the visual construction before rendering. Do not repair the drift merely by making everything dark, adding neon, or attaching a tiny astronaut. Specific requests for products, intimate scenes, playful illustration or a different style override this default; never enlarge or militarize a constrained brief.

Carry the established visual direction into requests for “diagrams,” cutaways and systems imagery unless the user explicitly asks for a technical/vector/data presentation. In this art context, show alien morphology, tangible materials, epic spatial scale and atmospheric depth. Antialgorithm should expand the worlds and compositions within that direction. A conventional bridge, turbine or textbook globe does not become an alien megastructure through labels or a sci-fi title.

## Load only what helps

- Read [worldbuilding-loop.md](references/worldbuilding-loop.md) for open briefs about new worlds, concepts, civilizations, advanced technologies or exploratory image sets. Run this before selecting a visual family.
- Use [monumental-direction.md](references/monumental-direction.md) for the default theme, reference anchors, scale checks and ways to broaden a set without drifting into unrelated visual genres.
- Read [concept-space.md](references/concept-space.md) when expanding possibility, breaking repeated ideas, or connecting extraordinary capabilities to original cultures and scenes. Its examples are invented seeds, not a closed catalog.
- Use [world-notebook.md](references/world-notebook.md) to track selected concepts, continuity, visual diversity and actual render outcomes across a series. Keep notes compact; do not mistake them for persistent memory or deterministic generation.
- Read [reference-atlas.md](references/reference-atlas.md) for the self-contained construction atlas and a workflow for inspecting references supplied in the current task. It is authoring guidance, not a record of images bundled with this package.
- Read [detail-vocabulary.md](references/detail-vocabulary.md) when the user asks for intricate detail, richer materials, convincing machinery, or a less generic result.
- Read [prompt-recipes.md](references/prompt-recipes.md) when writing prompts, selecting a starting composition, adapting to products or creatures, or making a coherent series. Treat every recipe as a proposed original artwork.
- Read [antialgorithm-method.md](references/antialgorithm-method.md) to invent subject-specific departures in concept, morphology and composition while retaining the art direction. Its guidance is adapted from a pinned upstream source.
- Read [diagram-studies.md](references/diagram-studies.md) only for an explicitly requested technical/vector/data diagram or reproducible schematic. Its SVG examples and offline atlas are optional technical tools, not the visual standard for monumental sci-fi art.

## Host capabilities

The host must provide image generation for rendered artwork and image inspection for visual review. This bundle supplies the creative workflow and an optional Node.js SVG renderer, not image-model access. The diagram scripts use Node built-ins and a local browser; see the diagram reference for runtime and resource limits. If a required capability is unavailable, state the gap and label any concepts or prompts as unrendered; do not report them as completed images. Use current supported tool interfaces and do not install services automatically. Keep actual notebooks, feedback, generated-image histories and private source evidence in the host's authorized private storage, outside this public bundle.

## 1. Resolve the creative brief

Extract the subject, use, format, mood, desired medium, detail level, and fixed constraints from the request. Preserve a specific user brief; add only choices needed to execute it. Use a portrait composition for an otherwise unspecified image inspired by supplied reference artwork, a wide composition for a website hero, and the user's format whenever given.

Choose the requested output mode:

- **Artwork:** generate the image with the available image-generation tool. Do not stop after writing a prompt.
- **Prompts or art direction:** deliver copyable prompts and useful variations without calling an image generator.
- **Edit:** inspect the target and explicitly preserve its subject, silhouette, framing, and other requested invariants while changing the specified features.
- **Exploratory series:** vary civilizations, purposes, technologies, scales, silhouettes, materials, palettes and viewpoints. Share only the finish or other traits the brief requests.
- **Connected series:** retain established world facts and selected design traits while varying scene roles and compositions. Do not turn a request for unrelated worlds into a single-universe series.
- **Art-led diagram, cutaway or world-system image:** retain the inherited sci-fi art direction. Invent an extraordinary structure and show its operation through spatial construction, material continuity and a consequential event. Generate the illustrative artwork with the image tool; add separately composed, verified annotations only when requested. The word “diagram” alone does not select the SVG templates or an authoring UI.
- **Explicit technical/vector/data diagram:** preserve exact relationships, labels and units with a precise diagram tool. Use the optional bundled SVG workflow only when its schematic construction fits the requested result. Label fictional fields as illustrative. Respect an explicitly requested clean technical style.
- **Motion or code:** use the applicable animation or coding workflow. A still image is a keyframe, not an animation; a written motion plan is not a rendered video.

Proceed with reasonable assumptions instead of asking a questionnaire. Never introduce a person, logo, fictional brand, or additional vehicle when a specific brief excludes or does not call for it. In an open environment brief, use a small figure, service craft, doorway, railing, or repeating module as a scale cue; a person is optional.

## 2. Invent the world before its appearance

Run the full loop for an open worldbuilding or exploratory brief; use a short version for one open image. For a precise composition, product, animal or edit, preserve the brief and add only the background reasoning needed to execute it. Do not insert lore or additional subjects into a constrained task.

1. **Expand the premise.** Choose the speculative regime and scale. For unlimited-energy or unlimited-time requests, embrace those assumptions; do not silently reduce the premise to present-day feasibility or obligatory fuel scarcity. Keep invented rules internally consistent without claiming scientific validation.
2. **Create alternatives.** Use the [deliberate-departure pass](references/antialgorithm-method.md#run-one-bounded-creative-pass): identify the familiar construction, derive a specific reason to depart, and protect user-fixed choices. Draft two or three one-sentence premises for a single open image; for a set, draft roughly twice the requested count in batches of at most twelve final scenes. Vary more than appearance: who exists, what matters to them, what their technology changes and which event the image catches.
3. **Write the causal chain.** For agents, connect `capability -> motive or value -> consequence -> designed form or environment -> visible event`. For natural or emergent worlds, use `condition -> process -> ecological or physical consequence -> scene`. Permit creators, motives and mechanisms to remain unknown. Let wonder, care, play, incomprehension or ceremony supply stakes as readily as danger. Do not force war, empire, human inhabitants or a resource crisis into every world.
4. **Develop selected concepts.** Write a short scene paragraph plus a compact concept card: premise, known agents or process, a consistent observable relationship, purpose when relevant, history trace, current event, two or three visible consequences, theme anchors and an optional open question. Keep unknowns unknown. Lore must earn visible consequences; names and adjectives do not establish originality.
5. **Check theme, then diversify.** First apply the monumental direction to the selected visual scene without its title or lore. Then compare purpose, mechanism, construction logic, silhouette, setting, scale, viewpoint, material and palette. Compare the main design move against the actual available recent ledger; state when none exists. Replace a repeated premise or form before polishing it; a recolor is not a new concept. Preserve all requested subject domains across a set, including ships, structures, monoliths, planetary works, propulsion and fictional weapons when requested. Use one critique and at most one revision pass by default.
6. **Choose the image moment.** Pick one decisive action or organizing relationship. Translate two or three world facts into visible evidence; a swarm, ecosystem, civic event or environmental boundary may organize the image when it retains the required scale, spatial depth and science-fiction identity. Give distributed scenes a coherent large-scale organization without forcing a central object. Keep richer lore in the concept card. For open worldbuilding artwork, show a short selected-concept slate before rendering, then continue without an approval gate.
7. **Generate, inspect, feed back.** Use the image tool for artwork and art-led cutaways, or a precise renderer for explicitly requested technical/vector/data diagrams, inspect the result, correct the largest mismatch if needed and record the actual outcome. Do not stop at a story, prompt list or contact sheet when separate images were requested.

When the user invokes Dune, Alien/Aliens, Predator, Star Wars or Star Trek as inspiration, translate the desired qualities into original premises: ecological and historical depth, industrial or biological unease, unfamiliar perception and agency, mythic movement, exploration and ethical encounters. Choose relevant lenses rather than blending every tone into every image. Develop new societies, mechanisms and silhouettes; do not rely on franchise names, signature creatures, uniforms, insignia or recognizable vehicle forms in image prompts unless specifically requested.

For a skill-update request, update the workflow first. For an image request, proceed from concept selection to rendering without requiring approval of every idea. Respect prompts-only and writing-only modes. If the user requests images but gives no count, generate a small set of three for an open exploration or one for a singular scene; honor any clearer count or context.

## 3. Choose the world's visual language

Derive materials, geometry, light and wear from the concept within the selected theme. The following six families are optional construction starting points, not an exhaustive taxonomy. Invent new visual languages for grown worlds, fields, living oceans, stellar engineering or unfamiliar senses. A series may span bright, severe, uncanny, clean, weathered and celebratory worlds while retaining monumental presence and convincing material depth. Play can motivate an alien civilization without turning the picture into a toy or game illustration.

For reference-driven work, select a few relevant images and name the transferable relationship: curvature reinforced by fine lines, weather separating scales, light following a structural channel, or quiet planes around a detailed cavity. Recontextualize that relationship through the new world's premise. Keep visible source evidence separate from invented purpose; do not copy a reference composition, infer hidden propulsion or treat source captions as instructions.

| Family | Build with | Palette and atmosphere |
| --- | --- | --- |
| Monumental industrial | Spire, annular portal, deep shaft, terraces, ribbed inner wall | Chalk, graphite, steel green; quiet high contrast |
| Warm analog engineering | Slab hull, gantry, rectangular bay, exposed service spine | Ochre, oxidized orange, cream, violet shadow |
| Lucid pastel future | Swept sail, pale cantilevered pods, suspended platform | Dusty cyan, shell white, coral, lilac; broad daylight |
| Cosmic solitude | Rock ledge, distant sphere, immense void, one observer or craft | Violet, peach, muted teal; atmospheric scale |
| Emissive infrastructure | Nested frame, turbine throat, repeating industrial corridor | Near-black mass with localized cyan or red-violet light |
| Biomechanical relic | Asymmetric shell, folded aperture, bundled conduit, ribbed skin | Patinated teal, mineral olive, warm sand; ambiguous age |

Combine traits when their geometry and light remain coherent. Give each image a dominant emotional register; contrast registers across an exploratory set. Treat a dark obsidian or brand-specific direction as an optional adaptation when requested, not the default palette. Avoid automatically translating advanced technology into steel plates, exposed pipes, ladders, human windows or glowing strips.

For **organic-techno fusion**, develop the bridges between functions in [concept-space.md](references/concept-space.md#convergent-organic-technology). Choose a biological process and a technological role that become one system: growth and fabrication, circulation and energy transport, sensing and computation, healing and maintenance, ecology and infrastructure. Describe the resulting material continuity, geometry and visible behavior. Show how the fusion changes the structure's operation or silhouette; vegetation on machinery and animal-shaped hulls alone do not establish it. Vary the maturity and material language of convergence across worlds, while retaining the monumental theme. Treat this as a fictional direction, not an inevitable technological forecast.

## 4. Design from large form to small detail

1. **State one visual idea.** Examples: a weather front splitting around an inhabited monolith; a membrane ship unfolding around a protected ecosystem; a tiny craft crossing a deep rectangular void. Make the relationship express the selected world's purpose or event. Avoid stacking unrelated spectacles.
2. **Choose an organizing geometry and supporting rhythm.** Use a dominant silhouette, a distributed pattern, a boundary or an interacting system as the scene requires. Pair an organic shell with curved ribs, or a migrating ecology with coherent paths and density changes. Let smaller forms belong to that organization without forcing a hero object.
3. **Establish composition.** Specify viewpoint, crop, focal position, quiet area, foreground obstruction if useful, and two or three depth planes. Name the relationship: “the circular opening occupies the upper half; the small platform anchors the lower edge.”
4. **Make scale legible.** Use overlap, repeated units, atmosphere, a known object or a long uninterrupted surface. At planetary scale use limb curvature, continental weather, shadows across a world or nested orbital distances. For nonhuman civilizations use ecological or geometric comparison rather than assuming doors and railings. A close product needs joints and edge thickness, not a tiny astronaut.
5. **Budget detail.** Begin with roughly 60% calm mass or atmosphere, 30% structural articulation, and 10% concentrated fine detail when helpful. These are adjustable authoring heuristics, not measurements from supplied references or mandatory ratios. Macro machinery scenes may be denser, but still need a quiet region.
6. **Assign color roles.** Choose a dominant field, a supporting material, and a focal accent. Allow neutrals and transitions. Monochrome, pastel and saturated directions are all available; never impose exactly three colors on every request.
7. **Specify visible surface behavior.** Prefer brushed paint, fine etched-looking lines, tonal scumbling, selective hard edges, and worn joins for the reference character. Use glossy, clean, photographic, or graphic treatments when requested.
8. **Place light with a cause.** Use sky, sun, an aperture, an engine, or a luminous channel. Describe how it reaches nearby planes. Keep most machinery non-emissive unless the brief calls for a light installation.

## 5. Write intricate detail as relationships

Choose a few compatible details from each relevant scale; do not paste the entire vocabulary into one prompt.

| Scale | Describe | Example |
| --- | --- | --- |
| Primary | Overall mass, silhouette, opening, load-bearing gesture | A smooth wedge enclosing a deep oval chamber |
| Secondary | Ribs, terraces, bays, ducts, platforms, support frames | Radial ribs disappear behind a segmented outer collar |
| Tertiary | Seams, fasteners, clamps, grilles, small lights, local wear | Paired clamps secure three cables beneath the collar; chipped paint follows its exposed rim |

Use **component + location + connection + surface behavior**:

> Recessed service panels follow the lower curve of the shell; narrow cable runs connect their corners to the central hub; tiny fasteners repeat at panel junctions; the raised edges catch pale light while the recesses stay dark.

Bind details to an imagined function or physical relationship: heat fins beside an outlet, gaskets around a hatch, flexible conduits across a moving joint, access steps beside a service bay. Keep fictional engineering visually coherent without claiming it has been mechanically validated.

Let the world replace this mechanical vocabulary when appropriate: growth scars at a living hinge, optical facets that turn toward a star, density gradients around a field boundary, or maintenance organisms within a membrane. Do not add bolts and rust to an advanced material that the premise says grows seamlessly or continually repairs itself.

Interpret “more intricate” as more hierarchy, connections, material differentiation, and selective discovery. Add detail around joints, undersides, cut edges, and the focal area. Preserve large planes, silhouette, and background quietness unless the user asks to change them.

## 6. Assemble a useful prompt

Write concrete nouns and spatial relationships before style adjectives. Use this order as a flexible scaffold:

```text
Output and format: [artwork / illustration / keyframe; aspect and use]
World cause and moment: [one premise that visibly affects the scene; what is happening now]
Subject and visual idea: [what exists; one memorable relationship]
Composition and scale: [viewpoint, placement, crop, depth, scale cue]
Primary forms: [silhouette and one repeating geometry]
Structure and fine detail: [selected connected components and where they occur]
Materials and finish: [surface response, wear logic, drawn or painted treatment]
Palette and light: [color roles, source, shadow, atmosphere]
Constraints: [invariants, needed empty space, exact text if requested]
Avoid: [a few relevant failure modes]
```

Offer a distilled prompt of about 70–110 words and an expanded prompt of about 180–280 words when the user asks for a prompt breakdown. For a normal image request, use only as much detail as improves the image. Do not pad prompts with “masterpiece,” “8K,” “award-winning,” or repeated “ultra-detailed.” Do not invent seed controls, model flags, lens metadata, or API settings.

Use a short relevant avoid clause, such as “no captions, no floating interface overlays, no uniform surface noise, no glowing outline around every part.” Omit exclusions that contradict the user's request. Request exact typography separately and verify it when text is required.

## 7. Generate and iterate

Use the available image-generation skill and its current tool contract for raster artwork. Keep art direction separate from tool parameters. Inspect local reference images before using them; label reference images and edit targets explicitly. Never assume images from an earlier session are still accessible. Inspect supplied references when accessible. Without them, use the bundled text atlas and describe the art direction as proposed rather than claiming source-image inspection.

For a new artwork, describe a new subject or arrangement. If reference-image inputs are useful and supported, state which attributes to transfer: form language, edge treatment, palette, or detail hierarchy. Do not transfer source captions into the artwork. Do not claim a generated image is handmade because a source video contains a provenance caption.

Generate the requested number of separate images; a contact sheet is additional only when requested or useful. Batch independent generation when supported, await every result, and display each actual image using the tool's delivery mechanism. Track failures honestly and retry within the bounded revision budget; never count a written prompt or failed call as a completed image. Use current tool contracts rather than inventing generation settings or installing another image service.

For edits, state what must remain fixed before the change. Reuse the actual target image through the available tool's supported mechanism; do not regenerate from prose alone when preserving the existing image matters.

Inspect the actual generated result against the references and brief:

- **Theme:** Does the image itself read as the requested monumental science-fiction direction before its caption is known? Check tangible mass or environmental structure, depth, scale and material character. Remove captions and labels from the review: if the image could be a conventional bridge, turbine or textbook globe, rebuild its morphology, viewpoint and setting for this brief. A toy-like plaza, near-future engineering plate or diagrammatic abstraction fails the monumental alien-world direction even if the fictional premise is sophisticated.
- **Thumbnail:** Can the subject, focal point, large silhouette, depth, and main color relationship be read immediately?
- **Close view:** Do ribs follow the form, panels join convincingly, repeated components have consistent rhythm, materials separate, and fine marks concentrate where intended? Check for unintended text, fused components, competing focal lights, and noisy texture.
- **Fusion, when requested:** Does growth, structure, circulation, sensing or repair visibly serve a technological role? Check the continuity or integration of those systems; distinguish visible features from fictional capabilities that the image cannot prove.
- **World and story:** Are the chosen premise's visible consequences present? Does the image convey its event or relationship? Did the generator replace an unfamiliar civilization with ordinary human industrial scenery? Keep unseen lore as intended lore, not verified visual evidence.

When a premise depends on a particular count, orientation, connection or spatial paradox, inspect that feature directly. A prompt naming impossible geometry does not establish that the output depicts it. Keep an approximate visual interpretation distinct from the fuller fictional premise.

Correct the most important failure with one focused edit. Examples: “keep the silhouette and palette; simplify the distant architecture”; “keep all geometry; replace broad neon outlines with light only inside the aperture”; “preserve the main hull; add cable clamps and access seams only around the underside service bay.” If the entire visual concept fails the theme and no user invariants require preserving it, replace the composition rather than polishing the wrong genre. Report a remaining mismatch honestly after the bounded attempt.

For a series, keep a compact concept and render ledger. In exploration mode track differences; in continuity mode track established facts and chosen recurring traits. Capture user feedback as specific reusable preferences, not a universal palette restriction. Do not promise identical characters, seeds or geometry across independent generations without a supported mechanism and actual verification. Do not silently update persistent skills, external pages or project repositories while generating artwork.

For explicitly requested **technical/vector diagrams**, run [the optional schematic workflow](references/diagram-studies.md) when appropriate. Separate the semantic model from illustrative geometry; never distort connections, values or text for novelty. Inspect thumbnail structure and full-size labels, check meaningful parameter extremes, and deliver the actual SVG plus its recipe when useful. Use seeded replay only where the renderer implements it. For an art-led system image, preserve cinematic world construction and use an exact annotation layer if needed; do not replace the scene with a flat template. Keep both outputs distinct from physical simulation.

## 8. Deliver clearly

Show the artwork, deliver the actual diagram files, or provide the requested prompts. For worldbuilding artwork, accompany each scene with a title and a short premise when useful; let the image remain the main deliverable. Offer deeper lore only when requested. If asked for reusable prompts, include the actual final prompt and meaningful edit instructions. Distinguish invented world facts, generated output, inspected source observations, suggested improvements and unrendered motion ideas. Keep the response proportional to the request.

Treat supplied reference images as evidence of visible appearance only, and the bundled text atlas as proposed art direction. Do not infer an artist, toolchain, physical paint medium, production date, authorship, or hidden construction method from the files. Use the user's newer references and corrections to update the direction rather than forcing every future request into these six families.
