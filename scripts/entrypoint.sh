#!/usr/bin/env bash
set -e

# =============================================================================
# Variables
# =============================================================================

DOOMWADDIR=${DOOMWADDIR:-'/wads'}
TARGET_HOST=${TARGET_HOST:-'localhost'}
TARGET_PORT=${TARGET_PORT:-'10666'}
TARGET_PASSWORD=${TARGET_PASSWORD:-''}
TIMEOUT=${TIMEOUT:-30}

# =============================================================================
# Functions
# =============================================================================

## Log helper function
log()
{
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ENTRYPOINT - $1"
}

## Display startup banner with configuration
show_banner()
{
  log "=== TwitchAndTear Starting ==="
  log "TARGET_HOST: ${TARGET_HOST}"
  log "TARGET_PORT: ${TARGET_PORT}"
  log "DOOMWADDIR: ${DOOMWADDIR}"
  log "CHANNELS: ${CHANNELS}"
}

## Set up runtime environment
setup_environment()
{
  # Set up XDG_RUNTIME_DIR for PulseAudio
  export XDG_RUNTIME_DIR="/tmp/runtime-twitchandtear"
  mkdir -p "${XDG_RUNTIME_DIR}"
  chmod 700 "${XDG_RUNTIME_DIR}"

  # Ensure PulseAudio socket is reachable
  export PULSE_SERVER="unix:/tmp/pulseaudio.socket"
}

## Start supervisor daemon
start_supervisor()
{
  log "Starting supervisor..."
  /usr/bin/supervisord -c /etc/supervisor/supervisord.conf &
  SUPERVISOR_PID=$!
}

## Wait for Xvfb to start with timeout
## Uses X server lock file as the most reliable indicator
wait_for_xvfb()
{
  log "Waiting for Xvfb to start..."
  local counter=0

  # Check for X server lock file which indicates display :0 is active
  until [ -f /tmp/.X0-lock ]; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $TIMEOUT ]; then
      log "ERROR: Xvfb failed to start within ${TIMEOUT} seconds"
      log "Checking supervisor status..."
      supervisorctl status 2>/dev/null || true
      exit 1
    fi
  done

  log "Xvfb is running (display :0 active)."
}

## Wait for PulseAudio socket with timeout
wait_for_pulseaudio()
{
  log "Waiting for PulseAudio socket..."
  local counter=0

  until [ -S /tmp/pulseaudio.socket ]; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $TIMEOUT ]; then
      log "WARNING: PulseAudio socket not found after ${TIMEOUT} seconds, continuing without audio"
      return 1
    fi
  done

  log "PulseAudio is running."
  return 0
}

## Show PulseAudio logs if socket not available
show_pulseaudio_logs()
{
  log "PulseAudio socket not available, checking logs..."
  cat /home/twitchandtear/pulseaudio.log 2>/dev/null | log_with_prefix "PULSEAUDIO" || log "No pulseaudio log found"
}

## Format log output with timestamp and source
log_with_prefix()
{
  local source="$1"
  while IFS= read -r line; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ${source} - ${line}"
  done
}

## Launch Zandronum client
launch_zandronum()
{
  local cmd="zandronum -connect ${TARGET_HOST}:${TARGET_PORT}"

  if [ -n "${TARGET_PASSWORD}" ]; then
    cmd="${cmd} +cl_password ${TARGET_PASSWORD}"
  fi

  log "Launching Zandronum: ${cmd}"
  DISPLAY=':0' DOOMWADDIR="${DOOMWADDIR}" ${cmd} 2>&1 | log_with_prefix "ZANDRONUM" | tee /home/twitchandtear/zandronum.log &
  ZANDRONUM_PID=$!
  log "Zandronum started with PID ${ZANDRONUM_PID}"
}

## Verify Zandronum is still running
verify_zandronum()
{
  sleep 2

  if ! kill -0 ${ZANDRONUM_PID} 2>/dev/null; then
    log "ERROR: Zandronum exited immediately. Check that WADs are available in ${DOOMWADDIR}"
    ls -la "${DOOMWADDIR}" 2>/dev/null || log "WAD directory not accessible"
    return 1
  fi

  return 0
}

## Launch OBS Studio
launch_obs()
{
  log "Launching OBS..."
  DISPLAY=':0' /usr/local/bin/obs.sh 2>&1 | log_with_prefix "OBS" | tee /home/twitchandtear/obs.log &
  OBS_PID=$!
  log "OBS started with PID ${OBS_PID}"

  # Wait for OBS window to appear, then send it to the back
  sleep 3
  log "Bringing Zandronum to foreground..."
  # Try multiple methods to find and activate Zandronum window
  DISPLAY=':0' xdotool search --class "Zandronum" windowactivate 2>/dev/null || \
  DISPLAY=':0' xdotool search --name "Zandronum" windowactivate 2>/dev/null || \
  DISPLAY=':0' xdotool search --name "DOOM" windowactivate 2>/dev/null || true
}

## Launch the TwitchAndTear bot
launch_bot()
{
  log "Starting TwitchAndTear bot..."
  cd /app
  exec npm start -- "$@"
}

## Run authorization mode
run_auth_mode()
{
  log "Running in authorization mode..."
  cd /app
  exec npm run auth
}

# =============================================================================
# Main
# =============================================================================

# Check for auth mode
if [ "$1" = "--auth" ] || [ "$1" = "auth" ]; then
  run_auth_mode
fi

show_banner
setup_environment
start_supervisor
wait_for_xvfb
wait_for_pulseaudio || show_pulseaudio_logs
launch_zandronum
verify_zandronum
launch_obs
launch_bot "$@"
