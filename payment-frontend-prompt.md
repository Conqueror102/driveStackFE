# Frontend Payment Integration Prompt — DriveStack
# Pricing Page · Feature Gates · Upgrade Prompts
# Referral UI · Subscription Management · Admin Audit UI

---

## New pages and components to build

```
New pages:
  /pricing              ← public pricing page
  /payment/success      ← post-checkout success
  /payment/cancelled    ← user cancelled checkout
  /settings             ← user settings + subscription management
  /settings/billing     ← billing details + cancel subscription
  /settings/referrals   ← referral link + stats
  /admin                ← admin dashboard (protected by admin secret)
  /admin/audit          ← audit log viewer
  /admin/users          ← user management
  /admin/revenue        ← revenue summary

New components:
  billing/
    pricing-card.tsx
    pricing-toggle.tsx       ← monthly/annual toggle
    feature-comparison.tsx   ← full feature table
    upgrade-modal.tsx        ← triggered from within the app
    feature-gate.tsx         ← wrapper that locks Pro features
    pro-badge.tsx            ← "Pro" badge shown next to features
    billing-status-card.tsx  ← shows current plan + status
    cancel-subscription-dialog.tsx
    grace-period-banner.tsx  ← shown when ON_HOLD

  referrals/
    referral-card.tsx        ← link + copy button
    referral-stats.tsx       ← referral list with statuses
    bonus-slots-display.tsx  ← shows earned slots progress

  admin/
    audit-log-table.tsx
    revenue-summary.tsx
    user-table.tsx
    manual-upgrade-dialog.tsx
    pricing-editor.tsx
```

---

## New API functions

```typescript
// lib/api/payments.api.ts — new file
export const paymentsApi = {
  createCheckout: (dto: { currency: string }) =>
    api.post<{ checkoutUrl: string }>('/payments/checkout', dto),

  cancel: () =>
    api.post('/payments/cancel'),

  getPortalUrl: () =>
    api.get<{ url: string }>('/payments/portal'),

  getStatus: () =>
    api.get<SubscriptionStatus>('/payments/status'),
}

// lib/api/referrals.api.ts — new file
export const referralsApi = {
  getStats: () =>
    api.get<ReferralStats>('/referrals/stats'),
}

// lib/api/admin.api.ts — new file
// Uses x-admin-secret header
export const adminApi = {
  getAuditLog:    (params: AuditLogParams) =>
    adminRequest.get('/admin/audit-log', { params }),

  getRevenue:     () =>
    adminRequest.get('/admin/revenue'),

  getUsers:       (params: any) =>
    adminRequest.get('/admin/users', { params }),

  manualUpgrade:  (userId: string, note: string) =>
    adminRequest.post(`/admin/users/${userId}/upgrade`, { note }),

  updatePricing:  (dto: UpdatePricingDto) =>
    adminRequest.put('/admin/pricing', dto),
}
```

---

## New Zustand store — subscription

```typescript
// stores/subscription.store.ts
interface SubscriptionStore {
  plan:   'FREE' | 'PRO' | null
  status: string | null
  gracePeriodEndsAt: string | null
  currentPeriodEnd:  string | null
  setSubscription: (data: SubscriptionData) => void
  isPro:           () => boolean
  isOnHold:        () => boolean
  canAccess:       (feature: ProFeature) => boolean
}

// canAccess mirrors the backend FeatureGuardService logic
// so the UI can gate features without an API call for every check
```

---

## /pricing — Public pricing page

### Page structure

```
<PricingPage>
  <PageHero />           ← headline + sub-headline
  <PricingToggle />      ← monthly / annual switch
  <PricingCards />       ← Free + Pro cards
  <FeatureComparison />  ← full feature table
  <FAQ />                ← 5 pricing-specific questions
  <FinalCTA />           ← bottom CTA
</PricingPage>
```

### PageHero

```
PRICING

Simple pricing.
No surprises.

One plan. Every feature.
Pay monthly, cancel whenever you want.
```

Centred. White background. 56px headline Inter 700.
Sub-headline 16px mid-grey.

### PricingToggle

A pill toggle between Monthly and Annual.

```
[Monthly]  [Annual — Save 33%]
```

Annual badge: small black background, white text "Save 33%",
border-radius 4px, 10px uppercase. Tight to the Annual label.

State lives in the parent component and drives which price
is shown in the cards below.

When toggled, the price in the Pro card animates:
- Old price fades down and out
- New price fades up and in
- Use AnimatePresence with mode="wait"

