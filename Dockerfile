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
    obs-studio \
    pulseaudio \
    supervisor \
    ucspi-tcp \
    x11vnc \
    xdotool \
    xvfb" \
  APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn \
  BUILD_DEPS="curl build-essential git gnupg software-properties-common wget" \
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
  TARGETHOST='localhost' \
  TARGETPORT=10666

# Upgrade the system and install dependencies
RUN add-apt-repository ppa:obsproject/obs-studio && \
  apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y ${BUILD_DEPS} ${APP_DEPS}

# Configure pulseaudio.
COPY config/default.pa client.conf /etc/pulse/

# Configure supervisord.
COPY config/supervisord.conf /etc/supervisor/supervisord.conf

# Install scripts
COPY scripts/ /usr/local/bin/

# Set up Zandronum
RUN mkdir -p /root/.config/zandronum
COPY config/zandronum.ini /root/.config/zandronum/
RUN /usr/local/bin/install_zandronum.sh

# Set up Node
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
  apt-get install -y nodejs

# Copy app source
COPY ./twitchandtear/ .

# Install packages
RUN npm install

# Clean up unnecessary packages
RUN apt-get autoremove --purge -y ${BUILD_DEPS} && \
  rm -rf /var/lib/apt/lists/*

# Set the user to unprivileged
#USER twitchandtear

# Launch
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
