# Frontend build prompt — Multi-account Google Drive aggregator
# Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui

---

## What you are building

A production-grade Next.js frontend for a multi-account Google Drive storage
manager. Users connect multiple Gmail accounts and see all their Drive storage
in one unified interface — combined quota display, file browser across all
accounts, drag-and-drop upload with account routing, and account management.

The design language is: light, airy, editorial, and premium. Think Linear,
Vercel dashboard, or Raycast's website. Clean whites, soft neutral surfaces,
precise typography, generous whitespace. No dark mode. No gradients. No
decorative elements. Every pixel serves a purpose.

---

## Tech stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode — `"strict": true` in tsconfig)
- **Styling**: Tailwind CSS 3.4+
- **Component library**: shadcn/ui (use the New York style variant)
- **Server state**: TanStack Query v5 (@tanstack/react-query)
- **Client state**: Zustand 4+
- **Forms**: React Hook Form + Zod
- **HTTP client**: Axios with a typed instance
- **Icons**: Lucide React (already included with shadcn)
- **Fonts**: Inter (via next/font/google)
- **Notifications**: Sonner (toast library, already works with shadcn)
- **Upload**: native browser File API + XMLHttpRequest (for progress tracking)
- **Date formatting**: date-fns

---

## Folder structure

Generate this exact structure. Do not deviate from it:

```
src/
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
      layout.tsx
    (dashboard)/
      layout.tsx
      page.tsx                      ← /  (redirects to /files)
      files/
        page.tsx                    ← /files
      accounts/
        page.tsx                    ← /accounts
      storage/
        page.tsx                    ← /storage
    globals.css
    layout.tsx                      ← root layout, fonts, providers
    not-found.tsx

  components/
    ui/                             ← shadcn generated components only
      button.tsx
      input.tsx
      badge.tsx
      dialog.tsx
      dropdown-menu.tsx
      progress.tsx
      skeleton.tsx
      tooltip.tsx
      separator.tsx
      avatar.tsx
      scroll-area.tsx
      select.tsx
      popover.tsx
      command.tsx
      alert.tsx

    layout/
      app-shell.tsx                 ← sidebar + main content wrapper
      sidebar.tsx                   ← nav sidebar
      sidebar-nav-item.tsx
      header.tsx                    ← top bar with page title + actions
      mobile-nav.tsx                ← bottom nav for mobile

    dashboard/
      storage-overview-card.tsx     ← big combined quota card
      segmented-quota-bar.tsx       ← coloured bar split by account
      account-quota-row.tsx         ← per-account breakdown row
      stats-strip.tsx               ← total files, accounts, free space

    files/
      file-browser.tsx              ← orchestrator for the whole page
      file-toolbar.tsx              ← search + filters + view toggle
      file-list.tsx                 ← list view
      file-grid.tsx                 ← grid view (thumbnails)
      file-row.tsx                  ← single row in list view
      file-card.tsx                 ← single card in grid view
      file-type-icon.tsx            ← icon mapped to file type
      account-badge.tsx             ← coloured pill for an account
      duplicate-badge.tsx           ← "duplicate" indicator
      file-actions-menu.tsx         ← download / delete dropdown
      file-empty-state.tsx
      file-skeleton.tsx             ← loading skeleton for list

    accounts/
      accounts-list.tsx
      account-card.tsx
      connect-account-button.tsx
      disconnect-dialog.tsx
      quota-mini-bar.tsx            ← small inline quota bar on account card

    upload/
      upload-zone.tsx               ← full-page drop target
      upload-staging-bar.tsx        ← bottom bar that appears after drop
      account-picker.tsx            ← account selection with quota display
      upload-progress-item.tsx      ← per-file progress row
      upload-queue.tsx              ← list of in-progress uploads

    common/
      page-header.tsx               ← page title + subtitle + action slot
      empty-state.tsx               ← generic empty state with icon
      error-state.tsx               ← error with retry button
      confirm-dialog.tsx            ← reusable "are you sure?" dialog
      kbd.tsx                       ← keyboard shortcut display
      copy-button.tsx

  hooks/
    use-files.ts                    ← TanStack Query hooks for files
    use-accounts.ts                 ← TanStack Query hooks for accounts
    use-storage.ts                  ← TanStack Query hook for quota
    use-upload.ts                   ← upload state + XHR progress logic
    use-debounce.ts
    use-drag-drop.ts                ← window-level drag detection
    use-key-binding.ts

  lib/
    api/
      client.ts                     ← axios instance + interceptors
      auth.api.ts
      accounts.api.ts
      files.api.ts
      storage.api.ts
      upload.api.ts

    utils/
      bytes.ts                      ← formatBytes, parseBytes
      dates.ts                      ← formatDate, formatRelative
      file-type.ts                  ← mimeType → FileType, icon, label
      account-colors.ts             ← deterministic color per account
      cn.ts                         ← clsx + tailwind-merge helper

    validations/
      auth.schema.ts
      upload.schema.ts

    constants/
      query-keys.ts
      routes.ts
      file-types.ts
      account-colors.ts

  stores/
    auth.store.ts                   ← user session, JWT token
    upload.store.ts                 ← active upload queue

  types/
    api.types.ts                    ← raw API response shapes
    file.types.ts
    account.types.ts
    upload.types.ts
    query.types.ts                  ← query param shapes

  providers/
    providers.tsx                   ← composes all providers
    query-provider.tsx
    auth-provider.tsx
```

