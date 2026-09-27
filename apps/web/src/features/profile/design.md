# Profile — Web-Resume Design Spec

> Web-resume, not document/paper. No print layout, no A4, no page breaks, no PDF chrome.

## Layout

- Container `max-width: 1200px`, centered `mx-auto`, outer padding `px-4` mobile / `px-6` desktop, page bg `#123159`.
- Two-column grid desktop `≥1024px`: `grid-cols-12 gap-6`. Main `col-span-8` holds summary → experience → projects (vertical stack, document order). Sidebar `col-span-4` holds contact → skills → languages → education → certifications (vertical stack).
- Stack `<1024px`: single column `grid-cols-1`, order = main blocks then sidebar blocks (or sidebar interleave per IA: summary, experience, projects, contact, skills, languages, education, certifications). No masonry.
- Floating top icon bar: `position: fixed` top-center, `backdrop-blur`, pill shape, icons only: Home / Profile (active) / Logout. No text labels in bar. `z-50`. Content `pt-20` to clear.

## Palette

- Page bg `#123159`, text `#FFFFFF` / `#FFFFFFCC` muted, primary accent `#f2dc6b` (links, active states, focus ring, skill pills highlight).
- Cards translucent: `bg-[#FFFFFF0D]` default, `bg-[#FFFFFF12]` hover/interactive, border `border-[#FFFFFF1F]` (`1px solid`), inner subtle highlight `border-t-[#FFFFFF14]` optional.
- Secondary borders/dividers `#FFFFFF0D` / `#FFFFFF14`.
- Icon bar: `bg-[#1a3a5a]/80` or `bg-[#FFFFFF0F]` with `backdrop-blur-md`, border `border-[#FFFFFF1F]`.
- No gradients, no avatar showcase gradients, no paper shadows, no hero banners.

## Typography (purpose → size/weight/tone)

- `display` — name header: `text-3xl md:text-4xl font-bold tracking-tight` neutral white.
- `title` — section card titles (Experience, Projects): `text-xl font-semibold`.
- `subtitle` — item titles (company + position, project name): `text-base font-semibold`.
- `role` — role/degree line under subtitle: `text-sm font-medium text-[#FFFFFFCC]`.
- `section` — sidebar group label (Contact, Skills, Languages…): `text-xs font-semibold uppercase tracking-widest text-[#FFFFFF99]`.
- `body` — summaries, responsibilities, descriptions: `text-sm font-normal leading-relaxed text-[#FFFFFFCC]`.
- `meta` — dates, locations, employment/location type: `text-xs font-normal text-[#FFFFFF80]`.
- `label` — chip/pill (skills, language proficiency): `text-xs font-medium`.

All antialiased. No serif display. Line-height relaxed for body.

## Card & Spacing

- Card: `rounded-2xl border bg-[#FFFFFF0D] border-[#FFFFFF1F] p-5 md:p-6` with `shadow-none` (flat translucent, not paper elevation).
- Section gap `space-y-6` between cards, `space-y-4` inside card between items, `gap-2` for pill wraps.
- Dividers between experience/project entries: `border-t border-[#FFFFFF0D] pt-4` or `Separator` with `bg-[#FFFFFF0D]`.
- Skills: pill wrap `flex flex-wrap gap-2`, pills `rounded-full bg-[#FFFFFF0F] border border-[#FFFFFF14] px-3 py-1 text-xs`.
- Sidebar cards slightly denser: `p-4 md:p-5`.

## Borders & Radius

- Radius `rounded-2xl` cards, `rounded-full` pills/icon bar/buttons.
- Border width `1px` always `border-[#FFFFFF1F]` for cards, `border-[#FFFFFF0D]` for internal dividers.
- Focus ring `ring-2 ring-[#f2dc6b]/40 ring-offset-0`.

## Top Bar

- Pill container `rounded-full px-2 py-2 flex items-center gap-1`.
- Icon buttons `size-9 rounded-full flex items-center justify-center` inactive `text-[#FFFFFF80] hover:bg-[#FFFFFF0F]`, active `bg-[#f2dc6b] text-[#123159]`.
- Icons Lucide: `House`, `User`, `LogOut`. No labels, `aria-label` only.

## Editing Interaction

- Double-click editable field → inline input/textarea/select. Single source of truth in local state.
- `useOptimistic` for immediate UI, revert on cancel/error. No persistence (no API call, no `localStorage`, no mutation). Blur or Escape reverts, Enter commits optimistically only.
- Technical fields hidden in UI: `id`, `currentVersion`, `createdAt`, `updatedAt`, `schemaVersion`, `skillRefs` raw ids, `evidenceRefs`, `aliases`, `credentialId`/`credentialUrl` raw (show only issuer/name/dates), `timezone` raw. Show human-readable derived values only.

## Forbidden

- No portfolio hero, no avatar showcase, no cover image, no metrics dashboard, no CTA banner, no gradients, no paper/document shadow or page curl, no print toolbar.
- No separate "About" hero section — summary is just first card in main column.
