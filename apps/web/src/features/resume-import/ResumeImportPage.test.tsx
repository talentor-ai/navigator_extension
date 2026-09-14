import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { components } from '@talentor/contracts';
import { ApiError } from '@talentor/api-client';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type ProfileSnapshot = components['schemas']['ProfileSnapshot'];

const mockUploadResume = vi.fn();
const mockConfirmResume = vi.fn();

vi.mock('./resume.api', () => ({
  uploadResume: (...args: unknown[]) => mockUploadResume(...args),
  confirmResume: (...args: unknown[]) => mockConfirmResume(...args),
}));

vi.mock('@/features/profile/components/ProfilePageEditorLayout', () => ({
  default: (props: {
    profile: CandidateProfileV1;
    pending: boolean;
    readOnly: boolean;
    onProfileChange: (next: CandidateProfileV1) => Promise<void>;
  }) => (
    <div
      data-testid="mock-editor"
      data-pending={String(props.pending)}
      data-readonly={String(props.readOnly)}
    >
      <div data-testid="mock-fullname">
        {props.profile.personalInfo.fullName}
      </div>
      <div data-testid="mock-email">{props.profile.personalInfo.email}</div>
      <div data-testid="mock-summary">
        {props.profile.baseSummary ?? 'empty'}
      </div>
      <button
        type="button"
        onClick={() => {
          void props.onProfileChange({
            ...props.profile,
            baseSummary: 'edited summary',
            personalInfo: {
              ...props.profile.personalInfo,
              fullName: 'Edited Name',
            },
          } as CandidateProfileV1);
        }}
      >
        Edit profile
      </button>
    </div>
  ),
}));

import ResumeImportPage from './ResumeImportPage';

