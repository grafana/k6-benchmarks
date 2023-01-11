(function(e, a) {
    for (var i in a) e[i] = a[i];
})(exports, function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.r = function(exports) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            });
        }
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    };
    __webpack_require__.t = function(value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value
        });
        if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 35);
}([ function(module, exports, __webpack_require__) {
    (function(global) {
        var check = function(it) {
            return it && it.Math == Math && it;
        };
        module.exports = check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof global == "object" && global) || Function("return this")();
    }).call(this, __webpack_require__(37));
}, function(module, exports) {
    module.exports = function(exec) {
        try {
            return !!exec();
        } catch (error) {
            return true;
        }
    };
}, function(module, exports) {
    module.exports = require("k6");
}, function(module, exports) {
    var hasOwnProperty = {}.hasOwnProperty;
    module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
    };
}, function(module, exports, __webpack_require__) {
    var fails = __webpack_require__(1);
    module.exports = !fails(function() {
        return Object.defineProperty({}, 1, {
            get: function() {
                return 7;
            }
        })[1] != 7;
    });
}, function(module, exports) {
    module.exports = function(it) {
        return typeof it === "object" ? it !== null : typeof it === "function";
    };
}, function(module, exports) {
    module.exports = require("k6/http");
}, function(module, exports, __webpack_require__) {
    var DESCRIPTORS = __webpack_require__(4);
    var IE8_DOM_DEFINE = __webpack_require__(20);
    var anObject = __webpack_require__(14);
    var toPrimitive = __webpack_require__(13);
    var nativeDefineProperty = Object.defineProperty;
    exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (IE8_DOM_DEFINE) try {
            return nativeDefineProperty(O, P, Attributes);
        } catch (error) {}
        if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var getOwnPropertyDescriptor = __webpack_require__(18).f;
    var createNonEnumerableProperty = __webpack_require__(10);
    var redefine = __webpack_require__(42);
    var setGlobal = __webpack_require__(15);
    var copyConstructorProperties = __webpack_require__(47);
    var isForced = __webpack_require__(52);
    module.exports = function(options, source) {
        var TARGET = options.target;
        var GLOBAL = options.global;
        var STATIC = options.stat;
        var FORCED, target, key, targetProperty, sourceProperty, descriptor;
        if (GLOBAL) {
            target = global;
        } else if (STATIC) {
            target = global[TARGET] || setGlobal(TARGET, {});
        } else {
            target = (global[TARGET] || {}).prototype;
        }
        if (target) for (key in source) {
            sourceProperty = source[key];
            if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor(target, key);
                targetProperty = descriptor && descriptor.value;
            } else targetProperty = target[key];
            FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
            if (!FORCED && targetProperty !== undefined) {
                if (typeof sourceProperty === typeof targetProperty) continue;
                copyConstructorProperties(sourceProperty, targetProperty);
            }
            if (options.sham || targetProperty && targetProperty.sham) {
                createNonEnumerableProperty(sourceProperty, "sham", true);
            }
            redefine(target, key, sourceProperty, options);
        }
    };
}, function(module, exports, __webpack_require__) {
    var IndexedObject = __webpack_require__(39);
    var requireObjectCoercible = __webpack_require__(40);
    module.exports = function(it) {
        return IndexedObject(requireObjectCoercible(it));
    };
}, function(module, exports, __webpack_require__) {
    var DESCRIPTORS = __webpack_require__(4);
    var definePropertyModule = __webpack_require__(7);
    var createPropertyDescriptor = __webpack_require__(12);
    module.exports = DESCRIPTORS ? function(object, key, value) {
        return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
    } : function(object, key, value) {
        object[key] = value;
        return object;
    };
}, function(module, exports) {
    module.exports = require("k6/metrics");
}, function(module, exports) {
    module.exports = function(bitmap, value) {
        return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
        };
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(5);
    module.exports = function(input, PREFERRED_STRING) {
        if (!isObject(input)) return input;
        var fn, val;
        if (PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject(val = fn.call(input))) return val;
        if (typeof (fn = input.valueOf) == "function" && !isObject(val = fn.call(input))) return val;
        if (!PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject(val = fn.call(input))) return val;
        throw TypeError("Can't convert object to primitive value");
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(5);
    module.exports = function(it) {
        if (!isObject(it)) {
            throw TypeError(String(it) + " is not an object");
        }
        return it;
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var createNonEnumerableProperty = __webpack_require__(10);
    module.exports = function(key, value) {
        try {
            createNonEnumerableProperty(global, key, value);
        } catch (error) {
            global[key] = value;
        }
        return value;
    };
}, function(module, exports) {
    var id = 0;
    var postfix = Math.random();
    module.exports = function(key) {
        return "Symbol(" + String(key === undefined ? "" : key) + ")_" + (++id + postfix).toString(36);
    };
}, function(module, exports) {
    module.exports = {};
}, function(module, exports, __webpack_require__) {
    var DESCRIPTORS = __webpack_require__(4);
    var propertyIsEnumerableModule = __webpack_require__(38);
    var createPropertyDescriptor = __webpack_require__(12);
    var toIndexedObject = __webpack_require__(9);
    var toPrimitive = __webpack_require__(13);
    var has = __webpack_require__(3);
    var IE8_DOM_DEFINE = __webpack_require__(20);
    var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPrimitive(P, true);
        if (IE8_DOM_DEFINE) try {
            return nativeGetOwnPropertyDescriptor(O, P);
        } catch (error) {}
        if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
    };
}, function(module, exports) {
    var toString = {}.toString;
    module.exports = function(it) {
        return toString.call(it).slice(8, -1);
    };
}, function(module, exports, __webpack_require__) {
    var DESCRIPTORS = __webpack_require__(4);
    var fails = __webpack_require__(1);
    var createElement = __webpack_require__(41);
    module.exports = !DESCRIPTORS && !fails(function() {
        return Object.defineProperty(createElement("div"), "a", {
            get: function() {
                return 7;
            }
        }).a != 7;
    });
}, function(module, exports, __webpack_require__) {
    var store = __webpack_require__(22);
    var functionToString = Function.toString;
    if (typeof store.inspectSource != "function") {
        store.inspectSource = function(it) {
            return functionToString.call(it);
        };
    }
    module.exports = store.inspectSource;
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var setGlobal = __webpack_require__(15);
    var SHARED = "__core-js_shared__";
    var store = global[SHARED] || setGlobal(SHARED, {});
    module.exports = store;
}, function(module, exports, __webpack_require__) {
    var IS_PURE = __webpack_require__(46);
    var store = __webpack_require__(22);
    (module.exports = function(key, value) {
        return store[key] || (store[key] = value !== undefined ? value : {});
    })("versions", []).push({
        version: "3.6.5",
        mode: IS_PURE ? "pure" : "global",
        copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
    });
}, function(module, exports, __webpack_require__) {
    var path = __webpack_require__(49);
    var global = __webpack_require__(0);
    var aFunction = function(variable) {
        return typeof variable == "function" ? variable : undefined;
    };
    module.exports = function(namespace, method) {
        return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace]) : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
    };
}, function(module, exports, __webpack_require__) {
    var has = __webpack_require__(3);
    var toIndexedObject = __webpack_require__(9);
    var indexOf = __webpack_require__(26).indexOf;
    var hiddenKeys = __webpack_require__(17);
    module.exports = function(object, names) {
        var O = toIndexedObject(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
        while (names.length > i) if (has(O, key = names[i++])) {
            ~indexOf(result, key) || result.push(key);
        }
        return result;
    };
}, function(module, exports, __webpack_require__) {
    var toIndexedObject = __webpack_require__(9);
    var toLength = __webpack_require__(27);
    var toAbsoluteIndex = __webpack_require__(29);
    var createMethod = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
            var O = toIndexedObject($this);
            var length = toLength(O.length);
            var index = toAbsoluteIndex(fromIndex, length);
            var value;
            if (IS_INCLUDES && el != el) while (length > index) {
                value = O[index++];
                if (value != value) return true;
            } else for (;length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
            }
            return !IS_INCLUDES && -1;
        };
    };
    module.exports = {
        includes: createMethod(true),
        indexOf: createMethod(false)
    };
}, function(module, exports, __webpack_require__) {
    var toInteger = __webpack_require__(28);
    var min = Math.min;
    module.exports = function(argument) {
        return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
    };
}, function(module, exports) {
    var ceil = Math.ceil;
    var floor = Math.floor;
    module.exports = function(argument) {
        return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
    };
}, function(module, exports, __webpack_require__) {
    var toInteger = __webpack_require__(28);
    var max = Math.max;
    var min = Math.min;
    module.exports = function(index, length) {
        var integer = toInteger(index);
        return integer < 0 ? max(integer + length, 0) : min(integer, length);
    };
}, function(module, exports) {
    module.exports = [ "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf" ];
}, function(module, exports, __webpack_require__) {
    var DESCRIPTORS = __webpack_require__(4);
    var fails = __webpack_require__(1);
    var has = __webpack_require__(3);
    var defineProperty = Object.defineProperty;
    var cache = {};
    var thrower = function(it) {
        throw it;
    };
    module.exports = function(METHOD_NAME, options) {
        if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
        if (!options) options = {};
        var method = [][METHOD_NAME];
        var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false;
        var argument0 = has(options, 0) ? options[0] : thrower;
        var argument1 = has(options, 1) ? options[1] : undefined;
        return cache[METHOD_NAME] = !!method && !fails(function() {
            if (ACCESSORS && !DESCRIPTORS) return true;
            var O = {
                length: -1
            };
            if (ACCESSORS) defineProperty(O, 1, {
                enumerable: true,
                get: thrower
            }); else O[1] = 1;
            method.call(O, argument0, argument1);
        });
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var shared = __webpack_require__(23);
    var has = __webpack_require__(3);
    var uid = __webpack_require__(16);
    var NATIVE_SYMBOL = __webpack_require__(33);
    var USE_SYMBOL_AS_UID = __webpack_require__(57);
    var WellKnownSymbolsStore = shared("wks");
    var Symbol = global.Symbol;
    var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;
    module.exports = function(name) {
        if (!has(WellKnownSymbolsStore, name)) {
            if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name]; else WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name);
        }
        return WellKnownSymbolsStore[name];
    };
}, function(module, exports, __webpack_require__) {
    var fails = __webpack_require__(1);
    module.exports = !!Object.getOwnPropertySymbols && !fails(function() {
        return !String(Symbol());
    });
}, function(module, exports, __webpack_require__) {
    var fails = __webpack_require__(1);
    module.exports = !fails(function() {
        return Object.isExtensible(Object.preventExtensions({}));
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, "options", function() {
        return options;
    });
    var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36);
    var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_0__);
    var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54);
    var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1__);
    var core_js_modules_es_object_define_properties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(61);
    var core_js_modules_es_object_define_properties__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(core_js_modules_es_object_define_properties__WEBPACK_IMPORTED_MODULE_2__);
    var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(64);
    var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_3__);
    var k6_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
    var k6_http__WEBPACK_IMPORTED_MODULE_4___default = __webpack_require__.n(k6_http__WEBPACK_IMPORTED_MODULE_4__);
    var k6__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2);
    var k6__WEBPACK_IMPORTED_MODULE_5___default = __webpack_require__.n(k6__WEBPACK_IMPORTED_MODULE_5__);
    var k6_metrics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11);
    var k6_metrics__WEBPACK_IMPORTED_MODULE_6___default = __webpack_require__.n(k6_metrics__WEBPACK_IMPORTED_MODULE_6__);
    function _templateObject() {
        var data = _taggedTemplateLiteral([ "http://test.k6.io/?ts=", "" ]);
        _templateObject = function _templateObject() {
            return data;
        };
        return data;
    }
    function _taggedTemplateLiteral(strings, raw) {
        if (!raw) {
            raw = strings.slice(0);
        }
        return Object.freeze(Object.defineProperties(strings, {
            raw: {
                value: Object.freeze(raw)
            }
        }));
    }
    var successfulLogins = new k6_metrics__WEBPACK_IMPORTED_MODULE_6__["Counter"]("successful_logins");
    var checkFailureRate = new k6_metrics__WEBPACK_IMPORTED_MODULE_6__["Rate"]("check_failure_rate");
    var timeToFirstByte = new k6_metrics__WEBPACK_IMPORTED_MODULE_6__["Trend"]("time_to_first_byte", true);
    var options = {
        thresholds: {
            http_req_duration: [ "p(95)<500" ],
            "http_req_duration{staticAsset:yes}": [ "p(95)<100" ],
            check_failure_rate: [ "rate<0.3" ]
        },
        ext: {
            loadimpact: {
                name: "".concat(__ENV.TEST_NAME) || "AWS EC2 Hardware Testing",
                projectID: 3478725
            }
        }
    };
    function randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var loginData = {
        users: [ {
            username: "admin",
            password: "123"
        }, {
            username: "test",
            password: "1234"
        }, {
            username: "invaliduser",
            password: "password"
        } ]
    };
    __webpack_exports__["default"] = function() {
        Object(k6__WEBPACK_IMPORTED_MODULE_5__["group"])("Front page", function() {
            var res = k6_http__WEBPACK_IMPORTED_MODULE_4___default.a.get(k6_http__WEBPACK_IMPORTED_MODULE_4___default.a.url(_templateObject(), Math.round(randomIntBetween(1, 2e3))), {
                tags: {
                    name: "http://test.k6.io/?ts=*"
                }
            });
            var checkRes = Object(k6__WEBPACK_IMPORTED_MODULE_5__["check"])(res, {
                "Homepage body size is 11026 bytes": function HomepageBodySizeIs11026Bytes(r) {
                    return r.status === 200 && r.body.length === 11026;
                },
                "Homepage welcome header present": function HomepageWelcomeHeaderPresent(r) {
                    return r.status === 200 && r.body.indexOf("Welcome to the k6.io demo site!") !== -1;
                }
            });
            checkFailureRate.add(!checkRes);
            timeToFirstByte.add(res.timings.waiting, {
                ttfbURL: res.url
            });
            Object(k6__WEBPACK_IMPORTED_MODULE_5__["group"])("Static assets", function() {
                var res = k6_http__WEBPACK_IMPORTED_MODULE_4___default.a.batch([ [ "GET", "http://test.k6.io/static/css/site.css", {}, {
                    tags: {
                        staticAsset: "yes"
                    }
                } ], [ "GET", "http://test.k6.io/static/js/prisms.js", {}, {
                    tags: {
                        staticAsset: "yes"
                    }
                } ] ]);
                checkRes = Object(k6__WEBPACK_IMPORTED_MODULE_5__["check"])(res[0], {
                    "Is stylesheet 4859 bytes?": function IsStylesheet4859Bytes(r) {
                        return r.status === 200 && r.body.length === 4859;
                    }
                });
                checkFailureRate.add(!checkRes);
                timeToFirstByte.add(res[0].timings.waiting, {
                    ttfbURL: res[0].url,
                    staticAsset: "yes"
                });
                timeToFirstByte.add(res[1].timings.waiting, {
                    ttfbURL: res[1].url,
                    staticAsset: "yes"
                });
            });
        });
        Object(k6__WEBPACK_IMPORTED_MODULE_5__["sleep"])(5);
        Object(k6__WEBPACK_IMPORTED_MODULE_5__["group"])("Login", function() {
            var res = k6_http__WEBPACK_IMPORTED_MODULE_4___default.a.get("http://test.k6.io/my_messages.php");
            var checkRes = Object(k6__WEBPACK_IMPORTED_MODULE_5__["check"])(res, {
                "Users should not be auth'd. Is unauthorized header present?": function UsersShouldNotBeAuthDIsUnauthorizedHeaderPresent(r) {
                    return r.status === 200 && r.body.indexOf("Unauthorized") !== -1;
                }
            });
            checkFailureRate.add(!checkRes);
            var position = Math.floor(Math.random() * loginData.users.length);
            var credentials = loginData.users[position];
            res = k6_http__WEBPACK_IMPORTED_MODULE_4___default.a.post("http://test.k6.io/login.php", {
                login: credentials.username,
                password: credentials.password,
                redir: "1"
            });
            checkRes = Object(k6__WEBPACK_IMPORTED_MODULE_5__["check"])(res, {
                "is logged in welcome header present": function isLoggedInWelcomeHeaderPresent(r) {
                    return r.status === 200 && r.body.indexOf("Welcome, admin!") !== -1;
                }
            });
            if (checkRes) {
                successfulLogins.add(1);
            }
            checkFailureRate.add(!checkRes, {
                page: "login"
            });
            timeToFirstByte.add(res.timings.waiting, {
                ttfbURL: res.url
            });
        });
        Object(k6__WEBPACK_IMPORTED_MODULE_5__["sleep"])(5);
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var $ = __webpack_require__(8);
    var $indexOf = __webpack_require__(26).indexOf;
    var arrayMethodIsStrict = __webpack_require__(53);
    var arrayMethodUsesToLength = __webpack_require__(31);
    var nativeIndexOf = [].indexOf;
    var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [ 1 ].indexOf(1, -0) < 0;
    var STRICT_METHOD = arrayMethodIsStrict("indexOf");
    var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", {
        ACCESSORS: true,
        1: 0
    });
    $({
        target: "Array",
        proto: true,
        forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH
    }, {
        indexOf: function indexOf(searchElement) {
            return NEGATIVE_ZERO ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
        }
    });
}, function(module, exports) {
    var g;
    g = function() {
        return this;
    }();
    try {
        g = g || new Function("return this")();
    } catch (e) {
        if (typeof window === "object") g = window;
    }
    module.exports = g;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
        1: 2
    }, 1);
    exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
    } : nativePropertyIsEnumerable;
}, function(module, exports, __webpack_require__) {
    var fails = __webpack_require__(1);
    var classof = __webpack_require__(19);
    var split = "".split;
    module.exports = fails(function() {
        return !Object("z").propertyIsEnumerable(0);
    }) ? function(it) {
        return classof(it) == "String" ? split.call(it, "") : Object(it);
    } : Object;
}, function(module, exports) {
    module.exports = function(it) {
        if (it == undefined) throw TypeError("Can't call method on " + it);
        return it;
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var isObject = __webpack_require__(5);
    var document = global.document;
    var EXISTS = isObject(document) && isObject(document.createElement);
    module.exports = function(it) {
        return EXISTS ? document.createElement(it) : {};
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var createNonEnumerableProperty = __webpack_require__(10);
    var has = __webpack_require__(3);
    var setGlobal = __webpack_require__(15);
    var inspectSource = __webpack_require__(21);
    var InternalStateModule = __webpack_require__(43);
    var getInternalState = InternalStateModule.get;
    var enforceInternalState = InternalStateModule.enforce;
    var TEMPLATE = String(String).split("String");
    (module.exports = function(O, key, value, options) {
        var unsafe = options ? !!options.unsafe : false;
        var simple = options ? !!options.enumerable : false;
        var noTargetGet = options ? !!options.noTargetGet : false;
        if (typeof value == "function") {
            if (typeof key == "string" && !has(value, "name")) createNonEnumerableProperty(value, "name", key);
            enforceInternalState(value).source = TEMPLATE.join(typeof key == "string" ? key : "");
        }
        if (O === global) {
            if (simple) O[key] = value; else setGlobal(key, value);
            return;
        } else if (!unsafe) {
            delete O[key];
        } else if (!noTargetGet && O[key]) {
            simple = true;
        }
        if (simple) O[key] = value; else createNonEnumerableProperty(O, key, value);
    })(Function.prototype, "toString", function toString() {
        return typeof this == "function" && getInternalState(this).source || inspectSource(this);
    });
}, function(module, exports, __webpack_require__) {
    var NATIVE_WEAK_MAP = __webpack_require__(44);
    var global = __webpack_require__(0);
    var isObject = __webpack_require__(5);
    var createNonEnumerableProperty = __webpack_require__(10);
    var objectHas = __webpack_require__(3);
    var sharedKey = __webpack_require__(45);
    var hiddenKeys = __webpack_require__(17);
    var WeakMap = global.WeakMap;
    var set, get, has;
    var enforce = function(it) {
        return has(it) ? get(it) : set(it, {});
    };
    var getterFor = function(TYPE) {
        return function(it) {
            var state;
            if (!isObject(it) || (state = get(it)).type !== TYPE) {
                throw TypeError("Incompatible receiver, " + TYPE + " required");
            }
            return state;
        };
    };
    if (NATIVE_WEAK_MAP) {
        var store = new WeakMap();
        var wmget = store.get;
        var wmhas = store.has;
        var wmset = store.set;
        set = function(it, metadata) {
            wmset.call(store, it, metadata);
            return metadata;
        };
        get = function(it) {
            return wmget.call(store, it) || {};
        };
        has = function(it) {
            return wmhas.call(store, it);
        };
    } else {
        var STATE = sharedKey("state");
        hiddenKeys[STATE] = true;
        set = function(it, metadata) {
            createNonEnumerableProperty(it, STATE, metadata);
            return metadata;
        };
        get = function(it) {
            return objectHas(it, STATE) ? it[STATE] : {};
        };
        has = function(it) {
            return objectHas(it, STATE);
        };
    }
    module.exports = {
        set: set,
        get: get,
        has: has,
        enforce: enforce,
        getterFor: getterFor
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var inspectSource = __webpack_require__(21);
    var WeakMap = global.WeakMap;
    module.exports = typeof WeakMap === "function" && /native code/.test(inspectSource(WeakMap));
}, function(module, exports, __webpack_require__) {
    var shared = __webpack_require__(23);
    var uid = __webpack_require__(16);
    var keys = shared("keys");
    module.exports = function(key) {
        return keys[key] || (keys[key] = uid(key));
    };
}, function(module, exports) {
    module.exports = false;
}, function(module, exports, __webpack_require__) {
    var has = __webpack_require__(3);
    var ownKeys = __webpack_require__(48);
    var getOwnPropertyDescriptorModule = __webpack_require__(18);
    var definePropertyModule = __webpack_require__(7);
    module.exports = function(target, source) {
        var keys = ownKeys(source);
        var defineProperty = definePropertyModule.f;
        var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
    };
}, function(module, exports, __webpack_require__) {
    var getBuiltIn = __webpack_require__(24);
    var getOwnPropertyNamesModule = __webpack_require__(50);
    var getOwnPropertySymbolsModule = __webpack_require__(51);
    var anObject = __webpack_require__(14);
    module.exports = getBuiltIn("Reflect", "ownKeys") || function ownKeys(it) {
        var keys = getOwnPropertyNamesModule.f(anObject(it));
        var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
        return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    module.exports = global;
}, function(module, exports, __webpack_require__) {
    var internalObjectKeys = __webpack_require__(25);
    var enumBugKeys = __webpack_require__(30);
    var hiddenKeys = enumBugKeys.concat("length", "prototype");
    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return internalObjectKeys(O, hiddenKeys);
    };
}, function(module, exports) {
    exports.f = Object.getOwnPropertySymbols;
}, function(module, exports, __webpack_require__) {
    var fails = __webpack_require__(1);
    var replacement = /#|\.prototype\./;
    var isForced = function(feature, detection) {
        var value = data[normalize(feature)];
        return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == "function" ? fails(detection) : !!detection;
    };
    var normalize = isForced.normalize = function(string) {
        return String(string).replace(replacement, ".").toLowerCase();
    };
    var data = isForced.data = {};
    var NATIVE = isForced.NATIVE = "N";
    var POLYFILL = isForced.POLYFILL = "P";
    module.exports = isForced;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var fails = __webpack_require__(1);
    module.exports = function(METHOD_NAME, argument) {
        var method = [][METHOD_NAME];
        return !!method && fails(function() {
            method.call(null, argument || function() {
                throw 1;
            }, 1);
        });
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var $ = __webpack_require__(8);
    var isObject = __webpack_require__(5);
    var isArray = __webpack_require__(55);
    var toAbsoluteIndex = __webpack_require__(29);
    var toLength = __webpack_require__(27);
    var toIndexedObject = __webpack_require__(9);
    var createProperty = __webpack_require__(56);
    var wellKnownSymbol = __webpack_require__(32);
    var arrayMethodHasSpeciesSupport = __webpack_require__(58);
    var arrayMethodUsesToLength = __webpack_require__(31);
    var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
    var USES_TO_LENGTH = arrayMethodUsesToLength("slice", {
        ACCESSORS: true,
        0: 0,
        1: 2
    });
    var SPECIES = wellKnownSymbol("species");
    var nativeSlice = [].slice;
    var max = Math.max;
    $({
        target: "Array",
        proto: true,
        forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH
    }, {
        slice: function slice(start, end) {
            var O = toIndexedObject(this);
            var length = toLength(O.length);
            var k = toAbsoluteIndex(start, length);
            var fin = toAbsoluteIndex(end === undefined ? length : end, length);
            var Constructor, result, n;
            if (isArray(O)) {
                Constructor = O.constructor;
                if (typeof Constructor == "function" && (Constructor === Array || isArray(Constructor.prototype))) {
                    Constructor = undefined;
                } else if (isObject(Constructor)) {
                    Constructor = Constructor[SPECIES];
                    if (Constructor === null) Constructor = undefined;
                }
                if (Constructor === Array || Constructor === undefined) {
                    return nativeSlice.call(O, k, fin);
                }
            }
            result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
            for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
            result.length = n;
            return result;
        }
    });
}, function(module, exports, __webpack_require__) {
    var classof = __webpack_require__(19);
    module.exports = Array.isArray || function isArray(arg) {
        return classof(arg) == "Array";
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var toPrimitive = __webpack_require__(13);
    var definePropertyModule = __webpack_require__(7);
    var createPropertyDescriptor = __webpack_require__(12);
    module.exports = function(object, key, value) {
        var propertyKey = toPrimitive(key);
        if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value)); else object[propertyKey] = value;
    };
}, function(module, exports, __webpack_require__) {
    var NATIVE_SYMBOL = __webpack_require__(33);
    module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
}, function(module, exports, __webpack_require__) {
    var fails = __webpack_require__(1);
    var wellKnownSymbol = __webpack_require__(32);
    var V8_VERSION = __webpack_require__(59);
    var SPECIES = wellKnownSymbol("species");
    module.exports = function(METHOD_NAME) {
        return V8_VERSION >= 51 || !fails(function() {
            var array = [];
            var constructor = array.constructor = {};
            constructor[SPECIES] = function() {
                return {
                    foo: 1
                };
            };
            return array[METHOD_NAME](Boolean).foo !== 1;
        });
    };
}, function(module, exports, __webpack_require__) {
    var global = __webpack_require__(0);
    var userAgent = __webpack_require__(60);
    var process = global.process;
    var versions = process && process.versions;
    var v8 = versions && versions.v8;
    var match, version;
    if (v8) {
        match = v8.split(".");
        version = match[0] + match[1];
    } else if (userAgent) {
        match = userAgent.match(/Edge\/(\d+)/);
        if (!match || match[1] >= 74) {
            match = userAgent.match(/Chrome\/(\d+)/);
            if (match) version = match[1];
        }
    }
    module.exports = version && +version;
}, function(module, exports, __webpack_require__) {
    var getBuiltIn = __webpack_require__(24);
    module.exports = getBuiltIn("navigator", "userAgent") || "";
}, function(module, exports, __webpack_require__) {
    var $ = __webpack_require__(8);
    var DESCRIPTORS = __webpack_require__(4);
    var defineProperties = __webpack_require__(62);
    $({
        target: "Object",
        stat: true,
        forced: !DESCRIPTORS,
        sham: !DESCRIPTORS
    }, {
        defineProperties: defineProperties
    });
}, function(module, exports, __webpack_require__) {
    var DESCRIPTORS = __webpack_require__(4);
    var definePropertyModule = __webpack_require__(7);
    var anObject = __webpack_require__(14);
    var objectKeys = __webpack_require__(63);
    module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        var keys = objectKeys(Properties);
        var length = keys.length;
        var index = 0;
        var key;
        while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
        return O;
    };
}, function(module, exports, __webpack_require__) {
    var internalObjectKeys = __webpack_require__(25);
    var enumBugKeys = __webpack_require__(30);
    module.exports = Object.keys || function keys(O) {
        return internalObjectKeys(O, enumBugKeys);
    };
}, function(module, exports, __webpack_require__) {
    var $ = __webpack_require__(8);
    var FREEZING = __webpack_require__(34);
    var fails = __webpack_require__(1);
    var isObject = __webpack_require__(5);
    var onFreeze = __webpack_require__(65).onFreeze;
    var nativeFreeze = Object.freeze;
    var FAILS_ON_PRIMITIVES = fails(function() {
        nativeFreeze(1);
    });
    $({
        target: "Object",
        stat: true,
        forced: FAILS_ON_PRIMITIVES,
        sham: !FREEZING
    }, {
        freeze: function freeze(it) {
            return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
        }
    });
}, function(module, exports, __webpack_require__) {
    var hiddenKeys = __webpack_require__(17);
    var isObject = __webpack_require__(5);
    var has = __webpack_require__(3);
    var defineProperty = __webpack_require__(7).f;
    var uid = __webpack_require__(16);
    var FREEZING = __webpack_require__(34);
    var METADATA = uid("meta");
    var id = 0;
    var isExtensible = Object.isExtensible || function() {
        return true;
    };
    var setMetadata = function(it) {
        defineProperty(it, METADATA, {
            value: {
                objectID: "O" + ++id,
                weakData: {}
            }
        });
    };
    var fastKey = function(it, create) {
        if (!isObject(it)) return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
        if (!has(it, METADATA)) {
            if (!isExtensible(it)) return "F";
            if (!create) return "E";
            setMetadata(it);
        }
        return it[METADATA].objectID;
    };
    var getWeakData = function(it, create) {
        if (!has(it, METADATA)) {
            if (!isExtensible(it)) return true;
            if (!create) return false;
            setMetadata(it);
        }
        return it[METADATA].weakData;
    };
    var onFreeze = function(it) {
        if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
        return it;
    };
    var meta = module.exports = {
        REQUIRED: false,
        fastKey: fastKey,
        getWeakData: getWeakData,
        onFreeze: onFreeze
    };
    hiddenKeys[METADATA] = true;
} ]));