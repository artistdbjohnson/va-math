# VA Math – Strix Rules of Engagement

## Scope
- Source: this repository (React + TypeScript PWA)
- Future deployed preview / staging only
- Auth (Google + email/magic-link), Stripe payment flows, Evidence locker (local IndexedDB + optional cloud sync)

## Priority Focus
1. Authentication & session management (Google OAuth, magic links, JWT/session tokens)
2. IDOR / broken access control on Evidence documents and saved scenarios (especially multi-user cloud path)
3. Business logic around paid entitlements vs free core calculator
4. Sensitive data exposure / client-side storage of claim documents (IndexedDB, localStorage)
5. XSS / injection in calculator inputs, Evidence file handling, and any rendered user content
6. Service worker / PWA offline cache poisoning or data leakage
7. Stripe webhook / payment confirmation integrity
8. Calculation integrity — the pure VA math engine (§4.25 / §4.26) must remain untamperable for the displayed result

## Explicit Exclusions
- Do NOT perform destructive testing
- Do NOT attempt to access or modify real user Evidence data if any exists
- Do NOT test against production live Stripe keys or live payment endpoints with real money
- Do NOT brute-force credentials beyond safe rate limits
- Ignore pure visual / accessibility issues (handled separately)

## Special Notes
This app handles veterans’ disability claim documents. Treat any potential data exposure of Evidence locker content as **Critical** severity by default. Prefer proof-of-concept that demonstrates access without exfiltrating real data.

Report only validated findings with clear reproduction steps.
