# Omega skills

Portable agent skills:

- **[beneb-logo](skills/beneb-logo/SKILL.md):** counted batches of original logo concepts and visual identity material for **beneb systems**.
- **[discover-ai-business-opportunities](skills/discover-ai-business-opportunities/SKILL.md):** recurring evidence-backed business opportunity discovery and evaluation.

- **[futurist-research](skills/futurist-research/SKILL.md):** physics-constrained possibility exploration, competing futures, value capture and reflective forecasting.

## Install futurist-research

Explore what new technologies make possible before narrowing to a product. Distinguish physical limits from engineering, economic and institutional constraints; combine multiple evidence signals; test who captures value when competitors have the same capabilities.

```sh
npx skills add castlemilk/omega-skills --skill futurist-research
```

In Codex, ask `$futurist-research` to explore a future, deepen a mechanism, challenge a thesis, or reflect on previous findings. These are natural-language modes, not additional installer commands. For example:

```text
Use $futurist-research to explore which physical activities become economical
as intelligence becomes abundant. Stay at the system level before choosing
products, challenge integration as a moat, and preserve competing scenarios.
```

The skill includes a [possibility method](skills/futurist-research/references/method.md), [evidence standards](skills/futurist-research/references/evidence.md), [private record templates and learning protocol](skills/futurist-research/references/records-and-learning.md), and [eight behavioral regression cases](skills/futurist-research/references/regression-cases.md). Feedback is classified as preference, factual correction, hypothesis, method critique or observed outcome. Original forecasts are preserved; agreement is not evidence, and better process is not proof of better predictive accuracy.

Live research and durable private storage are host capabilities, not provided by this bundle. Keep forecast ledgers and discussion feedback outside the public repository and installed skill directory. Installation does not retrain a model, create a schedule or install the skill on other machines. The existing `discover-ai-business-opportunities` skill remains a separate, optional downstream workflow for evaluating current buyers and ventures.

The installer requirements and agent/global options below apply to all three skills. Run `npm run test:futurist` for this bundle's structural checks. Behavioral regression cases require separate review; they are not executed by that command.

## Install discover-ai-business-opportunities

Research evidence-backed business ideas, compare them with prior suggestions, and evaluate demand, competition, economics and resilience as AI improves.

```sh
npx skills add castlemilk/omega-skills --skill discover-ai-business-opportunities
```

In Codex, ask `$discover-ai-business-opportunities` to run a discovery cycle or evaluate a venture hypothesis. The workflow normally suggests one strong idea with sources, uncertainties and a cheap next test. It can stay quiet on a scheduled run when no finding passes the evidence bar.

The host needs web search/read access for current research and durable private storage for the ongoing ledger. The skill does **not** create a schedule by itself: use the host's scheduler to run it daily, with the same private state destination and notification preferences. Hosts without live research can analyze supplied evidence, clearly labelled as captured rather than current.

The bundle preserves 67 historical public-source research records, including exclusions and limitations. It does not include personal conversation links, user feedback, a runtime ledger or credentials. Keep those outside this repository and outside the installed skill. Installing it grants no authority to contact customers, spend money, build or deploy products.

Review [SKILL.md](skills/discover-ai-business-opportunities/SKILL.md), [evidence criteria](skills/discover-ai-business-opportunities/references/evaluation.md) and [continuity guidance](skills/discover-ai-business-opportunities/references/continuity.md). The installer requirements and agent/global options below apply to all three skills.

## Install beneb-logo

