import { Card, CardContent } from '@/components/ui/card';

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`bg-muted animate-pulse rounded-md ${className ?? ''}`} />
);

const ProfilesLoadingView = () => {
  return (
    <div
      role="status"
      aria-label="Loading profiles"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading profiles...</span>
      <ul
        aria-hidden="true"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="list-none">
            <Card className="rounded-2xl bg-card border-border">
              <CardContent className="p-5 md:p-6 space-y-3">
                <SkeletonBlock className="h-6 w-2/3" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-5 w-12 rounded-full" />
                  <SkeletonBlock className="h-4 w-28" />
                </div>
                <SkeletonBlock className="h-3 w-1/2" />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilesLoadingView;
