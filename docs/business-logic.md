# Navigator Extension Business Logic

## Product Purpose

Talentor Navigator helps a job seeker tailor a resume to a job listing without leaving LinkedIn. It extracts visible job-post information, combines it with a selected seeker profile, sends both to the Talentor service, and presents the generated resume in history.

The extension is an assistant around resume preparation. It does not apply to jobs, bypass an ATS, or guarantee an interview.

## Actors And Responsibilities

- **Job seeker:** authenticates, maintains source profiles, selects a profile, reviews generated content, and decides whether to use it.
- **LinkedIn page:** supplies visible job-post DOM content to the content script.
- **Content script:** adds the Talentor extraction button and reads configured fields.
- **Popup:** lets the seeker inspect/edit job data, select a profile, trigger generation, and view history.
- **Service worker:** carries the latest scrape payload between isolated extension contexts.
- **Backend:** authenticates the seeker, matches profile context to the job description through an LLM prompt, and stores the resulting resume.

## User Journeys

### 1. Authenticate

1. Seeker opens the extension popup.
2. Seeker logs in or registers.
3. The returned token and user session are persisted in the `session` Zustand store.
4. Axios reads the persisted token and sends it as a Bearer token on later API requests.

### 2. Create and select profile

1. Seeker opens profile settings.
2. Seeker enters personal links, skills, languages, about-me text, and experience.
3. Profile API sends the profile to the backend.
4. Seeker selects a profile ID; the selection persists under `jobProfile`.

### 3. Extract a LinkedIn job

1. Manifest content script runs on a LinkedIn jobs URL.
2. A `MutationObserver` waits for the job action area.
3. The script injects `ApplyButton` beside the LinkedIn controls.
4. Clicking the button runs `JobPostScrapper`.
5. The scraper normalizes visible text and sends JSON through `JOB_POST_SCRAPPED_ACTION`.
6. The service worker forwards the message to an open popup or stores only the latest payload until popup connection.
7. `Home` parses the payload and merges it into the job-post form.

Current scraped fields:

- `title`
- `position` (currently reads the same selector as `title`)
- `description`
- `location`
- `companyName`
- `companyBriefDescription`
- `companyDescription`
- `companyLogoUrl` is configured, but scraper currently reads `textContent`, not image URL attributes

Job type, company worker count, posting date, applicants, and skills are declared but currently disabled or unimplemented in the selector configuration.

### 4. Generate a tailored resume

1. Seeker opens the generated/manual job form.
2. Scraped values appear as defaults; seeker may edit or enter them manually.
3. `GeneratePost` removes empty fields and sends the job post plus selected profile ID to `POST /api/v1/jobs/apply`.
4. Backend generates and stores the tailored resume.
5. On mutation success, popup clears form state, invalidates resume history, and navigates to `/my-cvs`.

The request field `name` defaults to the job title or `CV`.

### 5. Review history

History queries the backend using the selected profile ID and renders prior generated resumes. Download behavior is present in some client constants/components but has no working backend endpoint or guaranteed file URL.

## Business Data Flow

```text
LinkedIn visible job description
    -> scraped JobPost fields
    -> popup form corrections
    -> selected seeker profile ID
    -> backend profile + job prompt
    -> LLM keyword alignment and resume content
    -> persisted Resume + JobPost
    -> history review
```

## ATS Alignment Rule

The backend prompt asks OpenAI to extract relevant job keywords, match them against seeker information, use useful synonyms, and place truthful matches in resume sections. This is semantic prompt guidance, not a local keyword-matching algorithm. There is no client-side or server-side ATS score, coverage report, or deterministic ranking.

Generated output must be reviewed by the seeker because the model can produce incorrect, incomplete, or overly broad wording even when instructed not to invent experience.

## Product Boundaries And Known Gaps

- LinkedIn content is scraped from brittle CSS selectors and can break when LinkedIn changes markup.
- The observer disconnects after the first matching job control; SPA navigation may require reinjection support.
- Service-worker queue stores one latest payload, so multiple closed-popup scrapes overwrite each other.
- The extension does not submit forms or applications on LinkedIn.
- Backend expects `linkedinUrl`; extension code may use `linkedInUrl`.
- Backend expects `JobPost.skills` as `List<String>`; extension form currently treats skills as a string and scraper does not populate it.
- Extension declares delete-profile and download-resume flows that backend routes do not implement.
- Resume history must be scoped to the authenticated user's selected profile on the backend.
- `/my-cvs` route is not consistently wrapped by the authentication redirect.
- Profile display still contains hardcoded/mock presentation data in `InformationGrid`.

## Trust And Privacy Expectations

Job descriptions and seeker profiles are personal employment data. Keep transport authenticated, avoid logging raw prompts or generated resumes, protect API secrets, and require seeker review before use. Never describe generated keyword alignment as a guarantee of ATS passage.
