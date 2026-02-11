#!/usr/bin/env bash

# Install Zandronum from official binary tarball

# Variables
ZANDRONUM_VERSION=${ZANDRONUM_VERSION:-'3.2.1'}
ZANDRONUM_URL=${ZANDRONUM_URL:-"https://zandronum.com/downloads/zandronum${ZANDRONUM_VERSION}-linux-x86_64.tar.bz2"}
FMOD_URL=${FMOD_URL:-'https://zandronum.com/essentials/fmod/fmodapi44464linux.tar.gz'}
INSTALL_DIR=${INSTALL_DIR:-'/opt/zandronum'}

# Functions

## Display usage information
usage()
{
  echo "Usage: [Environment Variables] install_zandronum.sh [options]"
  echo "  Environment Variables:"
  echo "    ZANDRONUM_VERSION     version to install (default: '3.2.1')"
  echo "    ZANDRONUM_URL         download URL (default: auto-generated from version)"
  echo "    INSTALL_DIR           installation directory (default: '/opt/zandronum')"
}

## Install FMOD audio library (required by Zandronum)
install_fmod()
{
  echo "Downloading FMOD audio library..."
  wget -q -O /tmp/fmod.tar.gz "${FMOD_URL}"
  tar -xzf /tmp/fmod.tar.gz -C /tmp

  # Install the 64-bit FMOD library to system lib directory
  cp /tmp/fmodapi44464linux/api/lib/libfmodex64-4.44.64.so /usr/lib/
  ldconfig

  rm -rf /tmp/fmod.tar.gz /tmp/fmodapi44464linux
  echo "FMOD audio library installed"
}

## Install Zandronum
install_zandronum()
{
  echo "Downloading Zandronum ${ZANDRONUM_VERSION}..."
  mkdir -p "${INSTALL_DIR}"
  wget -q -O /tmp/zandronum.tar.bz2 "${ZANDRONUM_URL}"
  tar -xjf /tmp/zandronum.tar.bz2 -C "${INSTALL_DIR}" --strip-components=0
  rm -f /tmp/zandronum.tar.bz2

  # Create symlink so zandronum is in PATH
  ln -sf "${INSTALL_DIR}/zandronum" /usr/local/bin/zandronum
  ln -sf "${INSTALL_DIR}/zandronum.pk3" /usr/local/share/zandronum.pk3

  echo "Zandronum ${ZANDRONUM_VERSION} installed to ${INSTALL_DIR}"
}

# Logic

## Argument parsing
while [[ "$1" != "" ]]; do
  case $1 in
    -h | --help ) usage
                  exit 0
                  ;;
    * )           usage
                  exit 1
                  ;;
  esac
  shift
done

install_fmod
install_zandronum
