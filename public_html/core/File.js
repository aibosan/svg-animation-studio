/**
 * Asynchronous file read
 * @param {type} fileName file url
 * @param {function|null} resolve called with request response text (file contents) on success
 * @param {function|null} reject called with fileName when file cannot be read
 * @returns {undefined}
 */
function fileRead(fileName, resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200)  {
                log("file read error", fileName, Log.Level.SUCCESS);
                if(typeof resolve === "function") {
                    resolve(xhr.responseText);
                }
            }
            if(xhr.status === 0)  {
                log("file read error", fileName, Log.Level.WARNING);
                if(typeof reject === "function") {
                    reject(fileName);
                } else if(typeof resolve === "function") {
                    resolve();
                }
            }
        }
    };
    xhr.open("GET", fileName);
    xhr.send(null);
};