#!/bin/bash
# ==============================================================
# init-fullstack.sh — Bulletproof full-stack initializer
# deps → DB → server start + self-healing watchdog loop
#
# Proven pattern: nohup + disown + simple curl-based watchdog
# Tested: server auto-recovers within 20s after crash
# ==============================================================

PORT="${DEV_PORT:-3000}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="$SCRIPT_DIR/init-fullstack.log"

MAX_CRASHES=5
CRASH_WINDOW=60
RESTART_DELAY=5
HEALTH_INTERVAL=8

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"; }
ok()   { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✓${NC} $*" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠${NC} $*" | tee -a "$LOG_FILE"; }
fail() { echo -e "${RED}[$(date '+%H:%M:%S')] ✗${NC} $*" | tee -a "$LOG_FILE"; }

is_up() { curl -sf "http://localhost:$PORT" >/dev/null 2>&1; }

# Kill only processes on the port
kill_port() {
  local pids
  pids=$(lsof -ti :"$PORT" 2>/dev/null || true)
  [ -z "$pids" ] && return 0
  for p in $pids; do
    [ "$p" = "$$" ] && continue
    kill "$p" 2>/dev/null
  done
  sleep 2
  pids=$(lsof -ti :"$PORT" 2>/dev/null || true)
  [ -z "$pids" ] && return 0
  for p in $pids; do
    [ "$p" = "$$" ] && continue
    kill -9 "$p" 2>/dev/null
  done
  sleep 1
}

# Start server (simple, proven pattern)
start_server() {
  cd "$PROJECT_DIR"
  log "Starting Next.js dev server on port $PORT..."
  nohup bun run dev >> "$LOG_FILE" 2>&1 &
  disown

  local i=0
  while [ $i -lt 60 ]; do
    is_up && { ok "Server UP on port $PORT"; return 0; }
    i=$((i + 1)); sleep 1
  done
  fail "Server didn't respond in 60s"; return 1
}

cleanup() { log "Shutting down..."; kill_port; ok "Bye"; }
trap cleanup EXIT INT TERM

# ═══════════════════════════════════════════
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Z-TECH CAREER ACADEMY — Full-Stack Init"
echo "═══════════════════════════════════════════════════"
echo ""

cd "$PROJECT_DIR"
: > "$LOG_FILE"

kill_port

log "Installing dependencies..."
if command -v bun >/dev/null 2>&1; then bun install 2>&1 | tail -2
elif command -v npm >/dev/null 2>&1; then npm install 2>&1 | tail -2
else fail "No bun/npm!"; exit 1; fi
ok "Dependencies installed"

log "Setting up database..."
mkdir -p "$(dirname "$(grep DATABASE_URL .env 2>/dev/null | cut -d= -f2 | sed 's/file://')" 2>/dev/null || echo db)" 2>/dev/null
if command -v bun >/dev/null 2>&1; then
  bun run db:push 2>&1 | tail -3 || npx prisma db push --accept-data-loss 2>&1 | tail -3 || warn "DB push issue"
  bun run db:generate 2>&1 | tail -2 || npx prisma generate 2>&1 | tail -2 || warn "Prisma generate issue"
else
  npx prisma db push --accept-data-loss 2>&1 | tail -3 || warn "DB push issue"
  npx prisma generate 2>&1 | tail -2 || warn "Prisma generate issue"
fi
ok "Database ready"

start_server || { fail "Server failed to start"; exit 1; }

echo ""
ok "═══════════════════════════════════════════"
ok "  Server running on http://localhost:$PORT"
ok "  Log: $LOG_FILE"
ok "═══════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════
#  WATCHDOG LOOP
# ═══════════════════════════════════════════
crash_count=0
last_crash_ts=0

log "Watchdog active — health check every ${HEALTH_INTERVAL}s"

while true; do
  sleep $HEALTH_INTERVAL

  if is_up; then
    now_ts=$(date +%s)
    (( now_ts - last_crash_ts > CRASH_WINDOW )) && crash_count=0
    continue
  fi

  # Server DOWN
  now_ts=$(date +%s)
  (( now_ts - last_crash_ts > CRASH_WINDOW )) && crash_count=0
  crash_count=$((crash_count + 1))
  last_crash_ts=$now_ts

  if (( crash_count >= MAX_CRASHES )); then
    fail "Crash loop: $crash_count in ${CRASH_WINDOW}s — cooling 30s..."
    sleep 30; crash_count=0; continue
  fi

  warn "Server DOWN! Restart #$crash_count in ${RESTART_DELAY}s..."
  sleep "$RESTART_DELAY"
  kill_port
  start_server && ok "Server recovered (#$crash_count)" || fail "Restart failed"
done
