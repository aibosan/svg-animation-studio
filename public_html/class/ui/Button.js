/**
 * UI button
 * @param {type} options such as text, parent (and nextChild)
 * @param {type} attributes for HTML element
 * @returns {HTMLButtonElement}
 */
function Button(options, attributes) {
    UserInterfaceElement.call(this, "button", options, attributes);
    
    options = options || {};
    this.element.appendChild(options instanceof HTMLElement ? options : document.createTextNode(typeof options === "string" ? options : (options.text || options.value)));
    
    this.element.addEventListener('click', this.registerEventListener("click", dispatch.bind(this.element, "clicked"+(this.name ? "-"+this.name : ""), this.element)));
    
    return this.infest();
};

Button.prototype = Object.create(UserInterfaceElement.prototype);
