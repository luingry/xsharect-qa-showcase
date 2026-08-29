# Test strategy

## Quality risks

The highest risks are authorization bypass, stale synchronized state, UTF-8 data loss, reconnect ambiguity, and mobile layout overflow. The test suite converts each into a deterministic contract where possible.

```mermaid
flowchart BT
    A[API and state contracts<br/>fast and deterministic]
    B[Browser workflows<br/>user-visible behavior]
    C[Physical-device acceptance<br/>consent and real transport]
    A --> B --> C
```

The bottom layers run in CI. The top layer requires a real device, deliberate consent and observable evidence, so it remains a runbook rather than a fabricated pass.

## Design principles

1. Use an in-memory loopback server to avoid credentials, devices and network dependencies.
2. Assert visible behavior before implementation details.
3. Tag test metadata (`@mock`, `@negative`) for selection and reporting.
4. Use two browser contexts to prevent local storage/session sharing from hiding synchronization defects.
5. Preserve artifacts on failure, not in version control.
6. Reset synthetic server state before and after each ordinary test, and assert the reset response succeeds rather than assuming cleanup happened.
7. Treat unexpected browser console errors and uncaught page errors as failures, including pages manually created for cross-session coverage. The reconnect case narrowly permits WebKit's exact console message for its deliberate WebSocket close.
8. Verify assertion sensitivity with controlled mutations: a baseline targeted test must pass before its deliberately sabotaged equivalent is accepted as a killed mutant.
