#!/usr/bin/env bash

set -eo pipefail

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cat ${dir}/../remarks.ts | sed 's/\(.\)/\1\n/g' | grep '!' | wc -l
