// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/giftbag/index.js":[function(require,module,exports) {
// Scroll
class Scroll {
	constructor() {
		this.scrollElements = "";
	}

	// Set a custom selector
	setup(options) {
		if (options) {
			if (options.selector) {
				this.scrollElements = options.selector;
			}
		}
	}

	// run the scroll function
	init() {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const attrArr = Object.values(entry.target.attributes);

					// default
					let threshold = 0.1;
					let playInReverse = false;

					// enable reverse and reassign threshold if specified in data-attr
					attrArr.map(attr => {
						if (attr.name === "data-reverse") {
							playInReverse = true;
						}
						if (attr.name === "data-threshold") {
							threshold = parseFloat(attr.nodeValue);
						} else {
							threshold = 0.1;
						}
					});

					if (entry.intersectionRatio >= threshold) {
						entry.target.classList.add("visible");
					} else if (playInReverse) {
						entry.target.classList.remove("visible");
					}
				});
			},
			{
				threshold: [0, 0.2, 1]
			}
		);

		this.scrollElements.forEach(el => {
			observer.observe(el);
		});
	}
}

//  PARALLAX
class Parallax {
	constructor() {
		this.revealPoint = 0;
		this.selector = "";
		this.ease = "ease-out";
	}

	setup(options) {
		if (options) {
			if (options.selector) {
				this.selector = options.selector;
			}
			if (options.revealPoint) {
				this.revealPoint = options.revealPoint;
			}
			if (options.ease) {
				this.ease = options.ease;
			}

			if (options.direction) {
				this.direction = options.direction;
			}
		}
	}

	runParallax() {
		const pageTop = window.pageYOffset;
		const pageMid = pageTop + window.innerHeight / 2;

		this.selector.forEach(el => {
			const wHeight = window.innerHeight;
			const revealTop = el.getBoundingClientRect().top;

			let active;

			if (revealTop < wHeight - this.revealPoint) {
				active = true;
			} else {
				active = false;
			}

			if (revealTop < 0 + this.revealPoint) {
				active = false;
			}

			if (active) {
				// Run this if it already has a data attribute set
				const topSection = el.offsetTop;
				const midSection = topSection + el.offsetHeight / 2;

				const viewDistanceLeft = pageMid - midSection;
				const parallaxSpeed = parseFloat(
					el.getAttribute("data-parallax-speed")
				);

				// Sets the parallax direction
				let direction = "";

				if (el.hasAttribute("data-parallax-direction")) {
					// Direction to value of the attribute
					direction = el.getAttribute("data-parallax-direction");
				} else {
					// Set default direction to vertical
					direction = "vertical";
				}

				// Handle transform based on direction
				if (direction.toLowerCase() === "vertical") {
					el.style.transform = `translate3d(0, ${(viewDistanceLeft *
						parallaxSpeed) /
						3}px, 0)`;
				} else if (direction.toLowerCase() === "horizontal") {
					el.style.transform = `translate3d( ${(viewDistanceLeft *
						parallaxSpeed) /
						3}px, 0, 0)`;
				}

				el.style.transition = `transform ${this.ease}`;
			}
		});
	}

	init() {
		document.addEventListener("scroll", () => {
			this.runParallax();
		});
	}
}

// EVENT GROUP
class EventGroup {
	constructor() {
		this.selector = "";
	}

	setup(options) {
		// Setup of the custom selector
		if (options.selector) {
			this.selector = options.selector;
		}
	}

	init() {
		this.selector.forEach(event => {
			const listener = event.getAttribute("data-event");
			const setElement = event.getAttribute("data-event-element");
			const setClass = event.getAttribute("data-event-add");

			event.addEventListener(listener, () => {
				const elements = document.querySelectorAll(`${setElement}`);

				elements.forEach(element => {
					element.classList.toggle(setClass);
				});
			});
		});
	}
}

// DarkMode
class DarkMode {
	constructor() {
		this.wrapper = "";
		this.darkModeClass = "dark-mode-active";
		this.active = false;
		this.trigger = "";
	}

	setup(options) {
		if (options) {
			if (options.wrapper) {
				this.wrapper = options.wrapper;
			}
			if (options.trigger) {
				this.trigger = options.trigger;
			}
			if (options.darkModeClass) {
				this.darkModeClass = options.darkModeClass;
			}
		}
	}

	renderDarkMode() {
		const allElements = this.wrapper.querySelectorAll("*");

		if (this.active === true) {
			document.body.setAttribute("data-dark-mode", true);
			allElements.forEach(el => {
				el.classList.add(this.darkModeClass);
			});
			this.active = false;
			localStorage.setItem("dark-mode", "true");
		} else if (this.active === false) {
			allElements.forEach(el => {
				document.body.removeAttribute("data-dark-mode");
				el.classList.remove(this.darkModeClass);

				this.active = true;
				localStorage.removeItem("dark-mode");
			});
		}
	}

	init() {
		let localStatus = localStorage.getItem("dark-mode");

		if (localStatus == "true") {
			this.active = true;
		}

		this.renderDarkMode();

		this.trigger.addEventListener("click", () => {
			this.renderDarkMode();
		});
	}
}

// Container Queries
class ContainerQueries {
	constructor() {
		selector = "";
		attribute = "";
	}

	setup(options) {
		if (options.selector) {
			this.selector = options.selector;
		}
		if (options.attribute) {
			this.attribue = options.attribute;
		}
	}

	runContainerQueries() {
		this.selector.forEach(el => {
			// Get the value of the breakpoints attribute and split them into key value pairs
			// Reason why the breakpoints need a ; between each different size
			const breakpointAttributes = el.getAttribute(this.attribue).split("; ");

			// Add the data-current-breakpoint attribute to the el and set it to initial
			el.setAttribute("data-current-breakpoint", "initial");

			// Get the total width of the element
			const elementWidth = el.clientWidth;

			// Create keys array
			let keysArr = [];
			// Map through the breakpoint attributes and add a breakpoint class according to the key and the width according to the value
			breakpointAttributes.map((attr, i) => {
				// Split them into key and value
				const splitAttr = attr.split(":");
				const key = splitAttr[0];
				const value = +splitAttr[1];

				// If the value is greater or equal to the element width then you will add the current data-current-breakpoint
				if (value < elementWidth) {
					keysArr.push(key);
					// Set the current index to be the current breakpoint
					el.dataset.currentBreakpoint = keysArr[i];
				}
			});
		});
	}

	init() {
		this.runContainerQueries();
	}
}

module.exports = {
	Scroll,
	Parallax,
	EventGroup,
	DarkMode,
	ContainerQueries
};

},{}],"js/scripts.js":[function(require,module,exports) {
"use strict";

var _giftbag = require("giftbag");

// All giftbag follow this pattern
// 1. Create
// 2. Setup
// 3. Initialize
// 1. Create new parallax
var parallax = new _giftbag.Parallax(); // 2. Setup
// Selector elements

var parallaxElements = document.querySelectorAll('.parallax-element');
parallax.setup({
  selector: parallaxElements // This is the elements that will be selected

}); // 3. Init

parallax.init(); // Scroll based animations

var scroll = new _giftbag.Scroll();
var scrollElements = document.querySelectorAll('.scroll-element');
scroll.setup({
  selector: scrollElements
});
scroll.init();
},{"giftbag":"../node_modules/giftbag/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50549" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
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
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/scripts.js"], null)
//# sourceMappingURL=/scripts.cd665a19.js.map