import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExperienceItem } from './components/ExperienceItem';
import { useExperienceEditor } from './hooks/useExperienceEditor';
import type { ExperienceSectionProps } from './types';

const ExperienceSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: ExperienceSectionProps) => {
  const experiences = profile.experience;
  const {
    updateCompany,
    updatePosition,
    updateEmploymentType,
    updateLocationType,
    updateStartDate,
    updateEndDate,
    updateSummary,
    updateResponsibility,
    updateAchievement,
  } = useExperienceEditor(profile, onProfileChange);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Experience
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experience yet</p>
        ) : (
          experiences.map((item) => (
            <ExperienceItem
              key={item.id}
              item={item}
              pending={pending}
              readOnly={readOnly}
              onCompanySubmit={(value) => updateCompany(item.id, value)}
              onPositionSubmit={(value) => updatePosition(item.id, value)}
              onEmploymentTypeSubmit={(value) =>
                updateEmploymentType(item.id, value)
              }
              onLocationTypeSubmit={(value) =>
                updateLocationType(item.id, value)
              }
              onStartDateSubmit={(value) => updateStartDate(item.id, value)}
              onEndDateSubmit={(value) => updateEndDate(item.id, value)}
              onSummarySubmit={(value) => updateSummary(item.id, value)}
              onResponsibilitySubmit={(index, value) =>
                updateResponsibility(item.id, index, value)
              }
              onAchievementSubmit={(index, value) =>
                updateAchievement(item.id, index, value)
              }
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
export { ExperienceSection };
