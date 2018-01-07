function Slider(options, attributes) {
    options = options || {};
    options.event = options.event || {};
    this.change = options.event.change || null;
    if(options.event.change)
        delete options.event.change;
    
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("slider");
    
    this.value = options.value || 0;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.value = this.value > this.max ? this.max : this.value < this.min ? this.min : this.value;
    this.step = options.step || Math.ceil((this.max-this.min)/25);
    
    if(options.label) {
        var text = document.createElement("label");
            text.appendChild(typeof options.label === "string" ? document.createTextNode(options.label) : options.label);
        this.element.appendChild(text);
    }
    
    this.container = document.createElement("div");
    this.slider = document.createElement("div");
    this.element.appendChild(this.container);
    this.container.appendChild(this.slider);
    if(this.element.classList.contains("vertical"))
        this.slider.style.height = 100*((this.value-this.min)/(this.max-this.min)) + "%";
    else
        this.slider.style.width = 100*(this.value-this.min)/(this.max-this.min) + "%";
    
    if(options.number || options.numeric || options.showValue) {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "number");
        this.input.setAttribute("min", this.min);
        this.input.setAttribute("max", this.max);
        this.input.setAttribute("step", this.step);
        this.input.setAttribute("value", this.value);
        this.element.appendChild(this.input);
        
        this.input.addEventListener("change", this.registerEventListener("change", function(event) {
            var value = parseFloat(event.currentTarget.value);
            if(this.value !== value)
                this.set(value);
        }.bind(this.element)));
    }
    
    this.container.addEventListener("mousedown", this.registerEventListener("mousedown", function() {
        this.active = true;
    }.bind(this.element)));
    window.addEventListener("mouseup", this.registerEventListener("mouseup", function() {
        this.active = false;
    }.bind(this.element)));
    this.container.addEventListener("click", this.registerEventListener("click", this.eventHandler.bind(this.element)));
    this.container.addEventListener("mousemove", this.registerEventListener("mousemove", function(event) {
        if(this.active && (event.buttons & 1)) {
            this.eventHandler(event);
        }
    }.bind(this.element)));
    this.element.addEventListener("wheel", this.registerEventListener("wheel", function(event) {
        if(event.deltaY === 0)
            return;
        if(event.deltaY > 0)
            this.set(this.value - this.step);
        else
            this.set(this.value + this.step);
    }.bind(this.element)));
    
    return this.infest();
};

Slider.prototype = Object.create(UserInterfaceElement.prototype);

/**
 * Sets value
 * @param {number} value
 * @param {boolean|null} silent does not dispatch
 * @returns {number} final value
 */
Slider.prototype.set = function(value, silent) {
    if(value === this.value)
        return this.value;
    if(value < this.min)
        value = this.min;
    if(value > this.max)
        value = this.max;
    if(value !== this.min && value !== this.max)
        value -= (value % this.step);
    if(this.value === value)
        return this.value;
    this.value = value;
    if(this.classList.contains("vertical"))
        this.slider.style.height = 100*((this.value-this.min)/(this.max-this.min)) + "%";
    else
        this.slider.style.width = 100*(this.value-this.min)/(this.max-this.min) + "%";
    
    if(this.input)
        this.input.value = this.step%1 > 0.01 ? this.value.toFixed(1) : Math.round(this.value);
    if(typeof this.change === "function")
        this.change(this.value);
    if(silent !== true)
        dispatch("changed"+(this.name ? "-"+this.name : ""), this.value);
    return this.value;
};

/**
 * Sets value from percentage
 * @param {number} percent
 * @returns {number} final value
 */
Slider.prototype.setPercent = function(percent) {
    return this.set(percent*(this.max-this.min) + this.min);
};

/**
 * Handles slider's events (click, mousemove)
 * @param {type} event
 * @returns {undefined}
 */
Slider.prototype.eventHandler = function(event) {
    var rect = this.getContentRect(event.currentTarget);
    this.setPercent(this.classList.contains("vertical") ?
        1-((event.clientY - rect.bottom)/(rect.top - rect.bottom)) :
        (event.clientX - rect.left)/(rect.right - rect.left));
};