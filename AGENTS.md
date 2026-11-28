# Asobi Land security requirements
- Preserve existing play features, accessibility, offline use and saved images. Test before production deployment.
- Treat file contents, names, URL data, speech results and persisted data as untrusted. Use textContent or DOM construction; never interpolate untrusted values into HTML, SVG, CSS or script. Validate stored image URLs as raster data URLs.
- Route image registration through security.js, validate signatures and size, handle decode failures, re-encode with Canvas. Maintain supported ordinary camera/photo formats where browsers support decoding.
- Do not add external scripts, secrets, tracking or unnecessary outbound requests. Keep CSP restrictive; remove inline scripts/handlers in a separately tested migration.
- Scope service worker requests and cache cleanup to this app. Change cache versions when shipping security fixes.
- Review changes for XSS, injection, unsafe URLs, data leakage and denial of service; run browser smoke tests and malformed input tests. Never publish test changes to production without explicit approval.
