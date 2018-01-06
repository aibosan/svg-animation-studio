function Checkbox(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("checkbox");
    
    this.checked = false;
    
    if(options.checked || options.on || !options.off || options.value) {
        this.element.classList.add("checked");
        this.checked = true;
    }
    
    this.element.addEventListener('click', function() {
        this.toggle();
        dispatch("clicked", this);
    }.bind(this.element), false);
    
    return this.infest();
};

Checkbox.prototype = Object.create(UserInterfaceElement.prototype);

Checkbox.prototype.toggle = function() {
    if(this.checked) {
        this.classList.remove("checked");
        this.checked = false;
    } else {
        this.classList.add("checked");
        this.checked = true;
    }
};
