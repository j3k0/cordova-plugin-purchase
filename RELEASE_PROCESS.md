# Release Process — cordova-plugin-purchase & capacitor-plugin-cdv-purchase

Both packages are built and versioned from this single repo and **must share the same
version number** (verified by the `versions` script). Releases are cut manually from
`master`; there is no CI auto-publish.

> TL;DR: bump the 6 version files → write release notes → `make all` → commit → tag →
> push → `npm publish` (cordova) + `make capacitor-publish` (capacitor) → `gh release`.

## Where things live

| Concern | Location |
|---|---|
| Build/test/package targets | [`Makefile`](./Makefile) (`all`, `build`, `compile`, `tests`, `doc`, `capacitor-package`, `capacitor-publish`, `check-versions`) |
| Version consistency check + editor | [`versions`](./versions) — `./versions` to verify, `./versions --edit` to open all 6 files |
| Changelog | [`RELEASE_NOTES.md`](./RELEASE_NOTES.md) |
| Version fields (6 files) | `package.json`, `package-lock.json`, `plugin.xml`, `src/ts/store.ts` (`PLUGIN_VERSION`), `capacitor/package.json`, `capacitor/package-lock.json` |
| CI (build & test only — **no publish**) | `.github/workflows/` (`test.yml`, `build-*.yml`) |

The 6 version files are the source of truth; `www/store.js`, `www/store.d.ts`,
`api/`, and `capacitor/dist/index.js` are **generated** by `make all` and pick up the
version automatically — never hand-edit them.

## Steps

### 1. Prepare the branch
```sh
git checkout master
git pull
```
All work for the release must be merged. The tree should have no stray uncommitted
changes (check `git status`).

### 2. Choose the version
Semver, matching the existing `vMAJOR.MINOR.PATCH` tag scheme (e.g. `13.17.2`).

### 3. Bump the version in all 6 files
```sh
./versions --edit      # opens vim on all six files at once
```
or edit each by hand. Then verify they agree:
```sh
./versions             # or: make check-versions
# must print: "All version numbers match: <version>"
```

### 4. Write the release notes
Prepend a `### X.Y.Z` section under the matching `## X.Y` heading in
[`RELEASE_NOTES.md`](./RELEASE_NOTES.md) (add a new `## X.Y` heading for a new minor).
Follow the existing format: one `#### (tag) Title` subsection per user-facing change,
linking the issue/PR. Companion-plugin notes belong in a `#### Companion plugin
compatibility` block.

### 5. Build, test, generate docs, package Capacitor
```sh
make all
```
`all` = `build` + `doc` + `capacitor-package`, i.e.:
- `compile` → `tsc` (into `www/`)
- `tests` → `npm test` (jest) + javalint (checkstyle)
- `doc` → typedoc into `api/` and typedoc-dev into `api-dev/`
- `capacitor-package` → copies `www/store.js` + `www/store.d.ts` into `capacitor/www/`,
  runs `cd capacitor && npm run build`, and re-checks the versions match.

If you only need the Capacitor package without a full rebuild: `make capacitor-package`.

### 6. Review the diff
```sh
git status
git diff
```
Expected changed files: the 6 version files, `RELEASE_NOTES.md`, plus regenerated
artifacts (`www/store.js`, `www/store.d.ts`, `api/**`, `capacitor/dist/index.js`,
`capacitor/www/*`). Anything else is unexpected — investigate before continuing.

### 7. Commit
```sh
git add <the files from step 6>     # never `git add -A` — the tree has unrelated untracked files
git commit -m "release: X.Y.Z"
```

### 8. Tag (annotated)
```sh
git tag -a vX.Y.Z -m "release: X.Y.Z" -m "<short summary of the changes>"
```
The tag **must** be prefixed with `v` (the `vX.Y.Z` form is what `gh release` and the
existing tags use). Include a one- or two-line summary of the release in the annotation,
matching prior tags.

### 9. Push
```sh
git push
git push --tags
```

### 10. Publish to npm (manual)
CI does **not** publish. You must be logged in to the publishing account (`npm whoami`
→ `jchoelt`). Publish **both** packages:
```sh
npm publish                          # cordova-plugin-purchase (repo root)
make capacitor-publish               # capacitor-plugin-cdv-purchase (cd capacitor && npm publish)
```
For a pre-release, add `--tag next` to both.

### 11. Create the GitHub release
```sh
gh release create vX.Y.Z \
  -R j3k0/cordova-plugin-purchase \
  --title "vX.Y.Z" \
  --notes-file <path-to-the-release-notes-section>
```
The body should contain the version's `RELEASE_NOTES.md` section, an `## npm packages`
footer listing both published versions, and a link to `RELEASE_NOTES.md` at the tag —
see the [v13.16.1 release](https://github.com/j3k0/cordova-plugin-purchase/releases/tag/v13.16.1)
for the exact format. This step is easy to forget; do it right after publishing.

### 12. Verify
```sh
npm view cordova-plugin-purchase version          # == X.Y.Z
npm view capacitor-plugin-cdv-purchase version    # == X.Y.Z
gh release view vX.Y.Z -R j3k0/cordova-plugin-purchase   # marked "Latest"
git tag --list "vX.Y.Z"
```

## Checklist (copy-paste)

- [ ] `git checkout master && git pull`
- [ ] `./versions --edit` → bump 6 files, then `./versions` passes
- [ ] Add `### X.Y.Z` section to `RELEASE_NOTES.md`
- [ ] `make all` (green tests + regenerated `www/`, `api/`, `capacitor/dist/`)
- [ ] `git status` / `git diff` review
- [ ] `git commit -m "release: X.Y.Z"`
- [ ] `git tag -a vX.Y.Z -m "..."`
- [ ] `git push && git push --tags`
- [ ] `npm publish` (cordova) + `make capacitor-publish` (capacitor)
- [ ] `gh release create vX.Y.Z ...`
- [ ] `npm view ... version` + `gh release view` sanity check
