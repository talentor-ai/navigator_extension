import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const ProjectsSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const projects = profile.projects;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Projects
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 pt-4 first:pt-0"
            >
              <EditableField
                value={project.name}
                label="Project name"
                displayAs="p"
                purpose="title"
                weight="semibold"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextProjects = profile.projects.map((p) =>
                    p.id === project.id ? { ...p, name: value } : p,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    projects: nextProjects,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={project.role ?? ''}
                label="Project role"
                displayAs="p"
                purpose="subtitle"
                weight="medium"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextRole = value.trim() === '' ? null : value;
                  const nextProjects = profile.projects.map((p) =>
                    p.id === project.id ? { ...p, role: nextRole } : p,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    projects: nextProjects,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={project.description}
                label="Project description"
                displayAs="p"
                purpose="body"
                editor="textarea"
                rows={3}
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextProjects = profile.projects.map((p) =>
                    p.id === project.id ? { ...p, description: value } : p,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    projects: nextProjects,
                  };
                  return onProfileChange(next);
                }}
              />
              <div className="flex flex-wrap gap-2">
                <EditableField
                  value={project.startDate ?? ''}
                  label="Start date"
                  purpose="meta"
                  tone="muted"
                  editor="input"
                  inputType="month"
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextStart = value.trim() === '' ? null : value;
                    const nextProjects = profile.projects.map((p) =>
                      p.id === project.id ? { ...p, startDate: nextStart } : p,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      projects: nextProjects,
                    };
                    return onProfileChange(next);
                  }}
                />
                <EditableField
                  value={project.endDate ?? ''}
                  label="End date"
                  purpose="meta"
                  tone="muted"
                  editor="input"
                  inputType="month"
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextEnd = value.trim() === '' ? null : value;
                    const nextProjects = profile.projects.map((p) =>
                      p.id === project.id ? { ...p, endDate: nextEnd } : p,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      projects: nextProjects,
                    };
                    return onProfileChange(next);
                  }}
                />
              </div>
              <EditableField
                value={project.url ?? ''}
                label="Project URL"
                purpose="body"
                tone="muted"
                editor="input"
                inputType="url"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextUrl = value.trim() === '' ? null : value;
                  const nextProjects = profile.projects.map((p) =>
                    p.id === project.id ? { ...p, url: nextUrl } : p,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    projects: nextProjects,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={project.repository ?? ''}
                label="Repository URL"
                purpose="body"
                tone="muted"
                editor="input"
                inputType="url"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextRepo = value.trim() === '' ? null : value;
                  const nextProjects = profile.projects.map((p) =>
                    p.id === project.id ? { ...p, repository: nextRepo } : p,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    projects: nextProjects,
                  };
                  return onProfileChange(next);
                }}
              />
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
                      pending={pending}
                      disabled={readOnly}
                      onSubmit={(value) => {
                        const nextProjects = profile.projects.map((p) => {
                          if (p.id !== project.id) return p;
                          const prev = p.achievements ?? [];
                          const nextAch = prev.map((a, i) =>
                            i === idx ? value : a,
                          );
                          return { ...p, achievements: nextAch };
                        });
                        const next: CandidateProfileV1 = {
                          ...profile,
                          projects: nextProjects,
                        };
                        return onProfileChange(next);
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
export { ProjectsSection };
