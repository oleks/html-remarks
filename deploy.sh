#!/usr/bin/env bash

set -euo pipefail

./gitsync.sh

# Use -B to keep gh-pages at most one commit ahead of master.
# This leads to the use of -f when pushing to gh-pages on remote.
# This might actually be one descent use of git push -f..
git checkout -B gh-pages

trap 'git checkout master' INT TERM EXIT

set +e

cat | bash - <<EOF
set -euo pipefail
make clean
make
cp output/remarks.html .
git add remarks.html
git commit -S -m 'Deploy'
git push -f origin gh-pages
EOF

set -e

exit 0