Requires Node.js **22.20 or later** for the tested version of the [skills CLI](https://github.com/vercel-labs/skills).

```sh
npx skills add castlemilk/omega-skills --skill beneb-logo
```

The installer lets you select an agent. Installation defaults to the current project. Add `-g` to install globally, or specify the agent explicitly:

```sh
# Codex, global
npx skills add castlemilk/omega-skills --skill beneb-logo -g -a codex

# Claude Code, current project
npx skills add castlemilk/omega-skills --skill beneb-logo -a claude-code
```

To use the exact installer version exercised by this repository's smoke test:

```sh
npx skills@1.7.4 add castlemilk/omega-skills --skill beneb-logo
```

Review the files before installing: [SKILL.md](skills/beneb-logo/SKILL.md) and [bundled references](skills/beneb-logo/references/).

## Use it

In an agent with slash-style skills:

```text
/beneb-logo 10
```

In Codex:

```text
$beneb-logo 10
```

Natural language also works:

```text
Generate ten separate beneb systems logo concepts.
```

For refinement, supply the selected image and the property to explore:

```text
Use beneb-logo to make four refinements of this mark.
Preserve its two reciprocal parts and open central passage.
Compare simpler corners, clearer gaps and more balanced weight.
```

The host must provide **image generation** to produce the artwork and **image inspection** to review it. Installation adds the creative workflow and reference material; model access and native command menus are provided by the host. Generated images should be displayed in that host's supported format.

## Select by number and improve the next batch

Every batch presents numbered images with stable identities. Option **2** might be `B001-02-r1`; a correction becomes `B001-02-r2`. A frozen gallery record preserves which version you actually saw and chose.

```text
/beneb-logo 10
/beneb-logo select 2,5,8
```

You can add reasons naturally: “I like 2 and 5 for their open passages. Keep 8's silhouette, but simplify its corners.” The skill records those choices, inspects the selected geometry, and updates a versioned design profile. Unchosen images remain unrated. An inferred preference stays provisional until your feedback supports it.

| Request | Result |
| --- | --- |
| `I prefer 5 over 2` | Saves a relative preference without rejecting 2. |
| `/beneb-logo reject 4` | Records an explicit rejection and any stated reason. |
| `/beneb-logo refine 5 --count 6` | Produces six controlled refinements of the resolved option 5. |
| `/beneb-logo select 2,5 --next 10` | Saves learning and produces ten informed variations. |
| `Continue` | Uses the active learning loop's previous batch size and current profile. |
| `Show what you have learned` | Shows active preferences, supporting choices and uncertainty. |
| `Undo my last selection` | Retracts the feedback and dependent assumptions. |
| `Reset learned preferences` | Starts a new learning boundary while retaining image history and the current explicit brief. |

Selection alone saves feedback; it does not start another render batch. On an unspecified continuation after selections, the default mix for ten images is **six refinements, three nearby branches and one credible alternative**. Explicit radical exploration or pure refinement requests override that mix.

The [learning workflow](skills/beneb-logo/references/selection-learning.md) improves persistent design preferences, prompts, review criteria and experiments. Progress is judged against later choices. The base image model is not retrained.

Project state is private to the configured destination and survives skill updates. The optional zero-dependency [curation helper](skills/beneb-logo/scripts/curate.mjs) manages batch IDs, revisions, gallery snapshots, feedback and undo in a project-owned JSON file. The agent maintains semantic preferences alongside that record. Hosts without a local runtime use their supported durable memory or artifact mechanism.

## Included

- A year-3000 creative brief: obsidian, mathematical precision, alien engineering and quiet institutional authority.
- Clean strong contours, deliberate negative space and geometry that humans can parse.
- Separate workflows for radical exploration, adaptive continuation and controlled refinement.
- A counted-batch contract: exactly N selected presentations, with corrections tracked separately.
- Stable numbered galleries, explicit selection/rejection/comparison, and reversible learning.
- Prompt templates for logos, patterns, motion concepts, identity suites, objects, environments and graphic material.
- Actual-image review, exact prompts, input provenance and project-owned preference history.
- Host adapters for generation, display and a configurable archive destination.

All required guidance is inside `skills/beneb-logo`. A separate design-direction skill is not needed. Each project starts with its own preferences and selected assets; supply reference images when refining an existing mark.

## Maintain and test

```sh
npm test
npm run test:install
```

`npm test` validates all three portable bundles and exercises logo curation state transitions, frozen revisions, feedback retries, undo and state protection. Futurist tests check discovery metadata, internal references, privacy guards and record contracts; they do not measure forecasting accuracy. Opportunity payload tests also check source-row integrity and reject private identifiers, credential-like material, machine paths and accidentally bundled runtime state. `npm run test:install` uses `skills@1.7.4` to discover and install all three skills into an isolated temporary project for Codex and Claude Code, then compares the installed files byte-for-byte with the source. It does not install globally. The smoke test requires network access on its first run.

To test a remote source after publishing:

```sh
npm run test:install -- castlemilk/omega-skills
```

Installer usage and supported sources are documented in the upstream [skills command reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md).
