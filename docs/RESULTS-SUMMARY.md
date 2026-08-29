# Sanitized evidence summary

Acceptance date: 2026-08-29.

| Evidence | Result | Provenance and public boundary |
|---|---|---|
| Chromium mock suite | 10/10 passed | Reproduced locally from this sanitized checkout on the acceptance date; CI is the ongoing public proof |
| Chromium/Firefox/WebKit matrix | 30/30 passed | Reproduced locally from this sanitized checkout on the acceptance date; CI runs the same three projects |
| Maestro P0 | 5/5 passed | Self-reported private acceptance on an owned physical Android device against an isolated QA build |
| Maestro P1 | 2/2 passed | Self-reported private acceptance on the same QA build with deliberate platform consent |
| Hybrid browser/device acceptance | Passed | Self-reported private acceptance: real nonblank frame, permission-state UI, rotation/fullscreen, remote input, and reconnect |
| P2 | Not run | Explicitly excluded from scope |

The physical results are historical observations from the private project, not replayable evidence in this repository. No screenshots, APKs, device logs, device identifiers, addresses, credentials, or proprietary artifacts are versioned. P2 covers multi-device discovery, battery/thermal measurement, extended soak tests, and OEM-specific behavior.
