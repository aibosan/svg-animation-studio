var Language = function() {
    this.data = window.language;
    delete window.language;
    for(var i in this.current) {
        this.current = i;
        break;
    }
    this.current = config.language ? config.language : this.current;
};

Language.prototype.get = function(category, entry) {
    try {
        return this.data[this.current][category][entry];
    } catch(err) {
        return null;
    }
};

Language.prototype.switch = function(name) {
    if(name === this.current || !this.data[name])
        return false;
    this.current = name;
    dispatch("language-changed", this.current);
    return true;
};