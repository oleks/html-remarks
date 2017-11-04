#!/usr/bin/env bash

set -eo pipefail

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Type assertions:     $( ${dir}/count-type-assertions.sh )."
echo "Non-null assertions: $( ${dir}/count-non-null-assertions.sh )."
