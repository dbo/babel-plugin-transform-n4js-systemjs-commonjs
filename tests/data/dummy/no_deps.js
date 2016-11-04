(function(System) {
	'use strict';
	System.register([], function($n4Export) {
		var foo;
		foo = function foo() {
			console.log("called foo");
		};
		$n4Export('foo', foo);
		return {
			setters: [],
			execute: function() {}
		};
	});
})(typeof module !== 'undefined' && module.exports ? require('n4js-node/index').System(require, module) : System);
//# sourceMappingURL=dep.map
