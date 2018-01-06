function Button(options, attributes) {
    UserInterfaceElement.call(this, "button", options, attributes);
    
    options = options || {};
    this.element.appendChild(document.createTextNode(options.text || options.value));
    
    return this.infest();
};

Button.prototype = Object.create(UserInterfaceElement.prototype);
