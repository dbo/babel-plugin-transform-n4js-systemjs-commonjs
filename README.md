# babel-plugin-transform-n4js-systemjs-commonjs [![Build Status](https://travis-ci.org/dbo/babel-plugin-transform-n4js-systemjs-commonjs.svg?branch=master)](https://travis-ci.org/dbo/babel-plugin-transform-n4js-systemjs-commonjs) [![npm](https://img.shields.io/npm/v/babel-plugin-transform-n4js-systemjs-commonjs.svg)](https://www.npmjs.com/package/babel-plugin-transform-n4js-systemjs-commonjs) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> A babel plugin to transform N4JS SystemJS modules into CommonJS, enabling webpack (via [babel-loader](https://github.com/babel/babel-loader)) or [react-native packager](https://github.com/facebook/react-native/tree/master/packager)).

## Install

```bash
$ npm install babel-plugin-transform-n4js-systemjs-commonjs --save-dev
```

## Usage

Using a `.babelrc`:
```
{
  "plugins": ["transform-n4js-systemjs-commonjs"]
}
```

or via CLI:
```bash
$ babel --plugins transform-n4js-systemjs-commonjs ...
```

Plugin Options:
- `verbose: [string]` switches on verbose logging of the used module IDs
- `stripPackageID_re: [string|Regexp]` regex to rewrite/strip parts of the package ID by convention

## License

MIT © Daniel Bölzle
