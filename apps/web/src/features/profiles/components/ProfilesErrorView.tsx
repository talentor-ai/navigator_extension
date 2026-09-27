import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  message: string;
  onRetry: () => void;
  retrying?: boolean;
};

const ProfilesErrorView = ({ message, onRetry, retrying = false }: Props) => {
  return (
    <Card className="rounded-2xl bg-card border-border">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center md:px-8 md:py-12">
        <div role="alert" aria-live="assertive" className="space-y-2 max-w-md">
          <h2 className="text-title font-semibold text-foreground">
            Couldn&apos;t load profiles
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground break-words">
            {message}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          disabled={retrying}
          aria-busy={retrying}
          className="min-w-28"
        >
          {retrying ? 'Retrying...' : 'Retry'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfilesErrorView;
