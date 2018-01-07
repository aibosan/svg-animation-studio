/**
 * @class Abstract UI element class
 * @argument {string} tagName container's tag name
 * @argument {Object|null} options like events and parent
 * @argument {Object|null} attributes container's attributes
 */
function UserInterfaceElement(tagName, options, attributes) {
    if(!tagName && !options.element) {
        return this;
    }
    attributes = attributes || {};
    options = options || {};
    options.event = options.event || {};
    this.name = options.name || null;
    this.eventListeners = [];
    this.element = options.element ? options.element : document.createElement(tagName);
    for(var i in attributes) {
        this.element.setAttribute(i, attributes[i]);
    }
    for(var i in options.event) {
        if(typeof options.event[i] !== "function")
            continue;
        this.element.addEventListener(i, this.registerEventListener(i, options.event[i], false), false);
    }
    this.element.classList.add("ui");
    if(options.parent instanceof Element) {
        if(options.insertBefore instanceof Element && options.insertBefore.parentNode === options.parent) {
            options.parent.insertBefore(options.insertBefore, this.element);
        } else {
            options.parent.appendChild(this.element);
        }
    }
    Variable.INSTANCES_WITH_DESTRUCTOR++;
    return this;
};

/**
 * Merges with the DOM element, migrating object properties there
 * To be executed as "return this.infest()" at the end of constructor
 * @param {null|Element} element optional element to take over instead of this.element
 * @returns {UserInterfaceElement|Element} remaining element
 */
UserInterfaceElement.prototype.infest = function(element) {
    element = element || this.element || null;
    if(!element || !(element instanceof Element)) {
        return this;
    }
    if(this.element) {
        delete this.element;
    }
    for(var i in this) {
        element[i] = this[i];
        delete this[i];
    }
    return element;
};

/**
 * Destructor
 * @argument {boolean|null} recursive default false
 * @returns {Boolean}
 */
UserInterfaceElement.prototype.destroy = function(recursive) {
    if(this.element && this instanceof UserInterfaceElement) {
        return this.infest().destroy();
    }
    for(var i = 0; i < this.eventListeners.length; i++) {
        this.eventListeners[i].target.removeEventListener(this.eventListeners[i].name, this.eventListeners[i].function, this.eventListeners[i].capture);
        Variable.REGISTERED_EVENT_LISTENERS--;
    }
    if(this.parentNode) {
        this.parentNode.removeChild(this);
    }
    for(var i = 0; i < this.children.length; i++) {
        if(typeof this.children[i].destroy === "function") {
            this.children[i].destroy(recursive);
        }
    }
    Variable.INSTANCES_WITH_DESTRUCTOR--;
    return true;
}

/**
 * Hides UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.hide = function() {
    this.addEventListener("transitionend", function() {
        dispatch("hidden", this);
    }.bind(this), { 'once': true });
    this.classList.add("hidden");
    return this;
};

/**
 * Shows UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.show = function() {
    this.classList.remove("hidden");
    dispatch("shown", this);
    return this;
};

/**
 * Toggles visibility of UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.toggleHidden = function() {
    if(this.classList.contain("hidden")) {
        this.show();
    } else {
        this.hide();
    }
    return this;
};

/**
 * Disables UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.disable = function() {
    this.classList.add("disabled");
    this.setAttribute("disabled", "disabled");
    dispatch("disabled", this);
    return this;
};

/**
 * Enables UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.enable = function() {
    this.classList.remove("disabled");
    this.removeAttribute("disabled");
    dispatch("enabled", this);
    return this;
};

/**
 * Returns bounding client rectangle equivalent for content (no margin/padding/borders) of element
 * @param {Element|null} element
 * @returns {DOMRect}
 */
UserInterfaceElement.prototype.getContentRect = function(element) {
    var bRect = (element || this).getBoundingClientRect();
    var style = window.getComputedStyle(element || this);
    return new DOMRect(
        (bRect.x + parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth) + parseFloat(style.marginTop)),
        (bRect.y + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth) + parseFloat(style.marginLeft)),
        parseFloat(style.width), parseFloat(style.height)
    );   
};

/**
 * Registers event listener to remove during destruction
 * @param {string} event name of event
 * @param {function} funct callback function
 * @param {boolean|null} capture
 * @param {Element|null} target (optional) target of event listener
 * @returns {function} funct
 */
UserInterfaceElement.prototype.registerEventListener = function(eventName, funct, capture, target) {
    this.eventListeners.push({ "target": target || this, "name": eventName, "function": funct, "capture": capture });
    Variable.REGISTERED_EVENT_LISTENERS++;
    return funct;
};
