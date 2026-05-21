---
"@stremio-addon/sdk": patch
---

fix: resolve route ambiguity when `behaviorHints.configurable=true`

The optional `{/:config}` prefix was greedily matched by `path-to-regexp`, causing URLs like `/catalog/series/foo/skip=20.json` to be parsed as `config=catalog, resource=series, ...` and return "resource not found". The router now inspects the URL's first path segment: if it's a known resource or `manifest.json`, no config prefix is used; otherwise it's treated as the config segment.