### PricingCards

Two cards side by side. Centred. Max-width 760px total.

**Free card:**

```
Free
────────────────────────────
₦0 / free forever

What you get:
— 2 Google accounts
— Full file browser
— Manual file upload
— Smart account recommendation
— Default account setting

[Get started free]
← full width outline button
```

**Pro card:**

```
PRO                  [MOST POPULAR]
────────────────────────────
₦800               ← large, 48px, Inter 700
/month             ← 14px mid-grey

or ₦6,400/year (save ₦3,200)
← shown when annual toggle is active

International: $1.99/month

Everything in Free, plus:
— Unlimited Google accounts
— Move files between accounts
— Duplicate file detector (weekly)
— Bulk select + delete + move
— Storage alerts + notifications
— Storage history chart
— Upload from URL
— File preview
— Priority support
— Referral programme

[Upgrade to Pro →]
← full width filled black button
```

Card design:
Free: `border border-border` white background
Pro: `border-2 border-black` white background — heavier border
distinguishes it without colour.

`MOST POPULAR` badge: black background, white text, 10px uppercase,
`border-radius: 4px`, positioned absolute top-right of Pro card header.

Feature list items: `—` em dash as marker. 14px near-black.
Line-height: 2.0 — generous spacing makes the list feel premium.

Separator between Free features and "Everything in Free plus":
full-width `1px solid border` rule, 8px margin top and bottom.

### FeatureComparison

A full table below the cards. Every feature in the app listed.
Two columns: Free and Pro.

```
Feature                        Free    Pro
─────────────────────────────────────────
Google accounts                 2       ∞
File browser                    ✓       ✓
Manual upload                   ✓       ✓
Smart recommendation            ✓       ✓
Default account                 ✓       ✓
─────────────────────────────────────────
Move between accounts           —       ✓
Duplicate detector              —       ✓
Bulk operations                 —       ✓
Storage alerts                  —       ✓
Storage history chart           —       ✓
Upload from URL                 —       ✓
File preview                    —       ✓
Referral programme              —       ✓
─────────────────────────────────────────
Support                       Basic  Priority
```

Table design: no outer border. Internal `1px solid border`
row dividers. Section headers (first row of each group) in
12px uppercase mid-grey as a divider label.

`✓` in near-black. `—` in light-grey. `∞` in near-black.
The visual difference between ✓ and — must be immediate.

### Checkout flow

When user clicks "Upgrade to Pro":

1. Detect currency from `user.country`:
   ```typescript
   const currency = user.country === 'NG' ? 'NGN' : 'USD'
   ```

2. Call `paymentsApi.createCheckout({ currency })`

3. Show loading state on button:
   - Spinner replaces button label
   - Button is disabled

4. On success: `window.location.href = data.checkoutUrl`
   — redirect to Dodo hosted checkout

5. On error: toast.error("Something went wrong. Try again.")
   — button returns to normal

---

## /payment/success — Post-checkout success page

The user lands here after successful payment.
Dodo redirects to this URL after checkout.

**Page design:**

Centred. White background. Full-height.

```
[Large animated checkmark — draws itself on mount]

You're now on Pro 🎉

All features are unlocked.
Your subscription starts today.

[Go to my files →]     [View billing]
```

Animation: the checkmark draws itself using SVG stroke
`stroke-dashoffset` animation over 600ms.

On mount: call `paymentsApi.getStatus()` and update
the subscription store with the latest plan data.
This ensures the UI reflects Pro status immediately.

---

## /payment/cancelled — Cancelled checkout page

Simple. No drama. User changed their mind — that is okay.

```
No worries.

Your free account is still active.
You can upgrade whenever you're ready.

[← Back to DriveStack]     [View pricing]
```

---

## /settings/billing — Subscription management

```
<BillingStatusCard />
<PaymentHistoryList />
<DangerZone />           ← cancel subscription
```

### BillingStatusCard

```
Current plan:  Pro                [Manage billing →]
Status:        Active
Next billing:  June 17, 2026
Amount:        ₦800/month
```

If status is ON_HOLD, show `<GracePeriodBanner>` instead:

```
┌─────────────────────────────────────────────────────┐
│ ⚠  Payment failed — update your payment method      │
│    Your Pro access continues until June 5, 2026     │
│    after which your account will be downgraded.     │
│                         [Update payment method →]   │
└─────────────────────────────────────────────────────┘
```

