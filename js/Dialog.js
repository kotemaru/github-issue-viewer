
function Dialog(){this.initialize.apply(this, arguments)};
(function(Class){
	var current = name;
	var closureVar = null;

	Class.open = function(name){
		current = name;
		var $win = $(".DialogPanel").show();
		$(".Dialog").hide();
		var $di  = $(name).show();
		$di.offset({left:($win.width()/2-$di.width()/2), top:($win.height()/2-$di.height()/2)});
		restoreDialog($di);
		$di.trigger("opened");
		return $di;
	}

	Class.close = function(){
		$(".DialogPanel").hide();
		$(current).trigger("closed");
	}

	Class.save = function() {
		$dialog = $(current);
		$inputs = $dialog.find("*[data-path]");
		$inputs.each(function(){
			$input = $(this);
			var path = $input.attr("data-path");
			setValueFromPath(path, getValue($input));
		});
		Class.close();
	}
	function restoreDialog($dialog) {
		$inputs = $dialog.find("*[data-path]");
		$inputs.each(function(){
			$input = $(this);
			var path = $input.attr("data-path");
			setValue($input, getValueFromPath(path));
		});
	}
	function getValueFromPath(path) {
		var cur = window;
		var parts = path.split(".");
		for (var i=0;i<parts.length;i++){
			cur = cur[parts[i]];
			if (cur == null) return null;
		}
		return cur;
	}
	
	function setValueFromPath(path, val) {
		var cur = window;
		var parts = path.split(".");
		for (var i=0;i<parts.length-1;i++){
			if (cur[parts[i]] == null) cur[parts[i]] = {};
			cur = cur[parts[i]];
		}
		cur[parts[parts.length-1]] = val;
	}
	function getValue($input) {
		if ($input[0].tagName == "IMG") {
			return $input.attr("src");
		} else {
			return $input.val();
		}
	}
	function setValue($input, val) {
		if ($input[0].tagName == "IMG") {
			return $input.attr("src",val);
		} else {
			return $input.val(val);
		}
	}

	//--------------------------------------------------------------------
	Class.abort = function() {
		Dialog.open("#abortDialog");
	}

	Class.download = function() {
		var str = Storage.getDownloadString();
		var $a = $("#downloadLink");
		$a.attr("href","data:application/octet-stream,"+encodeURIComponent(str));
		Dialog.open("#downloadDialog");
	}

	Class.upload = function() {
		var $file = $("#uploadFile");
		$file.show().bind("change", function(){
			var reader = new FileReader();
			reader.onload = function(e) {
				Storage.setUploadString(reader.result);
				alert("設定を更新しました。ページをリロードします。");
				location.reload();
			};
            reader.readAsText($file[0].files[0]);
            Dialog.close();
		});
		Dialog.open("#uploadDialog");
	}


	Class.config = function() {
		Dialog.open("#configDialog");
	}
	Class.saveConfig = function() {
		Class.save();
		RedMine.save();
		Control.save();
		TaskBoard.save();
		MyMine.reconfig();
	}

	Class.saveAddFolder = function() {
		var $di = $("#addFolderDialog");
		var folder = {
			name:  $di.find("input[name='folderName']").val(),
			title: $di.find("input[name='folderTitle']").val(),
			icon:  $di.find("img#folderIcon").attr("src")
		};
		Folder.add(folder);
		Dialog.close();
		Folder.refresh();
	}
	Class.openAddFolder = function() {
		closureVar = {};
		Dialog.open("#addFolderDialog");
	}
	Class.addFolder = function() {
		Class.save();
		var folder = Folders.addFolder(closureVar);
		if (folder == null) {
			alert("フォルダの作成に失敗しました。\nIDが衝突している可能性があります。");
		}
		Folders.refresh();
	}

	Class.openEditFolder = function() {
		closureVar = Folders.getCurrent();
		Dialog.open("#editFolderDialog");
	}

	Class.saveFolder = function() {
		Class.save();
		Folders.refresh();
		Folders.save();
	}

	function show(name, onOkButton, onCancelButton) {
		var $dialog = Dialog.open(name);
		$dialog.find("#dialogOK").bind('click', onOkButton);
		if (onCancelButton) {
			$dialog.find("#dialogCancel").bind('click', onCancelButton);
		}
	}
	
	function alert(title, message) {
		var $dialog = Dialog.open("#alertDialog");
		$dialog.find("#dialogOK").bind('click', function(){hide();});
		$dialog.find("#dialogTitle").html(title);
		$dialog.find("#dialogBody").html(message);
	}
	
	Class.show = show;
	Class.alert = alert;
	Class.hide = close;

})(Dialog);
