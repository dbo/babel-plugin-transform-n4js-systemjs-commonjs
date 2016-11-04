(function(System) {
	'use strict';
	System.register([
		'@@cjs/foo',
		'@@cjs/foo/index',
		'@@cjs/foo/bar',
		'@@cjs/foo/bar/baz',
		'@@cjs/foo/bar/baz/index',
		'@node/repl',
		'dummy.api/foo',
		'dummy.api/foo/index',
		'dummy/foo/bar',
		'dummy/foo/bar/baz',
		'dummy/foo/bar/baz/index'
	], function($n4Export) {
		var foo;
		System._nodeRequire("bar")
		return {
			setters: [
				function($_import_dummy_dep) {
					foo = $_import_dummy_dep.foo;
				}
			],
			execute: function() {
				foo();
			}
		};
	});
})(typeof module !== 'undefined' && module.exports ? require('n4js-node/index').System(require, module) : System);
//# sourceMappingURL=with_deps.map