---

## Design system

### Typography

```
Font family:  Inter (next/font/google, subsets: ['latin'])
Apply to:     <html> via className

Scale:
  xs:   12px / 16px line-height
  sm:   13px / 20px
  base: 14px / 20px    ← default body
  lg:   16px / 24px
  xl:   18px / 28px
  2xl:  24px / 32px
  3xl:  30px / 36px

Weights used: 400 (regular), 500 (medium), 600 (semibold) only.
Never use 700 or 800 — too heavy against the light surfaces.
```

### Colour palette

Define these as Tailwind CSS custom tokens in `tailwind.config.ts`.
Do not use raw hex values in component files — always use the token names.

```typescript
// tailwind.config.ts extend.colors:
colors: {
  background:  '#FFFFFF',
  surface:     '#FAFAFA',
  border:      '#E5E7EB',
  'border-strong': '#D1D5DB',

  text: {
    primary:   '#0F0F0F',
    secondary: '#6B7280',
    tertiary:  '#9CA3AF',
    disabled:  '#D1D5DB',
  },

  accent: {
    DEFAULT: '#2563EB',   // primary blue for CTAs
    hover:   '#1D4ED8',
    subtle:  '#EFF6FF',   // light blue background
    text:    '#1D4ED8',   // blue text on white
  },

  success: {
    DEFAULT: '#16A34A',
    subtle:  '#F0FDF4',
    text:    '#15803D',
  },

  warning: {
    DEFAULT: '#D97706',
    subtle:  '#FFFBEB',
    text:    '#B45309',
  },

  danger: {
    DEFAULT: '#DC2626',
    subtle:  '#FEF2F2',
    text:    '#B91C1C',
  },
}
```

### Account colour system

Each connected Google account gets a consistent colour used everywhere it
appears — quota bars, account badges, file row accents, account cards.
Assign colours deterministically by the account's index in the list
(first connected = colour[0], second = colour[1], etc.).

```typescript
// lib/constants/account-colors.ts
export const ACCOUNT_COLORS = [
  { bg: '#EEF2FF', text: '#3730A3', dot: '#6366F1' },  // indigo
  { bg: '#F0FDF4', text: '#166534', dot: '#22C55E' },  // green
  { bg: '#FFF7ED', text: '#9A3412', dot: '#F97316' },  // orange
  { bg: '#FDF4FF', text: '#6B21A8', dot: '#A855F7' },  // purple
  { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' },  // emerald
  { bg: '#FFF1F2', text: '#9F1239', dot: '#F43F5E' },  // rose
] as const

// lib/utils/account-colors.ts
export function getAccountColor(index: number) {
  return ACCOUNT_COLORS[index % ACCOUNT_COLORS.length]
}
```

