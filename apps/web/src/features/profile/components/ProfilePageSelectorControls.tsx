import type { components } from '@talentor/contracts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type ProfileMetadata = components['schemas']['ProfileMetadata'];

type Props = {
  profiles: ProfileMetadata[];
  profileId: string | undefined;
  onSelect: (id: string) => void;
  onCreate: () => void;
};

const ProfilePageSelectorControls = ({
  profiles,
  profileId,
  onSelect,
  onCreate,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Select value={profileId} onValueChange={onSelect}>
        <SelectTrigger
          aria-label="Select profile"
          className="w-[220px] bg-card border-border"
        >
          <SelectValue placeholder="Select profile" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" onClick={onCreate}>
        New profile
      </Button>
    </div>
  );
};

export default ProfilePageSelectorControls;
