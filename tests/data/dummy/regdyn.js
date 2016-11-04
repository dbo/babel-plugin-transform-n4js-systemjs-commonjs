(function(System) {
	System.registerDynamic([], true, function(require, exports, module) {
		"use strict";

		if (exports) {
			System._nodeRequire("bar");
		}

		module.exports = {
		};
	});
})(typeof module !== 'undefined' && module.exports ? require('n4js-node/index').System(require, module) : System);
