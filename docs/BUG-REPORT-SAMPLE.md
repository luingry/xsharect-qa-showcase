# Bug report sample — QA-only runtime profile crashed at startup

> Sanitized example. Names, identifiers and platform details are intentionally generic.

**Severity:** High — blocks physical QA automation.

**Symptom:** An isolated QA build installed successfully but terminated during application startup before the first screen rendered.

**Root cause:** The QA profile intentionally omitted a cloud-messaging configuration, but application startup initialized the messaging SDK unconditionally.

**Fix:** Introduce a build-scoped feature flag. Production and normal debug profiles retain messaging; the isolated QA profile skips only the unavailable integration.

**Regression guard:** Unit-test the flag in both build profiles, build the QA artifact, and validate a real install/open before treating the device suite as executable.

**Learning:** Build success is necessary but not evidence that an installable test variant reaches first render.
