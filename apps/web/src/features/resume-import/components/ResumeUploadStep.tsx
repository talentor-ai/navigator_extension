import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RESUME_ACCEPT } from '../constants';
import ResumeImportErrorState from './ResumeImportErrorState';

type Props = {
  selectedFile: File | null;
  fileLabel: string | null;
  fileError: string | null;
  uploadError: string | null;
  isUploading: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  errorRef: React.RefObject<HTMLDivElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
};

const ResumeUploadStep = ({
  selectedFile,
  fileLabel,
  fileError,
  uploadError,
  isUploading,
  headingRef,
  errorRef,
  onFileChange,
  onUpload,
}: Props) => {
  const hasError = !!fileError || !!uploadError;
  return (
    <Card aria-busy={isUploading}>
      <CardHeader>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold leading-none tracking-tight"
        >
          Import resume
        </h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume-file-input">Resume file</Label>
          <Input
            id="resume-file-input"
            type="file"
            accept={RESUME_ACCEPT}
            onChange={onFileChange}
            disabled={isUploading}
            aria-invalid={!!fileError}
            aria-describedby={fileError ? 'resume-file-error' : undefined}
          />
          {selectedFile && fileLabel ? (
            <p className="text-sm text-muted-foreground">{fileLabel}</p>
          ) : null}
          {fileError ? (
            <div ref={errorRef} tabIndex={-1}>
              <ResumeImportErrorState message={fileError} />
              <span id="resume-file-error" className="sr-only">
                {fileError}
              </span>
            </div>
          ) : null}
          {uploadError ? (
            <div ref={!fileError ? errorRef : undefined} tabIndex={-1}>
              <ResumeImportErrorState message={uploadError} />
            </div>
          ) : null}
        </div>

        {isUploading ? (
          <div
            role="status"
            aria-live="polite"
            className="text-sm text-muted-foreground"
          >
            Uploading and parsing resume...
          </div>
        ) : null}

        <Button type="button" onClick={onUpload} disabled={isUploading}>
          Upload and parse
        </Button>

        {hasError ? (
          <div id="resume-file-error" className="sr-only">
            {fileError ?? uploadError}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ResumeUploadStep;