Banner: amber background `#FFFBEB`, amber border `#D97706`.
"Update payment method" opens Dodo customer portal URL.

If status is CANCELLED:

```
┌─────────────────────────────────────────────────────┐
│ ℹ  Your subscription is cancelled                   │
│    Pro features remain active until June 17, 2026   │
│                              [Resubscribe]          │
└─────────────────────────────────────────────────────┘
```

Blue background `#EFF6FF`, blue border `#2563EB`.

### CancelSubscriptionDialog

Triggered by "Cancel subscription" in the danger zone.

```
┌──────────────────────────────────────────────┐
│  Cancel your subscription?                    │
│                                               │
│  You'll keep Pro access until June 17, 2026.  │
│  After that your account reverts to Free.     │
│                                               │
│  Your connected accounts stay connected.      │
│  Your files are never deleted.                │
│                                               │
│  [Keep my subscription]  [Cancel subscription]│
└──────────────────────────────────────────────┘
```

Important lines in the dialog:
- "Your connected accounts stay connected" — reassures the user
- "Your files are never deleted" — the trust statement

"Cancel subscription" is a destructive button but NOT red.
Use the outline variant — this is not an irreversible deletion.
The user can resubscribe. Red would be misleading.

---

## /settings/referrals — Referral programme

```
<ReferralCard />
<BonusSlotsDisplay />
<ReferralStats />
```

### ReferralCard

```
┌──────────────────────────────────────────────────┐
│  Your referral link                              │
│                                                   │
│  drivestack.app/r/VICTOR123                      │
│  ─────────────────────────────────  [Copy link]  │
│                                                   │
│  Share this link. When someone upgrades to Pro,  │
│  you earn +1 account slot permanently.            │
│                                                   │
│  [Share on WhatsApp]  [Share on Twitter]          │
└──────────────────────────────────────────────────┘
```

Copy button: copies URL to clipboard, button changes to
"Copied!" with a check icon for 2 seconds then reverts.

WhatsApp share: `https://wa.me/?text=I'm using DriveStack to manage all my Google Drive accounts in one place. Sign up here: {referralUrl}`

### BonusSlotsDisplay

```
Bonus slots earned

  ● ●  ○            2 of 3 earned

  Each referral that upgrades adds +1 account slot
  to your free account. Maximum 3 bonus slots.
```

Three circles in a row. Filled circles (●) for earned slots,
empty circles (○) for remaining. Each circle 20px, coloured
to match the account colour system — indigo for first,
green for second, orange for third.

### ReferralStats

A list of referrals with masked emails and statuses:

```
vi***@gmail.com      Converted    May 20   +1 slot ✓
sa***@yahoo.com      Pending      May 18   waiting...
tu***@gmail.com      Expired      Apr 30   —
```

Status pills:
- Converted: green background, green text
- Pending:   grey background, grey text
- Expired:   light background, tertiary text

---

## FeatureGate component

This is the most important component in the payment system.
It wraps any Pro feature and shows an upgrade prompt when
the user is on Free.

```typescript
// components/billing/feature-gate.tsx

interface FeatureGateProps {
  feature:    ProFeature
  children:   React.ReactNode
  fallback?:  React.ReactNode  // custom fallback if provided
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { canAccess } = useSubscriptionStore()

  if (canAccess(feature)) return <>{children}</>

  if (fallback) return <>{fallback}</>

  return <LockedFeaturePrompt feature={feature} />
}
```

### LockedFeaturePrompt

Different sizes depending on context:

**Inline (inside a button or menu item):**
```
🔒 Pro feature
```
Just a lock icon and "Pro feature" text in 12px mid-grey.
The button/menu item is visually dimmed, `opacity-50`,
`cursor-not-allowed`.

**Section (replacing a full page section):**
```
┌────────────────────────────────────────────────┐
│                                                 │
│  🔒                                             │
│                                                 │
│  Duplicate Detector                             │
│  [Pro feature]                                  │
│                                                 │
│  Find identical files across all your accounts  │
│  and free up storage with one click.            │
│                                                 │
│  [Upgrade to Pro — ₦800/month]                  │
│                                                 │
└────────────────────────────────────────────────┘
```

White card, `border border-border`, centred content,
`border-radius: 12px`, padding 40px.

Lock icon: 32px, mid-grey.
Feature name: 20px semibold near-black.
`[Pro feature]` badge: black background, white text,
10px uppercase, `border-radius: 4px`.
Description: 14px mid-grey.
Upgrade button: full-width black filled button.

