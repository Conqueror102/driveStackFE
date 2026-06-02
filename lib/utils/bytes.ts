export function formatBytes(bytes: bigint | number | string, decimals = 1): string {
  const n = typeof bytes === 'bigint' ? Number(bytes) : Number(bytes);
  if (isNaN(n) || n === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
