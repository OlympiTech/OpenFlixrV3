const { dbg, packageCheck } = require("./helpers.js");
const { exec } = require("child_process");
const { INFO, WARN } = require("@olympitech/openflixr-logger");
const { install } = require("./dockerUtils.js");

module.exports = function run() {
	dbg("Initial Setup triggered");
	packageCheck("docker").then((res) => {
		if ((res.code == "1")) {
			if (res.message.indexOf("failed") > -1) {
				dbg("Docker not found, installing");
				install();
			}
		} else {
			dbg("Docker installed");
		}
	});
};