### Spacing

Use Tailwind's default spacing scale. The most common values in this app:
- Component padding: `p-4` (16px) for cards, `p-3` (12px) for rows
- Section gaps: `gap-6` (24px) between cards, `gap-3` (12px) within cards
- Page padding: `px-6 py-6` on the main content area
- Sidebar width: `w-60` (240px), fixed

### Borders and radius

```
Default border:   border border-border (1px #E5E7EB)
Strong border:    border border-border-strong
Radius:           rounded-lg  (8px) for cards
                  rounded-md  (6px) for buttons, inputs, badges
                  rounded-sm  (4px) for small pills
                  rounded-full for dots and avatars
```

### Shadows

Use sparingly. Only one level:
```
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
```
Applied only to: floating panels (dropdowns, popovers), dialogs, and the
sidebar on mobile. Never on regular cards — borders are sufficient.

---

## Axios client

```typescript
// lib/api/client.ts

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor — attach JWT from auth store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

---

## Auth store (Zustand)

```typescript
// stores/auth.store.ts

interface AuthState {
  user:         User | null
  token:        string | null
  isHydrated:   boolean
  setSession:   (user: User, token: string) => void
  clearSession: () => void
}

// Persist token to localStorage.
// Use zustand/middleware persist with key 'auth-storage'.
// On hydration, validate the token is not expired before setting user.
```

---

## Upload store (Zustand)

```typescript
// stores/upload.store.ts

interface UploadItem {
  id:          string        // local UUID
  sessionId:   string        // UploadSession.id from backend
  sessionUri:  string        // Google resumable upload URI
  file:        File
  accountId:   string
  accountEmail: string
  progress:    number        // 0–100
  status:      'pending' | 'uploading' | 'complete' | 'error'
  error?:      string
}

interface UploadStore {
  queue:          UploadItem[]
  isOpen:         boolean        // staging bar visible?
  stagedFiles:    File[]         // files dropped, awaiting account selection
  addToQueue:     (item: UploadItem) => void
  updateProgress: (id: string, progress: number) => void
  setStatus:      (id: string, status: UploadItem['status'], error?: string) => void
  stageFiles:     (files: File[]) => void
  clearStaged:    () => void
  dismiss:        (id: string) => void
}
```

---

## TanStack Query keys

Define all query keys as constants. Never use inline strings:

```typescript
// lib/constants/query-keys.ts
export const QUERY_KEYS = {
  files:       (params?: object) => ['files', params] as const,
  accounts:    ()                => ['accounts'] as const,
  storage:     ()                => ['storage'] as const,
  account:     (id: string)      => ['accounts', id] as const,
} as const
```

---

## Custom hooks

### `use-accounts.ts`

```typescript
// useAccounts(): returns list of connected accounts with color index injected
// useConnectAccount(): returns mutation that opens Google OAuth URL
// useDisconnectAccount(): returns mutation, invalidates accounts + files + storage
// useRefreshQuota(accountId): returns mutation that re-fetches quota for one account
```

### `use-files.ts`

```typescript
// useFiles(params: ListFilesParams): paginated file list with TanStack Query
// useDeleteFile(): mutation, optimistically removes from cache, shows toast
// useInvalidateFiles(): utility to bust file cache
```

### `use-storage.ts`

```typescript
// useStorage(): returns aggregated quota — totalLimit, totalUsed, totalFree, per-account breakdown
// Stale time: 10 minutes (matches backend cache TTL)
```

### `use-upload.ts`

```typescript
// Manages the full upload lifecycle:
// 1. createSession(file, accountId) — POST to backend, get sessionUri
// 2. startUpload(uploadItem) — XHR PUT to sessionUri with progress events
// 3. completeUpload(sessionId, driveFileId) — PATCH to backend
// 4. Use XMLHttpRequest, not fetch, because fetch does not expose upload progress
//
// XHR implementation:
const xhr = new XMLHttpRequest()
xhr.upload.onprogress = (e) => {
  if (e.lengthComputable) {
    const pct = Math.round((e.loaded / e.total) * 100)
    uploadStore.updateProgress(item.id, pct)
  }
}
xhr.onload = () => { ... }
xhr.onerror = () => { ... }
xhr.open('PUT', item.sessionUri)
xhr.setRequestHeader('Content-Type', item.file.type)
xhr.send(item.file)
```

### `use-drag-drop.ts`

```typescript
// Attaches dragenter / dragleave / drop to the window.
// Exposes: isDragging: boolean
// On drop: calls uploadStore.stageFiles(files), sets isOpen: true
// This makes the entire app a drop target — the user can drag files
// anywhere on the screen, not just a specific zone.
```

---

## Page specifications

---

### Root layout (`app/layout.tsx`)

- Apply Inter font to `<html>`
- Wrap children in `<Providers>` (query, auth)
- Include `<Toaster>` from Sonner
- Set metadata: title template `%s | DriveStack` (choose your app name)
- `viewport: { width: 'device-width', initialScale: 1 }`

---

### Auth layout (`app/(auth)/layout.tsx`)

- Centered layout, max-width 400px
- Light `#FAFAFA` background
- Show app logo/wordmark above the form card
- If user is already authenticated, redirect to `/files`

