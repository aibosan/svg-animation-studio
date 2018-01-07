/**
 * UI button
 * @param {type} options such as text, parent (and nextChild)
 * @param {type} attributes for HTML element
 * @returns {HTMLButtonElement}
 */
function Button(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("button");
    
    options = options || {};
    this.element.appendChild(options instanceof HTMLElement ? options : document.createTextNode(typeof options === "string" ? options : (options.text || options.value)));
    
    this.hookEventListener(this.element, "click", dispatch.bind(this.element, "clicked"+(this.name ? "-"+this.name : ""), this.element));
    if(this.name)
        this.hookGlobal("click-"+this.name, this.listenerSet.bind(this.element));
    return this.infest();
};

Button.prototype = Object.create(UserInterfaceElement.prototype);
