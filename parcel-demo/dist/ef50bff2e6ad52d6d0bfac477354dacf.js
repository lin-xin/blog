// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require === "function" && require;

    function newRequire(name, jumped, ModuleConfig) {
        if (!cache[name]) {
            if (!modules[name]) {
                // if we cannot find the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof require === "function" && require;
                if (!jumped && currentRequire) {
                    return currentRequire(name, true);
                }

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) {
                    return previousRequire(name, true);
                }

                var err = new Error('Cannot find module \'' + name + '\'');
                err.code = 'MODULE_NOT_FOUND';
                throw err;
            }

            function localRequire(x) {
                return newRequire(localRequire.resolve(x));
            }

            localRequire.resolve = function (x) {
                return modules[name][1][x] || x;
            };

            var module = cache[name] = new newRequire.Module(ModuleConfig);
            modules[name][0].call(module.exports, localRequire, module, module.exports);
        }

        return cache[name].exports;
    }

    function Module() {
        this.bundle = newRequire;
        this.exports = {};
    }

    newRequire.Module = Module;
    newRequire.modules = modules;
    newRequire.cache = cache;
    newRequire.parent = previousRequire;

    for (var i = 0; i < entry.length; i++) {
        newRequire(entry[i]);
    }

    // Override the current require with this new one
    return newRequire;
})({4:[function(require,module,exports) {
"use strict";

function showName(name) {
  document.getElementById('ts-app').innerHTML = 'Hello ' + name.value;
}
showName({ value: 'TypeScript' });
},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(config) {
    OldModule.call(this);
    this.hot = {
        accept: function (fn) {
            this._acceptCallback = fn || function () { };
        },
        dispose: function (fn) {
            this._disposeCallback = fn;
        },
        data: config && config.hot
    };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
    var ws = new WebSocket('ws://localhost:59040/');
    ws.onmessage = (e) => {
        var data = JSON.parse(e.data);

        if (data.type === 'update') {
            for (let asset of data.assets) {
                hmrApply(global.require, asset);
            }

            for (let asset of data.assets) {
                if (!asset.isNew) {
                    hmrAccept(global.require, asset.id);
                }
            }
        }

        if (data.type === 'error-resolved') {
            console.log('[parcel] ✨ Error resolved');
        }

        if (data.type === 'error') {
            console.error(`[parcel] 🚨 ${data.error.message}\n${data.error.stack}`);
        }
    };
}

function getParents(bundle, id) {
    var modules = bundle.modules;
    if (!modules) {
        return [];
    }

    let parents = [];
    for (let k in modules) {
        for (let d in modules[k][1]) {
            let dep = modules[k][1][d];
            if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
                parents.push(+k);
            }
        }
    }

    if (bundle.parent) {
        parents = parents.concat(getParents(bundle.parent, id));
    }

    return parents;
}

function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) {
        return;
    }

    if (modules[asset.id] || !bundle.parent) {
        let fn = new Function('require', 'module', 'exports', asset.generated.js);
        asset.isNew = !modules[asset.id];
        modules[asset.id] = [fn, asset.deps];
    } else if (bundle.parent) {
        hmrApply(bundle.parent, asset);
    }
}

function hmrAccept(bundle, id) {
    var modules = bundle.modules;
    if (!modules) {
        return;
    }

    if (!modules[id] && bundle.parent) {
        return hmrAccept(bundle.parent, id);
    }

    let cached = bundle.cache[id];
    if (cached && cached.hot._disposeCallback) {
        cached.hot._disposeCallback();
    }

    delete bundle.cache[id];
    bundle(id, undefined, {
        hot: true
    });

    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallback) {
        cached.hot._acceptCallback();
        return true;
    }

    return getParents(global.require, id).some(id => hmrAccept(global.require, id));
}
},{}]},{},[0,4])