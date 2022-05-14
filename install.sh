#!/usr/bin/env bash

dependancies() {
    echo "Installing dependencies."
    apt-get -y install \
    apt-transport-https \
    git \
    grep \
    sed \
    neofetch \
    sqlite3 > /dev/null 2>&1 || echo "Failed to install dependencies from apt. Seek help from the support server"
}

nodeinst() {
    if [ ! "node --version" ]; then
        apt update
        apt install node npm -y
        npm install n -g
        n install latest
    fi
}

symlink_of3() {
    INSTALL_DIR="/opt/openflixr3"
    # /usr/bin/of3
    if [[ -L "/usr/bin/of3" ]] && [[ "${INSTALL_DIR}/launch.sh" != "$(readlink -f /usr/bin/of3)" ]]; then
        echo "Attempting to remove /usr/bin/of3 symlink."
        rm -f "/usr/bin/of3" || fatal "Failed to remove /usr/bin/of3"
    fi
    if [[ ! -L "/usr/bin/of3" ]]; then
        echo "Creating /usr/bin/of3 symbolic link for OpenFLIXR3."
        ln -s -T "${INSTALL_DIR}/launch.sh" /usr/bin/of3 || fatal "Failed to create /usr/bin/of3 symlink."
    fi

    # /usr/local/bin/of3
    if [[ -L "/usr/local/bin/of3" ]] && [[ "${INSTALL_DIR}/launch.sh" != "$(readlink -f /usr/local/bin/of3)" ]]; then
        echo "Attempting to remove /usr/local/bin/of3 symlink."
        rm -f "/usr/local/bin/of3" || echo "Failed to remove /usr/local/bin/of3"
    fi
    if [[ ! -L "/usr/local/bin/of3" ]]; then
        echo "Creating /usr/local/bin/of3 symbolic link for OpenFLIXR3."
        ln -s -T "${INSTALL_DIR}/launch.sh" /usr/local/bin/of3 || echo "Failed to create /usr/local/bin/of3 symlink."
    fi
}

set_permissions() {
    local CH_PATH=${INSTALL_DIR}
    local CH_PUID=${2:-$DETECTED_PUID}
    local CH_PGID=${3:-$DETECTED_PGID}
    local SCRIPTNAME="$INSTALL_DIR/launch.sh"
    if [[ ${CH_PUID} -ne 0 ]] && [[ ${CH_PGID} -ne 0 ]]; then
        echo "Taking ownership of ${CH_PATH} for user ${CH_PUID} and group ${CH_PGID}"
        chown -R "${CH_PUID}":"${CH_PGID}" "${CH_PATH}" > /dev/null 2>&1 || true
        echo "Setting file and folder permissions in ${CH_PATH}"
        chmod -R a=,a+rX,u+w,g+w "${CH_PATH}" > /dev/null 2>&1 || true
    fi
    echo "Setting executable permission on ${SCRIPTNAME}"
    chmod +x "${SCRIPTNAME}" > /dev/null 2>&1 || fatal "of3 must be executable."
}

# User/Group information
readonly DETECTED_PUID=${SUDO_UID:-$UID}
readonly DETECTED_UNAME=$(id -un "${DETECTED_PUID}" 2> /dev/null || true)
readonly DETECTED_PGID=$(id -g "${DETECTED_PUID}" 2> /dev/null || true)
export DETECTED_PGID
readonly DETECTED_UGROUP=$(id -gn "${DETECTED_PUID}" 2> /dev/null || true)
export DETECTED_UGROUP
#readonly DETECTED_HOMEDIR=$(eval echo "~${DETECTED_UNAME}" 2> /dev/null || true)
INSTALL_DIR="/opt/openflixr3"

main() {
    #cd /opt
    dependancies
    nodeinst
    git clone https://github.com/OlympiTech/OpenFLIXR3 ${INSTALL_DIR}
    symlink_of3
    set_permissions
}
main
