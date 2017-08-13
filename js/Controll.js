

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
        $("#dialogPanel").on('click', "#settingsDialogBackup", function() {
            document.oncopy = function(event) {
                var str = JSON.stringify(Repo.settings, null, 4);
                event.clipboardData.setData("text/plain", str);
                event.preventDefault();
            };
            document.execCommand("Copy", false, null);
        });
        $("#dialogPanel").on('click', "#settingsDialogRestore", function() {
            document.onpaste = function(event) {
                var backup = Repo.settings ;
                try {
                    Repo.settings = JSON.parse(event.clipboardData.getData("text/plain"));
                    Dialog.open("#settingsDialog");
                } catch (e) {
                    console.log(e);
                }
                Repo.settings = backup;
                event.preventDefault();
            };
            document.execCommand("Paste", false, null);
        });
		$(document).keydown(function(e) {
			if (e.keyCode == 67 && e.ctrlKey) {
				TicketTray.clipbordCopy();
			}
		});
		

        var elem = PulldownButton.makeElement("filter_tag", {
            name : "タグ",
            keySort : "name",
            icon : "img/led24/tag_blue.png",
            nameKey: "name",
            values : Repo.getLabelDefines()
        });
		$("#filterButtons").append(elem);
        var elem = PulldownButton.makeElement("filter_user", {
            name : "タグ",
            keySort : "name",
            icon : "img/led24/user.png",
            nameKey: "name",
            values : MasterTable.getAll("user")
        });
        $("#filterButtons").append(elem);
		
	}

})(Controll);

//$(function(){
	//Controll.load();
//});



