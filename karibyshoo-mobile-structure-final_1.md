# Karibyshoo Mobile — Final Structure & Workflow (Expo + Expo Router)

Based on the full set of screens you shared, five patterns repeat across every domain (Visitors, Vehicles, Meetings, Wallet). Building **shared components for these five patterns first** is the single highest-leverage thing your team can do — it turns ~90 screens into maybe 15 real screens with different data plugged in.

---

## Part 1 — The 5 repeating patterns

### Pattern A: "Hub Dashboard" (Vehicle Parking Log, Check-in Log, Meetings, Payment List)
Every list screen looks like: **4 stat cards (2×2 grid)** → optional quick-action buttons → **searchable/filterable/paginated table** (search + calendar icon + status dropdown + export icon, rows with a status pill + "Details"/"Check-in" link, page numbers at the bottom).
→ Build once as `<StatGrid>` + `<FilterableTable>`, reuse with different stat definitions and columns.

### Pattern B: "Three-Method Check-in" (Visitors, Vehicles, Meeting Attendees)
Every check-in type offers the same three entry methods:
- **Basic Phone** — no OTP, gate-only, minimal fields, staff-operated
- **Assisted** — staff-operated, fuller form, split by context (Gate vs Reception/Parking Slot)
- **Smart Phone** — self-serve: phone number → Send OTP → Verify → form → **Confirm/Review screen** → submit

All three end in the same shape: a review screen showing everything entered, then a submit button whose label matches the action (Check-in / Add Attendee / Confirm Check-in).
→ Build once as `<VerificationStep>` (phone+OTP), `<EntityForm>` (configurable fields), `<ReviewScreen>` (read-only recap + submit).

### Pattern C: "Status Detail" (Visitor/Vehicle/Meeting Details)
Every detail screen: status badge top-left (Checked-In / Checked-Out / Reopened / Pending / Ongoing / Completed / Upcoming) → key-value info block → **tabbed content** (Notes-from-Admin vs Comments, or Remarks vs Comments) → image gallery (for visitor/vehicle) → primary action button that **changes based on status** (Checkout, Reopen, End Meeting, Edit).
→ Build once as `<StatusDetailScreen>` taking a status enum, a fields list, tab config, and a status→action map.

### Pattern D: "Sensitive Action Modal" (Reopen Visit Record, End Meeting)
Any destructive/irreversible action follows: confirmation copy → optional reason/remark textarea → optional image upload → **password field to authorize** → Cancel/Confirm buttons.
→ Build once as `<SensitiveActionModal>`, reused for Reopen, End Meeting, Delete Account, Payment Confirm.

### Pattern E: "Comments Thread"
Full-screen or embedded list of avatar + name + timestamp + message bubbles, with a "drop comment here" input + Send button at the bottom.
→ Build once as `<CommentsThread>`, used standalone (Comments screen) or embedded in a detail-screen tab.

---

## Part 2 — Full folder structure

