/* eslint-env node, mocha */
/* eslint-disable no-console */
"use strict";

const lib_path = require("path");
const lib_fs = require("fs");
const assert = require("assert");
const babel = require("@babel/core");

const path = p => lib_path.resolve(__dirname, ...p.split("/"));
const read = p => String(lib_fs.readFileSync(path(p)));

const babelOptions = {
    plugins: [[path("../index.js"), {
        //verbose: true,
        stripPackageID_re: "\\.api$"
    }]]
};

const fixtureTest = p => {
    const res = babel.transformFileSync(path(`${p}.js`), babelOptions).code;
    //console.log(res, read(`${p}_fixture.js`));
    assert.equal(res, read(`${p}_fixture.js`), "should be the same output");
};

describe("N4JS SystemJS -> CommonJS", () => {
    it("transforms System.register without dependencies", () => fixtureTest("data/dummy/no_deps"));
    it("transforms System.register with dependencies", () => fixtureTest("data/dummy/with_deps"));
    it("transforms System.registerDynamic", () => fixtureTest("data/dummy/regdyn"));

    it("keeps non-N4JS modules as is", () => {
        const pluginCode = read("../index.js");
        const expected = babel.transformSync(pluginCode).code;
        const res = babel.transformSync(pluginCode, babelOptions).code;
        assert.equal(res, expected, "should be the same output");
    });
});
