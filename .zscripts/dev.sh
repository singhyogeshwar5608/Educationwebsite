#!/bin/bash
# ==============================================================
# dev.sh — Delegates to init-fullstack.sh with watchdog
# This is the entry point called by the platform.
# ==============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INIT_SCRIPT="$SCRIPT_DIR/init-fullstack.sh"

if [ -f "$INIT_SCRIPT" ]; then
  exec "$INIT_SCRIPT" "$@"
else
  echo "ERROR: init-fullstack.sh not found at $INIT_SCRIPT"
  exit 1
fi
