var Log = function(message, attributes, level) {
    this.message = message || "";
    this.attributes = attributes || {};
    this.level = level || 0;
    this.timestamp = + new Date();
    
    switch(level) {
        case Log.Level.PRIORITY:
        case Log.Level.CRITICAL:
        case Log.Level.ERROR:
            console.error(this.getLevelAsString(), this.timestamp, "\"" + message + "\"", attributes);
            break;
        case Log.Level.WARNING:
            console.warn(this.getLevelAsString(), this.timestamp, "\"" + message + "\"", attributes);
            break;
        case Log.Level.REPORT:
            console.log(this.getLevelAsString(), this.timestamp, "\"" + message + "\"", attributes);
            break;
    }
    
    dispatch("log", this);
};

Log.Level = {
    /* should open error window of some kind */
    PRIORITY: 1,    // highest priority override
    CRITICAL: 2,    // system-stopping problems
    ERROR: 3,       // errors which need to be handled, but might not prevent functionality completely
    /* should be logged visibly in appropriate ui element */
    WARNING: 4,     // expected points of failure
    REPORT: 5,      // reports of normal behavior
    UNDEFINED: 6,   // default log level
    /* can be safely ignored by ui */
    INTERESTING: 7, // expected, but notable behavior (e.g. singleton destruction)
    SUCCESS: 8,     // success reports (e.g. singleton constructors, request setups, listeners)
    LOW: 9          // information (e.g. telemetry)
};

Log.prototype.destroy = function() {
    for(var i in this.attributes) {
        delete this.attributes[i];
    }
    delete this.message;
    delete this.level;
    delete this.timestamp;
    return true;
};

Log.prototype.getLevelAsString = function(level) {
    level = level || this.level;
    for(var i in Log.Level) {
        if(Log.Level[i] === level) {
            return i;
        }
    }
    throw new Error("Log level "+level+" does not exist");
    return null;
};

var Logs = [];

/**
 * Writes new log
 * @param {string} message
 * @param {Object|null} attributes
 * @param {number} level from Log.Level object
 * @returns {Boolean}
 */
var log = function(message, attributes, level) {
    if(!message) {
        return false;
    }
    
    level = level || Log.Level.UNDEFINED;
    
    Logs.push(new Log(message, attributes, level));
    
    if(Logs.length > Constant.LOG_SIZE) {
        Logs.shift().destroy();
    }
    
    var timestamp = + new Date();
    while(Logs[0] && timestamp - Logs[0].timestamp > Constant.LOG_DURATION) {
        Logs.shift().destroy();
    }
    return true;
};

/**
 * Removes all saved logs
 * @returns {Boolean}
 */
var logWipe = function() {
    while(Logs[0]) {
        Logs.shift().destroy();
    }
    return true;
};
