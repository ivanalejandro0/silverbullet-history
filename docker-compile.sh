#!/bin/env bash
# BUG: not working for some reason, moved to compile locally, see `compile.sh`
docker run \
  --volume $(pwd):/my \
  --rm -it \
  ghcr.io/silverbulletmd/silverbullet:v2 plug:compile -c /my/deno.jsonc --debug /my/history.plug.yaml 
