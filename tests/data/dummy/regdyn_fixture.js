(function (System) {
	System.registerDynamic([], true, function (__require, exports, module) {
		"use strict";

		if (exports) {
			require("bar");
		}

		module.exports = {};
	}, module, "babel-plugin-transform-n4js-systemjs-commonjs/tests/data/dummy/regdyn");
})(require("n4js-node").staticSystem);