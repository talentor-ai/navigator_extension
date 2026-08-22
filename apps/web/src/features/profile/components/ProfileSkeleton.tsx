import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`bg-muted animate-pulse rounded-md ${className ?? ''}`} />
);

const ProfileSkeleton = () => {
  return (
    <div
      role="status"
      aria-label="Loading profile"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-[1200px] px-4 md:px-6 py-6 pt-20"
    >
      <span className="sr-only">Loading profile...</span>
      <div className="grid grid-cols-12 gap-6">
        {/* Main column */}
        <main className="col-span-12 space-y-6 lg:col-span-8">
          {/* Header */}
          <Card className="rounded-2xl bg-card border-border">
            <CardHeader className="space-y-3">
              <SkeletonBlock className="h-8 w-2/3 md:h-9" />
              <SkeletonBlock className="h-4 w-1/2" />
              <div className="flex flex-wrap gap-2 pt-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-3 w-16" />
                <SkeletonBlock className="h-3 w-32" />
              </div>
            </CardHeader>
          </Card>

          {/* Summary */}
          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-5/6" />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-24" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  {i > 1 && <Separator className="bg-border/50" />}
                  <div className="space-y-2 pt-2">
                    <SkeletonBlock className="h-4 w-1/2" />
                    <SkeletonBlock className="h-3 w-1/3" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-20" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  {i > 1 && <Separator className="bg-border/50" />}
                  <div className="space-y-2 pt-2">
                    <SkeletonBlock className="h-4 w-1/2" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>

        {/* Sidebar */}
        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-20" />
            </CardHeader>
            <CardContent className="space-y-3">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-3/4" />
              <SkeletonBlock className="h-3 w-1/2" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-16" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-6 w-16 rounded-full" />
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-14 rounded-full" />
              <SkeletonBlock className="h-6 w-24 rounded-full" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-20" />
            </CardHeader>
            <CardContent className="space-y-2">
              <SkeletonBlock className="h-3 w-1/2" />
              <SkeletonBlock className="h-3 w-1/3" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card border-border">
            <CardHeader>
              <SkeletonBlock className="h-3 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              <SkeletonBlock className="h-4 w-3/5" />
              <SkeletonBlock className="h-3 w-1/2" />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
export { ProfileSkeleton };
