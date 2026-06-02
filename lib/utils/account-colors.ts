import { ACCOUNT_COLORS } from '../constants/account-colors';

export function getAccountColor(index: number) {
  return ACCOUNT_COLORS[index % ACCOUNT_COLORS.length];
}
