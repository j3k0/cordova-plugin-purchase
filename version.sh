#!/bin/bash
VERSION="$@"
if [ -z "$VERSION" ]; then
  cat plugin.xml | grep '^    version="[0-9betalph.-]*"' | cut -d\" -f2
  exit 0
fi
echo "Set version to '$VERSION'? (yes/[no])"
read ANSWER
if [ "x$ANSWER" = "xyes" ]; then
  npm version --no-git-tag-version "$@"
  sed -i.bak 's/    version="[0-9betalph.-]*"/    version="'$VERSION'"/' plugin.xml
  echo "commit and tag the release? ([yes]/no)"
  read ANSWER
  if [ "x$ANSWER" = "xyes" ] || [ "x$ANSWER" = "xy" ] || [ "x$ANSWER" = "x" ]; then
    git add package.json package-lock.json plugin.xml
    git commit -m "$VERSION"
    git tag -a "$VERSION" -m "$VERSION"
  fi
fi
