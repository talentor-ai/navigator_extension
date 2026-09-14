import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@talentor/api-client';
import { confirmResume, uploadResume } from '../resume.api';
import type {
  CandidateProfileV1,
  ProfileSnapshot,
  ResumeDraft,
} from '../types';
import {
  validateDraftProfile,
  validateProfileName,
  validateResumeFile,
} from '../validation';

export type UseResumeImportPageOptions = {
  onCreated?: (snapshot: ProfileSnapshot) => void;
  onError?: (message: string) => void;
};

function getUploadErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 413:
        return 'File too large. Maximum size is 5 MiB';
      case 415:
        return 'Unsupported file type. Only PDF, DOC, DOCX are allowed';
      case 422:
        return 'Resume could not be read or contained no extractable facts';
      case 429:
        return 'Service busy. Please try again';
      case 502:
      case 503:
      case 504:
        return 'Failed to generate profile. Please try again';
      default:
        return error.message || 'Failed to parse resume';
    }
  }
  return (error as Error)?.message ?? 'Failed to parse resume';
}

function getConfirmErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 409:
        return 'Profile name already exists';
      case 422:
        return error.message || 'Invalid profile data';
      default:
        return error.message || 'Failed to create profile';
    }
  }
  return (error as Error)?.message ?? 'Failed to create profile';
}

export function useResumeImportPage(options: UseResumeImportPageOptions = {}) {
  const { onCreated, onError } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ResumeDraft | null>(null);
  const [editedProfile, setEditedProfile] = useState<CandidateProfileV1 | null>(
    null,
  );

  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const uploadMutation = useMutation({
    mutationFn: ({ file, locale }: { file: File; locale?: string }) =>
      uploadResume(file, locale),
    onSuccess: (data) => {
      setDraft(data);
      setEditedProfile(data.profile);
      setUploadError(null);
      setConfirmError(null);
    },
    onError: (error) => {
      const msg = getUploadErrorMessage(error);
      setUploadError(msg);
      onError?.(msg);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: ({
      name,
      profile,
    }: {
      name: string;
      profile: CandidateProfileV1;
    }) => confirmResume(name, profile),
    onSuccess: (snapshot) => {
      setConfirmError(null);
      onCreated?.(snapshot);
    },
    onError: (error) => {
      const msg = getConfirmErrorMessage(error);
      setConfirmError(msg);
      onError?.(msg);
    },
  });

  const isUploading = uploadMutation.isPending;
  const isConfirming = confirmMutation.isPending;
  const isReview = !!draft && !!editedProfile;

  useEffect(() => {
    if (isReview) {
      headingRef.current?.focus();
    }
  }, [isReview]);

  useEffect(() => {
    if (uploadError || confirmError || fileError || nameError) {
      if (errorRef.current) {
        errorRef.current.focus();
      } else {
        headingRef.current?.focus();
      }
    }
  }, [uploadError, confirmError, fileError, nameError]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setUploadError(null);

    if (!files || files.length === 0) {
      setFileError('Please select a file');
      setSelectedFile(null);
      return;
    }
    if (files.length !== 1) {
      setFileError('Please select exactly one file');
      setSelectedFile(null);
      return;
    }
    const file = files[0];
    const err = validateResumeFile(file);
    setSelectedFile(file);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      const msg = 'Please select a file';
      setFileError(msg);
      onError?.(msg);
      return;
    }
    const err = validateResumeFile(selectedFile);
    if (err) {
      setFileError(err);
      onError?.(err);
      return;
    }
    setFileError(null);
    setUploadError(null);
    try {
      await uploadMutation.mutateAsync({ file: selectedFile, locale: 'en-US' });
    } catch {
      // handled via onError
    }
  };

  const handleNameChange = (value: string) => {
    setProfileName(value);
    if (nameError) setNameError(null);
    if (confirmError) setConfirmError(null);
  };

  const handleProfileChange = async (next: CandidateProfileV1) => {
    setEditedProfile(next);
  };

  const handleConfirm = async () => {
    const nameErr = validateProfileName(profileName);
    if (nameErr) {
      setNameError(nameErr);
      onError?.(nameErr);
      return;
    }
    if (!editedProfile) {
      const msg = 'No profile draft available';
      setConfirmError(msg);
      onError?.(msg);
      return;
    }
    const { fullName, email } = validateDraftProfile(editedProfile);
    const draftErr = fullName ?? email;
    if (draftErr) {
      setConfirmError(draftErr);
      onError?.(draftErr);
      return;
    }
    setNameError(null);
    setConfirmError(null);
    try {
      await confirmMutation.mutateAsync({
        name: profileName.trim(),
        profile: editedProfile,
      });
    } catch {
      // handled
    }
  };

  const fileLabel = selectedFile
    ? `${selectedFile.name} (${formatFileSize(selectedFile.size)})`
    : null;
  const warnings = draft?.warnings ?? [];

  return {
    selectedFile,
    fileLabel,
    fileError,
    uploadError,
    confirmError,
    profileName,
    nameError,
    draft,
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
    uploadMutation,
    confirmMutation,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
