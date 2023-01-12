const {FATAL, TRACE} = require("@olympitech/openflixr-logger");
const {dbg, runcmd, packageCheck} = require("./helpers");
const fs = require("fs");

function install() {
	dbg("Docker install started");
	dbg("Checking for docker installation");
	packageCheck("docker").then((res) => {
		if (!res) {
			TRACE("Package not found.");
			dbg("Setting up Dockers Package Repository");
			dAptReqs();
			dKeyRings();
			dAptAddRepo();
			dAptInstall();
		} else {
			daptremove();
			dAptInstall();
		}
	});
}

function dAptReqs() {
	runcmd("apt udpate");
	runcmd("apt-get install -y ca-certificates curl gnupg lsb-release");
}

function dKeyRings() {
	if (fs.existsSync("/etc/apt/keyrings")) {
		dbg("Folder exists. Continuing.");
	} else {
		runcmd("sudo mkdir -p /etc/apt/keyrings");
	}
	// eslint-disable-next-line no-unused-vars
	if (fs.existsSync("/etc/apt/keyrings/docker.gpg")) {
		fs.unlink("/etc/apt/keyrings/docker.gpg", (err) => {
			if (err) {
				FATAL(err);
			} else {
				dbg("File was deleted");
				runcmd("curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg && chmod a+r /etc/apt/keyrings/docker.gpg");
			}
		});
	} else {
		dbg("File didnt exist. Continuing");
		runcmd("curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg && chmod a+r /etc/apt/keyrings/docker.gpg");
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
				runcmd("echo deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null");
			}
		});
	} else {
		runcmd("echo deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null");
	}
}

function dAptInstall() {
	runcmd("apt update");
	runcmd("apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin");
}

function daptremove() {
	runcmd("apt update");
	runcmd("apt-get remove -y docker-ce docker-ce-cli containerd.io docker-compose-plugin");
}

module.exports = {
	install
};
