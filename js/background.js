chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        //bounds: {
        //    width: window.parent.screen.width,
        //    height: window.parent.screen.height
        //}
    });
});
