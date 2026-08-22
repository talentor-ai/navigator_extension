import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import {
  LANGUAGE_PROFICIENCY_OPTIONS,
  MOCK_PROFILE,
} from '../profile.constants';

type Language = components['schemas']['Language'];

type LanguagesSectionProps = {
  languages?: Language[];
  profile?: components['schemas']['CandidateProfileV1'];
};

const LanguagesSection = ({
  languages: languagesProp,
  profile,
}: LanguagesSectionProps) => {
  const languages =
    languagesProp ?? profile?.languages ?? MOCK_PROFILE.profile.languages;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Languages"
          label="Languages section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {languages.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 pt-4 first:pt-0">
            <EditableField
              value={item.language}
              label="Language"
              displayAs="p"
              purpose="title"
              weight="semibold"
            />
            <EditableField
              value={item.proficiency}
              label="Proficiency"
              purpose="meta"
              tone="muted"
              editor="select"
              options={LANGUAGE_PROFICIENCY_OPTIONS}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;
export { LanguagesSection };
