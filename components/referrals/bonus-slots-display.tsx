'use client';

const SLOT_COLORS = ['#6366F1', '#10B981', '#F59E0B'];
const MAX_SLOTS = 3;

interface BonusSlotsDisplayProps {
  bonusSlots: number;
}

export function BonusSlotsDisplay({ bonusSlots }: BonusSlotsDisplayProps) {
  const earned = Math.min(bonusSlots, MAX_SLOTS);

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h3 className="text-[15px] font-semibold text-text-primary mb-4">Bonus slots earned</h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: MAX_SLOTS }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i < earned ? SLOT_COLORS[i] : 'transparent',
                border: i < earned ? 'none' : '2px solid #D1D5DB',
              }}
            />
          ))}
        </div>
        <span className="text-[14px] font-medium text-text-primary">
          {earned} of {MAX_SLOTS} earned
        </span>
      </div>

      <p className="text-[13px] text-text-secondary">
        Each referral that upgrades adds +1 account slot to your free account. Maximum {MAX_SLOTS} bonus slots.
      </p>
    </div>
  );
}
