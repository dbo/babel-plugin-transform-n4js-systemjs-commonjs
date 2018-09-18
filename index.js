/**
 * babel-plugin-transform-n4js-systemjs-commonjs
 *
 * @license
 * Released under MIT license <https://raw.githubusercontent.com/dbo/babel-plugin-transform-n4js-systemjs-commonjs/master/LICENSE>
 * Copyright (c) Daniel Bölzle
 */

/* eslint-env node */
/* eslint-disable no-console */
"use strict";

const _ = require("lodash");
const lib_path = require("path");
const lib_fs = require("fs");
const cjsDep = /@(@cjs|node)\//;
const cjsStripTrailingIndex = /^([^/]*)\/index$/;

const getParentDirOf = path => {
    let index = path.lastIndexOf(lib_path.sep);
    return index < 0 ? null : path.substring(0, index);
};

const getModuleIdOf = (path, verbose) => {
    const origPath = path;
    for (let dir = getParentDirOf(path); dir; dir = getParentDirOf(dir)) {
        if (lib_fs.existsSync(lib_path.join(dir, "package.json"))) {
            dir = getParentDirOf(dir);
            path = path.substring(dir.length + 1 /* sep */);
            break;
        }
    }
    path = path.split(lib_path.sep).join("/");
    path = path.replace(/\.js$/, "");
    if (verbose) {
        console.log(`[babel-plugin-transform-n4js-systemjs-commonjs] getModuleIdOf(${origPath}) => ${path}`);
    }
    return path;
};

/*
 * This transformation turns
 *
 * - All `System.register` dependencies into `require` calls, so these can be statically analized.
 * - It resolves any @@cjs/@@node prefix targeting a plain node/NPM dependency.
 * - It registers the module as a named module (supported by the n4js-node runtime cjs polyfill).
 * - It rewrites any `System._nodeRequire` calls into plain `require`.
 * - It removes any source reference, since these are currently broken in N4JS.
 */
module.exports = ({types: t}) => {

    const buildDep = (d, stripPackageID_re) => {
        let val = d.value.replace(cjsDep, "");

        if (val !== d.value) {
            let m = val.match(cjsStripTrailingIndex);
            if (m) {
                val = m[1];
            }
            d = t.stringLiteral(val);

        } else if (stripPackageID_re) {
            val = d.value;
            let slash = val.indexOf("/");
            if (slash > 0) {
                let id = val.substring(0, slash);
                let mappedId = id.replace(stripPackageID_re, "");
                if (mappedId !== id) {
                    val = `${mappedId}${val.substring(slash)}`;
                    d = t.stringLiteral(val);
                }
            }
        }

        return d;
    }

    const _nodeRequireVisitor = {
        MemberExpression(path) {
            let expr = path.node;
            if (t.isIdentifier(expr.object, { name: "System" }) &&
                    t.isIdentifier(expr.property, { name: "_nodeRequire" })) {
                path.replaceWith(t.identifier("require"));
            }
        }
    };

    return {
        visitor: {
            Program(path, state) {
                let program = path.node,
                    opts = state.opts || {},
                    verbose = opts.verbose,
                    stripPackageID_re = opts.stripPackageID_re;

                if (stripPackageID_re && !(stripPackageID_re instanceof RegExp)) {
                    stripPackageID_re = new RegExp(stripPackageID_re);
                }

                if (n4jsModulePatternMatcher(program)) {
                    try {
                        const fnExpr = program.body[0].expression;

                        // reduce ternary footer:
                        const consequent = fnExpr.arguments[0].consequent;
                        consequent.callee.object.arguments = [t.stringLiteral("n4js-node")];
                        //consequent.arguments[0] = t.nullLiteral();
                        consequent.callee.property = t.identifier("staticSystem");
                        fnExpr.arguments = [consequent.callee];

                        const sysRegExpr = fnExpr.callee.body.body[0].expression;
                        const sysregDeps = sysRegExpr.arguments[0];
                        sysregDeps.elements = sysregDeps.elements.map(d => t.callExpression(t.identifier("require"), [buildDep(d, stripPackageID_re)]));

                        const dynregCallback = sysRegExpr.arguments[2];
                        if (dynregCallback) { // registerDynamic
                            // Get require symbol out of the way
                            dynregCallback.params[0] = t.identifier("__require");
                        }

                        sysRegExpr.arguments.push(t.identifier("module"));
                        const filename = state.file.opts.filename;
                        if (filename !== "unknown") {
                            sysRegExpr.arguments.push(t.stringLiteral(getModuleIdOf(filename, verbose)));
                        }

                        // replace all System._nodeRequire calls
                        path.traverse(_nodeRequireVisitor);

                    } catch (exc) { // log error, but leave as is
                        console.error(exc);
                    }
                }
            }
        }
    };
};

const n4jsModulePatternMatcher = _.matches({
    sourceType: "module",
    body: [{
        type: "ExpressionStatement",
        expression: {
            type: "CallExpression",
            arguments: [{
                type: "ConditionalExpression",
                consequent: {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        object: {
                            type: "CallExpression",
                            callee: {
                                type: "Identifier",
                                name: "require"
                            },
                            arguments: [{
                                type: "StringLiteral"
//                                value: "n4js-node/index"
                            }]
                        },
                        property: {
                            type: "Identifier",
                            name: "System"
                        }
                    },
                    arguments: [{
                        type: "Identifier",
                        name: "require"
                    }, {
                        type: "Identifier",
                        name: "module"
                    }]
                }
            }]
        }
    }]
});
