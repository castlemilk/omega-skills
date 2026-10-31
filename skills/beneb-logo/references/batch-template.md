# Batch planner and record

## Contents

- [Establish the run](#establish-the-run)
- [Plan each direction](#plan-each-direction)
- [Record each attempt](#record-each-attempt)
- [Freeze the selectable gallery](#freeze-the-selectable-gallery)
- [Record feedback and learning](#record-feedback-and-learning)
- [Complete the batch](#complete-the-batch)

Use this template to resolve the task before rendering and record what actually happened. Store run records in the project's configured archive, not in the installed skill.

## Establish the run

```text
Run:
Collection namespace:
Stable batch ID:
User request:
Resolved exact brand text and source:
Mode and focus:
Requested final count N:
Count source: explicit request / unfinished batch / active learning-loop continuation / default five
Active user constraints:
Explicit user selections:
Supporting feedback event IDs:
Active design-profile revision:
Provisional assistant candidates:
Selected parent and accessible reference:
Question this comparison should resolve:
Available image-generation and display capabilities:
Output and archive destination:
```

Within an explicit active selection-and-learning loop, “continue” reuses that loop's previous batch size unless the user changes it. Preserve an unfinished batch's count as well. A fresh unrelated unspecified generation request defaults to five. Selection indices are not image counts. Discussion of installation, syntax or quoted examples does not start a generation run.

## Plan each direction

| Field | Record |
| --- | --- |
| Index | Stable index from 1 to N |
| Identity | Stable slot such as B001-02 and concrete revision such as B001-02-r1 |
| Parent | Actual accessible asset, or no parent |
| Hypothesis | What might improve and why |
| Primary change | One observable geometric operation |
| Family and silhouette | Construction family; wide, tall or compact proportion; angular or curved rhythm |
| Meaningful tension | The single relationship made visible |
| Invariants | Selected geometry, palette, type and framing |
| Target construction | Part count, voids, openings, connections, contour and terminals |
| Reference roles | Distinguish edit target, geometry ancestor and presentation reference |
| Main risk | Concrete failure to inspect |
| Exact prompt | The complete text submitted to the generator |

Vary construction in radical exploration: component count, enclosure, nesting, bridge position, symmetry, proportion and rhythm. In refinement, preserve the selected identity and named scope. When combining refinements, inspect the preceding results first and carry forward only useful changes.

For a request to explore different logos, review the whole plan using [the construction catalog](construction-catalog.md). Ten directions should span several families, with contrasting proportions, open and enclosed spaces, one and several masses, and different contour rhythms. Identify repetitive clusters before rendering. Do not force a novelty quota onto controlled refinement or stretch silhouettes to equal dimensions. A common presentation makes geometric differences easier to compare; a repeated background field can obscure them.

After selections, use [the learning loop](selection-learning.md) to plan an adaptive continuation when no explicit mode overrides it. Allocate refinements, nearby branches and an alternative to total exactly N. Keep the user's evidence separate from assistant hypotheses about why an image was chosen.

## Record each attempt

```text
Direction index:
Attempt identifier:
Stable slot ID:
Revision ID:
Status: selected / superseded / rejected / incomplete
Exact submitted prompt:
Actual input images and roles:
Generator capability used:
Returned image path or persistent reference:
Dimensions and format:
Byte size and digest: [record only when available or measured]
Observed geometry:
Departure from target:
Observed family and silhouette:
Wordmark spelling:
Main and miniature correspondence:
Decision: retain / refine / park / explore further
Reason:
Next useful experiment:
Replaces attempt: [if applicable]
```

Keep a generated output's original bytes. Preserve meaningful corrections and their edit targets. If a reference is unavailable, record that gap rather than reconstructing it from a caption.

## Freeze the selectable gallery

Record the display before inviting choices:

| Number shown | Stable slot | Revision shown | Name | Actual image reference | Assistant review | User rating |
| --- | --- | --- | --- | --- | --- | --- |
| 1 through N | Existing batch-slot ID | Exact immutable revision | Short title | Accessible output reference | Retain, refine, park or explore further | Unrated until feedback |

Save a gallery ID and its frozen mapping. Put the number and revision label beside each actual image, outside the artwork. A summary table does not replace image delivery. Do not renumber a shortlist or reuse a historical number for another image without an explicit mapping.

For corrections, preserve the earlier revision, create the new revision in the same slot, and freeze a new displayed gallery. Feedback remains attached to the revision shown in its original gallery.

## Record feedback and learning

```text
Feedback event ID and retry key:
User's exact text:
Gallery used for number resolution:
Resolved revision IDs:
Action: select / reject / neutral / prefer / undo
Explicit rationale:
Observed selected-image properties:
Provisional preference hypothesis:
Supporting and contrary evidence:
Profile revision before and after:
Next authorised generation request: [or none]
```

Unmentioned images remain unrated. A relative preference does not reject the losing image. Preserve the distinction between a chosen parent and final brand approval. A feedback-only turn saves learning without starting a new generation batch.

## Complete the batch

Verify that the selected indices are exactly 1 through N, that each refers to a separate final image, and that every image has been displayed or delivered through the host's supported mechanism. A small duplicate inside a board is not an extra image.

Verify the configured archive save and references. Report a partial result honestly if a real tool limit remains. Distinguish observed raster properties, speculative premises, user choices and assistant recommendations.

Keep only the current constraints, selections, useful lessons and unresolved comparison in project state. Retain the full prompts, assets and attempt history with the batch.
