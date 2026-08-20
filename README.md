# career-log

A minimalist public site tracking Alfredo's professional path — work, projects, education and CPD — built as a data-driven timeline.

## Structure

- `src/data/events.json` — the dataset. One record per event, discriminated by `type` (`job` | `project` | `education` | `cpd`). See the entries for the field schema per type.
- `src/App.jsx` — the site. Reads `events.json`, splits it into sections, renders a sortable timeline per section.
- Deployed via Vercel, auto-deploying on every push to `main`.

## Updating

New entries are normally added by asking Claude in chat — Claude edits `src/data/events.json` and pushes directly, which triggers a Vercel redeploy automatically.
