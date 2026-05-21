---
"@stremio-addon/zod": minor
---

feat: opt-in response validation in `AddonBuilder`

Pass `{ validateResponses: true }` to validate handler return values against the zod response schemas (`streamResponseSchema`, `metaResponseSchema`, `catalogResponseSchema`, `subtitlesResponseSchema`, `addonCatalogResponseSchema`). Off by default for performance. An optional `onValidationError` callback can intercept failures (log-only, custom error, etc.) instead of letting `ValidationError` propagate.
