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

## Display startup banner with configuration
show_banner()
{
  echo "=== TwitchAndTear Starting ==="
  echo "TARGET_HOST: ${TARGET_HOST}"
  echo "TARGET_PORT: ${TARGET_PORT}"
  echo "DOOMWADDIR: ${DOOMWADDIR}"
  echo "CHANNELS: ${CHANNELS}"
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
  echo "Starting supervisor..."
  /usr/bin/supervisord -c /etc/supervisor/supervisord.conf &
  SUPERVISOR_PID=$!
}

## Wait for Xvfb to start with timeout
## Uses X server lock file as the most reliable indicator
wait_for_xvfb()
{
  echo "Waiting for Xvfb to start..."
  local counter=0

  # Check for X server lock file which indicates display :0 is active
  until [ -f /tmp/.X0-lock ]; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $TIMEOUT ]; then
      echo "ERROR: Xvfb failed to start within ${TIMEOUT} seconds"
      echo "Checking supervisor status..."
      supervisorctl status 2>/dev/null || true
      exit 1
    fi
  done

  echo "Xvfb is running (display :0 active)."
}

## Wait for PulseAudio socket with timeout
wait_for_pulseaudio()
{
  echo "Waiting for PulseAudio socket..."
  local counter=0

  until [ -S /tmp/pulseaudio.socket ]; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $TIMEOUT ]; then
      echo "WARNING: PulseAudio socket not found after ${TIMEOUT} seconds, continuing without audio"
      return 1
    fi
  done

  echo "PulseAudio is running."
  return 0
}

## Show PulseAudio logs if socket not available
show_pulseaudio_logs()
{
  echo "PulseAudio socket not available, checking logs..."
  cat /home/twitchandtear/pulseaudio.log 2>/dev/null || echo "No pulseaudio log found"
}

## Launch Zandronum client
launch_zandronum()
{
  local cmd="zandronum -connect ${TARGET_HOST}:${TARGET_PORT}"

  if [ -n "${TARGET_PASSWORD}" ]; then
    cmd="${cmd} +cl_password ${TARGET_PASSWORD}"
  fi

  echo "Launching Zandronum: ${cmd}"
  DISPLAY=':0' DOOMWADDIR="${DOOMWADDIR}" ${cmd} 2>&1 &
  ZANDRONUM_PID=$!
  echo "Zandronum started with PID ${ZANDRONUM_PID}"
}

## Verify Zandronum is still running
verify_zandronum()
{
  sleep 2

  if ! kill -0 ${ZANDRONUM_PID} 2>/dev/null; then
    echo "ERROR: Zandronum exited immediately. Check that WADs are available in ${DOOMWADDIR}"
    ls -la "${DOOMWADDIR}" 2>/dev/null || echo "WAD directory not accessible"
    return 1
  fi

  return 0
}

## Launch OBS Studio
launch_obs()
{
  echo "Launching OBS..."
  DISPLAY=':0' /usr/local/bin/obs.sh 2>&1 &
  OBS_PID=$!
  echo "OBS started with PID ${OBS_PID}"
}

## Launch the TwitchAndTear bot
launch_bot()
{
  echo "Starting TwitchAndTear bot..."
  cd /app
  exec npm start -- "$@"
}

## Run authorization mode
run_auth_mode()
{
  echo "Running in authorization mode..."
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
