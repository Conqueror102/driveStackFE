import type { ConnectedAccount as ApiConnectedAccount } from '@/lib/contracts/accounts';

export interface AccountColorInfo {
  bg: string;
  text: string;
  dot: string;
}

export type ConnectedAccount = ApiConnectedAccount & {
  colorIndex?: number;
  colorInfo?: AccountColorInfo;
};
