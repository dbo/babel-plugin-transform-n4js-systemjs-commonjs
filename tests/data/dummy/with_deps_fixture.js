(function (System) {
	'use strict';

	System.register([require('foo'), require('foo'), require('foo/bar'), require('foo/bar/baz'), require('foo/bar/baz/index'), require('repl'), require('dummy/foo'), require('dummy/foo/index'), require('dummy/foo/bar'), require('dummy/foo/bar/baz'), require('dummy/foo/bar/baz/index')], function ($n4Export) {
		var foo;
		require("bar");
		return {
			setters: [function ($_import_dummy_dep) {
				foo = $_import_dummy_dep.foo;
			}],
			execute: function () {
				foo();
			}
		};
	}, module, 'babel-plugin-transform-n4js-systemjs-commonjs/tests/data/dummy/with_deps');
})(require('n4js-node').System);
//--# sourceMappingURL=with_deps.map--