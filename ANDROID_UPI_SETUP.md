# SpendWise — Android UPI notification prototype setup

This is an **experimental notification-based prototype**, not an official UPI API connection. It only detects readable notifications from the payment apps whose Android package names are listed in the service. Notifications can be missing, delayed, reformatted, or ambiguous. Every candidate must be reviewed before it becomes a transaction.

## What this patch includes
- Connections screen for notification access and status.
- Java Capacitor plugin to open Android's notification-access settings.
- Android `NotificationListenerService` prototype for Google Pay, PhonePe and Paytm package names.
- Local parsing and a Confirm & save / Dismiss review step.
- No bank password, UPI PIN or OTP collection; no cloud sync is included.

## Build on Windows
1. Install Node.js LTS and Android Studio with Android SDK.
2. Extract the project ZIP, open Command Prompt in the project folder, and run:
   ```bat
   npm install
   npx cap add android
   ```
   If the `android` folder already exists, skip `npx cap add android`.
3. Copy `android-integration\src\main\java\com\example\spendwise\UpiNotificationPlugin.java` and `UpiNotificationListenerService.java` into `android\app\src\main\java\com\example\spendwise\`.
4. Open the generated `android\app\src\main\java\...\MainActivity.java` and register the plugin before `super.onCreate`:
   ```java
   registerPlugin(UpiNotificationPlugin.class);
   ```
   Add `import com.example.spendwise.UpiNotificationPlugin;` if needed. Keep your existing package declaration and existing MainActivity code.
5. Merge the service entry from `android-integration\AndroidManifest-additions.xml` inside the `<application>` element of `android\app\src\main\AndroidManifest.xml`.
6. Confirm the Android namespace/application ID is `com.example.spendwise`, or update Java package names, manifest service name, and broadcast action consistently if you changed it.
7. Run:
   ```bat
   npx cap sync android
   npx cap open android
   ```
8. Build and run on a real Android phone. In SpendWise > Connections, tap **Enable notification access**, select SpendWise in Android settings, enable access, return to the app, and tap **Check status**.

## Before using
- The Java package names of payment apps can vary by market/version. Verify installed package names on your target device and update the allowlist in `UpiNotificationListenerService.java`.
- This prototype listens only while Android has the service enabled. The current bridge is not a durable background queue; do not rely on it for financial records if the SpendWise process is not active. Add encrypted persistent queuing, transaction review, retention controls and tests before production.
- Do not publish the app or request broad SMS access for this feature. This design uses notification access, which is separately sensitive and must be disclosed clearly. Review Google Play policy and applicable privacy requirements before distribution.
- Notifications are not authoritative bank statements. A notification can be a request, refund, failed payment, or unrelated message; parser rules are heuristic.
- GitHub Pages is only the web version. Native notification access works only in the built Android app.

## Not included
No official UPI transaction-history API, no bank integration, no automatic cloud sync, no guarantee of every transaction, no production-grade background queue, and no Play Store policy approval. These require separate implementation, testing, and potentially provider approval.
