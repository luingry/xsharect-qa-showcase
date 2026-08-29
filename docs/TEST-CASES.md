# Test cases

| ID | Level | Scenario | Expected result | Status |
|---|---|---|---|---|
| WEB-001 | Mock | Valid authentication | Viewer shell becomes visible | Automated |
| WEB-002 | Mock | Invalid authentication | Accessible error is visible | Automated |
| WEB-003 | Mock/negative | Protected API without token | 401 unauthorized | Automated |
| WEB-004 | Mock | Create UTF-8 note | Autosave shows `Saved` | Automated |
| WEB-005 | Mock | Two viewers | WS event updates observer | Automated |
| WEB-006 | Mock | Delete note | Observer returns to empty state | Automated |
| WEB-007 | Mock | Intentional socket close | Reconnect feedback appears | Automated |
| WEB-008 | Mock | 320/390/1440 viewport | No horizontal overflow | Automated |
| WEB-009 | Mock/negative | Malformed JSON payload | 400 invalid JSON | Automated |
| MOB-001 | Physical | Fresh application smoke | Main action visible | Passed privately; sanitized result |
| HYB-001 | Hybrid | Device server plus browser | Real frame and contract evidence | Passed privately; sanitized result |

P2 scenarios are deliberately excluded.
