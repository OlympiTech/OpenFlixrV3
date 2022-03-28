const { DEBUG, FATAL } = require("@olympitech/openflixr-logger");

function isRequired(arg) {
	throw new Error(`${arg} is a required argument`);
}

function dbg (message = isRequired("message to be sent")) {
	// eslint-disable-next-line no-undef
	if (debugEnabled === true) {
		DEBUG(`${message}`);
	}
}

function sudoCheck() {
	// eslint-disable-next-line no-undef
	if (process.env.HOME === "/root") {
		dbg("Root verified. Continuing");
	} else {
		FATAL("Setup must be running in SUDO. Please relaunch 'sudo node /opt/openflixrv3/src/index.js --setup'");
		// eslint-disable-next-line no-undef
		process.exit(1);
	}
}

module.exports = {
	dbg,
	sudoCheck
};