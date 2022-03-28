const { INFO, FATAL} = require("@olympitech/openflixr-logger");

const { dbg } = require("./helpers");


module.exports = function run() {
	INFO("Beginning first run of OpenFlixr3");
	dbg("Running version check");
	nodeUpgrade();
	// docker install
	// symlink
	// 
};


function nodeUpgrade () {
	// eslint-disable-next-line no-undef
	const version = process.version;
	if (version <= "v17") {
		FATAL("Node needs to be at the latest version. Please update and try again.");
		// eslint-disable-next-line no-undef
		process.exit();
	} else {
		dbg("Version at latest. Continuing.");
	}
}