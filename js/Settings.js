

function Settings(){}

(function(_class){
	_class.info = {
		owner : "",
		project : "",
		labelDefines: []
	};
	var labelDefines = {};

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
		if (labels == null) labels = _class.getLabels(issue);

		for (var key in labels) {
		    if (labels[key] && labels[key].progress && !isNaN(+labels[key].progress)) {
		        return labels[key];
		    }
		}
		return {progress:0};
	}
	_class.getLabelSortOrder = function(labels) {
        var sum = 0;
        for ( var key in labels) {
            if (labels[key] && labels[key].sort && !isNaN(+labels[key].sort)) {
                sum = sum +labels[key].sort;
            }
        }
        return sum;
    }


	_class.save = function() {
		Storage.put("Settings", _class.info);
		convertLabelDefines();
	}
	_class.load = function() {
		Storage.get("Settings", {owner:"", project:"", labelDefines:[]}, function(value){
		    delete value.progress;
			_class.info = value;
			convertLabelDefines();
			console.log(JSON.stringify(value));
		});
	}

    function convertLabelDefines() {
        labelDefines = {};
        if (_class.info.labelDefines == null) return;
        for (var i=0; i< _class.info.labelDefines.length;i++) {
            var item = _class.info.labelDefines[i];
            labelDefines[item.name] = item;
        }
    }

})(Settings);

$(function(){
	Settings.load();
});