```
karibyshoo-mobile/
├── src/
│   ├── app/                                  # Expo Router — routing only, thin files
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── check-email.tsx
│   │   │   ├── verify-email.tsx
│   │   │   ├── new-password.tsx
│   │   │   └── create-account/
│   │   │       ├── index.tsx                 # choose Company vs Individual
│   │   │       ├── company.tsx
│   │   │       └── individual.tsx
│   │   │
│   │   ├── (app)/                            # authenticated
│   │   │   ├── _layout.tsx
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx               # Home / Check-ins / Wallet / Settings
│   │   │   │   ├── home/index.tsx            # dashboard — company OR individual variant by role
│   │   │   │   ├── check-ins/
│   │   │   │   │   ├── index.tsx             # hub: 3 cards -> Visitors / Meeting / Vehicle Parking
│   │   │   │   │   ├── visitors/…
│   │   │   │   │   ├── meetings/…
│   │   │   │   │   └── vehicle-parking/…
│   │   │   │   ├── wallet/…
│   │   │   │   └── settings/…
│   │   │   └── … (non-tab stacks reachable from Home quick actions / other domains)
│   │   │
│   │   ├── +not-found.tsx
│   │   └── _layout.tsx                       # imports "@/global.css", providers, fonts
│   │
│   ├── global.css                            # 🔑 lives beside app/, imported via "@/global.css"
│   │
│   ├── screens/                              # mirrors web pages/ 1:1 by domain
│   │   ├── login/  create-account/  dashboard/        (company + individual variants)
│   │   │
│   │   ├── visitors/
│   │   │   ├── log/                          # Pattern A: Check-in Log dashboard + list
│   │   │   ├── checkin/
│   │   │   │   ├── basic-phone.tsx
│   │   │   │   ├── assisted-gate.tsx
│   │   │   │   ├── assisted-reception.tsx
│   │   │   │   ├── smart-phone.tsx           # phone/OTP -> form -> confirm-visitor
│   │   │   │   └── confirm-visitor.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── assisted.tsx
│   │   │   │   └── smart-phone.tsx
│   │   │   ├── detail/                       # Pattern C: status detail (+ reopen modal)
│   │   │   └── individual/                   # simplified self-view variants
│   │   │
│   │   ├── vehicle-parking/
│   │   │   ├── log/                          # Pattern A
│   │   │   ├── checkin/
│   │   │   │   ├── basic-phone-gate.tsx
│   │   │   │   ├── assisted-gate.tsx
│   │   │   │   ├── assisted-parking-slot.tsx # incl. "Verify Vehicle" sub-step
│   │   │   │   ├── smart-phone-gate.tsx
│   │   │   │   └── smart-phone-parking-slot.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── assisted.tsx
│   │   │   │   └── smart-phone.tsx
│   │   │   ├── detail/                       # Pattern C, + map + gallery
│   │   │   └── individual/
│   │   │
│   │   ├── meetings/
│   │   │   ├── list/                         # Pattern A: Meetings dashboard
│   │   │   ├── create/
│   │   │   │   ├── form.tsx
│   │   │   │   └── review.tsx                # Pattern B review step, password toggle
│   │   │   ├── detail/                       # Pattern C: status -> Cancel/Edit | End Meeting
│   │   │   ├── end-meeting.tsx                # Pattern D
│   │   │   ├── join-requests/                # Pattern A variant (Requests List)
│   │   │   ├── attendees/
│   │   │   │   ├── add/
│   │   │   │   │   ├── basic.tsx
│   │   │   │   │   ├── assisted.tsx
│   │   │   │   │   ├── smart-phone.tsx
│   │   │   │   │   └── confirm.tsx
│   │   │   │   ├── list.tsx                  # Attendee List (Pattern A)
│   │   │   │   └── detail.tsx
│   │   │   ├── payments/
│   │   │   │   ├── list.tsx                  # Payment List, Pay-all (Pattern A)
│   │   │   │   ├── detail.tsx                # Pattern D-style password confirm to edit/pay
│   │   │   └── individual/
│   │   │       ├── join-meeting.tsx
│   │   │       ├── join-confirmation.tsx
│   │   │       └── detail.tsx                # tabs: Remarks/Comments
│   │   │
│   │   ├── wallet/
│   │   │   ├── index.tsx                     # balance + Transfer/Add Money
│   │   │   ├── add-funds/
│   │   │   │   ├── card.tsx  momo.tsx  bank-transfer.tsx
│   │   │   ├── transfer.tsx
│   │   │   ├── transaction-detail.tsx
│   │   │   └── transaction-history.tsx
│   │   │
│   │   ├── settings/
│   │   │   ├── index.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── geofencing.tsx                # dynamic add/remove "Point" list
│   │   │   ├── preference.tsx
│   │   │   ├── security/
│   │   │   │   ├── index.tsx  change-password.tsx  notifications.tsx
│   │   │   ├── notifications.tsx
│   │   │   └── data-privacy/
│   │   │       ├── index.tsx  logs-reports.tsx  data-retention.tsx  delete-account.tsx
│   │   │
│   │   ├── comments/                         # standalone full-screen (Pattern E)
│   │   │
│   │   └── not-found/
│   │
│   ├── components/
│   │   ├── patterns/                         # 🔑 the 5 reusable patterns above
│   │   │   ├── StatGrid.tsx
│   │   │   ├── FilterableTable.tsx
│   │   │   ├── VerificationStep.tsx          # phone + OTP
│   │   │   ├── EntityForm.tsx                # config-driven form (visitor/vehicle/attendee)
│   │   │   ├── ReviewScreen.tsx
│   │   │   ├── StatusDetailScreen.tsx
│   │   │   ├── SensitiveActionModal.tsx
│   │   │   └── CommentsThread.tsx
│   │   ├── ui/                               # buttons, inputs, badges, cards
│   │   ├── forms/
│   │   ├── SignaturePad.tsx                  # 📱 mobile-native, canvas/gesture based
│   │   ├── ImageGallery.tsx
│   │   └── MapPreview.tsx
│   │
│   ├── api/  constants/  context/  hooks/  store/  types/  utils/    # ported from web, minimal changes
│   │
│   └── services/                             # 📱 mobile-only device capabilities
│       ├── camera.ts                         # QR scan (gate/company ID), image capture
│       ├── location.ts                       # geofencing, vehicle parking map
│       ├── notifications.ts
│       ├── biometrics.ts
│       └── storage.ts                        # SecureStore wrapper
│
├── assets/
├── nativewind-env.d.ts  postcss.config.mjs                       # project root, not src/
└── app.json  babel.config.js  tsconfig.json  metro.config.js  package.json
```

