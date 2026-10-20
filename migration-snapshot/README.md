# Pre-migration baseline snapshot

Captured 2026-10-17, from the live site at https://www.sivan-pesahov.dev/, back when
it still had a live Flask API on Railway.

**Outcome:** instead of migrating the backend to Render/Postgres, we went fully static.
`detail-*.json` and `comments-*.json` here are the source data that was hand-converted
into `Frontend/src/data/projects.ts` — the site's only data source now, no server/DB
at runtime. See that file's header comment for details.

- `snapshot-home.png`, `snapshot-project-*.png` — full-page screenshots of the live
  (Railway-backed) site, used to visually confirm the static rebuild matches exactly
  (see `verify-static-*.png` — captured from the static build's local preview, same
  pre-existing "scroll-reveal" rendering quirk in both, confirming parity)
- `projects-api-snapshot.json` — `GET /api/projects` (list view, no `description_md`)
- `detail-*.json` — `GET /api/projects/:slug` per project, including `description_md`
  and that project's comments — this is what `src/data/projects.ts` was generated from
- `comments-*.json` — `GET /api/projects/:slug/comments` standalone (same data as
  embedded in `detail-*.json`)

Trade-off: the site can no longer accept *new* comments or contact-form submissions
(no backend to receive them) — the contact form was already not wired into the live
site (visitors use the `mailto:` links on the homepage instead), and the 5 real
existing comments were preserved read-only in the static data rather than dropped.

The `Backend/` Postgres-migration prep (driver swap, `docker-compose.yml`, the data
migration script) from the earlier plan is no longer needed for production — nothing
deploys it — but was left in place in case local dynamic content editing is wanted later.
