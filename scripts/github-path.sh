#!/usr/bin/env bash

set -euo pipefail

git remote get-url origin | \
  sed 's/^git@github.com:\(.*\)\.git$/\1/'
