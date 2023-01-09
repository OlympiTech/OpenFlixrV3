const { DEBUG, FATAL } = require("@olympitech/openflixr-logger");


function isRequired(arg) {
	throw new Error(`${arg} is a required argument`);
}

function dbg(message = isRequired("message to be sent")) {
	// eslint-disable-next-line no-undef
	if (debugEnabled === true) {
		DEBUG(`${message}`);
	}
}

function sudoCheck() {
	if (!(process.env.SUDO_USER)) {
		FATAL("Sudo is required for this function. Please relaunch with SUDO");
		process.exit();
	}
}

function antiSudoCheck() {
	if (process.env.SUDO_USER) {
		FATAL("Sudo elevation found where none required. Please rerun without SUDO");
		process.exit();
	}
}

module.exports = { dbg, sudoCheck, antiSudoCheck };