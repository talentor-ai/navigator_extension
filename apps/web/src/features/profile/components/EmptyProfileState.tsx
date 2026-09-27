import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type EmptyProfileStateProps = {
  onCreate: () => void;
  creating?: boolean;
};

const EmptyProfileState = ({
  onCreate,
  creating = false,
}: EmptyProfileStateProps) => {
  return (
    <Card className="rounded-2xl bg-card border-border">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center md:px-8 md:py-14">
        <div className="space-y-2">
          <h2 className="text-title font-semibold text-foreground">
            No profile yet
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
            Create your first profile to get started. You can import your resume
            later and keep versions as you iterate.
          </p>
        </div>
        <Button
          type="button"
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

export default EmptyProfileState;
export { EmptyProfileState };
