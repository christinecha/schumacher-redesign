requirejs(["../scripts/helper/dropdown.js"], function(util) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
})
requirejs(["../scripts/helper/nav.js"], function(util) {})
requirejs(["../scripts/helper/catalog.js"], function(util) {})
requirejs(["../scripts/helper/collection.js"], function(util) {})
requirejs(["../scripts/helper/quickshop.js"], function(util) {})
