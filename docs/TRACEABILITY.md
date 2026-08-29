# Traceability

| Risk | Requirement | Test evidence |
|---|---|---|
| Unauthorized data access | Notes require a valid session | `auth-api.spec.mjs` negative request |
| Malformed client input | Invalid JSON is rejected predictably | `auth-api.spec.mjs` malformed payload |
| Credential feedback | Wrong code is understandable | `auth-api.spec.mjs` alert assertion |
| Auth shell bypass | Wrong code cannot reveal protected UI | `auth-api.spec.mjs` requires `#app` hidden and auth card visible |
| UTF-8 corruption | Notes preserve Unicode | `notes-ui.spec.mjs` |
| Lost live update | Another viewer reflects mutation | two-context WS assertion |
| Stateful test leakage | Each case starts and ends with a successful synthetic reset | automatic Playwright fixture plus notes cleanup |
| Reconnect ambiguity | Interrupted session is visible | `reconnect-responsive.spec.mjs` |
| Mobile overflow and accidental tiny target | Shell is unclipped and Connect is at least 44px high | responsive parameterized cases |
| Silent client regression | Console/page errors fail the test | automatic fixture and manual two-context guard |
| Vacuous regression assertion | Auth, broadcast and disconnect mutations must fail a real Playwright test | `npm run test:oracles` and `oracle-mutations` CI job |
