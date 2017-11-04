#!/usr/bin/env bash

set -eo pipefail

cat remarks.ts | sed 's/\(.\)/\1\n/g' | grep '!' | wc -l
