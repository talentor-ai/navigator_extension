export const BUTTON_CONTAINER_PATH =
  '.job-details-jobs-unified-top-card__container--two-pane .jobs-save-button.artdeco-button';

export const JOB_POST_FIELDS = [
  {
    field: 'title',
    cssKey: '.job-details-jobs-unified-top-card__job-title a.ember-view',
  },
  {
    field: 'position',
    cssKey: '.job-details-jobs-unified-top-card__job-title a.ember-view',
  },
  //   {
  //     field: 'jobType',
  //     cssKey: '',
  //   },
  {
    field: 'description',
    cssKey: '.jobs-description__container',
  },
  {
    field: 'location',
    cssKey:
      '.job-details-jobs-unified-top-card__primary-description-container > div > span',
  },
  {
    field: 'companyName',
    cssKey: '.job-details-jobs-unified-top-card__company-name a',
  },
  {
    field: 'companyBriefDescription',
    cssKey: '.jobs-company__inline-information', // Parent element
    accessTo: 'parentNode',
  },
  {
    field: 'companyDescription',
    cssKey: '.jobs-company__company-description',
  },
  {
    field: 'companyLogoUrl',
    cssKey: '.ivm-image-view-model img.ivm-view-attr__img--centered',
    getUrl: true,
  },
  // {
  //   field: 'companyWorkers',
  //   cssKey: '.jobs-company__inline-information', // First child element
  //   accessTo: 'firstChild',
  // },
  //   {
  //     field: 'datePosted',
  //     cssKey: '',
  //   },
  //   {
  //     field: 'applicants',
  //     cssKey: '',
  //   },
  //   {
  //     field: 'skills',
  //     cssKey: '',
  //   },
];
