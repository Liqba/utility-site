# Repository workflow

- After every source change, commit the change and push it to the `github` remote (`main` branch).
- Keep the Sites source workflow intact; it may also push the same source commit to the Sites source repository.
- Never store GitHub access tokens in source files, Git remotes, or committed configuration.

## Japanese Duolingo study notes

- Before adding grammar to `japanese-study/grammar.md`, read the existing notes and add only genuinely new points. Do not repeat grammar already covered; if a lesson adds a materially new usage or nuance, record only that addition.
- Timestamp each new grammar addition with the actual date and time in `Asia/Bangkok` when it is written.
- Before adding vocabulary to `japanese-study/vocabulary-source.tsv`, check for existing entries and avoid duplicates.