---

### Login page (`app/(auth)/login/page.tsx`)

**Form fields:** email, password
**Validation (Zod):**
- email: valid email format
- password: min 1 char (validation is on the server)

**Behaviour:**
- On success: `setSession(user, token)` then `router.push('/files')`
- On error: show field-level errors from API response
- "Don't have an account?" link to `/register`
- Show loading spinner inside the submit button while pending

**Design:**
- White card with `border border-border rounded-lg p-8`
- Inputs are full width, stacked vertically with `gap-4`
- Submit button is full width, `bg-accent text-white`
- No extra decorative elements — the form IS the page

---

### Register page (`app/(auth)/register/page.tsx`)

Same pattern as login. Fields: displayName (optional), email, password,
confirmPassword. Zod: password min 8 chars, confirmPassword must match.

---

### Dashboard layout (`app/(dashboard)/layout.tsx`)

Renders `<AppShell>` which contains:
- `<Sidebar>` on the left (fixed, `w-60`)
- Main content area on the right with `<Header>` + `<main>`
- `<UploadZone>` as a transparent overlay on the window (activated by
  `isDragging` from `use-drag-drop`)
- `<UploadStagingBar>` anchored to the bottom of the screen when
  `uploadStore.isOpen === true`
- Guard: if no auth token, redirect to `/login`

---

### Sidebar (`components/layout/sidebar.tsx`)

**Structure:**
```
App logo / wordmark        ← top of sidebar, 16px semibold
─────────────────────
Navigation items:
  Files           (Lucide: Files)
  Storage         (Lucide: PieChart)
  Accounts        (Lucide: Users)
─────────────────────
[bottom section]
  User avatar + email
  Settings (icon button)
  Sign out (icon button)
```

**Active state:** `bg-accent-subtle text-accent font-medium` on the active
nav item. Inactive: `text-text-secondary hover:bg-surface hover:text-text-primary`.

**Account colour dots:** Below each nav item, show small coloured dots for
each connected account (max 3, then "+N more"). This is a subtle reminder of
how many accounts are connected.

---

### Files page (`app/(dashboard)/files/page.tsx`)

This is the most complex page. It composes:

```
<PageHeader title="Files" subtitle="All files across your accounts">
  <Button onClick={openUpload}>Upload</Button>
</PageHeader>

<FileBrowser />
```

**`FileBrowser` component** orchestrates:
1. `<FileToolbar>` — search input, account filter pills, type filter pills,
   sort selector, view toggle (list/grid)
2. `<FileList>` or `<FileGrid>` depending on view mode
3. `<Pagination>` at the bottom

**`FileToolbar` design:**
- Search input on the left (Lucide `Search` icon inside, `w-64`)
- Account filter pills next to search — one pill per connected account,
  coloured dot + truncated email. Toggleable. Multiple can be active.
