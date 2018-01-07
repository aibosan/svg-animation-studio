function Loader() {
    this.queue = [];
    this.ready = true;
};

/**
 * Loads up and parses new list of files to load, and adds them to the internal queue
 * @param {string} listURL list location (contains array)
 * @param {function|null} resolve callback for case of success
 * @param {function|null} reject callback for case of error (file not existing)
 * @returns {undefined}
 */
Loader.prototype.addList = function(listURL, resolve, reject) {
    fileRead(listURL, function(content) {
        if(!content || !content.length) {
            if(typeof resolve === "function") {
                resolve();
            }
            return false;
        }
        try {
            var queue = JSON.parse(content);
            this.queue = this.queue.concat(queue);
        } catch(error) {
            log("file list could not be parsed", {
                'fileURL': listURL, 'fileContent': content },
                Log.Level.WARNING);
            if(typeof reject === "function") {
                reject();                
                return false;
            }
        } finally {
            if(typeof resolve === "function") {
                resolve();
            }
            return true;
        }
    }.bind(this), reject);
    return true;
};

/**
 * Loads all files in queue
 * @param {String|null} url file to load
 * @param {function|null} resolve callback after successfully finishing loading
 * @param {function|null} reject callback when problem occurs
 * @returns {Boolean}
 */
Loader.prototype.load = function(url, resolve, reject) {
    if(!this.ready) {
        return false;
    }
    this.ready = false;
    if(url)
        this.queue.push(url);
    this.readNext(resolve, reject);
};

Loader.prototype.readNext = function(resolve, reject) {
    if(!window.config)
        window.config = {};
    if(!window.language)
        window.language = {};
    if(this.queue.length === 0) {
        this.ready = true;
        if(typeof resolve === "function") {
            resolve();
        }
        return;
    }
    
    var candidate = this.queue.shift();
    if(!candidate || typeof candidate !== 'string' || !candidate.length) {
        this.readNext(resolve, reject);
        return;
    }
    
    var parse = null;
    
    switch(candidate.toLowerCase().replace(/.*\./, '')) {
        case "list":
            this.addList(candidate, this.readNext.bind(this, resolve, reject));
            return;
            break;
        case "js":
            parse = function(content) {
                var html = document.createElement("script");
                    html.setAttribute("type", "text/javascript");
                    html.innerHTML = content;
                document.head.appendChild(html);
                this.readNext(resolve, reject);
            }.bind(this);
            break;
        case "css":
            parse = function(content) {
                var html = document.createElement("style");
                    html.innerHTML = content;
                document.head.appendChild(html);
                this.readNext(resolve, reject);
            }.bind(this);
            break;
        case "json":
            parse = candidate.match("config/language/") ? function(content) {
                try {
                    var parsed = JSON.parse(content);
                    window.language[candidate.toLowerCase().replace(/.*\//, '').replace(/\..*/, '')] = parsed;
                } catch(error) {
                    log("config file could not be parsed", {
                        'fileURL': listURL, 'fileContent': content },
                        Log.Level.WARNING);
                    if(typeof reject === "function")
                        return reject();
                } finally {
                    this.readNext(resolve, reject);
                }
            }.bind(this) : function(content) {
                try {
                    var parsed = JSON.parse(content);
                    for(var i in parsed)
                        window.config[i] = parsed[i];
                } catch(error) {
                    log("config file could not be parsed", {
                        'fileURL': listURL, 'fileContent': content },
                        Log.Level.WARNING);
                    if(typeof reject === "function")
                        return reject();
                } finally {
                    this.readNext(resolve, reject);
                }
            }.bind(this);
            break;
    }
    
    if(typeof parse === "function") {
        console.log(candidate);
        fileRead(candidate, parse, reject);
    } else {
        this.readNext(resolve, reject);
    }
};

/**
 * Asynchronously chain-loads all classes and instances all singletons
 * @returns {undefined}
 */
window.onload = function() {
    window.singletons = [];
    requestAnimationFrame(function() {
        new Loader().load("core/main.list", function() {
            while(singletons.length > 0)
                new window[singletons.pop()]();
        });
    });
};
    
