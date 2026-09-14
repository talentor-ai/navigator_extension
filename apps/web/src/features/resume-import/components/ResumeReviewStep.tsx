import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfilePageEditorLayout from '@/features/profile/components/ProfilePageEditorLayout';
import type { CandidateProfileV1 } from '../types';
import ResumeImportErrorState from './ResumeImportErrorState';

type Props = {
  profile: CandidateProfileV1;
  warnings: string[];
  profileName: string;
  nameError: string | null;
  confirmError: string | null;
  isConfirming: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  errorRef: React.RefObject<HTMLDivElement | null>;
  onNameChange: (value: string) => void;
  onProfileChange: (next: CandidateProfileV1) => Promise<void>;
  onConfirm: () => void;
};

const ResumeReviewStep = ({
  profile,
  warnings,
  profileName,
  nameError,
  confirmError,
  isConfirming,
  headingRef,
  errorRef,
  onNameChange,
  onProfileChange,
  onConfirm,
}: Props) => {
  return (
    <div className="space-y-6" aria-busy={isConfirming}>
      <Card>
        <CardHeader>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold leading-none tracking-tight"
          >
            Review profile
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            role="note"
            className="rounded-md border bg-muted px-3 py-2 text-sm"
          >
            AI-generated content may be inaccurate. Please review carefully.
          </div>

          {warnings.length > 0 ? (
            <ul className="space-y-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="profile-name-input">Profile name</Label>
            <Input
              id="profile-name-input"
              value={profileName}
              onChange={(e) => onNameChange(e.target.value)}
              disabled={isConfirming}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'profile-name-error' : undefined}
              placeholder="e.g. Backend Engineer"
            />
            {nameError ? (
              <div ref={errorRef} tabIndex={-1}>
                <ResumeImportErrorState message={nameError} />
                <span id="profile-name-error" className="sr-only">
                  {nameError}
                </span>
              </div>
            ) : null}
          </div>

          {confirmError ? (
            <div ref={!nameError ? errorRef : undefined} tabIndex={-1}>
              <ResumeImportErrorState message={confirmError} />
            </div>
          ) : null}

          {isConfirming ? (
            <div
              role="status"
              aria-live="polite"
              className="text-sm text-muted-foreground"
            >
              Creating profile...
            </div>
          ) : null}

          <Button type="button" onClick={onConfirm} disabled={isConfirming}>
            Confirm and create profile
          </Button>
        </CardContent>
      </Card>

      <ProfilePageEditorLayout
        profile={profile}
        pending={isConfirming}
        readOnly={isConfirming}
        onProfileChange={onProfileChange}
      />
    </div>
  );
};

export default ResumeReviewStep;
