# SpendWise Payments Integration Roadmap

## Scope of this build

This package adds a PhonePe-style Payments section for UX prototyping. It does **not** execute UPI transfers, link bank accounts, collect UPI PINs/OTPs, scan live QR codes, or settle merchant payments.

## Working now
- Responsive payments landing screen and navigation.
- Demo UPI-ID form validates a sample-looking ID and displays a non-payment preview.
- Links to local transaction history.
- Existing local expense tracking, manual expense entry, CSV import, category assignment, and Android notification prototype remain separate.

## Demo-only
- Scan QR button is a placeholder; no camera is opened and no QR is decoded.
- Pay UPI ID is a local preview only; no payment intent or transfer is created.
- Bank transfer and bill payment buttons are not connected to payment rails.

## Requires external eligibility / approvals
- Initiating real UPI payments or becoming a UPI third-party app provider.
- Collecting payments as a merchant, dynamic QR, refunds, settlements, or bill payments.
- Official bank transaction data through the Account Aggregator ecosystem.

A payment initiation path and an Account Aggregator data path are distinct integrations. AA access is consent-driven data sharing; it does not itself authorize SpendWise to initiate UPI payments.

## Compliant path for real UPI payments in India
1. Define the exact model: (a) accepting payments for SpendWise itself, (b) integrating a licensed payment provider for merchants, or (c) a consumer-facing UPI app that initiates person-to-person transfers. These have different requirements.
2. Register the business if commercializing, but do not treat incorporation as UPI eligibility.
3. Contact an acquiring bank / sponsor bank or an authorized payment provider and describe the product and user journey. For a full consumer UPI app, ask the bank to assess sponsor-bank/TPAP participation requirements and NPCI onboarding.
4. Complete the partner's legal, KYB/KYC, security, privacy, risk, dispute, grievance, fraud monitoring, and technical review.
5. Obtain sandbox credentials and documented APIs from the selected partner. Never use guessed endpoints or secrets from the frontend.
6. Build a backend integration: secret storage, signed request verification, idempotency keys, webhook validation, transaction state machine, reconciliation, audit logging, rate limiting, and per-user access control.
7. Use partner-approved UPI flows and SDKs. UPI PIN entry must occur only in the approved bank/UPI flow; SpendWise must never collect or store a UPI PIN or OTP.
8. Complete UAT/certification and written production approval before enabling live transfers.

## Suggested architecture
Android app (Capacitor/native UI) -> SpendWise backend -> approved partner API. The backend stores provider secrets and validates callbacks. The client only receives the minimum transaction status needed for display. Separate account-data consent and payment initiation services, databases, permissions, and audit trails.

## Provider onboarding packet to prepare
- Company legal name, incorporation/registration documents, PAN and authorized signatory details as applicable.
- Product description, target users, flow diagrams, expected volumes, supported use cases, and monetization model.
- Privacy policy, terms, data retention/deletion policy, consent UX, grievance/support contact, and incident response plan.
- Security architecture, penetration-test plan/report if requested, vulnerability management, encryption/key-management plan, and business continuity plan.
- Fraud/AML/sanctions controls, transaction monitoring, dispute/refund handling, and customer support process as applicable to the chosen role.
- Technical callback/webhook URLs, domain ownership, app package ID, signing details, test devices, and sandbox test results.

Exact documents, fees, regulatory eligibility, sponsor-bank requirements, and certification steps depend on the selected partner and the exact product model. Obtain the current checklist in writing from that partner and qualified Indian counsel.

## Official starting points
- NPCI UPI: https://www.npci.org.in/what-we-do/upi/product-overview
- NPCI UPI ecosystem / TPAP information: https://www.npci.org.in/what-we-do/upi/third-party-app-providers
- Setu Account Aggregator docs (bank-data sharing, not payment initiation): https://docs.setu.co/data/account-aggregator/quickstart
- Google Play policies: https://support.google.com/googleplay/android-developer/topic/9877467

## Production safety checklist
- Never store bank passwords, UPI PINs or OTPs.
- No real transfer button until partner certification and production credentials are in place.
- Display clear payment status from a verified backend; do not treat client-side success as proof of payment.
- Idempotent payment requests and webhook handling.
- Reconciliation and clear pending/failed/reversed states.
- Least-privilege access, secure logging without secrets, and a deletion/revocation path.
