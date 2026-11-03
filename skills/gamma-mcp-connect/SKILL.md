---
name: gamma-mcp-connect
description: Connect, reconnect, or diagnose access to Gamma Art Studio and Nocturne MCP services. Verify the exact connector and distinguish public catalogue, authenticated design-library, private Studio image-library, hosted endpoint, and native CLI access. Not for Gamma presentation generation or general app deployment.
---

# Connect to Gamma MCP

Restore the requested capability through the existing connection first. This skill provides a portable connection workflow, not an MCP server, credentials, or permission to change authentication, grants, repositories, or infrastructure. The host must supply a supported Gamma connector and its connection UI, or an explicitly requested native MCP client.

## Discover the exact connection

Establish which Gamma app, host, account/workspace and capability the user means. Discover available tools and use the returned app identity and current schemas rather than guessing IDs, endpoints or tool names. Similar names are not evidence of the same service.

Prefer the existing exact connector. If it is missing, use the host's supported connector discovery and setup flow for the verified app. Do not create a new plugin, register a new OAuth client or substitute a similarly named service as a troubleshooting shortcut. If the correct connection cannot be identified, ask for the app or host rather than guessing a server URL.

## Verify one minimal read

1. Choose a non-mutating read appropriate to the requested capability. For authenticated design-library access, a currently exposed list-design-systems operation is a useful probe. Tool discovery alone is not a successful authenticated call.
2. Execute it through that connector. Keep a sanitized record of the connector, operation, time, execution environment and result or error. Preserve status and useful error detail; an empty but successful list may verify the operation without proving the existence of any private data.
3. If the exact connector returns `UNAUTHORIZED` and requests reauthentication, direct the user to reconnect that exact app through the host's supported secure connection UI. Do not switch to CLI registration, another execution environment or an alternate authentication path to evade the failed gate.
4. After the user confirms reconnection, retry that minimal read once. If it remains unauthorized, report the app and sanitized error, stop dependent work and diagnose only within current authority. Do not loop or broaden grants.
5. Resume only the capability verified. A successful read establishes that operation's access at that time, not permanent connection health or permission for writes. A request to check connectivity does not by itself authorize a test write. Probe any separately requested capability through its own authorized gate.

For other failures, keep the original error and separate missing tools, network reachability, authentication, authorization and application behavior. Do not infer a credential problem from every timeout or server error.

## Keep access claims separate

| Tested surface | What the evidence establishes | What it does not establish |
| --- | --- | --- |
| Gamma Public Catalogue | Access to the published data returned by that operation. | OAuth acceptance, authenticated access or private Studio image-library access. |
| Gamma Design Library authenticated connector | The specific authenticated design-system/catalogue read worked for the connected principal. | Private Studio image persistence, image writes, native CLI login or the exact deployed source commit. |
| Private Studio image library | Only the image-library operation actually exercised under its authorized principal. | Catalogue access, write capability from a read alone, or persistence from a response alone. |
| Hosted Gamma / Nocturne MCP endpoint | The behavior of the exact route, deployment and callback tested. | A completed OAuth flow from a callback 404 or protected-route 401, or success on a different deployment. |
| Native MCP client, including Codex CLI | The explicitly tested client's configuration and network/authentication result. | Equivalent access from another desktop, managed execution environment, hosted endpoint or connector. |

Name the tested connector and environment, and identify the principal and endpoint only as needed in the private result. Label unknowns. Verify a deployment/source commit from authoritative release evidence, native CLI acceptance from that client, and image writes or persistence from separately authorized operation evidence. Never promote metadata or a catalogue read into those claims.

## Native CLI work only when requested or required

Do not introduce CLI work merely to fix a connector reauthentication error. When the requested task actually needs a native client:

- Inspect existing configuration and preserve unrelated entries. Before an authorized edit, make an appropriately restricted backup; configuration may contain credentials.
- Consult the current client/provider documentation and verified metadata. Preserve the exact issuer, resource/audience, scopes, redirect URI and PKCE requirements. Do not invent an endpoint or copy another deployment's settings.
- Obtain consent through the supported secure UI. Never ask the user to paste tokens, authorization codes or client secrets into chat. Changes that create persistent access or expand permissions need the required approval at that step.
- Treat dynamic client registration (DCR) as a state-changing request, not a harmless connectivity probe. After a timeout, lost response or uncertain output, reconcile supported provider/registration state before retrying. Missing local output does not prove registration failed. If reconciliation is unavailable, report the outcome as uncertain and pause dependent work rather than creating duplicate clients.
- Preserve denials. Do not use another route, host or client to bypass an access restriction.

## Protect diagnostics and close the loop

Before writing diagnostic files, use an owner-only directory and restrictive creation mask; on POSIX systems, use directory mode `0700` and file mode `0600`. On other hosts use equivalent private storage. Redact locally before sharing or adding reusable evidence. Tokens, authorization codes, cookies, client secrets, PKCE verifiers and secret query parameters can appear in URLs, headers, bodies and stderr. Do not dump raw responses or retain sensitive diagnostics in a public skill or repository.

Keep sanitized operation, status, time and error detail. If raw diagnostics must be retained under existing authority, keep them restricted and outside shared artifacts. Do not create extra hosting, jobs or clients to conceal a blocked path, or move a private image library behind external OAuth without a separately approved identity and data-access design.

Report the useful result first: the exact capability restored or remaining blocker, what was tested, and what remains unverified. Distinguish denied, pending, uncertain and failed actions. Installing this skill, discovering a tool, and completing a connection UI are not by themselves proof that the requested operation works.

## Fresh connections, hostname changes, and cross-client failures

An already connected client can keep reading while a new login fails. Verify fresh onboarding separately from an existing token/session. Record the exact client, connector, endpoint, issuer and resource without retaining authorization URLs or token hints.

When an authorization screen says the request could not be verified, do not assume an expired token is the cause. Inspect safe server status/reason evidence and compare the browser origin with the server's exact trusted origin. Verify whether an older hostname redirects to a newer one. A platform alias does not migrate OAuth issuer, audience, client registration, Google callback or cookie scope automatically.

Never fix a mismatch by removing Origin validation, accepting arbitrary subdomains, forwarding a forged Origin, widening redirect callbacks, or accepting every issuer/audience. A canonical-host migration needs one internally consistent configuration for browser origin, issuer, resource, discovery/JWKS endpoints and provider callback. Preserve PKCE, signed continuations, identity and callback allowlists; obtain required approval for authentication-trust changes. Explain that existing tokens may be rejected and clients may need fresh consent. Do not promise refresh compatibility without verification.

Test a fresh cookie jar and the existing connector independently, including interrupted login, denied consent, expired/tampered continuations, wrong origin/resource/audience and unknown callbacks. Local OAuth harnesses must enforce cookie host/path/Secure rules; a single global cookie jar can falsely certify cross-host login. Synthetic local provider tests are not evidence of real Google consent or another user's machine working.

After an authorized repair, verify the exact served build and a newly initiated read-only connection. Direct the user to start from their client rather than reuse an old authorization URL. Request only the configured connector/endpoint and sanitized failure time if troubleshooting continues, never another token-bearing URL.

For end-to-end verification, initiate authorization from the actual client so that its state and PKCE verifier remain paired with the callback. A manually composed authorization request or an authorization redirect alone does not prove a completed connection. Verify an authenticated read through that newly connected client after callback completion. Record fresh-client and existing-client reconnect results separately from deployed metadata and build identity.
