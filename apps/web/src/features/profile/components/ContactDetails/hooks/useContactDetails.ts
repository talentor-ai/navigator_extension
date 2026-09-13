import { useState } from 'react';
import type { components } from '@talentor/contracts';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type LinkType = components['schemas']['LinkType'];
type Link = components['schemas']['Link'];

export function useContactDetails(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const handleEmailSubmit = (value: string) => {
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, email: value },
    };
    return onProfileChange(next);
  };

  const handlePhoneSubmit = (value: string) => {
    const trimmed = value.trim();
    const nextPhone = trimmed === '' ? null : trimmed;
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, phone: nextPhone },
    };
    return onProfileChange(next);
  };

  const handleCitySubmit = (value: string) => {
    const trimmed = value.trim();
    const nextCity = trimmed === '' ? null : trimmed;
    const baseLoc = profile.personalInfo.location ?? {};
    const nextLoc = {
      ...baseLoc,
      city: nextCity,
    } as components['schemas']['Location'];
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, location: nextLoc },
    };
    return onProfileChange(next);
  };

  const handleRegionSubmit = (value: string) => {
    const trimmed = value.trim();
    const nextRegion = trimmed === '' ? null : trimmed;
    const baseLoc = profile.personalInfo.location ?? {};
    const nextLoc = {
      ...baseLoc,
      region: nextRegion,
    } as components['schemas']['Location'];
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, location: nextLoc },
    };
    return onProfileChange(next);
  };

  const handleCountryCodeSubmit = (value: string) => {
    const trimmed = value.trim();
    const nextCountry = trimmed === '' ? null : trimmed;
    const baseLoc = profile.personalInfo.location ?? {};
    const nextLoc = {
      ...baseLoc,
      countryCode: nextCountry,
    } as components['schemas']['Location'];
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, location: nextLoc },
    };
    return onProfileChange(next);
  };

  const handleLinkTypeSubmit = (index: number, value: string) => {
    const nextLinks = profile.personalInfo.links.map((l, i) =>
      i === index ? { ...l, type: value as LinkType } : l,
    );
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, links: nextLinks },
    };
    return onProfileChange(next);
  };

  const handleLinkUrlSubmit = (index: number, value: string) => {
    const trimmed = value.trim();
    const nextLinks = profile.personalInfo.links.map((l, i) =>
      i === index ? { ...l, url: trimmed } : l,
    );
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, links: nextLinks },
    };
    return onProfileChange(next);
  };

  const handleLinkLabelSubmit = (index: number, value: string) => {
    const trimmed = value.trim();
    const nextLabel = trimmed === '' ? null : trimmed;
    const nextLinks = profile.personalInfo.links.map((l, i) =>
      i === index ? { ...l, label: nextLabel } : l,
    );
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, links: nextLinks },
    };
    return onProfileChange(next);
  };

  const addLink = (payload: {
    type: string;
    url: string;
    label: string | null;
  }) => {
    const trimmedType = payload.type.trim();
    const trimmedUrl = payload.url.trim();
    const rawLabel = payload.label ?? '';
    const trimmedLabel = rawLabel.trim();
    const nextLabel = trimmedLabel === '' ? null : trimmedLabel;
    const newLink: Link = {
      type: trimmedType as LinkType,
      url: trimmedUrl,
      label: nextLabel,
    };
    const nextLinks = [...profile.personalInfo.links, newLink];
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, links: nextLinks },
    };
    const result = onProfileChange(next);
    if (result && typeof (result as Promise<void>).then === 'function') {
      return (result as Promise<void>).then(() => setIsAddOpen(false));
    }
    setIsAddOpen(false);
    return result;
  };

  const removeLink = (index: number) => {
    if (index < 0 || index >= profile.personalInfo.links.length) return;
    const nextLinks = profile.personalInfo.links.filter((_, i) => i !== index);
    const next: CandidateProfileV1 = {
      ...profile,
      personalInfo: { ...profile.personalInfo, links: nextLinks },
    };
    return onProfileChange(next);
  };

  return {
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
  };
}
