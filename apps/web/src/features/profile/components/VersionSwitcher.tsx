import { useState } from 'react';
import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    // Deterministic UTC date for tests / SSR stability; shows date + time short
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  } catch {
    return iso;
  }
};

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

  return (
    <Card className="rounded-2xl bg-card border-border">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-section font-semibold uppercase tracking-widest text-muted-foreground">
            Versions
          </h2>
          {previewVersion !== null ? (
            <Badge variant="secondary" className="text-xs">
              Previewing
            </Badge>
          ) : null}
        </div>

        {previewVersion !== null ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 md:flex-row md:items-center md:justify-between"
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
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2"
          >
            <p className="text-xs font-medium text-destructive">{error}</p>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-3">
        {versions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No versions yet
          </p>
        ) : (
          <ul className="space-y-3" aria-label="Profile versions">
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
        <Separator className="bg-border/50 hidden" />
      </CardContent>
    </Card>
  );
};

export default VersionSwitcher;
export { VersionSwitcher };
