function Switch(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("switch");
    
    this.on = false;
    
    if(options.checked || options.on || !options.off || options.value) {
        this.element.classList.add("on");
        this.on = true;
    }
    
    this.element.addEventListener('click', function() {
        this.toggle();
        dispatch("clicked", this);
    }.bind(this.element), false);
    
    return this.infest();
};

Switch.prototype = Object.create(UserInterfaceElement.prototype);

Switch.prototype.toggle = function() {
    if(this.on) {
        this.classList.remove("on");
        this.on = false;
    } else {
        this.classList.add("on");
        this.on = true;
    }
};
