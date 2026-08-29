# Sanitized Maestro flows

These P0/P1 examples are reusable, sanitized specifications. Replace `${APP_ID}` with an isolated test package owned by the team. Never run `clearState` against a personal or production package. The templates are not directly replayable without that private APK; [the evidence summary](../docs/RESULTS-SUMMARY.md) records the sanitized physical acceptance separately.

| Flow | Scope | Public status |
|---|---|---|
| `p0-smoke.yaml` | launch and primary action | Sanitized template; private counterpart passed |
| `p1-session-lifecycle.yaml` | approved session start/stop | Sanitized template; private counterpart passed with physical consent |

P2 is excluded: multi-device behavior, thermal/battery, long-running sessions and OEM-specific checks.
