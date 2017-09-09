

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
		    if (CheckButton.isChecked($("#waffleButton"))) {
   		        $("#webview").attr("src",Repo.getWaffleUrl($sel.val(),
       		        PulldownButton.getValue($("#filter_user")),
   		            PulldownButton.getValue($("#filter_tag"))
   		            ));
             } else {
  			    Repo.loadIssues($sel.val(), TicketTray.onLoadIssue);
            }
		},
		milestoneButton: function(){
			Repo.loadMilestone(Milestone.onLoadMilestones);
		},
		settingsButton: function(){
			Dialog.show("#settingsDialog", function() {
				Dialog.save();
				Settings.save();
			});
		},
		waffleButton: function(){
		    if (CheckButton.isChecked($("#waffleButton"))) {
		        $("#webviewTray").show();
		        $("#ticketTray").hide();
                BUTTON_ACTIONS.issuesButton();
		    } else {
		        $("#webviewTray").hide();
		        $("#ticketTray").show();
		    }
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
                var str = JSON.stringify(Settings.info, null, 4);
                event.clipboardData.setData("text/plain", str);
                event.preventDefault();
            };
            document.execCommand("Copy", false, null);
        });
        $("#dialogPanel").on('click', "#settingsDialogRestore", function() {
            document.onpaste = function(event) {
                var backup = Settings.info ;
                try {
                    Settings.info = JSON.parse(event.clipboardData.getData("text/plain"));
                    Dialog.open("#settingsDialog");
                } catch (e) {
                    console.log(e);
                }
                Settings.info = backup;
                event.preventDefault();
            };
            document.execCommand("Paste", false, null);
        });
		$(document).keydown(function(e) {
			if (e.keyCode == 67 && e.ctrlKey) {
				TicketTray.clipbordCopy();
			}
		});
		

        var $elem = PulldownButton.makeElement("filter_tag", {
            name : "タグ",
            keySort : "name",
            icon : "img/led24/tag_blue.png",
            nameKey: "name",
            values : Settings.getLabelDefines()
        });
        $elem.bind('change', function(){BUTTON_ACTIONS.issuesButton();});
		$("#filterButtons").append($elem);
        var $elem = PulldownButton.makeElement("filter_user", {
            name : "担当者",
            keySort : "name",
            icon : "img/led24/user.png",
            nameKey: "name",
            values : MasterTable.getAll("user")
        });
        $elem.bind('change', function(){BUTTON_ACTIONS.issuesButton();});
        $("#filterButtons").append($elem);

		$("#milestoneSelector").bind('change', function(){BUTTON_ACTIONS.issuesButton();});

	}

})(Controll);

//$(function(){
	//Controll.load();
//});



