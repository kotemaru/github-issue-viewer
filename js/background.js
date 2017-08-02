chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        bounds: {
            width: 1024, // window.parent.screen.width,
            height: 768 // window.parent.screen.height
        }
    });
});
