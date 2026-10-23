#!/usr/bin/env bash
set -euo pipefail

if [[ $# != 1 || ${PLAYWRIGHT_MODULE:-} != */node_modules/playwright/index.mjs ]]; then
  echo 'Usage: PLAYWRIGHT_MODULE=/absolute/prefix/node_modules/playwright/index.mjs container.sh <new-evidence-directory>' >&2
  exit 2
fi
verify_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)
verify_browser_root=${PLAYWRIGHT_MODULE%/node_modules/playwright/index.mjs}
verify_node_dir=$(dirname "$(readlink -f "$(command -v node)")")
verify_pnpm_dir=$(dirname "$(readlink -f "$(command -v pnpm)")")
verify_image=mcr.microsoft.com/playwright:v1.64.0-noble
# Use an existing image; fetching a runtime is a separate, visible setup step.
docker image inspect "$verify_image" >/dev/null
verify_container="verify-double-take-$$"
printf 'Container doctor: docker exec %q %q doctor local\n' "$verify_container" "$verify_root/.agents/skills/verify-double-take/scripts/verify.mjs"
exec docker run --rm --init --name "$verify_container" \
  --user "$(id -u):$(id -g)" --shm-size=1g \
  --mount "type=bind,source=$verify_root,target=$verify_root" \
  --mount "type=bind,source=$verify_browser_root,target=/browser,readonly" \
  --mount "type=bind,source=$verify_node_dir,target=/node-bin,readonly" \
  --mount "type=bind,source=$verify_pnpm_dir,target=/pnpm,readonly" \
  --workdir "$verify_root" \
  --env PATH=/node-bin:/pnpm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  --env PLAYWRIGHT_MODULE=/browser/node_modules/playwright/index.mjs \
  --env PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
  --env PLAYWRIGHT_CHROMIUM_EXECUTABLE=/ms-playwright/chromium-1248/chrome-linux64/chrome \
  "$verify_image" .agents/skills/verify-double-take/scripts/verify.mjs run "$1"
