import { useState } from 'react';
import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/Icons';
import { formatDate } from '@/lib/date';

type ProfileVersionMetadata = components['schemas']['ProfileVersionMetadata'];

export type VersionSwitcherProps = {
  versions: ProfileVersionMetadata[];
  currentVersion: number;
  previewVersion: number | null;
  pendingVersion: number | null;
  error: string | null;
  onPreview: (version: number) => void;
  onActivate: (version: number) => void;
  onExitPreview: () => void;
};

const HISTORY_PANEL_ID = 'profile-history-panel';

const VersionSwitcher = ({
  versions,
  currentVersion,
  previewVersion,
  pendingVersion,
  error,
  onPreview,
  onActivate,
  onExitPreview,
}: VersionSwitcherProps) => {
  const [confirmVersion, setConfirmVersion] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isPreviewing = previewVersion !== null;

  return (
    <Card className="rounded-2xl bg-card border-border mt-20">
      <CardHeader className="p-0">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={HISTORY_PANEL_ID}
          aria-label={isOpen ? 'Collapse history' : 'Expand history'}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-6 py-4 text-left transition-colors hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex flex-wrap items-center gap-2">
            <h2 className="text-section font-semibold uppercase tracking-widest text-muted-foreground">
              History
            </h2>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {versions.length}
            </Badge>
            {isPreviewing ? (
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                Previewing
              </Badge>
            ) : null}
          </span>
          <Icons
            type={isOpen ? 'chevronUp' : 'chevronDown'}
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-muted-foreground"
          />
        </button>

        {isPreviewing ? (
          <div
            role="status"
            aria-live="polite"
            className="mx-6 mb-4 flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 md:flex-row md:items-center md:justify-between"
          >
            <p className="text-xs font-medium text-foreground">
              Previewing version {previewVersion} — read-only
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onExitPreview}
              className="self-start md:self-auto"
            >
              Exit preview
            </Button>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mx-6 mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2"
          >
            <p className="text-xs font-medium text-destructive">{error}</p>
          </div>
        ) : null}
      </CardHeader>

      {isOpen ? (
        <CardContent id={HISTORY_PANEL_ID} className="space-y-3 pt-6">
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No history yet
            </p>
          ) : (
            <ul className="space-y-3" aria-label="Profile history">
              {versions.map((v) => {
                const isCurrent =
                  v.isCurrent || v.versionNumber === currentVersion;
                const isPreview = previewVersion === v.versionNumber;
                const isPending = pendingVersion === v.versionNumber;
                const needsConfirm = confirmVersion === v.versionNumber;

                return (
                  <li
                    key={v.id}
                    className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
                      isPreview
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            Version {v.versionNumber}
                          </span>
                          {isCurrent ? (
                            <Badge
                              variant="default"
                              className="text-[10px] px-2 py-0.5"
                            >
                              Current
                            </Badge>
                          ) : null}
                          {isPreview ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-2 py-0.5"
                            >
                              Preview
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(v.createdAt)} · {v.sourceType}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {needsConfirm ? (
                          <>
                            <span className="text-xs font-medium text-foreground hidden sm:inline">
                              Confirm activation?
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                onActivate(v.versionNumber);
                                setConfirmVersion(null);
                              }}
                              disabled={isPending}
                              aria-busy={isPending}
                            >
                              {isPending ? 'Activating...' : 'Confirm'}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmVersion(null)}
                              disabled={isPending}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onPreview(v.versionNumber)}
                              disabled={isPreview || pendingVersion !== null}
                              aria-pressed={isPreview}
                            >
                              Preview
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setConfirmVersion(v.versionNumber)}
                              disabled={isCurrent || pendingVersion !== null}
                              aria-label={
                                isPending
                                  ? `Activating version ${v.versionNumber}`
                                  : `Activate version ${v.versionNumber}`
                              }
                            >
                              {isPending ? 'Activating...' : 'Activate'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {needsConfirm ? (
                      <p className="text-xs text-muted-foreground">
                        This will make version {v.versionNumber} the current
                        version.
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      ) : null}
    </Card>
  );
};

export default VersionSwitcher;
export { VersionSwitcher };
