import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { MOCK_PROFILE } from '../profile.constants';

type Project = components['schemas']['Project'];

type ProjectsSectionProps = {
  projects?: Project[];
  profile?: components['schemas']['CandidateProfileV1'];
};

const ProjectsSection = ({
  projects: projectsProp,
  profile,
}: ProjectsSectionProps) => {
  const projects =
    projectsProp ?? profile?.projects ?? MOCK_PROFILE.profile.projects;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Projects"
          label="Projects section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-col gap-3 pt-4 first:pt-0">
            <EditableField
              value={project.name}
              label="Project name"
              displayAs="p"
              purpose="title"
              weight="semibold"
            />
            {project.role ? (
              <EditableField
                value={project.role}
                label="Project role"
                displayAs="p"
                purpose="subtitle"
                weight="medium"
                tone="muted"
              />
            ) : null}
            <EditableField
              value={project.description}
              label="Project description"
              displayAs="p"
              purpose="body"
              editor="textarea"
              rows={3}
            />
            <div className="flex flex-wrap gap-2">
              <EditableField
                value={project.startDate ?? ''}
                label="Start date"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="month"
              />
              <EditableField
                value={project.endDate ?? ''}
                label="End date"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="month"
              />
            </div>
            {project.url ? (
              <EditableField
                value={project.url}
                label="Project URL"
                purpose="body"
                tone="muted"
                editor="input"
                inputType="url"
              />
            ) : null}
            {project.repository ? (
              <EditableField
                value={project.repository}
                label="Repository URL"
                purpose="body"
                tone="muted"
                editor="input"
                inputType="url"
              />
            ) : null}
            {project.achievements && project.achievements.length > 0 ? (
              <div className="flex flex-col gap-2">
                {project.achievements.map((ach, idx) => (
                  <EditableField
                    key={`${project.id}-ach-${idx}`}
                    value={ach}
                    label="Achievement"
                    displayAs="p"
                    purpose="body"
                    editor="textarea"
                    rows={2}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
export { ProjectsSection };