- Type filter pills: All, Docs, PDFs, Images, Video, Other
- Sort select on the right: Recent, Name, Size
- View toggle: list/grid icon buttons, far right
- All filters are controlled state in the `FileBrowser` component and
  passed down as query params to `useFiles()`

**`FileRow` component** (list view):

```
[file type icon]  [filename + account badge]  [account]  [size]  [modified]  [actions]

Columns (CSS grid):
  1fr (name)  120px (account)  80px (size)  100px (modified)  48px (actions)

Hover state: bg-surface, show actions dropdown
```

- File type icon: 20px, coloured to match the account's colour
- Account badge: `<AccountBadge>` pill with account colour scheme
- If two files in the current view share the same name: show
  `<DuplicateBadge>` — a small grey "duplicate" pill inline with the filename
- Actions dropdown (`<FileActionsMenu>`): Download, Open in Drive (external
  link), Delete. Delete shows `<ConfirmDialog>` before proceeding.
- Delete is optimistic: remove from UI immediately, show undo toast for 4s,
  revert if undo is clicked before the API call completes.

**`FileCard` component** (grid view):

```
┌─────────────────────────┐
│  [thumbnail or type icon]│   160px × 120px
│                         │
├─────────────────────────┤
│  filename (truncated)   │
│  [account badge]  size  │
└─────────────────────────┘
```

- If `thumbnailLink` exists: use `next/image` with `fill` and blur placeholder
- Otherwise: large centred file type icon on a `bg-surface` background,
  icon coloured to match the account

**`FileEmptyState`:** centred, Lucide `FolderOpen` icon at 48px,
"No files yet" heading, "Upload your first file or connect an account"
subtext, two CTA buttons: "Upload file" and "Connect account".

**`FileSkeleton`:** for loading state, render 8 skeleton rows using
`<Skeleton>` from shadcn. Match the exact column layout of `FileRow`
so the layout does not shift when data loads.

---

### Storage page (`app/(dashboard)/storage/page.tsx`)

```
<PageHeader title="Storage" subtitle="Quota breakdown across all accounts" />

<StorageOverviewCard />       ← big summary card at top
<AccountQuotaList />          ← one row per account below
```

**`StorageOverviewCard`:**
- Shows `totalUsed` / `totalLimit` in large type
- e.g.: `18.4 GB used of 45 GB`
- Below that: `<SegmentedQuotaBar>` — a single horizontal bar split into
  coloured segments, one per account, proportional to usage
- Below the bar: a legend row with coloured dots + email + usage per account

**`SegmentedQuotaBar`:**
- Height: `h-3` (12px), `rounded-full`
- Each segment is a coloured `div` with `flex-shrink-0`
- Width of each segment: `(accountUsed / totalLimit) * 100` as a percentage
- Free space segment: `bg-border` at the end
- Smooth width transitions with `transition-all duration-500`
- Do not animate on first render (use `useEffect` to set `mounted: true`
  before applying widths, to avoid SSR mismatch)

**`AccountQuotaRow`:**
```
[account avatar/initials]  [email + displayName]  [quota bar]  [X.X GB free]  [↻ refresh]
```
- Avatar: initials circle, background from account colour scheme
- Quota bar: thin `h-1.5` bar in the account's colour
- Refresh button: icon only, calls `useRefreshQuota(accountId)` mutation
- Shows `quotaUpdatedAt` as relative time: "Updated 3 min ago"

**Stats strip (top of page, before the card):**
Four metric boxes in a grid:

```
[ Total accounts ] [ Total storage ] [ Used ] [ Free ]
     3 accounts       45.0 GB        18.4 GB   26.6 GB
```

Each box: `bg-surface border border-border rounded-lg p-4`

---

### Accounts page (`app/(dashboard)/accounts/page.tsx`)

```
<PageHeader title="Accounts" subtitle="Manage your connected Google accounts">
  <ConnectAccountButton />
</PageHeader>

<AccountsList />
```

