var RequestCallbacks = {};
var EventCallbacks = {};

/**
 * Waits for incoming {@link request} call with the same requestName
 * @function
 * @param {string} requestName unique name of the request
 * @param {function} callback function taking attribute
 * @returns {function|null}
 */
function listen(requestName, callback) {
    if(!requestName || !callback || typeof callback !== "function") {
        return null;
    }
    if(RequestCallbacks[requestName]) {
        log("requests already exists", {
            'name': requestName,
            'callback': callback,
            'caller': listen.caller || null
        }, Log.Level.ERROR);
        RequestCallbacks[requestName] = [];
    }
    RequestCallbacks[requestName] = callback;
    log("listening to requests", {
        'name': requestName,
        'callback': callback,
        'caller': listen.caller || null,
        'listenerCount': RequestCallbacks[requestName].length
    }, Log.Level.SUCCESS);
    return callback;
};

/**
 * Adds event listener
 * @param {string} eventName event name
 * @param {function} callback function, return !true blocks subsequent (earlier set) listeners
 * @returns {function|null} callback when successful, or null if not
 */
function addListener(eventName, callback) {
    if(!eventName || !callback) {
        return null;
    }
    if(!EventCallbacks[eventName]) {
        EventCallbacks[eventName] = [];
    }
    for(var i = 0; i < EventCallbacks[eventName].length; i++) {
        if(EventCallbacks[eventName][i] === callback) {
            log("listener already exists", {
                'name': eventName,
                'callback': callback
            }, Log.Level.WARNING);
            return false;
            return null;
        }
    }
    EventCallbacks[eventName].unshift(callback);
    return callback;
};

/**
 * Removes event listener with given name and callback
 * @param {string} eventName
 * @param {function} callback
 * @returns {Boolean|function} callback, or false if the listener could not be removed
 */
function removeListener(eventName, callback) {
    if(!eventName || !EventCallbacks[eventName]) {
        return false;
    }
    var removed = false;
    for(var i = 0; i < EventCallbacks[eventName].length; i++) {
        if(EventCallbacks[eventName][i] === callback) {
            EventCallbacks[eventName].splice(i, 1);
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
    if(!EventCallbacks[eventName]) {
        if(eventName !== "log") {
            log(eventName, {
                'attributes': attributes,
                'listeners': 0,
                'unregistered': true
            }, Log.Level.EVENT);
        }
        return true;
    }
    for(var i = 0; i < EventCallbacks[eventName].length; i++) {
        if(!EventCallbacks[eventName][i](attributes)) {
            break;
        }
    }
    if(eventName !== "log") {
        log(eventName, {
            'attributes': attributes,
            'listeners': EventCallbacks[eventName].length
        }, Log.Level.EVENT);
    }
    return true;
};

/**
 * Removes listener setup by {@link listen}
 * @function
 * @param {string} requestName name of request to break
 * @returns {function|null} callback
 */
function forget(requestName) {
    if(!RequestCallbacks[requestName]) {
        if(EventCallbacks[eventName][i] === callback) {
            log("listener does not exist", {
                'name': requestName
            }, Log.Level.WARNING);
            return false;
            return null;
        }
        return null;
    }
    
    var callback = RequestCallbacks[requestName];
    RequestCallbacks[requestName] = null;
    log("forgot request callback", {
        'name': requestName,
        'callback': callback,
        'caller': forget.caller || null,
        'listenerCount': RequestCallbacks[requestName].length
    }, Log.Level.INTERESTING);
    return callback;    
};

/**
 * Sends a request; if a listener was set up for it with {@link listen}
 * @param {string} name of the request callback function
 * @param {object|null} attributes passed to the request callback
 * @returns {type}
 */
function request(name, attributes) {
    if(!name || !RequestCallbacks[name] || typeof RequestCallbacks[name] !== "function") {
        throw new Error("Request '"+name+"' has no listener.");
        return null;
    }
    
    log("request sent", {
        'name': name,
        'attributes': attributes
    }, Log.Level.LOW);
    
    return RequestCallbacks[name](attributes);
};
    