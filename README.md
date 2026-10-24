# SpendWise — responsive expense tracker

A runnable browser prototype for desktop/mobile web. It can also be wrapped as an Android app using Capacitor.

## Included and working locally
- Responsive dashboard, monthly budget, category totals, transaction list.
- Add expense manually.
- Import CSV statements locally in the browser.
- Heuristic category assignment with category-column override.
- Duplicate detection using date + normalized description + amount + reference.
- Browser-local persistence, search, transaction deletion, and delete-all control.
- PWA manifest and service worker for install/offline shell.

## Important limitations
- **Demo only:** initial transactions are sample records.
- **No live bank/UPI connection is implemented.** The Connections screen explains the integration checklist. A real provider integration requires provider selection, onboarding, user consent, a secure backend, server-side secret management, verified callbacks, token revocation, and security/privacy review.
- Browser `localStorage` is convenient for a demo, not an encrypted financial-data vault. Do not use this prototype to store real sensitive financial records on shared devices.
- CSV formats vary. Verify dates, debit/credit signs, transfers, and categories after import. Duplicate detection is heuristic, not a guarantee.
- The app does not ask for bank passwords, OTPs, or UPI PINs.

## Run locally
Use a local web server (service workers do not work reliably from `file://`):
```bash
python -m http.server 8080
```
Open `http://localhost:8080`.

## Deploy website
Upload these files to a static host that serves HTTPS. Test CSV import, browser storage, and PWA install on the target browsers.

## Android wrapper with Capacitor
Prerequisites: Node.js LTS, Android Studio, Android SDK.
```bash
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init SpendWise com.example.spendwise --web-dir .
npm install @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```
In Android Studio, build and test the app, then create a signed release APK/AAB. For production, review local data storage and file-picker behavior on actual devices. For a packaged native app, the PWA service worker may not be necessary.

## CSV import
Headers recognized include:
- Date: `Date`, `Transaction Date`, `Value Date`
- Description: `Description`, `Narration`, `Merchant`, `Details`, `Particulars`
- Amount: `Amount`, `Transaction Amount`, `Amt`; or `Debit` and/or `Credit`
- Optional: `Type`, `Category`, `Reference`, `UTR`, `Transaction ID`

Signed amount convention: negative means expense, positive means income. If using Debit/Credit columns, debit amounts are treated as expenses and credit amounts as income. Review imports after loading.

## Production live-bank integration checklist
1. Choose a provider authorized for the intended financial data flow and supported institutions/regions.
2. Implement consent UX and backend-only credentials. Never ship provider secrets in browser/Android code.
3. Exchange and store access tokens only on the backend; encrypt at rest and limit access.
4. Validate signatures, timestamps, replay protection, and webhook events.
5. Normalize provider transactions and deduplicate using provider transaction IDs where available.
6. Implement consent revocation, disconnect, retention limits, export/deletion, audit logs, and incident response.
7. Perform legal, regulatory, security, and privacy review before onboarding real users.
