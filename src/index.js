#!/usr/bin/env node
/* eslint-disable no-constant-condition */
// requirements
global.argv = "";
global.debugEnabled = "";
const { sudoCheck , dbg, antiSudoCheck } = require("./helpers.js");
const { FATAL, INFO } = require("@olympitech/openflixr-logger");
const initialSetup = require("./initialSetup");

// COMMAND LINE HANDLING
var { argv } = require("yargs")
	.scriptName("OpenFlixr V3 Main")
	.usage("Usage: [sudo] of3 [option]")
	.example("of3 --setup")
	.strict(true)
	.version("3.0.0")
	.epilogue("Copywrite Olympitech 2023")
	.option("setup", {
		default: true,
		describe: "Inital run and setup of all related packages and software.",
		group: ("setup", "First Run"),
		type: "boolean",
		strict: true
	})
	.option("debug", {
		default: true,
		describe: "enable debug messages for the duration of the session",
		type: "boolean",
		strict: true
	})
	.option("docker-install", { 
		default: false,
		describe: "Install docker only",
		type: "Boolean",
		group: ("Install", "Docker:"),
		strict: true
	})
	.option("docker-uninstall", { 
		default: false,
		describe: "uninstall docker only",
		type: "Boolean",
		group: ("uninstall", "Docker:"),
		strict: true
	})
	.option("docker-refresh", { 
		default: false,
		describe: "Refresh docker installation only",
		type: "Boolean",
		group: ("Refresh", "Docker:"),
		strict: true
	})
	.global("debug");

// Check for command line arguments before continuing

if (argv.setup === true || argv.debug === true) {
	try {
		if (argv.setup === true) {
			if (argv.debug === true) {
				// eslint-disable-next-line no-undef
				debugEnabled = true;
			}
			dbg("Debugging enabled on first setup.");
			dbg("Performing SUDO check (SUDO required for setup)");
			//sudoCheck();
			initialSetup();
		} else if (argv.debug === true) {
			global.debugEnabled = true;
		}
	} catch (error) {
		FATAL(error);
	}
}

if (!(argv.setup === true)) {
	dbg("No setup parameter found, running anti-sudo");
	antiSudoCheck();
	dbg("Anti-Sudo Passed");
}

if ("argv.docker-install") {
	//
} else if ("argv.docker-uninstall") {
	//
} else if ("argv.docker-refresh") {
	INFO("Refreshing docker images for updates.");
	dbg("This does nothing at this time.");

}