> **What actually moved:** only `app/` and `global.css` — they now live inside `src/`. Every config file (`metro.config.js`, `postcss.config.mjs`, `nativewind-env.d.ts`, `tsconfig.json`, `package.json`, `app.json`) stays at the project root, since those are tooling config, not app code — Metro/PostCSS/TypeScript all expect to find them there regardless of where `src/` puts your actual code. `src/screens/`, `src/components/`, `src/api/`, `src/services/`, etc. were already inside `src/` in the original plan, so nothing about Part 1 or Part 3 changes.

---

## Part 3 — Workflow, tied to what you actually showed me

### Auth
`Login` → `Sign Up` (choose Company/Individual → respective form) or `Forgot Password` → `Check Email` → `Verify Email` (OTP) → `New Password` → back to `Login`.

### Home (role-aware)
- **Company admin**: stat cards (Total Checkin, Total Meeting, Check-in Today, Parking Sessions) → quick actions (Checkin / Join Meeting / Park Vehicle) → Recent Checkins table.
- **Individual**: same shape, different actions (Add Visitor / New Meeting / Park Vehicle) and Active Checkin table.

### Check-ins tab (the real backbone)
`Check-ins` hub → 3 cards → **Visitors Check-in | Meeting | Vehicle Parking**, each opening its own Pattern-A log screen.

**Within each domain**, the check-in action always resolves the same way:
1. Pick a method (Basic / Assisted / Smart Phone) — usually determined by *who's* checking in (staff vs visitor's own phone) and *where* (gate vs reception/parking-slot).
2. Fill the form (fields vary: visitor info, vehicle info, driver info — but the shape is identical: personal details, ID details, purpose/remark).
3. Smart Phone flows insert a phone+OTP step before the form; Assisted/Parking-Slot flows insert a "Verify Vehicle/Visitor" review step before final confirm.
4. Submit → lands on the Status Detail screen for that record.

**Status Detail** then drives what's next:
- `Checked-In` → primary action is Checkout (or, for vehicles, opens the Vehicle Checkout flow with payment method + OTP/transaction ID).
- `Checked-Out` → primary action is **Reopen Visit Record** (Pattern D modal, password-gated).
- Notes/Comments tab lets staff log admin remarks against the record at any time.

### Meetings
`Meetings` list (Pattern A) → **Create Meeting** (form → review, with optional password protection) or tap a row for **Meeting Details**.
- `Upcoming` → Cancel Meeting / Edit Meeting Details.
- `Ongoing` → Comments tab active, **End Meeting** button (Pattern D: image + closing remark + password).
- `Completed` → read-only, attendance stats, still browsable comments.
- **Attendees**: `Add Attendee` (same 3-method pattern, includes signature capture) → `Attendee List` (Pattern A) → `Attendee Detail` → **Payment Details** (edit account/bank + password-authorize) → `Payment List` with Pay-all.
- **Individual**: `Join Meeting` (enter ID or scan QR) → password gate if required → `Confirm`/Save Attendance (with signature) → `Meeting Details` (Remarks/Comments tabs).

### Wallet
`Wallet` (balance, Transfer, Add Money) → `Add Funds` (Card/Momo/Bank Transfer — each with different fields) or `Transfer` (account + bank + password-authorize) → `Transaction Detail` → `Transaction History` (searchable, dated).

### Settings
`Settings` menu → `Profile`, `Geofencing` (dynamic point list), `Preference`, `Security` (→ Change Password, Security Notifications), `Notifications` (grouped toggles), `Data & Privacy` (→ Logs & Reports, Data Retention, Delete Account — the last two using Pattern D).

---

## Why this will hold up as the team grows

- **New devs** map a Figma screen to a folder in seconds: domain name matches web `pages/`, and if it's a list/detail/check-in screen, they already know the shape from Pattern A/B/C.
- **Bug fixes to shared UI** (e.g. "make the OTP resend timer configurable") happen in **one file** (`VerificationStep.tsx`) instead of five copy-pasted forms.
- **New domains** (Companies, Branches, Complexes, Users, Office Space — the ones without mobile designs yet) will very likely reuse Pattern A (list) and Pattern C (detail) almost as-is, so building those out later should be fast.
