# Base image
FROM node:current-alpine3.13

# Information
LABEL maintainer="FrozenFOXX <frozenfoxx@churchoffoxx.net>"

# Variables
WORKDIR /usr/src/app
ENV APPDIR="/usr/src/app" \
  NODE_ENV="production" \
  NPM_CONFIG_LOGLEVEL="info" \
  NPM_CONFIG_PREFIX="/home/node/.npm-global" \
  PATH="$PATH:/home/node/.npm-global/bin"

# Copy app source
COPY . .

# Install packages
RUN npm install

# Expose listen port
EXPOSE 8888

# Launch
ENTRYPOINT [ "node", "index.js" ]
