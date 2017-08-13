
$(function(){
	function includeHtml($parent, url) {
		$.ajax({
			url: url,
			async: true,
			success: function(html){
				$parent.append($(html));
			},
			error: function(err) {
				console.log(err);
			}
		});
	}
	function init() {
		console.log("init");


		
		var $dialogPanel = $("#dialogPanel");
		includeHtml($dialogPanel, "parts/AbortDialog.html");
		includeHtml($dialogPanel, "parts/AlertDialog.html");
		includeHtml($dialogPanel, "parts/LoginDialog.html");
		includeHtml($dialogPanel, "parts/SettingsDialog.html");
		
		BorderLayout.init({
			header:{size:60, resizable:false},
		}).load().refresh();

		MasterTable.load();
		Controll.load();
	}
	setTimeout(init, 500);

});

