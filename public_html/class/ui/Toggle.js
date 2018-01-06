/**
 * UI toggle button
 * @param {type} options such as text, parent (and nextChild)
 * @param {type} attributes for HTML element
 * @returns {HTMLButtonElement}
 */
function Toggle(options, attributes) {
    options = options || { "states": [] };
    UserInterfaceElement.call(this, "button", options, attributes);
    this.element.classList.add("toggle");
    
    if(Array.isArray(options)) {
        options = {
            "states": options
        };
    }
    
    this.state = null;
    
    for(var i = 0; i < options.states.length; i++) {
        var element = document.createElement("span");
            element.index = i;
            element.classList.add("hidden");
        if(typeof options.states[i] === "string") {
            element.appendChild(document.createTextNode(options.states[i]));
            if(options.default) {
                if(i === 0)
                    element.setAttribute("class", "black hidden");
                if(i === 1)
                    element.setAttribute("class", "white hidden");
            }
        } else if(typeof options.states[i] === "object") {
            element.appendChild(document.createTextNode(options.states[i].text));
            if(options.states[i].class)
                element.classList.add(options.states[i].class);
            if(options.states[i].selected) {
                element.classList.remove("hidden");
                this.state = i;
            }
            if(options.states[i].onClick)
                element.addEventListener('click', options.states[i].onClick);
        } else if(options.states[i] instanceof HTMLElement) {
            element.appendChild(options.states[i]);
        }
        this.element.appendChild(element);
    }
    
    this.element.addEventListener('click', this.select.bind(this.element));
    
    if(this.state === null) {
        this.state = 0;
        this.element.children[0].classList.remove("hidden");
    }
    
    return this.infest();
};

Toggle.prototype = Object.create(UserInterfaceElement.prototype);

Toggle.prototype.select = function(number) {
    if(number === undefined || number === null || isNaN(number))
        number = this.state + 1;
    if(!this.children[number])
        number = 0;
    if(this.state !== null && this.children[number]) {
        for(var i = 0; i < this.children[this.state].classList.length; i++)
            this.classList.remove(this.children[this.state].classList[i]);
        this.children[this.state].classList.add("hidden");
    }
    this.state = number;
    this.children[this.state].classList.remove("hidden");
    for(var i = 0; i < this.children[this.state].classList.length; i++)
        this.classList.add(this.children[this.state].classList[i]);
    dispatch("toggled", this);
    return this;
};
