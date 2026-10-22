# Test API security

This repository is a prototype. Do not expose routes for students, orders, payments, or admin data without a deliberate server-side access policy.

## Default behavior

- `GET /api/healthz` remains accessible.
- All other `/api` routes return HTTP 503 unless `TEST_API_KEY` is configured with a minimum 32-character secret.
- When configured, include `x-test-api-key` on requests. Invalid or missing keys return HTTP 401.
- Browser cross-origin requests are disabled unless their exact origin is listed in `TEST_API_ALLOWED_ORIGINS` (comma-separated).
- JSON/form bodies are limited to 1 MB.

Keep `TEST_API_KEY` in deployment secrets. Never put it in Git, frontend source code, a browser bundle, a query string, or a public example. If a public web frontend needs access, replace this temporary guard with user authentication and per-resource authorization on a trusted backend; do not embed a shared API key in the browser.

Even for demos, use disposable test data. Disable or revoke credentials when the deployment is no longer needed.
