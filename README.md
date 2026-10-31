# Omega skills

Portable agent skills, starting with **beneb-logo**: counted batches of original logo concepts and visual identity material for **beneb systems**.

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

## Included

- A year-3000 creative brief: obsidian, mathematical precision, alien engineering and quiet institutional authority.
- Clean strong contours, deliberate negative space and geometry that humans can parse.
- Separate workflows for radical exploration and controlled refinement.
- A counted-batch contract: exactly N selected presentations, with corrections tracked separately.
- Prompt templates for logos, patterns, motion concepts, identity suites, objects, environments and graphic material.
- Actual-image review, exact prompts, input provenance and project-owned preference history.
- Host adapters for generation, display and a configurable archive destination.

All required guidance is inside `skills/beneb-logo`. A separate design-direction skill is not needed. Each project starts with its own preferences and selected assets; supply reference images when refining an existing mark.

## Maintain and test

```sh
npm test
npm run test:install
```

`npm test` checks the skill metadata, bundled reference links and portable payload. `npm run test:install` uses `skills@1.7.4` to discover and install the skill into an isolated temporary project for Codex and Claude Code, then compares the installed files with the source. It does not install globally. The smoke test requires network access on its first run.

To test a remote source after publishing:

```sh
npm run test:install -- castlemilk/omega-skills
```

Installer usage and supported sources are documented in the upstream [skills command reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md).
