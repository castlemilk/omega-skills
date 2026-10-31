# Batch planner and record

Use this template to resolve the task before rendering and record what actually happened. Store run records in the project's configured archive, not in the installed skill.

## Establish the run

```text
Run:
User request:
Mode and focus:
Requested final count N:
Count source: explicit request / unfinished active batch / default five
Active user constraints:
Explicit user selections:
Provisional assistant candidates:
Selected parent and accessible reference:
Question this comparison should resolve:
Available image-generation and display capabilities:
Output and archive destination:
```

A new request after a completed batch does not automatically inherit the completed batch's count. Preserve an unfinished batch's count unless the user changes it. Discussion of installation, syntax or quoted examples does not start a generation run.

## Plan each direction

| Field | Record |
| --- | --- |
| Index | Stable index from 1 to N |
| Parent | Actual accessible asset, or no parent |
| Hypothesis | What might improve and why |
| Primary change | One observable geometric operation |
| Invariants | Selected geometry, palette, type and framing |
| Target construction | Part count, voids, openings, connections, contour and terminals |
| Reference roles | Distinguish edit target, geometry ancestor and presentation reference |
| Main risk | Concrete failure to inspect |
| Exact prompt | The complete text submitted to the generator |

Vary construction in radical exploration: component count, enclosure, nesting, bridge position, symmetry, proportion and rhythm. In refinement, preserve the selected identity and named scope. When combining refinements, inspect the preceding results first and carry forward only useful changes.

## Record each attempt

```text
Direction index:
Attempt identifier:
Status: selected / superseded / rejected / incomplete
Exact submitted prompt:
Actual input images and roles:
Generator capability used:
Returned image path or persistent reference:
Dimensions and format:
Byte size and digest: [record only when available or measured]
Observed geometry:
Departure from target:
Wordmark spelling:
Main and miniature correspondence:
Decision: retain / refine / park / explore further
Reason:
Next useful experiment:
Replaces attempt: [if applicable]
```

Keep a generated output's original bytes. Preserve meaningful corrections and their edit targets. If a reference is unavailable, record that gap rather than reconstructing it from a caption.

## Complete the batch

Verify that the selected indices are exactly 1 through N, that each refers to a separate final image, and that every image has been displayed or delivered through the host's supported mechanism. A small duplicate inside a board is not an extra image.

Verify the configured archive save and references. Report a partial result honestly if a real tool limit remains. Distinguish observed raster properties, speculative premises, user choices and assistant recommendations.

Keep only the current constraints, selections, useful lessons and unresolved comparison in project state. Retain the full prompts, assets and attempt history with the batch.
