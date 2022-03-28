const { DEBUG } = require("@olympitech/openflixr-logger");

function isRequired(arg) {
	throw new Error(`${arg} is a required argument`);
}

function dbg (message = isRequired("message to be sent")) {
	// eslint-disable-next-line no-undef
	if (debugEnabled === true) {
		DEBUG(`${message}`);
	}
}

//function sudoCheck

module.exports = {dbg};