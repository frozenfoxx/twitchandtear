# Base image
FROM ubuntu:20.04

# Information
LABEL maintainer="FrozenFOXX <frozenfoxx@churchoffoxx.net>"

# Variables
WORKDIR /usr/src/app
ENV APPDIR="/usr/src/app" \
  APP_DEPS="libglu1-mesa libgtk2.0 net-tools socat x11vnc xvfb" \
  APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn \
  BUILD_DEPS="curl build-essential git gnupg software-properties-common wget" \
  DEBIAN_FRONTEND=noninteractive \
  DISPLAY=0 \
  DISPLAY_WIDTH=1280 \
  DISPLAY_HEIGHT=720 \
  DOOMWADDIR='/wads' \
  LANG=en_US.UTF-8 \
  LANGUAGE=en_US.UTF-8 \
  LC_ALL=C.UTF-8 \
  NODE_ENV="production" \
  NPM_CONFIG_LOGLEVEL="info" \
  NPM_CONFIG_PREFIX="/home/node/.npm-global" \
  PATH="$PATH:/home/node/.npm-global/bin"

# Upgrade the system
RUN apt-get update && \
    apt-get upgrade -y

# Install packages
RUN apt-get install -y ${BUILD_DEPS} ${APP_DEPS}

# Set up Zandronum
RUN mkdir -p /root/.config/zandronum
COPY config/zandronum.ini /root/.config/zandronum/
COPY scripts/install_zandronum.sh /tmp/
RUN /tmp/install_zandronum.sh

# Set up Node
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
  apt-get install -y nodejs

# Copy app source
COPY ./twitchandtear/ .

# Install packages
RUN npm -g install

# Clean up unnecessary packages
RUN apt-get autoremove --purge -y ${BUILD_DEPS} && \
  rm -rf /var/lib/apt/lists/*

# Launch
ENTRYPOINT [ "node", "index.js" ]
