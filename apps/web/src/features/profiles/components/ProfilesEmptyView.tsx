import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  onCreate: () => void;
  creating?: boolean;
};

const ProfilesEmptyView = ({ onCreate, creating = false }: Props) => {
  return (
    <Card className="rounded-2xl bg-card border-border">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center md:px-8 md:py-14">
        <div className="space-y-2">
          <h2 className="text-title font-semibold text-foreground">
            No profiles yet
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
            Create your first profile to get started. You can import your resume
            later and keep versions as you iterate.
          </p>
        </div>
        <Button
          type="button"
          variant="lime"
          onClick={onCreate}
          disabled={creating}
          aria-busy={creating}
          className="min-w-36"
        >
          {creating ? 'Creating...' : 'Create profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfilesEmptyView;
