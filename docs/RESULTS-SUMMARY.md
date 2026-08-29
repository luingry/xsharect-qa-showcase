# Sanitized evidence summary

Acceptance date: 2026-08-29.

| Evidence | Result | Provenance and public boundary |
|---|---|---|
| Chromium mock suite | 10/10 passed | Reproduced locally from this sanitized checkout on the acceptance date; CI is the ongoing public proof |
| Chromium/Firefox/WebKit matrix | 30/30 passed | Reproduced locally from this sanitized checkout on the acceptance date; CI runs the same three projects |
| Oracle mutation smoke | 3/3 deliberate regressions killed | Each probe first requires a green targeted baseline, then requires a real Playwright test failure after auth, WebSocket broadcast, or disconnect sabotage; the dedicated CI job publishes its separate output |
| Maestro P0 | 5/5 passed | Self-reported private acceptance on an owned physical Android device against an isolated QA build |
| Maestro P1 | 2/2 passed | Self-reported private acceptance on the same QA build with deliberate platform consent |
| Hybrid browser/device acceptance | Passed | Self-reported private acceptance: 11/11 checks in both blocked/enabled control states, distributed real-frame sampling, zero runtime errors, rotation/fullscreen, remote input with observable frame change, and reconnect feedback |
| P2 | Not run | Explicitly excluded from scope |

The physical results are historical observations from the private project, not replayable evidence in this repository. No screenshots, APKs, device logs, device identifiers, addresses, credentials, or proprietary artifacts are versioned. P2 covers multi-device discovery, battery/thermal measurement, extended soak tests, and OEM-specific behavior.

The synthetic server is reset through a test-only endpoint before and after ordinary browser tests; reset responses and the deliberate disconnect response must be successful. Browser console and uncaught page errors are test failures, including in the two manually created note-session pages.
