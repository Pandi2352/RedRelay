import { useMemo, useState } from 'react';
import { cn } from '@/shared/lib';
import { calculateElapsedMinutes, formatBloodType } from '../requests.helpers';
import type { BloodRequest } from '../types';

interface RequestStatusStripProps {
  request: BloodRequest;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RequestStatusStrip({
  request,
  size = 'md',
  className,
}: RequestStatusStripProps) {
  const { bloodType, unitsNeeded, unitsConfirmed, createdAt } = request;
  const [mountedAt] = useState(() => Date.now());

  const minutesAgo = useMemo(() => {
    return calculateElapsedMinutes(createdAt, mountedAt);
  }, [createdAt, mountedAt]);

  const segments = useMemo(() => {
    const list: Array<'confirmed' | 'open'> = [];
    for (let i = 0; i < unitsNeeded; i++) {
      if (i < unitsConfirmed) {
        list.push('confirmed');
      } else {
        list.push('open');
      }
    }
    return list;
  }, [unitsNeeded, unitsConfirmed]);

  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';
  const segmentHeight = size === 'lg' ? 'h-3.5' : size === 'sm' ? 'h-2' : 'h-2.5';

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'font-display font-bold tracking-tight text-primary',
            textSize,
          )}
        >
          {formatBloodType(bloodType)}
        </span>
        <span className="text-xs text-fg-muted font-medium">
          {unitsConfirmed} / {unitsNeeded} units
        </span>
      </div>

      <div className="flex items-center gap-1 flex-1 max-w-[140px] px-2">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-sm transition-colors',
              segmentHeight,
              seg === 'confirmed'
                ? 'bg-primary'
                : 'border border-border-strong bg-transparent',
            )}
          />
        ))}
      </div>

      <span className="text-xs font-mono tabular-nums text-fg-subtle shrink-0">
        {minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`}
      </span>
    </div>
  );
}
