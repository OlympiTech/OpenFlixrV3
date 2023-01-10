const { WARN, FATAL } = require("@olympitech/openflixr-logger");
const { exec } = require("child_process");
const { dbg } = require("./helpers");
const fs = require("fs");

function install() {
	dbg("Docker install started");
	dbg("Setting up Dockers Package Repository");
	dAptReqs();
	dKeyRings();
	dAptAddRepo();
	// check if docker package exists. remove if so, install if not.
	// let dpackage
	
}

function dAptReqs() {
	exec("apt-get install -y ca-certificates curl gnupg lsb-release", (error, stdout) => {
		if (error) {
			WARN(`exec error: ${error}`);
			return;
		} else {
			dbg(stdout);
		}
	});
}

function dKeyRings() {
	if (fs.existsSync("/etc/apt/keyrings")) {
		dbg("Folder exists. Continuing.");
	} else {
		exec("sudo mkdir -p /etc/apt/keyrings", (error, stdout) => {
			if (error) {
				WARN(`exec error: ${error}`);
				return;
			} else {
				dbg(stdout);
			}
		});
	}
	// eslint-disable-next-line no-unused-vars
	if (fs.existsSync("/etc/apt/keyrings/docker.gpg")) {
		fs.unlink("/etc/apt/keyrings/docker.gpg", (err) => {
			if (err) {
				FATAL(err);
			} else {
				dbg("File was deleted");
				exec("curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg", (error, stdout) => {
					if (error) {
						WARN(`exec error: ${error}`);
						return;
					} else {
						dbg(stdout);
					}
				});
			}
		});
	} else {
		dbg("File didnt exist. Continuing");
		exec("curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg", (error, stdout) => {
			if (error) {
				WARN(`exec error: ${error}`);
				return;
			} else {
				dbg(stdout);
			}
		});
	}
}

function dAptAddRepo() {
	let file;
	file = "/etc/apt/sources.list.d/docker.list";
	if (fs.existsSync(file)) {
		fs.unlinkSync(file, (err) => {
			if (err) {
				FATAL(err);
			} else {
				dbg("File was deleted");
			}
		});
	} else {
		exec(`echo deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`, (error, stdout) => {
			if (error) {
				WARN(`exec error: ${error}`);
				return;
			} else {
				dbg(stdout);
			}
		});
	}
}

module.exports = { install };