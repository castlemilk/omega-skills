# Private records and reflective learning

## Storage contract

Keep runtime records in the user's authorized **private project destination**, outside the public repository and installed skill directory. Reuse existing records rather than creating parallel histories. Store only necessary context, concise reasons and provenance, not private internal reasoning traces. Do not include customer secrets, personal conversation links or account identifiers in a published bundle.

Use stable IDs and append-only revisions for analytical history. Corrections supersede earlier records rather than silently replacing them. Honor explicit privacy/deletion requirements; append-only analysis is not permission to retain information the user asks to delete. Record concurrent versions and use revision guards where the storage tool supports them. On conflict, reread and reconcile. Read back completed writes. On failure, keep an unsaved checkpoint and report the limitation.

## Minimal templates

These are blank field contracts, not an existing ledger or an installed storage service. The host may use Markdown, JSON, a database or structured pages with equivalent fields.

**Run checkpoint:** run ID; as-of time; method version and repository commit when known; mode; question; geography; horizon; level of analysis; authorized state location; user constraints; source coverage; evidence delta; conclusions with status; unresolved unknowns; next review trigger; persistence receipt.

**Evidence record:** evidence ID; origin and source reference; publication/event/retrieval dates; claim; units and denominator; context and geography; source incentives; access and measurement limitations; supporting or contradicting hypothesis IDs.

**Hypothesis record:** hypothesis ID; revision; concise proposition; possibility/commercial status; causal chain; constraint classes; dependencies; observed versus inferred links; alternatives; evidence IDs; falsifiers; next discriminating test; proposed/selected/rejected/deferred status and reason.

**Forecast record:** forecast ID; revision; created-at and information-cutoff times; exact proposition; horizon/deadline; observable resolution criteria and source; probability and rationale if used; base-rate comparator if available; dependencies; evidence IDs; uncertainty; review trigger; pending/resolved/unresolvable status. Add the outcome, resolution evidence and resolution date only when known.

**Feedback record:** feedback ID; date; type; concise feedback; affected records; change made; what did not change; evidence status; provenance; next check; reversal/supersession links when applicable.

**Method change:** change ID; old/new version; demonstrated failure or explicit methodological instruction; proposed general rule; expected benefit; possible regression; test cases; evaluation result and limitations; approval/publication state; rollback rule.

## Reflection protocol

After a substantive correction, decision or completed application:

1. Classify the input before changing confidence.
2. Identify affected conclusions and dependent forecasts, not just the sentence corrected.
3. Append the change with a concise reason and provenance; preserve earlier versions.
4. State what changed, what stayed unchanged, and which evidence would change it again.
5. Choose a targeted follow-up test or method regression check.

| Feedback class | Appropriate update | Not justified |
| --- | --- | --- |
| Preference or goal | Change objectives, scope, presentation or constraints | Increasing empirical confidence in a market thesis |
| Factual correction | Verify where needed; invalidate and reopen dependent conclusions | Quietly rewriting the old forecast to look correct |
| Hypothesis or intuition | Add a testable branch and alternatives | Treating enthusiasm or agreement as confirmation |
| Method critique | Repair the identified workflow failure; test the general rule | Overfitting the whole method to one favored business |
| Observed outcome | Apply the predeclared resolution rule and update evidence | Calling an unresolved or ambiguous outcome a success |

In particular, premature narrowing from a structural question to an existing product is a scope failure. Restore the requested level and retain the product ideas as deferred, not as the answer. An unverified claim that something was installed is a delivery-status error: inspect the artifact and correct the status separately from the research thesis.

## Calibration and improvement

Separate **process quality** from **predictive accuracy**. Better source coverage, fewer scope errors and clearer falsifiers improve the process; they do not by themselves demonstrate better forecasts. Conversation feedback does not retrain the underlying model.

Resolve due forecasts using the original rules. Keep unresolved and unresolvable cases visible with reasons; never count them as correct. For a binary forecast with probability p and outcome y in {0,1}, the Brier score is (p-y)^2, where lower is better. Use this only for genuinely resolvable probabilistic predictions. Do not invent probabilities for qualitative scenarios just to produce a score.

Before comparing versions, declare the cohort, time cutoff, information policy, horizons and baseline. Score the original forecast and the latest eligible pre-outcome revision separately; do not pick whichever looks best. Compare against a relevant base-rate or simple reference forecast on the same cases. Report sample size, dependence among forecasts, unresolved coverage and uncertainty. Small or selected samples cannot establish general predictive improvement.

Review missed mechanisms, wrong timings, neglected alternatives, source-quality problems and economic versus technical confusions. Retire a weak hypothesis or update it with provenance. For method changes, use a fresh or held-out example in addition to the motivating case. Preserve counterexamples and rollback when the change creates a new systematic error.

## Change control and continuity

Discussion can update the authorized private record during the current task. Publishing a changed reusable skill, changing a schedule, or writing to another system requires the applicable user authority; feedback is not blanket permission. Never silently broaden permissions.

Before a substantive method release, run the structural tests and manually exercise relevant [regression cases](regression-cases.md). Log what was actually tested. Structural checks validate the package, not the agent's judgment. Review future outcomes when the user resumes the work or through a separately authorized schedule; the skill does not run itself in the background.
