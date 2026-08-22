import type { components } from '@talentor/contracts';

type ProfileSnapshot = components['schemas']['ProfileSnapshot'];

export const MOCK_PROFILE = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Sofía — Senior Frontend',
  currentVersion: 1,
  createdAt: '2024-01-15T09:00:00.000Z',
  updatedAt: '2025-03-10T14:30:00.000Z',
  profile: {
    schemaVersion: 1,
    locale: 'en-US',
    defaultRole: 'Senior Frontend Engineer',
    baseSummary:
      'Senior Frontend Engineer with 8+ years building accessible, high-performance web apps. Specialized in React, TypeScript and design systems, with a track record of leading cross-functional teams and shipping user-centric products at scale.',
    personalInfo: {
      fullName: 'Sofía Reyes',
      email: 'sofia.reyes@example.com',
      phone: '+34 612 345 678',
      location: {
        city: 'Madrid',
        region: 'Madrid',
        countryCode: 'ES',
        timezone: 'Europe/Madrid',
      },
      links: [
        {
          type: 'portfolio',
          url: 'https://sofia.reyes.dev',
          label: 'Portfolio',
        },
        {
          type: 'linkedin',
          url: 'https://linkedin.com/in/sofiareyes',
          label: 'LinkedIn',
        },
        {
          type: 'github',
          url: 'https://github.com/sofiareyes',
          label: 'GitHub',
        },
      ],
    },
    experience: [
      {
        id: '10000000-0000-4000-a000-000000000001',
        company: 'Cabify',
        companyLocation: {
          city: 'Madrid',
          region: 'Madrid',
          countryCode: 'ES',
          timezone: 'Europe/Madrid',
        },
        position: 'Senior Frontend Engineer',
        employmentType: 'full-time',
        locationType: 'hybrid',
        startDate: '2021-03',
        endDate: null,
        summary:
          'Lead frontend for rider and driver web platforms serving millions of monthly users across Spain and LATAM.',
        responsibilities: [
          'Own architecture of React/Next.js micro-frontends and shared design system',
          'Mentor 5 frontend engineers and drive RFC process',
          'Collaborate with product and UX to define accessible, performant user journeys',
        ],
        achievements: [
          'Reduced LCP by 42% via SSR streaming and image optimization',
          'Shipped unified design system adopted by 12 teams',
          'Led migration from CRA to Next.js with zero-downtime rollout',
        ],
        skillRefs: [
          'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
          'b2c3d4e5-f6a7-4b8c-9d0e-222222222222',
          'c3d4e5f6-a7b8-4c9d-8e0f-333333333333',
        ],
      },
      {
        id: '20000000-0000-4000-a000-000000000002',
        company: 'Idealista',
        companyLocation: {
          city: 'Madrid',
          region: 'Madrid',
          countryCode: 'ES',
          timezone: 'Europe/Madrid',
        },
        position: 'Frontend Engineer',
        employmentType: 'full-time',
        locationType: 'onsite',
        startDate: '2018-06',
        endDate: '2021-02',
        summary:
          "Built search and listing experiences for Spain's leading real-estate marketplace.",
        responsibilities: [
          'Developed React/TypeScript SPA with SSR for SEO-critical pages',
          'Integrated GraphQL BFF and optimized caching strategies',
          'Implemented comprehensive testing with Jest and Playwright',
        ],
        achievements: [
          'Improved search conversion by 18% through UX and performance work',
          'Cut bundle size by 35% via code-splitting and tree-shaking',
          'Introduced visual regression testing to CI pipeline',
        ],
        skillRefs: [
          'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
          'e5f6a7b8-c9d0-4e1f-8a2b-555555555555',
          'f6a7b8c9-d0e1-4f2a-8b3c-666666666666',
        ],
      },
    ],
    skills: [
      {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
        name: 'React',
        category: 'Frontend',
        yearsOfExperience: 8,
        lastUsed: '2025-03',
        aliases: ['React.js', 'ReactJS'],
      },
      {
        id: 'b2c3d4e5-f6a7-4b8c-9d0e-222222222222',
        name: 'TypeScript',
        category: 'Language',
        yearsOfExperience: 7,
        lastUsed: '2025-03',
        aliases: ['TS'],
      },
      {
        id: 'c3d4e5f6-a7b8-4c9d-8e0f-333333333333',
        name: 'Next.js',
        category: 'Frontend',
        yearsOfExperience: 5,
        lastUsed: '2025-02',
        aliases: ['NextJS'],
      },
      {
        id: 'd4e5f6a7-b8c9-4d0e-8f1a-444444444444',
        name: 'Node.js',
        category: 'Backend',
        yearsOfExperience: 4,
        lastUsed: '2024-12',
        aliases: ['Node'],
      },
      {
        id: 'e5f6a7b8-c9d0-4e1f-8a2b-555555555555',
        name: 'GraphQL',
        category: 'API',
        yearsOfExperience: 4,
        lastUsed: '2024-11',
        aliases: ['GQL'],
      },
      {
        id: 'f6a7b8c9-d0e1-4f2a-8b3c-666666666666',
        name: 'Testing Library',
        category: 'Testing',
        yearsOfExperience: 6,
        lastUsed: '2025-01',
        aliases: ['React Testing Library', 'RTL'],
      },
    ],
    languages: [
      {
        id: '30000000-0000-4000-a000-000000000003',
        language: 'Spanish',
        proficiency: 'native',
      },
      {
        id: '40000000-0000-4000-a000-000000000004',
        language: 'English',
        proficiency: 'C1',
      },
    ],
    education: [
      {
        id: '50000000-0000-4000-a000-000000000005',
        institution: 'Universidad Politécnica de Madrid',
        degree: 'MSc',
        fieldOfStudy: 'Computer Science',
        location: {
          city: 'Madrid',
          region: 'Madrid',
          countryCode: 'ES',
          timezone: 'Europe/Madrid',
        },
        startDate: '2014-09',
        endDate: '2016-06',
      },
    ],
    projects: [
      {
        id: '60000000-0000-4000-a000-000000000006',
        name: 'A11y Design System',
        role: 'Lead Frontend',
        description:
          'Open-source accessible component library powering 12 product teams with WCAG 2.2 AA compliance and dark-mode theming.',
        startDate: '2022-01',
        endDate: '2024-12',
        url: 'https://a11y-system.sofia.reyes.dev',
        repository: 'https://github.com/sofiareyes/a11y-system',
        achievements: [
          'Adopted by 12 teams, 200+ component imports weekly',
          '100% coverage with a11y automated checks in CI',
        ],
        skillRefs: [
          'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
          'b2c3d4e5-f6a7-4b8c-9d0e-222222222222',
          'f6a7b8c9-d0e1-4f2a-8b3c-666666666666',
        ],
      },
      {
        id: '70000000-0000-4000-a000-000000000007',
        name: 'Realtime Maps SDK',
        role: 'Frontend Engineer',
        description:
          'SDK for realtime vehicle tracking with WebSockets and canvas rendering, used in rider ETA and fleet dashboards.',
        startDate: '2019-03',
        endDate: '2020-11',
        url: 'https://maps-sdk.sofia.reyes.dev',
        repository: 'https://github.com/sofiareyes/maps-sdk',
        achievements: [
          'Cut render latency by 60% via canvas batching',
          'Supported 50k concurrent connections in load tests',
        ],
        skillRefs: [
          'b2c3d4e5-f6a7-4b8c-9d0e-222222222222',
          'd4e5f6a7-b8c9-4d0e-8f1a-444444444444',
          'e5f6a7b8-c9d0-4e1f-8a2b-555555555555',
        ],
      },
    ],
    certifications: [
      {
        id: '80000000-0000-4000-a000-000000000008',
        name: 'AWS Certified Developer – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-06',
        expirationDate: '2026-06',
        credentialId: 'AWS-123456',
        credentialUrl: 'https://aws.amazon.com/verification/AWS-123456',
      },
      {
        id: '90000000-0000-4000-a000-000000000009',
        name: 'Professional Scrum Developer I',
        issuer: 'Scrum.org',
        issueDate: '2022-04',
        expirationDate: null,
        credentialId: 'PSD-987654',
        credentialUrl: 'https://scrum.org/certificates/PSD-987654',
      },
    ],
  },
} satisfies ProfileSnapshot;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
] as const;

export const LOCATION_TYPE_OPTIONS = [
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
] as const;

export const LANGUAGE_PROFICIENCY_OPTIONS = [
  { value: 'native', label: 'Native' },
  { value: 'C2', label: 'C2' },
  { value: 'C1', label: 'C1' },
  { value: 'B2', label: 'B2' },
  { value: 'B1', label: 'B1' },
  { value: 'A2', label: 'A2' },
  { value: 'A1', label: 'A1' },
] as const;

export const LINK_TYPE_OPTIONS = [
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'other', label: 'Other' },
] as const;
