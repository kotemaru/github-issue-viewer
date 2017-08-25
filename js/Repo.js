

function Repo(){}

(function(_class){

	function getOwnerProject() {
		return Settings.info.owner + "/" + Settings.info.project;
	}
	function getRepoPath() {
		return  "/repos/" + getOwnerProject();
	}
	function getIssueQuery() {
		return "repo:"+getOwnerProject()+"+type:issue";
	}

	function loadMilestone(onLoadMilestones) {
		$.ajax({
			type: "GET", url:"https://api.github.com"+getRepoPath()+"/milestones",
			beforeSend: Auth.setupHeader,
			dataType: "json",
			success: function(json) {
				_class.milestones = {};
				for (var i=0;i<json.length;i++) {
					var item = json[i];
					_class.milestones[item.id] = {id:item.id, number:item.number, title:item.title};
				}
				onLoadMilestones(_class.milestones);
			},
			error: function(jqXHR, textStatus, errorThrown){
				Dialog.alert(textStatus+": "+errorThrown);
			}
		});
	}

	function loadIssues(milestone, onload) {
		var q = getIssueQuery();
		if (milestone != "" && milestone != "*") {
			if (milestone == "-") {
				q = q+"+no:milestone";
			} else {
				q = q+"+milestone:\""+milestone+"\"";
			}
		}
		$.ajax({
			type: "GET", url:"https://api.github.com/search/issues?q="+q+"&sort=updated&page=1&per_page=100",
			beforeSend: Auth.setupHeader,

			dataType: "json",
			success: function(json) {
				onload(json);
			},
			error: function(jqXHR, textStatus, errorThrown){
				Dialog.alert(textStatus+": "+errorThrown);
			}
		});
	}
	_class.getGithubLink = function(id) {
		return "https://github.com/"+getOwnerProject()+"/issues/"+id;
	}
	
	_class.loadMilestone = loadMilestone;
	_class.loadIssues = loadIssues;

	_class.openIssue = function(id) {
		window.open(getGithubLink(id), "_blank");
	}

})(Repo);