**`ConnectAccountButton`:** calls `GET /google-accounts/connect` which
redirects to Google's OAuth consent page. After the OAuth flow, Google
redirects back to the callback endpoint which redirects to
`/accounts?connected=true`. On mount, detect this query param and show
a success toast: "Account connected successfully".

**`AccountCard`:**
```
┌──────────────────────────────────────────────────────┐
│ [avatar]  victor@gmail.com          [⋮ actions menu] │
│           Victor Onyemaechi                          │
│                                                      │
│  [████████░░░░░░░░░░░░░] 9.4 GB of 15 GB used       │
│                                                      │
│  Connected Jan 12, 2026            [Refresh quota]   │
└──────────────────────────────────────────────────────┘
```

- Avatar: coloured initials circle using account colour
- Quota bar: account colour, shows percentage used
- Actions menu (⋮): "Refresh quota", "Open Google Drive" (external), 
  "Disconnect" (triggers `<DisconnectDialog>`)
- If quota > 90%: show `<Badge variant="warning">Almost full</Badge>`

**`DisconnectDialog`:**
- Confirm dialog with `<AlertDialog>` from shadcn
- Warning: "Disconnecting this account will remove all cached files from this
  account. Your Google Drive files are not deleted."
- Destructive confirm button: "Disconnect account"

**Empty state** (no accounts connected):
- Centred illustration area (use a simple SVG of interlocking circles or
  just a large Lucide `Cloud` icon)
- "Connect your first Google account" heading
- "Each account adds 15 GB of free storage" subtext
- `<ConnectAccountButton>` CTA

---

### Upload flow (bottom staging bar)

This is a key UX decision: do not interrupt the user with a modal the moment
they drop a file. Let the file land, then ask where it goes.

**`UploadZone`:** a transparent `fixed inset-0` overlay that only becomes
visible (`opacity-100`) when `isDragging === true`. Shows a dashed border
overlay with "Drop files anywhere" text. Does not block clicks when inactive
(`pointer-events-none` when not dragging).

**`UploadStagingBar`:** slides up from the bottom (`translate-y-0` when open,
`translate-y-full` when closed, `transition-transform duration-300`).
Height: `auto`, min-height `200px`. Background: `bg-white border-t border-border`.

Layout of the staging bar:
```
┌────────────────────────────────────────────────────────────┐
│  2 files ready to upload                           [✕ close]│
│                                                            │
│  report.pdf   4.2 MB                                       │
│  photo.jpg    1.1 MB                                       │
│                                                            │
│  Upload to:                                                │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│  │ ● victor@…     │ │ ● v.work@…     │ │ ● backup.vic@… │ │
│  │ 5.6 GB free    │ │ 9.4 GB free    │ │ 11.6 GB free   │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ │
│             ← account with most free space pre-selected    │
│                                          [Upload ↑]        │
└────────────────────────────────────────────────────────────┘
```

**`AccountPicker`:** three (or more) selectable cards, one per connected
account. Each shows: coloured dot, truncated email, free space remaining.
Pre-select the account with the most free space. Selected state:
`border-accent bg-accent-subtle`. One can be selected at a time.

**On "Upload" click:**
1. For each staged file, call `upload.api.createSession(file, accountId)`
2. Add each to `uploadStore.queue` with status `uploading`
3. Dismiss the staging bar
4. Show `<UploadQueue>` — a small floating panel bottom-right showing
   per-file progress bars
5. XHR uploads run concurrently (max 3 at a time to avoid saturating the
   connection)

**`UploadProgressItem`:**
```
[file icon]  report.pdf          72%
             victor@gmail.com  [████████░░]
```

**On completion:** progress bar fills, status changes to a green check,
item fades out after 2 seconds. Invalidate the files query:
`queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files() })`

---

## Utility implementations

### `lib/utils/bytes.ts`

