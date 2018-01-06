/**
 * UI button
 * @param {type} options such as text, parent (and nextChild)
 * @param {type} attributes for HTML element
 * @returns {HTMLButtonElement}
 */
function Button(options, attributes) {
    UserInterfaceElement.call(this, "button", options, attributes);
    
    options = options || {};
    this.element.appendChild(document.createTextNode(typeof options === "string" ? options : (options.text || options.value)));
    
    this.element.addEventListener('click', function() {
        dispatch("clicked", this)
    }.bind(this), false);
    
    return this.infest();
};

Button.prototype = Object.create(UserInterfaceElement.prototype);
