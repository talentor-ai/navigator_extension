import { Button } from '@/components/ui/button';
import { Icons, type IconType } from '@/components/Icons';

export type CollectionSectionHeaderProps = {
  title: string;
  icon?: IconType;
  onAdd: () => void;
  readOnly?: boolean;
  pending?: boolean;
  addLabel?: string;
  addAriaLabel?: string;
  headingLevel?: 'h2' | 'h3';
};

export function CollectionSectionHeader({
  title,
  icon,
  onAdd,
  readOnly = false,
  pending = false,
  addLabel = 'Add',
  addAriaLabel,
  headingLevel = 'h2',
}: CollectionSectionHeaderProps) {
  const HeadingTag = headingLevel;
  const showAdd = !readOnly;
  const ariaLabel = addAriaLabel ?? `Add ${title}`;

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2.5">
        {icon ? (
          <Icons
            type={icon}
            aria-hidden="true"
            strokeWidth={2.5}
            className="h-5 w-5 shrink-0 text-lime"
          />
        ) : null}
        <HeadingTag className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </HeadingTag>
      </span>
      {showAdd ? (
        <Button
          type="button"
          variant="lime"
          size="sm"
          onClick={onAdd}
          disabled={pending}
          aria-label={ariaLabel}
          aria-busy={pending ? 'true' : undefined}
        >
          <Icons type="add" aria-hidden="true" />
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default CollectionSectionHeader;