```typescript
export function formatBytes(bytes: bigint | number, decimals = 1): string {
  const n = typeof bytes === 'bigint' ? Number(bytes) : bytes
  if (n === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(n) / Math.log(k))
  return `${parseFloat((n / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}
```

### `lib/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `lib/utils/file-type.ts`

Map Google MIME types to icons (Lucide) and human-readable labels:

```typescript
const FILE_TYPE_MAP: Record<string, { icon: LucideIcon, label: string, colour: string }> = {
  'application/vnd.google-apps.document':     { icon: FileText,         label: 'Document',     colour: '#4285F4' },
  'application/vnd.google-apps.spreadsheet':  { icon: Sheet,            label: 'Spreadsheet',  colour: '#34A853' },
  'application/vnd.google-apps.presentation': { icon: Presentation,     label: 'Presentation', colour: '#FBBC04' },
  'application/pdf':                          { icon: FileType2,         label: 'PDF',          colour: '#EA4335' },
  'application/vnd.google-apps.folder':       { icon: Folder,           label: 'Folder',       colour: '#F6C026' },
}
// image/* → Image (ImageIcon, '#0EA5E9')
// video/* → Video (Video, '#8B5CF6')
// audio/* → Audio (Music, '#EC4899')
// default  → File  (File,  '#6B7280')

export function getFileTypeInfo(mimeType: string) { ... }
```

---

## API layer

All API functions return typed responses. Never call `axios` directly in
components or hooks — always go through these functions.

```typescript
// lib/api/files.api.ts
export const filesApi = {
  list:            (params: ListFilesParams)  => api.get<PaginatedFiles>('/files', { params }),
  createSession:   (dto: CreateSessionDto)    => api.post<UploadSession>('/files/upload-session', dto),
  completeUpload:  (id: string, dto: object)  => api.patch(`/files/upload-session/${id}`, dto),
  delete:          (accountId: string, fileId: string) => api.delete(`/files/${accountId}/${fileId}`),
}

// lib/api/accounts.api.ts
export const accountsApi = {
  list:           ()           => api.get<ConnectedAccount[]>('/google-accounts'),
  getConnectUrl:  ()           => api.get<{ url: string }>('/google-accounts/connect'),
  disconnect:     (id: string) => api.delete(`/google-accounts/${id}`),
  refreshQuota:   (id: string) => api.get(`/google-accounts/${id}/quota`),
}

// lib/api/storage.api.ts
export const storageApi = {
  summary: () => api.get<StorageSummary>('/storage/summary'),
}
```

---

## TypeScript types

```typescript
// types/account.types.ts
export interface ConnectedAccount {
  id:             string
  googleEmail:    string
  displayName:    string | null
  avatarUrl:      string | null
  storageLimit:   string    // BigInt serialised as string from API
  storageUsed:    string
  quotaUpdatedAt: string
  createdAt:      string
  colorIndex:     number    // injected client-side, not from API
}

// types/file.types.ts
export type FileType =
  | 'DOCUMENT' | 'SPREADSHEET' | 'PRESENTATION'
  | 'PDF' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FOLDER' | 'OTHER'

export interface FileRecord {
  id:              string
  driveFileId:     string
  name:            string
  fileType:        FileType
  mimeType:        string
  sizeBytes:       string   // BigInt as string
  webViewLink:     string | null
  thumbnailLink:   string | null
  isFolder:        boolean
  driveModifiedAt: string
  account: {
    id:          string
    googleEmail: string
    displayName: string | null
    avatarUrl:   string | null
  }
}

export interface PaginatedFiles {
  data: FileRecord[]
  meta: { total: number; page: number; limit: number; lastPage: number }
}

// types/upload.types.ts
export interface UploadSession {
  id:          string
  sessionUri:  string
  fileName:    string
  mimeType:    string
  fileSize:    string
  status:      'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
  expiresAt:   string
}
```

---

## Environment variables

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=DriveStack
```

---

## Component patterns to follow everywhere

### Loading states

Never show a spinner for data that has a skeleton equivalent.
Use `<FileSkeleton>` for file lists, `<Skeleton>` from shadcn for cards.
Reserve spinners (`<Loader2 className="animate-spin">`) only for
mutation buttons (submit, delete, disconnect).

### Error states

TanStack Query `isError` should render `<ErrorState>` with the error message
and a "Try again" button that calls `refetch()`. Never show a blank screen.

### Optimistic updates

Delete operations must be optimistic:
```typescript
onMutate: async (variables) => {
  await queryClient.cancelQueries({ queryKey: QUERY_KEYS.files() })
  const previous = queryClient.getQueryData(QUERY_KEYS.files())
  queryClient.setQueryData(QUERY_KEYS.files(), (old) => ({
    ...old,
    data: old.data.filter(f => f.driveFileId !== variables.fileId)
  }))
  return { previous }
},
onError: (err, variables, context) => {
  queryClient.setQueryData(QUERY_KEYS.files(), context.previous)
  toast.error('Failed to delete file')
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files() })
}
```

### Toast notifications

Use Sonner. Standard patterns:
- Success: `toast.success('File deleted')`
- Error: `toast.error('Failed to delete file')`
- Loading + result: `toast.promise(mutation, { loading: '...', success: '...', error: '...' })`
- Undo: `toast.success('File deleted', { action: { label: 'Undo', onClick: handleUndo } })`

### Responsive behaviour

- Sidebar collapses to bottom nav on mobile (`lg:hidden` for bottom nav,
  `hidden lg:flex` for sidebar)
- File browser: list view only on mobile (hide grid toggle on `< lg`)
- Staging bar: full width on mobile, `max-w-2xl mx-auto` on desktop
- Account picker in staging bar: single column on mobile, three columns on desktop

---

## Accessibility requirements

- All interactive elements must be keyboard accessible
- Icon-only buttons must have `aria-label`
- File rows in list view: add `role="row"` and `role="cell"` appropriately
- Account filter pills: use `aria-pressed` for toggle state
- Upload progress: use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`,
  `aria-valuemax` on progress bars
