function Switch(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("switch");
    
    this.value = false;
    
    if(options.checked || options.value || !options.off || options.value) {
        this.element.classList.add("on");
        this.value = true;
    }
    
    this.hookEventListener(this.element, "click", this.set.bind(this.element));
    if(this.name) {
        this.hookGlobal("set-"+this.name, this.listenerSet.bind(this.element));
        this.hookRequest("get-"+this.name, function(){return this.value}.bind(this.element));
    }
    
    return this.infest();
};

Switch.prototype = Object.create(UserInterfaceElement.prototype);

Switch.prototype.set = function(silent) {
    if(this.value) {
        this.classList.remove("on");
        this.value = false;
    } else {
        this.classList.add("on");
        this.value = true;
    }
    if(silent !== true)
        dispatch("changed"+(this.name ? "-"+this.name : ""), this.value);
};

Switch.prototype.get = function() {
    
};
