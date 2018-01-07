/**
 * UI toggle button
 * @param {type} options such as text, parent (and nextChild)
 * @param {type} attributes for HTML element
 * @returns {HTMLButtonElement}
 */
function Toggle(options, attributes) {
    UserInterfaceElement.call(this, "div", options, attributes);
    this.element.classList.add("button");
    this.element.classList.add("toggle");
    
    if(Array.isArray(options)) {
        options = {
            "states": options
        };
    }
    options.states = options.states || [];
    if(options.states.length === 0) {
        return null;
    }
    
    this.value = null;
    
    for(var i = 0; i < options.states.length; i++) {
        var element = document.createElement("span");
            element.index = i;
            element.classList.add("hidden");
        if(typeof options.states[i] === "string") {
            element.appendChild(document.createTextNode(options.states[i]));
            if(options.default) {
                if(i === 0)
                    element.setAttribute("class", "dark hidden");
                if(i === 1)
                    element.setAttribute("class", "hidden");
            }
        } else if(typeof options.states[i] === "object") {
            if(options.states[i].text) 
                element.appendChild(document.createTextNode(options.states[i].text));
            if(options.states[i].class)
                element.classList.add(options.states[i].class);
            if(options.states[i].selected)
                this.value = i;
            if(options.states[i].onClick)
                element.addEventListener('click', options.states[i].onClick);
        } else if(options.states[i] instanceof HTMLElement) {
            element.appendChild(options.states[i]);
        }
        this.element.appendChild(element);
    }
    
    if(this.value === null) {
        this.value = 0;
    }
    
    this.element.children[this.value].classList.remove("hidden");
    for(var i = 0; i < this.element.children[this.value].classList.length; i++)
        this.element.classList.add(this.element.children[this.value].classList[i]);
        
    this.hookEventListener(this.element, "click", this.set.bind(this.element));
    if(this.name) {
        this.hookGlobal("set-"+this.name, this.listenerSet.bind(this.element));
        this.hookRequest("get-"+this.name, function(){return this.value}.bind(this.element));
    }
    
    return this.infest();
};

Toggle.prototype = Object.create(UserInterfaceElement.prototype);

Toggle.prototype.set = function(number, silent) {
    if(number === undefined || number === null || isNaN(number))
        number = this.value + 1;
    if(!this.children[number])
        number = 0;
    if(this.value !== null && this.children[number]) {
        for(var i = 0; i < this.children[this.value].classList.length; i++)
            this.classList.remove(this.children[this.value].classList[i]);
        this.children[this.value].classList.add("hidden");
    }
    this.value = number;
    this.children[this.value].classList.remove("hidden");
    for(var i = 0; i < this.children[this.value].classList.length; i++)
        this.classList.add(this.children[this.value].classList[i]);
    if(silent !== true) {
        dispatch("changed"+(this.name ? "-"+this.name : ""), this.value);
    }
    return this;
};
