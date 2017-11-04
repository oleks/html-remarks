#!/usr/bin/env bash

set -eo pipefail

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cat ${dir}/../*.ts | \
  grep ' as ' | \
  sed 's/\( as \)/\1\n/g' | \
  grep ' as ' | \
  wc -l