**Modal (triggered from a feature action):**

When a user clicks a locked action (like "Move to account"),
instead of silently failing — open `<UpgradeModal>`.

### UpgradeModal

```
┌────────────────────────────────────────────────┐
│                                        [✕]      │
│                                                 │
│  Unlock Move Files                              │
│                                                 │
│  Move files between your Google accounts        │
│  instantly — no downloading, no re-uploading.   │
│                                                 │
│  Everything you get with Pro:                   │
│  — Move files between accounts                  │
│  — Duplicate detector                           │
│  — Bulk operations                              │
│  — Storage alerts                               │
│  — Unlimited accounts                           │
│                                                 │
│  ₦800/month · Cancel anytime                   │
│                                                 │
│  [Upgrade to Pro →]                             │
│  [Maybe later]                                  │
└────────────────────────────────────────────────┘
```

The modal headline is feature-specific — "Unlock Move Files",
"Unlock Duplicate Detector" etc. This makes the prompt feel
contextual not generic.

"Maybe later" is a ghost text link, mid-grey, small.
Never call it "Cancel" — that word has negative connotations
next to a payment conversation.

---

## GracePeriodBanner — global app banner

When subscription status is ON_HOLD, show a full-width
banner at the very top of every page inside the dashboard:

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Payment failed. Update your payment method to keep Pro access.│
│    Access expires June 5, 2026.          [Update payment method] │
└──────────────────────────────────────────────────────────────────┘
```

Amber background. Full-width. Sits above the sidebar and
main content — not inside either. 48px height.
Dismiss button (✕) removes it for this session only —
it reappears on next page load until resolved.

---

## Feature gating in existing pages

### Files page — toolbar

Bulk select mode: wrap the bulk selection trigger in FeatureGate:

```tsx
<FeatureGate feature="bulk_operations">
  <BulkSelectToggle />
</FeatureGate>
```

When free user clicks the dimmed bulk select:
```tsx
<FeatureGate
  feature="bulk_operations"
  fallback={
    <Tooltip content="Bulk operations require Pro">
      <button className="opacity-40 cursor-not-allowed">
        <CheckSquare className="h-4 w-4" />
      </button>
    </Tooltip>
  }>
  <BulkSelectToggle />
</FeatureGate>
```

### FileActionsMenu — Move to account

```tsx
<DropdownMenuItem
  onSelect={() => {
    if (!canAccess('move_files')) {
      openUpgradeModal('move_files')
      return
    }
    openMoveSheet(file)
  }}
  className={cn(!canAccess('move_files') && 'opacity-50')}>
  <ArrowRightLeft className="h-4 w-4 mr-2" />
  Move to account
  {!canAccess('move_files') && (
    <ProBadge className="ml-auto" />
  )}
</DropdownMenuItem>
```

### Duplicates page — entire page

```tsx
<FeatureGate
  feature="duplicate_detector"
  fallback={
    <LockedFeaturePrompt
      feature="duplicate_detector"
      title="Duplicate Detector"
      description="Find identical files across all your accounts and free up storage with one click."
    />
  }>
  <DuplicatesPageContent />
</FeatureGate>
```

### Accounts page — connect button

```tsx
// Show the limit and lock when at the limit
{isAtAccountLimit && !isPro && (
  <Tooltip content={`Free plan: ${accountLimit} accounts. Upgrade for unlimited.`}>
    <Button
      variant="outline"
      onClick={() => openUpgradeModal('connect_account_above_limit')}>
      <Lock className="h-4 w-4 mr-2" />
      Connect account
    </Button>
  </Tooltip>
)}
```

---

## Sidebar updates

Add a subtle plan indicator at the bottom of the sidebar:

**Free user:**
```
[Settings icon]  [Bell icon]
──────────────────────
victor@gmail.com
Free plan  [Upgrade →]
```

"Upgrade →" is a small text link in accent blue. It does not
scream at the user. It is simply there for when they are ready.

**Pro user:**
```
[Settings icon]  [Bell icon]
──────────────────────
victor@gmail.com
Pro  ✓
```

`Pro ✓` in 11px with a small green check. Quiet affirmation.
No badge, no announcement. Just a confirmation.

---

## /admin — Admin dashboard

Protected by checking `x-admin-secret` header from a
separate admin axios instance. This page is never linked
from the main app. Access it by navigating directly to `/admin`.

### Layout

Same app shell but with admin-specific sidebar:

```
Sidebar:
  Overview
  Users
  Revenue
  Audit Log
  Pricing
