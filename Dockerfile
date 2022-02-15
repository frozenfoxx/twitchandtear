# Base image
FROM ubuntu:20.04

# Information
LABEL maintainer="FrozenFOXX <frozenfoxx@churchoffoxx.net>"

# Variables
WORKDIR /app
ENV APPDIR="/usr/src/app" \
  APP_DEPS="gstreamer1.0-plugins-good \
    gstreamer1.0-pulseaudio \
    gstreamer1.0-tools \
    libglu1-mesa \
    libgtk2.0 \
    net-tools \
    novnc \
    obs-studio \
    pulseaudio \
    supervisor \
    ucspi-tcp \
    websockify \
    x11vnc \
    xdotool \
    xvfb" \
  APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn \
  BUILD_DEPS="curl \
    build-essential \
    git \
    gnupg \
    software-properties-common \
    wget" \
  CHANNELS='' \
  CLIENT_ID=''\
  CLIENT_SECRET='' \
  DEBIAN_FRONTEND=noninteractive \
  DISPLAY=':0' \
  DISPLAY_WIDTH=1280 \
  DISPLAY_HEIGHT=720 \
  DOOMWADDIR='/wads' \
  LANG=en_US.UTF-8 \
  LANGUAGE=en_US.UTF-8 \
  LC_ALL=C.UTF-8 \
  NODE_ENV="production" \
  NPM_CONFIG_LOGLEVEL="info" \
  NPM_CONFIG_PREFIX="/home/node/.npm-global" \
  PATH="${PATH}:/home/node/.npm-global/bin" \
  RCONPASSWORD='' \
  STREAM_KEY='' \
  TARGET_HOST='localhost' \
  TARGET_PORT=10666

# Upgrade the system and install dependencies
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y ${BUILD_DEPS} && \
  add-apt-repository ppa:obsproject/obs-studio && \
  apt-get install -y ${APP_DEPS}

# Set up Node
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
  apt-get install -y nodejs

# Create unprivileged user
RUN useradd --create-home --shell /bin/bash twitchandtear

# Copy user configurations
COPY config/obs/global.ini /home/twitchandtear/.config/obs-studio/global.ini
COPY config/obs/scene.json /home/twitchandtear/.config/obs-studio/basic/scenes/Untitled.json
COPY config/obs/twitch.ini /home/twitchandtear/.config/obs-studio/basic/profiles/Twitch/basic.ini
COPY config/obs/twitch.json /home/twitchandtear/service_template.json
COPY config/zandronum.ini /home/twitchandtear/.config/zandronum/

# Configure pulseaudio
COPY config/pulse/client.conf /etc/pulse/
COPY config/pulse/default.pa /etc/pulse/

# Configure supervisord
COPY config/supervisord.conf /etc/supervisor/supervisord.conf

# Install scripts
COPY scripts/ /usr/local/bin/

# Set up Zandronum
RUN /usr/local/bin/install_zandronum.sh

# Copy app source
COPY ./twitchandtear/ .

# Install Node.js packages
RUN npm install

# Clean up unnecessary packages
RUN apt-get autoremove --purge -y ${BUILD_DEPS} && \
  rm -rf /var/lib/apt/lists/*

# Ensure user permissions
RUN chown -R twitchandtear:twitchandtear /home/twitchandtear

# Set the user to unprivileged
USER twitchandtear

# Launch
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
