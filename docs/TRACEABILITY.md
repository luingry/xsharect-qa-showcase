# Traceability

| Risk | Requirement | Test evidence |
|---|---|---|
| Unauthorized data access | Notes require a valid session | `auth-api.spec.mjs` negative request |
| Malformed client input | Invalid JSON is rejected predictably | `auth-api.spec.mjs` malformed payload |
| Credential feedback | Wrong code is understandable | `auth-api.spec.mjs` alert assertion |
| UTF-8 corruption | Notes preserve Unicode | `notes-ui.spec.mjs` |
| Lost live update | Another viewer reflects mutation | two-context WS assertion |
| Reconnect ambiguity | Interrupted session is visible | `reconnect-responsive.spec.mjs` |
| Mobile overflow | Shell contains at narrow widths | responsive parameterized cases |
