/**
 * @class Abstract UI element class
 * @argument {string} tagName container's tag name
 * @argument {Object|null} options like events and parent
 * @argument {Object|null} attributes container's attributes
 */
function UserInterfaceElement(tagName, options, attributes) {
    if(!tagName) {
        return this;
    }
    attributes = attributes || {};
    options = options || {};
    options.event = options.event || {};
    this.eventListeners = options.event;
    this.element = document.createElement(tagName);
    for(var i in attributes) {
        this.element.setAttribute(i, attributes[i]);
    }
    for(var i in options.event) {
        if(typeof options.event[i] !== "function")
            continue;
        this.element.addEventListener(i, options.event[i], false);
    }
    this.element.classList.add("ui");
    if(options.parent instanceof Element) {
        if(options.insertBefore instanceof Element && options.insertBefore.parentNode === options.parent) {
            options.parent.insertBefore(options.insertBefore, this.element);
        } else {
            options.parent.appendChild(this.element);
        }
    }
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
 * @returns {Boolean}
 */
UserInterfaceElement.prototype.destroy = function() {
    if(this.element && this instanceof UserInterfaceElement) {
        return this.infest().destroy();
    }
    for(var i in this.eventListeners) {
        this.removeEventListener(i, this.eventListeners[i]);
    }
    if(this.parentNode) {
        this.parentNode.removeChild(this);
    }
    return true;
}

/**
 * Hides UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.hide = function() {
    this.classList.add("hidden");
    return this;
};

/**
 * Shows UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.show = function() {
    this.classList.remove("hidden");
    return this;
};

/**
 * Toggles visibility of UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.toggle = function() {
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
    return this;
};

/**
 * Enables UI element
 * @returns {UserInterfaceElement}
 */
UserInterfaceElement.prototype.enable = function() {
    this.classList.remove("disabled");
    this.removeAttribute("disabled");
    return this;
};