- Dialogs use shadcn `<AlertDialog>` or `<Dialog>` which handle focus trapping
- Loading skeletons: add `aria-busy="true"` to the container while loading

---

## What to generate

1. All files in the folder structure above, fully implemented
2. `tailwind.config.ts` with the custom colour tokens
3. `components.json` for shadcn (New York style, neutral base colour)
4. `.env.local.example`
5. All shadcn components listed in the `ui/` directory
   (run: `npx shadcn@latest add button input badge dialog dropdown-menu
   progress skeleton tooltip separator avatar scroll-area select
   popover command alert alert-dialog`)
6. A `README.md` with setup instructions and a route map

---

## Key UX decisions baked in — do not change these

1. **No dark mode.** The app is light-only. Do not add a theme toggle.

2. **Drop anywhere.** The drag-and-drop target is the entire window, not a
   specific zone. The upload zone overlay only appears visually when dragging.

3. **Stage then route.** Files are staged in a bottom bar after dropping.
   The account picker appears in that bar — not as a modal that interrupts
   before the drop.

4. **Account colours are consistent.** Every place an account appears —
   quota bars, file badges, account cards, upload picker — uses the same
   colour from `ACCOUNT_COLORS`. Never use different colours for the same
   account in different parts of the UI.

5. **BigInt as strings.** All storage values from the API are strings
   (`"16106127360"`). Convert to `Number` only for display calculations.
   Use `formatBytes()` for all human-readable display.

6. **Optimistic deletes with undo.** Never ask "are you sure?" for deletes
   in the file list (it breaks flow). Delete immediately, show a 4-second
   undo toast instead. Reserve the `<ConfirmDialog>` only for the account
   disconnect action which is higher stakes.

7. **Pre-select the account with most free space.** In the upload account
   picker, automatically select the account with the highest `storageLimit -
   storageUsed`. The user can override. This removes a decision for the
   common case.

8. **XHR for uploads, not fetch.** `fetch` does not expose upload progress
   events. Use `XMLHttpRequest` with `xhr.upload.onprogress` for real progress
   tracking. This is a deliberate technical choice for the target market
   (mobile users on slower connections need visible progress).
