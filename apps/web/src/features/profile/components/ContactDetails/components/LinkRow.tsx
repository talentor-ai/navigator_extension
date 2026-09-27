import type { components } from '@talentor/contracts';
import { EditableField } from '@/components/EditableField';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { LINK_TYPE_OPTIONS } from '../../../profile.constants';
import { validateHttpUrl } from '../../../validation';

type Link = components['schemas']['Link'];

type Props = {
  link: Link;
  index: number;
  pending?: boolean;
  readOnly?: boolean;
  onTypeSubmit: (index: number, value: string) => void | Promise<void>;
  onUrlSubmit: (index: number, value: string) => void | Promise<void>;
  onLabelSubmit: (index: number, value: string) => void | Promise<void>;
  onRemove: (index: number) => void | Promise<void>;
};

export function LinkRow({
  link,
  index,
  pending,
  readOnly,
  onTypeSubmit,
  onUrlSubmit,
  onLabelSubmit,
  onRemove,
}: Props) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <EditableField
            value={link.type}
            label="Link type"
            purpose="label"
            weight="medium"
            tone="muted"
            editor="select"
            options={LINK_TYPE_OPTIONS}
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => onTypeSubmit(index, value)}
          />
          <EditableField
            value={link.url}
            label="URL"
            purpose="body"
            editor="input"
            inputType="url"
            pending={pending}
            disabled={readOnly}
            validate={validateHttpUrl}
            onSubmit={(value) => onUrlSubmit(index, value)}
          />
          <EditableField
            value={link.label ?? ''}
            label="Label"
            purpose="meta"
            tone="muted"
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => onLabelSubmit(index, value)}
          />
        </div>
        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            disabled={pending}
            aria-label={`Remove ${link.type} link ${link.url}`}
          >
            <Icons type="delete" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default LinkRow;
