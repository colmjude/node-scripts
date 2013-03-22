#!/usr/bin/env node

var fs = require('fs'),
	path = require('path');

// default pattern - regex for The Walking Dead
// var re = /(The).*(Walking).*(Dead).*(S\d+E\d+).*/;
var default_args = 2,
	pattern = "(The).*(Walking).*(Dead).*(S\\d+E\\d+).*",
	re = new RegExp(pattern),
	replacement_base = "$1 $2 $3 - $4.mp4";

// ARGS: each arg becomes part of the regex that is to be kept
if(process.argv.length > default_args) {
	var args = process.argv,
		pattern = "";
	// remove node and script name from args list
	args.splice(0,default_args);
	args.forEach(function(it,ind,arr) {
		pattern += "(" + it + ").*";
	});
	pattern += "(S\\d+E\\d+).*";
	re = new RegExp(pattern);

	replacement_base = "";
	for( var i = 1; i <= args.length; i++ ) {
		replacement_base += "$" + i + " ";
	}
	replacement_base += "- $" + (args.length + 1);
	renameFiles();
} else {
	console.log("WARNING: no args received");
}

function renameFiles() {
	fs.readdir(".", function(err, files){
		if(files.length) {
			files.forEach(function(item, index, arr) {
				var new_name,
					replacement_pattern = replacement_base + path.extname(item);

				new_name = item.replace(re, replacement_pattern);
				if(new_name !== item) {
					fs.rename(item, new_name, function() {
						console.log("SUCCESS: renamed to " + new_name);
					});
				}
			});
		}
	});
}

// things to do
// make it handle other formats e.g 2x04