```

### Overview page

Four stat cards:
```
[ Active Pro users ]  [ Total revenue ]  [ Refunds ]  [ Disputes ]
```

Below: a simple line chart of daily new Pro subscribers
for the last 30 days.

### Audit Log page `/admin/audit`

A filterable table of all `AdminAuditLog` entries.

Filters:
```
[User email search]  [Action filter dropdown]  [Date range picker]
```

Table columns:
```
Timestamp  |  User  |  Action  |  Entity  |  Details
```

Clicking a row expands it to show the full `before` and
`after` JSON diff. Displayed as a two-column diff view —
left side before (red tint), right side after (green tint).

Pagination: 50 rows per page.

### Users page `/admin/users`

Table of all users with:
```
Email  |  Plan  |  Status  |  Joined  |  Accounts  |  Actions
```

Actions column: "Upgrade manually" button opens a dialog:

```
┌──────────────────────────────────────┐
│  Manually upgrade user               │
│                                      │
│  victor@gmail.com                    │
│                                      │
│  Reason / note:                      │
│  [                                   │
│  ]                                   │
│                                      │
│  This grants 30 days of Pro access.  │
│                                      │
│  [Cancel]  [Upgrade user]            │
└──────────────────────────────────────┘
```

Note is required — forces you to document why you're
manually upgrading someone.

### Pricing page `/admin/pricing`

```
┌──────────────────────────────────────────────────┐
│  Pricing configuration                           │
│                                                   │
│  Pro — Nigerian Naira (NGN)                      │
│  Dodo Product ID: [input field]                  │
│  Amount (kobo): [input field]   = ₦800           │
│  Interval: [month / year dropdown]               │
│  Status: [Active toggle]                         │
│                            [Save changes]        │
│  ─────────────────────────────────────────────   │
│  Pro — US Dollar (USD)                           │
│  [same fields]                                   │
└──────────────────────────────────────────────────┘
```

Below each pricing config: a change history log showing
the last 5 updates with timestamps and the values changed.
Pulled from `AdminAuditLog` filtered to `admin.pricing_updated`.

This lets you see exactly when and how you changed prices.

---

## New query keys

```typescript
// lib/constants/query-keys.ts — add:
subscriptionStatus: () => ['subscription', 'status'] as const,
referralStats:      () => ['referrals', 'stats'] as const,
paymentHistory:     () => ['payments', 'history'] as const,
adminAuditLog:      (params?: object) => ['admin', 'audit', params] as const,
adminRevenue:       () => ['admin', 'revenue'] as const,
adminUsers:         (params?: object) => ['admin', 'users', params] as const,
```

---

## Signup page update — referral code

Update the register page to:

1. Check for `?ref=CODE` in the URL on mount
2. Store the ref code in component state
3. Send it in the register API call:

```typescript
// In register mutation:
await authApi.register({
  email,
  password,
  displayName,
  referralCode: refCode ?? undefined,  // from URL param
})
```

4. Show a subtle banner on the register page when a ref code
   is present:

```
✓ You were referred by a DriveStack user.
  You'll both benefit when you upgrade to Pro.
```

12px, green text, green check icon. Below the form headline.

---

## Toast messages for payment events

```typescript
// After successful checkout redirect back:
// On /payment/success mount — check query params from Dodo
// Dodo may pass ?subscription_id= or similar

toast.success("You're now on Pro! All features unlocked.")

// After cancellation:
toast.success("Subscription cancelled. You keep Pro access until [date].")

// When grace period banner CTA clicked:
// Opens portal URL in new tab
window.open(portalUrl, '_blank')

// After referral link copied:
toast.success("Referral link copied!")

// When feature gate upgrade button clicked and checkout fails:
toast.error("Couldn't start checkout. Please try again.")
```

---

## Mobile behaviour

Pricing page:
- Cards stacked vertically — Pro card first on mobile
- Feature comparison table: horizontal scroll on mobile,
  sticky first column (feature name), scrollable second
  and third columns

Upgrade modal:
- Full-screen sheet on mobile, not a centred modal
- Slides up from bottom

Grace period banner:
- Two lines on mobile instead of one
- CTA button below the text

Admin pages:
- Not optimised for mobile — admin is desktop only
- Show a "Please use desktop for admin" message on mobile
