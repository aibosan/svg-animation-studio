/**
 * Radio button class
 * @param {type} options such as text, parent (and nextChild)
 * @param {type} attributes for HTML element
 * @returns {HTMLDivElement}
 */
function Radio(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("checkbox");
    this.element.classList.add("radio");
    
    this.value = true;
    this.element.classList.add("checked");
    
    this.nextRadio = null;
    this.firstRadio = this.element;
    this.number = options.number || 0;
    
    if(options.value === false) {
        this.element.classList.remove("checked");
        this.value = false;
    }
    
    this.hookEventListener(this.element, "click", this.set.bind(this.element));
    if(this.name) {
        this.hookGlobal("set-"+this.name, this.listenerSet.bind(this.element));
        this.hookRequest("get-"+this.name, function(){return this.value}.bind(this.element));
    }
    
    return this.infest();
};

Radio.prototype = Object.create(UserInterfaceElement.prototype);

/**
 * Adds radio button to chain
 * @param {Radio} radio button
 * @returns {Radio} added button
 */
Radio.prototype.add = function(radio) {
    if(radio === this) {
        return this;
    }
    var oldNext = this.nextRadio;
    radio.firstRadio = this.firstRadio;
    this.nextRadio = radio;
    if(oldNext)
        this.nextRadio.add(oldNext);
    this.firstRadio.check();
    return radio;
};

/**
 * Sets button as on and sets all other radio buttons in group to off
 * @argument {boolean|null} silent doe not pass event
 * @returns {Radio} self
 */
Radio.prototype.on = function(silent) {
    if(this.firstRadio)
        this.firstRadio.off(true);
    this.value = true;
    this.classList.add("checked");
    if(silent !== true)
        dispatch("changed"+(this.name ? "-"+this.name : ""), this.number);
    return this;
};

Radio.prototype.set = function(value, silent) {
    if(value === false)
        this.off();
    else
        this.on(silent);
};

/**
 * Sets button as off
 * @param {boolean|null} recursive invoke for next in chain
 * @returns {Radio}
 */
Radio.prototype.off = function(recursive) {
    this.value = false;
    this.classList.remove("checked");
    if(recursive && this.nextRadio)
        this.nextRadio.off(recursive);
    return this;
};

/**
 * Checks the chain of buttons to avoid multiple checked ones
 * @returns {Boolean}
 */
Radio.prototype.check = function() {
    if(this.nextRadio && this.nextRadio !== this)
        if(this.value)
            this.nextRadio.off(true);
        else
            return this.nextRadio.check();
    return true;
};