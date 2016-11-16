(function (System) {
	'use strict';

	System.register([], function ($n4Export) {
		var foo;
		foo = function foo() {
			console.log("called foo");
		};
		$n4Export('foo', foo);
		return {
			setters: [],
			execute: function () {}
		};
	}, module, 'babel-plugin-transform-n4js-systemjs-commonjs/tests/data/dummy/no_deps');
})(require('n4js-node').staticSystem);
//--# sourceMappingURL=dep.map--