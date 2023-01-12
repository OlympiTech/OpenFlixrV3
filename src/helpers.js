const { DEBUG, FATAL, WARN } = require("@olympitech/openflixr-logger");
const { exec } = require("child_process");

function isRequired(arg) {
	throw new Error(`${arg} is a required argument`);
}

function dbg(message = isRequired("message to be sent")) { // eslint-disable-next-line no-undef
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

function runcmd(command = isRequired("Command to be run")) {
	exec(command, (error, stdout) => {
		if (error) {
			WARN(`exec error: ${error}`);
			return;
		} else {
			dbg(stdout);
		}
	});
}

function packageCheck(package = isRequired("Package to be checked for")) {
	return new Promise((resolve) => {
		exec(`which "${package}"`, (error, stdout) => {
			if (error) {
				resolve(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

module.exports = {
	dbg,
	sudoCheck,
	antiSudoCheck,
	runcmd,
	packageCheck
};
