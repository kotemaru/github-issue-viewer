

function Controll(){}
(function(_class){
	function login() {
		var user = $("#loginDialog #user").val();
		var pass = $("#loginDialog #pass").val();
		Auth.login(user,pass, function success() {
			Dialog.close();
		}, function fail(){
			Dialog.alert("Login fail", "ログインに失敗しました。");
		});
	}

	
	var BUTTON_ACTIONS = {
		loginButton: function(){
			Dialog.show("#loginDialog", login);
		},
		issuesButton: function(){
			var $sel = $("#milestoneSelector");
			Repo.loadIssues($sel.val(), TicketTray.onLoadIssue);
		},
		milestoneButton: function(){
			Repo.loadMilestone(Milestone.onLoadMilestones);
		},
		settingsButton: function(){
			Dialog.show("#settingsDialog", function() {
				Dialog.save();
				Repo.save();
			});
		},
	};
	
	function bindButtons() {
		for (name in BUTTON_ACTIONS) {
			$("#"+name).bind('click', BUTTON_ACTIONS[name]);
		}
	}
	
	_class.load = function() {
		bindButtons();
		
		$("#dialogPanel").on('click', ".CloseImg", function(){Dialog.close();});
	
		$(document).keydown(function(e) {
			if (e.keyCode == 67 && e.ctrlKey) {
				TicketTray.clipbordCopy();
			}
		});
	}

})(Controll);

//$(function(){
	//Controll.load();
//});



