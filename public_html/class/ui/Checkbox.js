function Checkbox(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("checkbox");
    
    this.value = false;
    
    if(options.checked || options.on || !options.off || options.value) {
        this.element.classList.add("checked");
        this.value = true;
    }
    
   this.hookEventListener(this.element, "click", this.set.bind(this.element));
    if(this.name) {
        this.hookGlobal("set-"+this.name, this.listenerSet.bind(this.element));
        this.hookRequest("get-"+this.name, function(){return this.value}.bind(this.element));
    }
    
    return this.infest();
};

Checkbox.prototype = Object.create(UserInterfaceElement.prototype);

Checkbox.prototype.set = function(toChecked, silent) {
    if(toChecked === this.value)
        return;
    if(typeof toChecked !== "boolean")
        toChecked = !this.value;
    if(toChecked) {
        this.classList.add("checked");
    } else {
        this.classList.remove("checked");
    }
    this.value = toChecked;
    if(silent !== true)
        dispatch("changed"+(this.name ? "-"+this.name : ""), this.value);
            
};
