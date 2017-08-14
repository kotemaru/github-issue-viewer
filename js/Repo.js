

function Repo(){}

(function(_class){
	_class.settings = {
		owner : "",
		project : "",
		labelDefines: []
	};
	var labelDefines = {};

	function getOwnerProject() {
		return _class.settings.owner + "/" + _class.settings.project;
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

	_class.getLabelDefines = function() {
	    return labelDefines;
    }

	_class.getLabels = function(issue) {
		var labels = {};
		if (issue.labels == null || issue.labels.length == 0) return labels;
		for (var i=0;i<issue.labels.length; i++) {
		    var name = issue.labels[i].name;
			if (labelDefines[name]) labels[name] = labelDefines[name];
		}
		console.log("getLabels", labels);
		return labels;
	}
	_class.getProgress = function(issue, labels) {
		if (issue.state == "closed") return {progress:100};
		if (labels == null) labels = Repo.getLabels(issue);

		for (var key in labels) {
		    if (labels[key] && labels[key].progress && !isNaN(+labels[key].progress)) {
		        return labels[key];
		    }
		}
		return {progress:0};
	}
	_class.getLabelSortOrder = function(labels) {
        var max = 0;
        for ( var key in labels) {
            if (labels[key] && labels[key].sort && !isNaN(+labels[key].sort)) {
                max = Math.max(max, +labels[key].sort);
            }
        }
        return max;
    }
	_class.getGithubLink = function(id) {
		return "https://github.com/"+getOwnerProject()+"/issues/"+id;
	}

	_class.loadMilestone = loadMilestone;
	_class.loadIssues = loadIssues;
	_class.save = function() {
		Storage.put("Repo", _class.settings);
		convertLabelDefines();
	}
	_class.load = function() {
		Storage.get("Repo", {owner:"", project:"", labelDefines:[]}, function(value){
		    delete value.progress;
			_class.settings = value;
			convertLabelDefines();
			console.log(JSON.stringify(value));
		});
	}

    function convertLabelDefines() {
        labelDefines = {};
        if (_class.settings.labelDefines == null) return;
        for (var i=0; i< _class.settings.labelDefines.length;i++) {
            var item = _class.settings.labelDefines[i];
            labelDefines[item.name] = item;
        }
    }

	_class.openIssue = function(id) {
		window.open(getGithubLink(id), "_blank");
	}

})(Repo);

$(function(){
	Repo.load();
});
