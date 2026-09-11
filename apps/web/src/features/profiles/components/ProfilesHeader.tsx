import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';

type Props = {
  count: number;
  onCreate: () => void;
};

const ProfilesHeader = ({ count, onCreate }: Props) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-display font-bold tracking-tight text-foreground md:text-4xl">
          Profiles
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {count === 0
            ? 'Create and manage your candidate profiles'
            : `${count} ${count === 1 ? 'profile' : 'profiles'} total`}
        </p>
      </div>
      <Button
        type="button"
        variant="lime"
        onClick={onCreate}
        className="shrink-0 gap-2"
      >
        <Icons type="add" className="h-4 w-4" aria-hidden="true" />
        New profile
      </Button>
    </div>
  );
};

export default ProfilesHeader;
