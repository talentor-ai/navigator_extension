import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';

export type CollectionSectionHeaderProps = {
  title: string;
  onAdd: () => void;
  readOnly?: boolean;
  pending?: boolean;
  addLabel?: string;
  addAriaLabel?: string;
  headingLevel?: 'h2' | 'h3';
};

export function CollectionSectionHeader({
  title,
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
      <HeadingTag className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </HeadingTag>
      {showAdd ? (
        <Button
          type="button"
          variant="outline"
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
