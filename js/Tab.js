function Tab(){this.initialize.apply(this, arguments)};
(function(_Class) {
	_Class.prototype.initialize = function($elem, id) {
		this.id = id;
		this.$elem = $elem;
		this.$url = $elem.find(".Url");
		this.$webview = $elem.find(".Webview");
		this.webview = this.$webview[0];
		this.$resize = $elem.find("#resize");
		this.$dialog = $elem.find(".Dialog");
		this.isFullSize = false;
		this.$webview[0].setZoom(0.5);

		var self = this;
		$elem.find("#back").bind('click', function() {self.back();});
		$elem.find("#forward").bind('click', function() {self.forward();});
		$elem.find("#reload").bind('click', function() {self.reload();});
		$elem.find("#home").bind('click', function() {self.gotoHome();});
		$elem.find("#star").bind('click', function() {self.register();});
		$elem.find("#resize").bind('click', function() {self.resize();});
		this.$url.bind('keyup', function(event) {
			if (event.which != 13) return true;
			self.syncLocation();
			return false;
		});
		
		this.webview.addEventListener('loadstart', function(ev){self.onLoadstart(ev);});
		this.webview.addEventListener('newwindow', function(ev){self.onNewWindow(ev);});
		this.webview.addEventListener('dialog', function(ev){self.onDialog(ev);});
	}
	
	_Class.prototype.onLoadstart = function onLoadstart(ev) {
		this.$url.val(this.webview.src);
		this.syncSizeMode();
	}
	_Class.prototype.onNewWindow = function onNewWindow(ev) {
		window.open(ev.targetUrl);
	}
	_Class.prototype.onDialog = function onDialog(ev) {
		var controller = e.dialog;
		var messageType = ev.messageType;
		var $dialog = this.$dialog;
		var $ok = this.$dialog.find("#dialogOK").show().bind('click', function(ev) {
			controller.ok((messageType == 'prompt')? $input.val() : undefined);
			$dialog.hide();
		});
		var $cancel = this.$dialog.find("#dialogCancel").show().bind('click', function(ev) {
			controller.cancel();
			$dialog.hide();
		});
		var $input = this.$dialog.find("#dialogInput").hide().val("");
		
		$dialog.find("#dialogMessage").text(ev.messageText);
		if (messageType != 'alert') $cancel.hide();
		if (messageType == 'prompt') $input.show();
		$dialog.show();
	}
	
	_Class.prototype.resize = function resize() {
		//console.log(this, button);
		this.isFullSize = !this.isFullSize;
		this.syncSizeMode();
	}
	_Class.prototype.syncSizeMode = function syncSizeMode() {
		if (this.isFullSize) {
			this.$elem.css({position:"absolute", "z-index":1});
			this.$elem.offset({left:0,top:0}).height("100%").width("100%");
			this.$resize.attr("src","img/window-small.png");
			this.webview.setZoom(1.0);
		} else {
			this.$elem.css({position:"relative", "z-index":0});
			this.$elem.height("33%").width("33%");
			this.$resize.attr("src","img/window-big.png");
			this.webview.setZoom(0.5);
		}
	}
	
	_Class.prototype.syncLocation = function syncLocation() {
		this.$webview.attr("src", this.$url.val());
	}

	_Class.prototype.register = function register() {
		var value = JSON.stringify({home: this.$url.val()});
		var keyValue = {};
		keyValue[this.id]= {home: this.$url.val()};
		chrome.storage.local.set(keyValue, function () {});
		//window.localStorage.setItem(this.id, value);
	}
	_Class.prototype.gotoHome = function gotoHome() {
		var self = this;
		chrome.storage.local.get(this.id, function (value) {
			try {
				var data = value[self.id];
				self.$url.val(data.home);
				self.syncLocation();
			} catch (e) {
				console.log(e);
			}
		});
	}
	_Class.prototype.back = function back() {
		this.webview.back();
	}
	_Class.prototype.forward = function forward() {
		this.webview.forward();
	}
	_Class.prototype.reload = function reload() {
		this.webview.reload();
	}
})(Tab);


$(function(){
	var $templ = $(".Template > .Tab");
	var $main = $("#main");
	for (var i=0; i<9 ;i++) {
		var $clone = $templ.clone();
		var tab = new Tab($clone, "tab_"+i);
		$clone.data("tab", tab);
		$main.append($clone);
		tab.gotoHome();
	}
});


