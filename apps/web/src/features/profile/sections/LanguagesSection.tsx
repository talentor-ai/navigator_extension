import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { LANGUAGE_PROFICIENCY_OPTIONS } from '../profile.constants';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const LanguagesSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const languages = profile.languages;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Languages
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {languages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No languages yet</p>
        ) : (
          languages.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 pt-4 first:pt-0">
              <EditableField
                value={item.language}
                label="Language"
                displayAs="p"
                purpose="title"
                weight="semibold"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextLanguages = profile.languages.map((l) =>
                    l.id === item.id ? { ...l, language: value } : l,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    languages: nextLanguages,
                  };
                  return onProfileChange(next);
                }}
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
                onSubmit={(value) => {
                  const nextLanguages = profile.languages.map((l) =>
                    l.id === item.id
                      ? {
                          ...l,
                          proficiency:
                            value as components['schemas']['LanguageProficiency'],
                        }
                      : l,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    languages: nextLanguages,
                  };
                  return onProfileChange(next);
                }}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;
export { LanguagesSection };
