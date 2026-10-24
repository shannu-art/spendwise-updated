# Publish SpendWise

## Free website hosting with GitHub Pages
1. Create/sign into GitHub.
2. Create a **public** repository named `spendwise`.
3. Upload the contents of this folder to the repository root (not the ZIP).
4. Open **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
6. Wait for deployment. The URL is `https://YOUR-USERNAME.github.io/spendwise/`.

Public repositories and published files are public. Do not upload real financial statements, credentials, or private data.

## Test locally on Windows
Open Command Prompt in this folder:
```bat
python -m http.server 8080 --bind 0.0.0.0
```
On the same Wi-Fi, find the computer IPv4 address with `ipconfig` and open `http://IP-ADDRESS:8080` on Android. Keep the server running.

## Android APK build
Prerequisites: Node.js LTS, Android Studio, Android SDK, and a compatible JDK.
```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```
In Android Studio, wait for Gradle sync, run on a test device, then use **Build → Generate Signed Bundle / APK** to make a release. If `android/` already exists, skip `npx cap add android`.

## What's included
- Dashboard, monthly budget and category summaries
- Manual expense entry, transaction search and deletion
- CSV statement import with heuristic categorization and duplicate fingerprinting
- Local browser storage and data deletion control
- Responsive mobile layout, PWA manifest, offline app shell
- Connection setup checklist and privacy warnings

## Not production banking software
No real bank/UPI connection, account login, server sync, or encrypted vault is included. The Connections page is a checklist only. Live financial-data access requires an eligible provider, consent flows, secure backend credentials and token storage, verified callbacks, provider-specific integration, legal/regulatory review, and security testing. Never collect bank passwords, OTPs, or UPI PINs in this app. Local browser storage is not encrypted; use demo data only until production security is implemented.
