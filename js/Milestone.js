

function Milestone(){}

(function(_class){
	_class.settings = {
		milesotones: {}
	}

	_class.onLoadMilestones = function(milestones) {
		_class.settings.milesotones = {};
		for (var id in milestones) {
			_class.settings.milesotones[id] = {title: milestones[id].title}
		}
		_class.save();
		_class.apply();
	}

	_class.apply = function() {
		var milestones = _class.settings.milesotones;
		var $sel = $("#milestoneSelector");
		$sel.html("<option>*</option>");
		for (var id in milestones) {
			var item = milestones[id];
			$sel.append($("<option value='"+item.title+"'>"+item.title+"</option>"));
		}
	}

	_class.load = function() {
		Storage.get("Milestone", {milesotones: {}}, function(value){
			_class.settings = value;
			_class.apply();
		});
	}
	_class.save = function() {
		Storage.put("Milestone", _class.settings);
	}

})(Milestone);

$(function(){
	Milestone.load();
});
