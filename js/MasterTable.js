

function MasterTable(){this.initialize.apply(this, arguments)};
(function(Class){
	var masterTable = {};

	Class.put = function(name, id, data) {
	    if (masterTable[name] == undefined) masterTable[name]= {};
	    if ( masterTable[name][id]) return;
	    masterTable[name][id] = data;
	    Storage.put("MasterTable", masterTable);
	}
	Class.getAll = function(name) {
        return masterTable[name];
	}
	Class.each = function(name, callback) {

	}
	Class.remove = function(name) {
	    delete  masterTable[name][id];
	    Storage.put("MasterTable", masterTable);
	}

	Class.load = function() {
        Storage.get("MasterTable", {}, function(value){
            masterTable = value;
        });
	}

})(MasterTable);

$(function(){
	MasterTable.load();
});