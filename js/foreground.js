function login() {
	var user = $("#loginDialog #user").val();
	var pass = $("#loginDialog #pass").val();
	Auth.login(user,pass, function success() {
		Dialog.close();
	}, function fail(){
		Dialog.alert("Login fail", "ログインに失敗しました。");
	});
}
function onLoadIssue(json) {
	var issues = [];
	for (var i=0;i<json.items.length;i++) {
		var item = json.items[i];
		var assigned = (item.assignees.length>0) ? item.assignees[0].login : "";
		var issue = {
			id:				item.number, 		// 番号
			assigned_to:	{name:assigned}, 	// 担当者
			updated_on:		item.updated_at, 	// 更新日
			done_ratio:		Repo.getProgress(item), 	// 進捗
			subject:		item.title
		};
		issues.push(issue);
	}
	TicketTray.setData(issues);
}

function onLoadMilestones(milestones) {
	var $sel = $("#milestoneSelector");
	$sel.html("<option>*</option>");
	for (var id in milestones) {
		var item = milestones[id];
		$sel.append($("<option value='"+item.title+"'>"+item.title+"</option>"));
	}
}
		
var grobal = {
	PROGRESS_TAGS : {
		"--prepare": {title: "仕様策定中", level: 0},
		"[ready to implement]": {title:"着手可能", level: 1},
		"[doing]": {title:"処理中", level: 50},
		"[ready to review]": {title:"レビュー中", level: 60},
		"[ready to merge]": {title:"マージ待", level: 70},
		"[in progress]": {title:"マージ済", level: 80},
		"[QA]": {title:"テスト待", level: 90},
		"--close": {title: "完了", level: 100},

	}
};

function getProgress(issue) {
	if (issue.state == "closed") return grobal.PROGRESS_TAGS["--close"];
	for (var i=0;i<issue.labels.length; i++) {
		var label = issue.labels[i];
		var progress = grobal.PROGRESS_TAGS[label.name];
		if (progress) return progress;
	}
	return grobal.PROGRESS_TAGS["--prepare"];
}






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

$(function(){



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

//	if (!Auth.isLogin()) {
//		Dialog.show("#loginDialog", login);
//	}
	
	$("#loginButton").bind('click',function(){
		Dialog.show("#loginDialog", login);
	});
	$("#issuesButton").bind('click',function(){
		var $sel = $("#milestoneSelector");
		Repo.loadIssues($sel.val(), onLoadIssue);
	});
	$("#milestoneButton").bind('click',function(){
		Repo.loadMilestone(onLoadMilestones);
	});
	$("#settingsButton").bind('click',function(){
		Dialog.show("#settingsDialog", function() {
			Dialog.save();
			Repo.save();
		});
	});
	$("#test").bind('click',function(){
		document.oncopy = function(event) {
			event.clipboardData.setData("text/html", "<table><tr><td><a href='http://google.co.jp'>google<a></td><td>xxxxxxx</td></tr></table>");
			event.preventDefault();
		};
		document.execCommand("Copy", false, null);
		document.onpaste = function(event) {
			console.log(event.clipboardData.items);
			console.log(event.clipboardData.getData("text/html"));
			console.log(event.clipboardData.getData("text/plain"));

			event.preventDefault();
		};
		document.execCommand("Paste", false, null);
	});

	$("#dialogPanel").on('click', ".CloseImg", function(){Dialog.close();});
	
	$(document).keydown(function(e) {
		if (e.keyCode == 67 && e.ctrlKey) {
			TicketTray.clipbordCopy();
		}
	});

}
	setTimeout(init, 1000);

});

