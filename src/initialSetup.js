const { dbg } = require("./helpers.js");
const { exec } = require("child_process");
const { INFO, WARN } = require("@olympitech/openflixr-logger");
const { install } = require("./dockerUtils.js");

module.exports = function run() {
	dbg("Initial Setup triggered");
	dockerCheck();
};

function dockerCheck() {
	
	let dockerVersion;
	exec("docker --version", (error, stdout) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		dockerVersion = stdout;
	});

	if (dockerVersion) {
		INFO(`Docker is installed. Version: ${dockerVersion}`);
		return;
	} else {
		WARN("Docker is not installed.");
		dbg("Docker needs to be installed. Progressing to install.");
		install();
	}
}