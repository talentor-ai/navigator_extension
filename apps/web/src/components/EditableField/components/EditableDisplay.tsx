import type { ElementType, KeyboardEvent, RefObject } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  displayAs?: ElementType;
  displayRef: RefObject<HTMLElement | null>;
  label: string;
  styles: string;
  className?: string;
  isBlocked: boolean;
  pending?: boolean;
  displayContent: React.ReactNode;
  onDoubleClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

export function EditableDisplay({
  displayAs: Display = 'span',
  displayRef,
  label,
  styles,
  className,
  isBlocked,
  pending,
  displayContent,
  onDoubleClick,
  onKeyDown,
}: Props) {
  return (
    <Display
      ref={displayRef as never}
      role="button"
      tabIndex={isBlocked ? -1 : 0}
      aria-label={`Edit ${label}`}
      aria-disabled={isBlocked}
      aria-busy={pending ? true : undefined}
      className={cn(
        styles,
        !isBlocked && 'cursor-text hover:bg-secondary',
        isBlocked && 'cursor-default opacity-70',
        className,
      )}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    >
      {displayContent}
    </Display>
  );
}
