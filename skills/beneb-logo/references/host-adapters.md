# Host capabilities and persistence

This skill supplies instructions and design references. Installation does not provide an image model, credentials, native slash-command registration or access to another user's archive.

## Capability check

Before generation, identify the host's available image generation, image editing, image viewing, display and artifact-saving capabilities. Use their actual tool schemas and supported input mechanisms. Do not invent tool names, model availability or paths.

Prefer the host's native image-generation capability when present. Make one distinct render request per direction, using a distinct construction brief. For edits, inspect the actual target first and supply it through the supported image-input mechanism.

Use a configured API or CLI image provider only when that route is already authorised or the user explicitly requests it. Read the provider's current instructions. Do not ask the user to paste secrets into chat or silently install a paid provider.

If no image capability is available, prepare the useful brief and exact prompts, identify the missing capability and state that image generation remains incomplete. Do not substitute code-drawn placeholders or report prompts as generated images.

## Display adapters

| Host capability | Delivery |
| --- | --- |
| Native generated-image output | Return each image using the documented display mechanism. In a ChatGPT code-mode environment exposing it, this may be `generatedImage(result)`. Use that helper only when it actually exists. |
| Local artifact renderer | Use the host's supported local-image attachment or artifact link. Verify the image file exists and is viewable. |
| External image provider | Preserve the returned image and use a supported durable artifact/display route. Treat expiring URLs as temporary. |
| No inline image display | Deliver accessible image files through the supported artifact mechanism and explain the display limit. A textual description is not an image delivery. |

Do not regenerate an existing image merely to make it visible. Follow the host's image-saving rules; automatically saved outputs need no duplicate upload unless a configured archive or requested deliverable requires one.

## Project state and outputs

Choose an existing user-designated project location. When the host supports authorised local artifacts and no location is specified, a useful structure is:

```text
beneb/
  state.md
  assets/
  batches/
    run-identifier/
      record.md
      images/
```

Use [state-template.md](state-template.md) for current preferences and [batch-template.md](batch-template.md) for detailed run records. Follow host-specific durable-storage requirements instead when local files are transient.

Keep mutable state outside the installed skill and package cache. Do not overwrite user state during installation or upgrades. Preserve original generated files and use new filenames for revisions.

## Configured external archives

An external archive is optional and must be resolved from the current user's destination and authority. Configuration identifies a destination; it does not grant access or broader permission. Reuse valid authorization already present in the session without adding confirmation steps.

For a configured document or storage provider:

1. Read the destination and applicable instructions freshly.
2. Use authorised returned identifiers and file references exactly.
3. Save original images, exact prompts, actual input roles, lineage and concise reviews.
4. Preserve unrelated content and concurrent changes.
5. Use the provider's supported guards or conflict mechanism.
6. Reconcile unknown outcomes before retrying; verify completed saves.

If a document reaches a confirmed capacity limit, preserve history. Use a new batch document within the already authorised archive scope and add a compact index link where possible. Do not delete history or broaden sharing to make space.

A connector-specific adapter may use Pages or another document system when available, but never hardcode a private account, archive identifier or standing permission in this distributable.

## Completion

Report the completed image count, chosen revisions and verified delivery location. State any remaining generation, display or save blocker precisely. Keep installation, generated imagery, archived content and production-ready vector work as separate completion claims.
