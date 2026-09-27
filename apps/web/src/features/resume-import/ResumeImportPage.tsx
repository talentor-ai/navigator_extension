import type { ProfileSnapshot } from './types';
import { useResumeImportPage } from './hooks/useResumeImportPage';
import ResumeReviewStep from './components/ResumeReviewStep';
import ResumeUploadStep from './components/ResumeUploadStep';

type Props = {
  onCreated?: (snapshot: ProfileSnapshot) => void;
  onError?: (message: string) => void;
};

const ResumeImportPage = ({ onCreated, onError }: Props) => {
  const {
    selectedFile,
    fileLabel,
    fileError,
    uploadError,
    confirmError,
    profileName,
    nameError,
    editedProfile,
    warnings,
    isUploading,
    isConfirming,
    isReview,
    headingRef,
    errorRef,
    handleFileChange,
    handleUpload,
    handleNameChange,
    handleProfileChange,
    handleConfirm,
  } = useResumeImportPage({ onCreated, onError });

  if (isReview && editedProfile) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
        <ResumeReviewStep
          profile={editedProfile}
          warnings={warnings}
          profileName={profileName}
          nameError={nameError}
          confirmError={confirmError}
          isConfirming={isConfirming}
          headingRef={headingRef}
          errorRef={errorRef}
          onNameChange={handleNameChange}
          onProfileChange={handleProfileChange}
          onConfirm={handleConfirm}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
      <ResumeUploadStep
        selectedFile={selectedFile}
        fileLabel={fileLabel}
        fileError={fileError}
        uploadError={uploadError}
        isUploading={isUploading}
        headingRef={headingRef}
        errorRef={errorRef}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default ResumeImportPage;
