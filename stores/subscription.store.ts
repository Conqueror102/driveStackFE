import { create } from 'zustand'

export type SubscriptionPlan   = 'FREE' | 'PRO'
export type SubscriptionStatus = 'ACTIVE' | 'ON_HOLD' | 'CANCELLED' | 'EXPIRED'

export type ProFeature =
  | 'move_files'
  | 'duplicate_detector'
  | 'bulk_operations'
  | 'storage_alerts'
  | 'storage_history'
  | 'upload_from_url'
  | 'file_preview'
  | 'connect_account_above_limit'

export interface SubscriptionData {
  plan:              SubscriptionPlan
  status:            SubscriptionStatus
  currentPeriodEnd:  string | null
  gracePeriodEndsAt: string | null
}

interface SubscriptionStore {
  plan:              SubscriptionPlan
  status:            SubscriptionStatus
  currentPeriodEnd:  string | null
  gracePeriodEndsAt: string | null

  setSubscription: (data: SubscriptionData) => void
  reset:           () => void
  isPro:           () => boolean
  isOnHold:        () => boolean
  isInGracePeriod: () => boolean
  canAccess:       (feature: ProFeature) => boolean
}

const DEFAULT_STATE: SubscriptionData = {
  plan:              'FREE',
  status:            'ACTIVE',
  currentPeriodEnd:  null,
  gracePeriodEndsAt: null,
}

export const useSubscriptionStore = create<SubscriptionStore>(
  (set, get) => ({
    ...DEFAULT_STATE,

    setSubscription: (data) => set({ ...data }),

    reset: () => set(DEFAULT_STATE),

    isPro: () => get().plan === 'PRO',

    isOnHold: () => get().status === 'ON_HOLD',

    isInGracePeriod: () => {
      const { status, gracePeriodEndsAt } = get()
      if (status !== 'ON_HOLD') return false
      if (!gracePeriodEndsAt) return false
      return new Date(gracePeriodEndsAt) > new Date()
    },

    canAccess: (feature: ProFeature) => {
      const { plan, status, currentPeriodEnd } = get()

      // Free users — no Pro features
      if (plan !== 'PRO') return false

      // Active Pro — full access
      if (status === 'ACTIVE') return true

      // ON_HOLD — keep access during grace period
      if (status === 'ON_HOLD') return true

      // CANCELLED — keep access until period ends
      if (status === 'CANCELLED' && currentPeriodEnd) {
        return new Date(currentPeriodEnd) > new Date()
      }

      // EXPIRED — no access
      return false
    },
  })
)
