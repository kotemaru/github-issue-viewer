

function Auth(){}

(function(_class){
	var AUTH_TOKEN = "AUTH_TOKEN";
	var NOTE = "github-issue-viewer-";
	_class.terminal = "Desktop";

	function getNote() {
		return NOTE + Settings.info.terminal;
	}

	function isLogin() {
		return _class.token != null;
	}
	function setAuthToken(token) {
		//window.localStorage.setItem(AUTH_TOKEN, token);
		var keyValue = {};
		keyValue[AUTH_TOKEN]= token;
		chrome.storage.local.set(keyValue, function () {});
		_class.token = token;
	}

	function getAuthTokenAsync() {
		chrome.storage.local.get(AUTH_TOKEN, function (value) {
			_class.token = value[AUTH_TOKEN];
		});
	}

	function login(user,pass, success, fail) {
		delateOldAuth(user,pass,function onSuccess(id) {
			createAuth(user, pass, success, fail);
		}, fail);
	}


	function createAuth(user, pass, onSuccess, onFail) {
		$.ajax({
			type: "POST", url:"https://api.github.com/authorizations",
			beforeSend: function(xhr) {
				var credentials = window.btoa(user+":"+pass);
			    xhr.setRequestHeader("Authorization", "Basic " + credentials);
			},
			contentType:"application/json; charset=utf-8",
			data: JSON.stringify({"scopes":["repo"],"note":getNote()}),
			dataType: "json",
			success: function(json) {
				setAuthToken(json.token);
				onSuccess();
			},
			error: function(jqXHR, textStatus, errorThrown){
				onFail(textStatus+": "+errorThrown);
			}
		});
	}

	function delateOldAuth(user, pass, onSuccess, onFail) {
		$.ajax({
			type: "GET", url:"https://api.github.com/authorizations",
			beforeSend: function(xhr) {
				var credentials = window.btoa(user+":"+pass);
			    xhr.setRequestHeader("Authorization", "Basic " + credentials);
			},
			dataType: "json",
			success: function(json) {
				var id = -1;
				for (var i=0;i<json.length;i++) {
					var auth = json[i];
					if (auth.note == getNote()) id = auth.id;
				}
				if (id >= 0) {
					deleteAuth(user, pass, onSuccess, onFail, id);
				} else {
					onSuccess(id);
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				onFail(textStatus+": "+errorThrown);
			}
		});
	}
	function deleteAuth(user, pass, onSuccess, onFail, id) {
		$.ajax({
			type: "DELETE", url:"https://api.github.com/authorizations/"+id,
			beforeSend: function(xhr) {
				var credentials = window.btoa(user+":"+pass);
			    xhr.setRequestHeader("Authorization", "Basic " + credentials);
			},
			dataType: "json",
			success: function(json) {
				onSuccess(json);
			},
			error: function(jqXHR, textStatus, errorThrown){
				onFail(textStatus+": "+errorThrown);
			}
		});
	}
	function setupHeader(xhr) {
	    xhr.setRequestHeader("Authorization", "token "+_class.token);
	}
			
	_class.isLogin = isLogin;
	_class.setupHeader = setupHeader;
	_class.login = login;

	getAuthTokenAsync();


})(Auth);



