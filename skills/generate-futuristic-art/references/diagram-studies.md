# Optional technical SVG studies

Use this route for an explicitly requested technical/vector/data diagram or repeatable schematic. The three bundled examples are flat explanatory constructions; they do not establish the visual standard for monumental sci-fi art. Within an art-led request, “diagram,” “cutaway” or “systems study” retains the [monumental direction](monumental-direction.md) and the image-generation workflow. Use the [Antialgorithm adaptation](antialgorithm-method.md) to strengthen concept, morphology and composition without switching the medium.

## Choose the right output

| Requested result | Route |
| --- | --- |
| Cinematic or painterly artwork | Creative-writing loop, then the available image-generation tool |
| Art-led sci-fi diagram, cutaway or world-system image | Retain alien morphology, epic scale, material depth and atmosphere; generate the illustrative image and add verified annotations separately when requested |
| Explicit exact connections, process order or data diagram | Semantic model first; use a compact Mermaid diagram or another precise tool when sufficient |
| Explicit editable vector schematic matching one of these examples | The optional SVG renderer below, with illustrative labels |
| Real scientific chart, technical design or simulation | Use the appropriate data/modeling workflow; retain sources, units and validation |

Do not offer a technical-looking picture as evidence of an engineered system. These SVGs use invented geometry and normalized fields, not heat transfer, structural mechanics, fluid simulation or measured observations. Their numeric controls are authoring parameters.

## Generate a portable atlas

Use an existing Node.js runtime, version 22.20 or newer. The scripts require only Node built-ins and do not fetch packages, fonts, images or telemetry. Run from the skill directory and choose an output folder outside the installed skill:

```sh
diagram_output="/absolute/path/to/your/output"
node scripts/build-diagram-atlas.mjs --out-dir "$diagram_output" --seed 731
```

Replace the example path with an authorized output directory outside the installed skill. Do not bundle generated files, completed recipes or user histories into a public skill release. Open the generated `atlas.html` in a current browser. If scripting is blocked in a preview, download it and open the file locally; individual SVGs remain viewable without the interactive atlas.

The atlas provides study selection, scenario-specific controls, seed replay, SVG and recipe export, and validated recipe import. It runs locally and keeps its current state in memory. Export a recipe to retain a state; do not imply automatic persistence. Use the study selector and controls by keyboard. The default view is static, with no animation necessary to understand the diagrams.

## Parameter schema and distinct constructions

All studies use a 1440 × 1000 SVG viewBox and a `seed` integer from 0 to 4294967295. Fractions below have inclusive bounds 0–1; count controls require integers. Unknown study identifiers, unknown options, non-finite values and out-of-range inputs must fail explicitly.

| Study | Construction and visual question | Parameters |
| --- | --- | --- |
| `vascular-drive` | Dark longitudinal propulsion section. How does branched circulation converge into the drive's rigid chamber and exchange surfaces? | `load`: illustrative activity; `branches`: 3–9 major transport branches; `fusion`: degree of visible functional integration |
| `grafted-span` | Pale terrain section across a rift. Where do grown roots, aligned fibers and the precise span share a continuous structure? | `growth`: extent of the growth transition; `bays`: 5–13 structural bays; `load`: illustrative applied-load state |
| `climate-shell` | Orbital planetary cutaway. How do shell plates, apertures and circulation relate at planetary scale? | `aperture`: opening state; `plates`: 4–9 plate sectors; `circulation`: illustrative transport activity |

Use parameters to explore a coherent system, then change system or composition for the next world. A different seed can vary detail within a study; it does not invent a new civilization, produce a physically new mechanism, or establish uniqueness.

## Programmatic interface

Import [world-diagrams.mjs](../scripts/world-diagrams.mjs) as an ES module:

```js
import { STUDIES, renderStudy } from './scripts/world-diagrams.mjs';

const { svg, manifest } = renderStudy('vascular-drive', {
  seed: 731,
  load: 0.72,
  branches: 6,
  fusion: 0.64,
});
```

`STUDIES` exposes the study identifiers, titles, descriptions, defaults and control metadata. `renderStudy(kind, options)` returns SVG text and a recipe manifest with `version`, `generatorVersion`, `kind`, `seed`, `width`, `height` and resolved `params`, plus the renderer's fictional-data/provenance notes. Read the returned manifest rather than inventing a model setting. The [atlas builder](../scripts/build-diagram-atlas.mjs) writes the HTML, standalone SVGs and recipes to the requested directory.

For replay, retain the **generator version, study kind, seed and every resolved parameter**. The same version and inputs produce the same SVG bytes. Different browser fonts or rasterizers may change raster appearance slightly; the seed does not promise identical screenshots across platforms. Later generator revisions require their matching code for exact replay. Do not transfer this reproducibility claim to raster image generation.

## Review and resource limits

Inspect all three actual default renders at full size and thumbnail scale. Review parameter extremes that can alter structure, and one imported/exported recipe. Verify the primary silhouette, the visible organic-technological connection, diagram labels, layer relationships, a clear synthetic-data legend and intended difference between scenes.

Keep each generated SVG below 200 KB and 2,500 elements. Bound every count and numeric input; avoid unbounded recursion, external assets or expensive post-processing. Keep labels and legends as readable text with an accessible title and description; use position, line style or geometry as well as color to distinguish relationships. Numeric controls and accompanying prose provide a text route to the authoring state. Do not claim a full accessibility audit from these checks.

Review the offline atlas at desktop and phone widths. On a narrow screen, retain readable controls and a useful diagram viewing route rather than shrinking all lettering into an unreadable miniature. Test keyboard focus, seed validation, study changes, control changes, reset, import failure without corrupting the current view, and SVG/JSON exports. Do not add motion to communicate a state that can be read statically.

Extend the renderer only when an explicit technical/vector task needs a new schematic. Do not expand the atlas or build controls merely because an artwork brief needs a new world. Specify its semantic question, independent parameter schema, composition, layer structure, invalid states and performance bounds. Preserve exact labels and relationships while giving each study its own geometry. Keep generated imagery, runtime records and private source evidence outside the distributable package.
