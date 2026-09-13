import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { EditableField } from '@/components/EditableField';
import { LocationFields } from '../LocationFields';
import { useContactDetails } from './hooks/useContactDetails';
import { LinkRow } from './components/LinkRow';
import { AddLinkDialog } from './components/AddLinkDialog';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const ContactDetails = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const {
    isAddOpen,
    openAdd,
    closeAdd,
    addLink,
    removeLink,
    handleEmailSubmit,
    handlePhoneSubmit,
    handleCitySubmit,
    handleRegionSubmit,
    handleCountryCodeSubmit,
    handleLinkTypeSubmit,
    handleLinkUrlSubmit,
    handleLinkLabelSubmit,
  } = useContactDetails(profile, onProfileChange);

  const links = profile.personalInfo.links;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Contact
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <EditableField
            value={profile.personalInfo.email}
            label="Email"
            purpose="body"
            editor="input"
            inputType="email"
            pending={pending}
            disabled={readOnly}
            onSubmit={handleEmailSubmit}
          />
          <EditableField
            value={profile.personalInfo.phone ?? ''}
            label="Phone"
            purpose="body"
            editor="input"
            inputType="tel"
            pending={pending}
            disabled={readOnly}
            onSubmit={handlePhoneSubmit}
          />
        </div>

        <LocationFields
          location={profile.personalInfo.location}
          pending={pending}
          readOnly={readOnly}
          onCitySubmit={handleCitySubmit}
          onRegionSubmit={handleRegionSubmit}
          onCountryCodeSubmit={handleCountryCodeSubmit}
        />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Links</h3>
            {!readOnly && (
              <Button
                type="button"
                variant="lime"
                size="sm"
                onClick={openAdd}
                disabled={pending}
                aria-label="Add link"
              >
                <Icons type="add" aria-hidden="true" />
                Add link
              </Button>
            )}
          </div>
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet</p>
          ) : (
            links.map((link, idx) => (
              <LinkRow
                key={`${link.type}-${link.url}-${idx}`}
                link={link}
                index={idx}
                pending={pending}
                readOnly={readOnly}
                onTypeSubmit={handleLinkTypeSubmit}
                onUrlSubmit={handleLinkUrlSubmit}
                onLabelSubmit={handleLinkLabelSubmit}
                onRemove={removeLink}
              />
            ))
          )}
        </div>

        <AddLinkDialog
          open={isAddOpen}
          onCancel={closeAdd}
          onSubmit={addLink}
          pending={pending}
        />
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
export { ContactDetails };
