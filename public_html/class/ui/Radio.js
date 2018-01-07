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
    
    this.checked = false;
    
    this.nextRadio = null;
    this.firstRadio = this.element;
    this.number = options.number || 0;
    
    if(options.checked || options.on || !options.off || options.value) {
        this.element.classList.add("checked");
        this.checked = true;
    }
    
    this.element.addEventListener('click', this.registerEventListener("click", function() {
        if(!this.checked)
            this.on();
    }.bind(this.element)));
    
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
    if(this.nextRadio) {
        return this.nextRadio.add(radio);
    }
    radio.firstRadio = this.firstRadio;
    this.nextRadio = radio;
    if(this.checked && this.nextRadio.checked) {
        this.nextRadio.checked = false;
        this.nextRadio.classList.remove("checked");
    }
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
    this.checked = true;
    this.classList.add("checked");
    if(silent !== true)
        dispatch("changed"+(this.name ? "-"+this.name : ""), this.number);
    return this;
};

/**
 * Sets button as off
 * @param {boolean|null} recursive invoke for next in chain
 * @returns {Radio}
 */
Radio.prototype.off = function(recursive) {
    this.checked = false;
    console.log(this);
    this.classList.remove("checked");
    if(recursive && this.nextRadio)
        this.nextRadio.off(recursive);
    return this;
};
