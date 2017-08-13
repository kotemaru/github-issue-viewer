chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        bounds: {
            width: 1024, // window.parent.screen.width,
            height: 768 // window.parent.screen.height
        }
    });
});
function settingsBackup(settings) {
    //var content = zip.generate();
    var zipName = 'download.zip';
    //var dataURL = 'data:application/zip;base64,' + content;
    var dataURL = window.webkitURL.createObjectURL(new Blob([settings]));
    chrome.downloads.download({
        url : dataURL,
        filename : zipName,
        saveAs : true
    });
}
chrome.runtime.onMessage.addListener(function(msg, sender) {
    console.log(msg);
    if ((msg.action === 'settingsBackup')
            && (msg.params !== undefined)) {
        settingsBackup(msg.params);
    }
});