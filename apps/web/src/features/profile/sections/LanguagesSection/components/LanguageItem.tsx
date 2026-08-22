import { EditableField } from '@/components/EditableField';
import { LANGUAGE_PROFICIENCY_OPTIONS } from '../../../profile.constants';
import type { Language } from '../types';

type Props = {
  item: Language;
  pending?: boolean;
  readOnly?: boolean;
  onLanguageSubmit: (value: string) => void | Promise<void>;
  onProficiencySubmit: (value: string) => void | Promise<void>;
};

export const LanguageItem = ({
  item,
  pending,
  readOnly,
  onLanguageSubmit,
  onProficiencySubmit,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <EditableField
        value={item.language}
        label="Language"
        displayAs="p"
        purpose="title"
        weight="semibold"
        pending={pending}
        disabled={readOnly}
        onSubmit={onLanguageSubmit}
      />
      <EditableField
        value={item.proficiency}
        label="Proficiency"
        purpose="meta"
        tone="muted"
        editor="select"
        options={LANGUAGE_PROFICIENCY_OPTIONS}
        pending={pending}
        disabled={readOnly}
        onSubmit={onProficiencySubmit}
      />
    </div>
  );
};
