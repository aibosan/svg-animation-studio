/**
 * Manages normal events. Singleton.
 * @returns {EventManager}
 */
function EventManager() {
    window.addEventListener("mousedown", this.mouseDown, false);
    window.addEventListener("mouseup", this.mouseUp, false);
    window.addEventListener("click", this.click, false);
    window.addEventListener("dblclick", this.dblClick, false);
    window.addEventListener("contextmenu", this.wheel, false);
    
    window.addEventListener("wheel", this.wheel, false);
    window.addEventListener("wheel", this.wheel, false);
    
};






EventManager = new EventManager();
