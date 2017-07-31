

function Repo(){}

(function(_class){
	_class.onLoadMilestores = function(milestones) {}
	_class.onLoadIssues = function(issues) {}
	_class.settings = {
		owner : "",
		project : "",
		progress: {}
	};

	function getOwnerProject() {
		return _class.settings.owner + "/" + _class.settings.project;
	}
	function getRepoPath() {
		return  "/repos/" + getOwnerProject();
	}
	function getIssueQuery() {
		return "repo:"+getOwnerProject()+"+type:issue";
	}

	function loadMilestone(onLoadMilestores) {
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
				onLoadMilestores(_class.milestones);
			},
			error: function(jqXHR, textStatus, errorThrown){
				Dialog.alert(textStatus+": "+errorThrown);
			}
		});
	}
	
	function loadIssues(milestone, onload) {
		var q = getIssueQuery();
		if (milestone != "" && milestone != "*") {
			q = q+"+milestone:\""+milestone+"\"";
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
	
	_class.__getLabels = function(item) {
		var labels = [];
		if (item.labels == null || item.labels.length == 0) return labels;
		for (var i=0;i<item.labels.length; i++) {
			var name = item.labels[i].name;
			for (var key in _class.settings.progress) {
				var progress = _class.settings.progress[key];
				if (name != progress.tag) {
					labels.push(name);
					break;
				}
			}
		}
		console.log("getLabels", labels);
		return labels;
	}
	_class.getLabels = function(item) {
		var labels = {};
		if (item.labels == null || item.labels.length == 0) return labels;
		for (var i=0;i<item.labels.length; i++) {
			labels[item.labels[i].name] = item.labels[i].id;
		}
		console.log("getLabels", labels);
		return labels;
	}
	_class.getProgress = function(item, labels) {
		if (item.state == "closed") return 100;
		if (labels == null) labels = Repo.getLabels();

		for (var key in _class.settings.progress) {
			var progress = _class.settings.progress[key];
			//console.log(name, progress);
			if (labels[progress.tag] !== undefined) return progress.per;
		}
		return 0;
	}
	_class.getGithubLink = function(id) {
		return "https://github.com/"+getOwnerProject()+"/issues/"+id;
	}
	
	_class.loadMilestone = loadMilestone;
	_class.loadIssues = loadIssues;
	_class.save = function() {
		Storage.put("Repo", _class.settings);
	}
	_class.load = function() {
		Storage.get("Repo", {owner:"", project:""}, function(value){
			_class.settings = value;
		});
	}
	_class.openIssue = function(id) {
		window.open(getGithubLink(id), "_blank");
	}

})(Repo);

$(function(){
	Repo.load();
});
