/*
 * Copyright 2013, Fog Creek Software
 * License: http://www.apache.org/licenses/LICENSE-2.0 
 */

var Proto = (function () {
    "use strict";

	function bind(f, self) {
		return function () {
			return f.apply(self, arguments);
		}
	}

    var methods = {
        _super: function (base) {
			if (base === null || base === undefined) {
				throw new Error("argument is null or undefined")
			}

			if(!base.isPrototypeOf(this) && base !== this) {
				throw new Error("argument is unrelated")
			}

            var methods = Object.getPrototypeOf(base).__methods__;
            var proxy = Object.create(this);
            for (var key in methods) {
                proxy[key] = bind(methods[key], this);
            }

            return proxy;
        },

        create: function (properties) {
            var model = Object.create(this);
            model.__methods__ = Object.create(this.__methods__);
            model.__methods__.extend.call(model, properties);
            return model;
        },

        extend: function (properties) {
            var key;
            var propNames = properties ? Object.getOwnPropertyNames(properties) : [];
            for (var i = 0; i < propNames.length; i++) {
                var key = propNames[i];
                var descriptor = Object.getOwnPropertyDescriptor(properties, key);

                if (typeof descriptor.value === 'function') {
                    this.__methods__[key] = descriptor.value;
                    continue;
                }

                Object.defineProperty(this, key, descriptor);
            }

            for (key in this.__methods__) {
                this[key] = bind(this.__methods__[key], this);
            }
        }
    };

    var Proto = {
        __methods__: {}
    };

    methods.extend.call(Proto, methods);
    return Proto;
} ());
