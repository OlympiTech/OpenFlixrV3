#!/usr/bin/env node
// requirements
global.argv = "";
global.debugEnabled = "";
const { sudoCheck, dbg } = require("./helpers.js");
const { FATAL } = require("@olympitech/openflixr-logger");
const initialSetup = require("./initialSetup");

// COMMAND LINE HANDLING
var { argv } = require("yargs")
	.scriptName("OpenFlixr V3 Main")
	.usage("Usage: [sudo] of3 [option]")
	.example("of3 --setup")
	.strict(true)
	.version("3.0.0")
	.epilogue("Copywrite Olympitech 2022")
	.option("s", {
		alias: "setup",
		default: false,
		describe: "Inital run and setup of all related packages and software.",
		type: "boolean",
		strict: true
	})
	.option("d", {
		alias: "debug",
		default: false,
		describe: "Enable debug messages for the duration of the session",
		type: "boolean",
		strict: true
	})
	.global("d");

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
			sudoCheck();
			initialSetup();
		} else if (argv.debug === true) {
			global.debugEnabled = true;
		}
	} catch (error) {
		FATAL(error);
	}
}