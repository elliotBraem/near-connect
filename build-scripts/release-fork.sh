#!/usr/bin/env bash
# Cut a fork release: build the library, commit build/ (gitignored normally),
# and tag it so other repos can install directly from GitHub:
#
#   yarn add "https://github.com/<owner>/<repo>.git#v0.12.0-fork.1"
#
# npm/yarn run no lifecycle scripts for git installs, so build/ must exist in
# the tagged tree. The tag is what consumers pin to — delete/release it only
# when the tree is in a good state. Once changes are merged upstream and
# published to npm, drop the git-URL pin and return to the npm package.
set -euo pipefail

cd "$(dirname "$0")/.."

TAG="${1:?Usage: release-fork.sh <tag> (e.g. v0.12.0-fork.1)}"

if git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
  echo "Tag $TAG already exists — pick a new one." >&2
  exit 1
fi

yarn build

git add -f build
git commit -m "chore(release): $TAG — committed build/ for git-URL installs" 
git tag "$TAG"

echo
echo "Done. Consumers can install with:"
echo "  yarn add \"\$(git remote get-url origin)#$TAG\""
echo "Push it with: git push origin $(git branch --show-current) $TAG"
