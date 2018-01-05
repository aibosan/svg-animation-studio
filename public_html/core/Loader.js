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
            resolve();
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
 * @param {String|null} listURL optional list to add before loading
 * @param {function|null} resolve callback after successfully finishing loading
 * @param {function|null} reject callback when problem occurs
 * @returns {Boolean}
 */
Loader.prototype.load = function(listURL, resolve, reject) {
    if(!this.ready) {
        return false;
    }
    this.ready = false;
    if(listURL) {
        this.addList(listURL, this.readNext.bind(this, resolve, reject), reject);
    } else {
        this.readNext(resolve, reject);
    }
};

Loader.prototype.readNext = function(resolve, reject) {
    if(!window.config) {
        window.config = {};
    }
    if(this.queue.length === 0) {
        this.ready = true;
        if(typeof resolve === "function") {
            resolve();
        }
        return;
    }
    
    var candidate = this.queue.pop();
    if(!candidate || typeof candidate !== 'string' || !candidate.length) {
        this.readNext(resolve, reject);
        return;
    }
    
    var parse = null;
    
    switch(candidate.toLowerCase().replace(/.*\./, '')) {
        case "list":
            this.addList(candidate, this.readNext(resolve, reject));
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
        case "conf":
            parse = function(content) {
                try {
                    var parsed = JSON.parse(content);
                    for(var i in parsed) {
                        window.config[i] = parsed[i];
                    }
                } catch(error) {
                    console.warn(error);
                    if(typeof reject === "function") {
                        reject();                
                        return;
                    }
                } finally {
                    this.readNext(resolve, reject);
                }
            }.bind(this);
            break;
    }
    
    if(typeof parse === "function") {
        fileRead(candidate, parse, reject);
    } else {
        this.readNext(resolve, reject);
    }
};

window.onload = function() {
    requestAnimationFrame(function() {
        new Loader().load("core/main.list");
    });
};
    