function makeDraft(overrides?: Partial<CandidateProfileV1>): {
  profile: CandidateProfileV1;
  warnings: string[];
} {
  const base: CandidateProfileV1 = {
    schemaVersion: 1,
    locale: 'en-US',
    personalInfo: {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      links: [],
    },
    defaultRole: null,
    baseSummary: 'AI summary',
    experience: [],
    skills: [],
    languages: [],
    education: [],
    projects: [],
    certifications: [],
  } as unknown as CandidateProfileV1;
  const profile = {
    ...base,
    ...overrides,
    personalInfo: {
      ...base.personalInfo,
      ...(overrides?.personalInfo ?? {}),
    },
  } as unknown as CandidateProfileV1;
  return { profile, warnings: ['AI may be incomplete'] };
}

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return { qc, Wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ResumeImportPage', () => {
  it('renders upload step with label and accept', () => {
    const { Wrapper } = createWrapper();
    render(<ResumeImportPage />, { wrapper: Wrapper });
    expect(
      screen.getByRole('heading', { name: /import resume/i }),
    ).toBeInTheDocument();
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.accept).toBe(
      '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(
      screen.getByRole('button', { name: /upload and parse/i }),
    ).toBeInTheDocument();
  });

  it('invalid file blocked and shows inline alert', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    const onError = vi.fn();
    render(<ResumeImportPage onError={onError} />, { wrapper: Wrapper });

    const file = new File(['hello'], 'resume.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/unsupported/i);

    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    expect(mockUploadResume).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: /import resume/i }),
    ).toBeInTheDocument();
  });

  it('rejects zero-byte file', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File([], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 0 });
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByRole('alert')).toHaveTextContent(/empty/i);
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    expect(mockUploadResume).not.toHaveBeenCalled();
  });

  it('successful upload shows review with draft fields and warnings', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    const draft = makeDraft();
    mockUploadResume.mockResolvedValue(draft);

    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/resume\.pdf/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /upload and parse/i }));

    await waitFor(() =>
      expect(mockUploadResume).toHaveBeenCalledWith(file, 'en-US'),
    );
    expect(
      await screen.findByRole('heading', { name: /review profile/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ai-generated content may be inaccurate/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/ai may be incomplete/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile name/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-fullname')).toHaveTextContent(
      'Ada Lovelace',
    );
    expect(screen.getByTestId('mock-email')).toHaveTextContent(
      'ada@example.com',
    );
    expect(
      screen.getByRole('button', { name: /confirm and create profile/i }),
    ).toBeInTheDocument();
  });

  it('shows selected filename and size', async () => {
    const { Wrapper } = createWrapper();
    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File(['a'.repeat(1024)], 'myResume.PDF', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText(/myResume\.PDF/)).toBeInTheDocument();
    expect(screen.getByText(/KB|B|MB/)).toBeInTheDocument();
  });

  it('edits persist and confirm calls confirmResume with EDITED draft', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    const draft = makeDraft();
    mockUploadResume.mockResolvedValue(draft);

    const snapshot: ProfileSnapshot = {
      id: 'new-id',
      name: 'Backend',
      currentVersion: 1,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      profile: draft.profile,
    } as ProfileSnapshot;
    mockConfirmResume.mockResolvedValue(snapshot);
    const onCreated = vi.fn();

    render(<ResumeImportPage onCreated={onCreated} />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(screen.getByLabelText(/resume file/i), {
      target: { files: [file] },
    });
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    await screen.findByRole('heading', { name: /review profile/i });

    await user.click(screen.getByText('Edit profile'));
    await waitFor(() =>
      expect(screen.getByTestId('mock-fullname')).toHaveTextContent(
        'Edited Name',
      ),
    );

    const nameInput = screen.getByLabelText(
      /profile name/i,
    ) as HTMLInputElement;
    await user.type(nameInput, '  Backend  ');

    await user.click(
      screen.getByRole('button', { name: /confirm and create profile/i }),
    );

    await waitFor(() => expect(mockConfirmResume).toHaveBeenCalledTimes(1));
    const [passedName, passedProfile] = mockConfirmResume.mock.calls[0] as [
      string,
      CandidateProfileV1,
    ];
    expect(passedName).toBe('Backend');
    expect((passedProfile as CandidateProfileV1).personalInfo.fullName).toBe(
      'Edited Name',
    );
    expect((passedProfile as CandidateProfileV1).baseSummary).toBe(
      'edited summary',
    );
    expect(onCreated).toHaveBeenCalledWith(snapshot);
  });

  it('missing name blocks confirm with inline alert', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    mockUploadResume.mockResolvedValue(makeDraft());

    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(screen.getByLabelText(/resume file/i), {
      target: { files: [file] },
    });
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    await screen.findByRole('heading', { name: /review profile/i });

    const nameInput = screen.getByLabelText(
      /profile name/i,
    ) as HTMLInputElement;
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');

    await user.click(
      screen.getByRole('button', { name: /confirm and create profile/i }),
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/profile name is required/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'profile-name-error');
    expect(mockConfirmResume).not.toHaveBeenCalled();
  });

  it('overlong name blocked', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    mockUploadResume.mockResolvedValue(makeDraft());
    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(screen.getByLabelText(/resume file/i), {
      target: { files: [file] },
    });
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    await screen.findByRole('heading', { name: /review profile/i });

    const nameInput = screen.getByLabelText(/profile name/i);
    await user.type(nameInput, 'a'.repeat(121));
    await user.click(
      screen.getByRole('button', { name: /confirm and create profile/i }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(/120/i);
    expect(mockConfirmResume).not.toHaveBeenCalled();
  });

  it('error from upload shows inline alert and calls onError', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    mockUploadResume.mockRejectedValue(new ApiError(413, 'File too large'));
    const onError = vi.fn();

    render(<ResumeImportPage onError={onError} />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(screen.getByLabelText(/resume file/i), {
      target: { files: [file] },
    });
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });

  it('uploading disables input and button and shows status', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    let resolve: (v: unknown) => void;
    mockUploadResume.mockImplementation(
      () => new Promise((res) => (resolve = res)),
    );

    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    const button = screen.getByRole('button', { name: /upload and parse/i });
    await user.click(button);

    await waitFor(() => expect(input).toBeDisabled());
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/uploading/i);
    const busyContainer = document.querySelector('[aria-busy="true"]');
    expect(busyContainer).toBeInTheDocument();

    resolve!(makeDraft());
    await screen.findByRole('heading', { name: /review profile/i });
  });

  it('confirming disables editing and shows status', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    mockUploadResume.mockResolvedValue(makeDraft());
    let confirmResolve: (v: unknown) => void;
    mockConfirmResume.mockImplementation(
      () => new Promise((res) => (confirmResolve = res)),
    );

    render(<ResumeImportPage />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(screen.getByLabelText(/resume file/i), {
      target: { files: [file] },
    });
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    await screen.findByRole('heading', { name: /review profile/i });

    const nameInput = screen.getByLabelText(/profile name/i);
    await user.type(nameInput, 'Backend');
    const confirmBtn = screen.getByRole('button', {
      name: /confirm and create profile/i,
    });
    await user.click(confirmBtn);

    await waitFor(() => expect(confirmBtn).toBeDisabled());
    expect(screen.getByRole('status')).toHaveTextContent(/creating profile/i);
    expect(screen.getByTestId('mock-editor')).toHaveAttribute(
      'data-pending',
      'true',
    );
    expect(screen.getByTestId('mock-editor')).toHaveAttribute(
      'data-readonly',
      'true',
    );

    confirmResolve!({
      id: 'id',
      name: 'Backend',
      currentVersion: 1,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      profile: makeDraft().profile,
    });
    await waitFor(() => expect(confirmBtn).not.toBeDisabled());
  });

  it('confirm error shows inline alert and onError', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    mockUploadResume.mockResolvedValue(makeDraft());
    mockConfirmResume.mockRejectedValue(
      new ApiError(409, 'Profile name already exists'),
    );
    const onError = vi.fn();

    render(<ResumeImportPage onError={onError} />, { wrapper: Wrapper });

    const file = new File(['content'], 'resume.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(screen.getByLabelText(/resume file/i), {
      target: { files: [file] },
    });
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    await screen.findByRole('heading', { name: /review profile/i });

    await user.type(screen.getByLabelText(/profile name/i), 'Backend');
    await user.click(
      screen.getByRole('button', { name: /confirm and create profile/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /already exists/i,
    );
    expect(onError).toHaveBeenCalled();
  });

  it('oversize file blocked client side', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<ResumeImportPage />, { wrapper: Wrapper });

    const bigFile = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'big.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/resume file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(await screen.findByRole('alert')).toHaveTextContent(/large|size/i);
    await user.click(screen.getByRole('button', { name: /upload and parse/i }));
    expect(mockUploadResume).not.toHaveBeenCalled();
  });
});
