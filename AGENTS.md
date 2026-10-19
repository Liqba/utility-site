# Repository workflow

- After every source change, commit the change and push it to the `github` remote (`main` branch).
- Keep the Sites source workflow intact; it may also push the same source commit to the Sites source repository.
- Never store GitHub access tokens in source files, Git remotes, or committed configuration.

## Japanese Duolingo study notes

- Before adding grammar to `japanese-study/grammar.md`, read the existing notes and add only genuinely new points. Do not repeat grammar already covered; if a lesson adds a materially new usage or nuance, record only that addition.
- Group practice material by local calendar date. Lessons on the same date belong under one date heading, without separate session entries; open a new dated heading only when the date changes.
- Record only the calendar date in Asia/Bangkok for grammar notes and Anki date tags; do not include time of day or minutes.
- Before adding vocabulary to `japanese-study/vocabulary-source.tsv`, check for existing entries and avoid duplicates.
