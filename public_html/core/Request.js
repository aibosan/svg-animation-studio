var RequestCallbacks = {};

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
 * Removes listener setup by {@link listen}
 * @function
 * @param {string} requestName name of request to break
 * @returns {function|null} callback
 */
function forgetRequest(requestName) {
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
    