var GlobalCallbacks = {};

/**
 * Adds event listener
 * @param {string} eventName event name
 * @param {function} callback function, return !true blocks subsequent (earlier set) listeners
 * @returns {function|null} callback when successful, or null if not
 */
function addGlobal(eventName, callback) {
    if(!eventName || !callback) {
        return null;
    }
    if(!GlobalCallbacks[eventName]) {
        GlobalCallbacks[eventName] = [];
    }
    for(var i = 0; i < GlobalCallbacks[eventName].length; i++) {
        if(GlobalCallbacks[eventName][i] === callback) {
            log("listener already exists", {
                'name': eventName,
                'callback': callback
            }, Log.Level.WARNING);
            return false;
            return null;
        }
    }
    GlobalCallbacks[eventName].unshift(callback);
    return callback;
};

/**
 * Removes event listener with given name and callback
 * @param {string} eventName
 * @param {function} callback
 * @returns {Boolean|function} callback, or false if the listener could not be removed
 */
function removeGlobal(eventName, callback) {
    if(!eventName || !GlobalCallbacks[eventName]) {
        return false;
    }
    var removed = false;
    for(var i = 0; i < GlobalCallbacks[eventName].length; i++) {
        if(GlobalCallbacks[eventName][i] === callback) {
            GlobalCallbacks[eventName].splice(i, 1);
            i--;
            removed = true;
        }
    }
    if(removed) {
        return callback;
    } else {
        log("listener removal failed", {
            'name': eventName,
            'callback': callback
        }, Log.Level.ERROR);
        return false;
    }
}

/**
 * Dispatches event with givent attributes, triggering any functions set with {@link listen}
 * @param {string} eventName
 * @param {object|null} attributes
 * @returns {Boolean} whether event could be dispatched
 */
function dispatch(eventName, attributes) {
    if(!eventName) {
        return false;
    }
    if(!GlobalCallbacks[eventName]) {
        if(eventName !== "log") {
            log(eventName, {
                'attributes': attributes,
                'listeners': 0,
                'unregistered': true
            }, Log.Level.EVENT);
        }
        return true;
    }
    for(var i = 0; i < GlobalCallbacks[eventName].length; i++) {
        if(GlobalCallbacks[eventName][i](attributes) === false) {
            break;
        }
    }
    if(eventName !== "log") {
        log(eventName, {
            'attributes': attributes,
            'listeners': GlobalCallbacks[eventName].length
        }, Log.Level.EVENT);
    }
    return true;
};