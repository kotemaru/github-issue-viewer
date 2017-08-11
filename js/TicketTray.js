
//@Singleton
function TicketTray(){this.initialize.apply(this, arguments)};
(function(_class){
	var _TICKET_TRAY    = "#ticketTray";
	var _TICKET         = "#ticketTray .ExTableRow";
	var TicketSelect    = "TicketSelect";
	var _TicketSelect   = "."+TicketSelect;
	var TicketUnChecked = "TicketUnChecked";
	var ExTableBody     = "ExTableBody";
	var _ExTableBody    = "."+ExTableBody;
	var _Folder         = ".Folder";


	var SETTERS = {
		id:			function($elem,issue) {
			$elem.text(issue.id);
			var $ticket = $elem.parent();
			$ticket[0].dataset.num = issue.id;
			$ticket[0].dataset.subject = issue.subject;
//			$ticket.toggle_class(TicketUnChecked, !TicketPool.isChecked(issue.id));
		},
//		project:	function($elem,issue) {$elem.html(name(issue.project));},
//		tracker:	function($elem,issue) {$elem.html(name(issue.tracker));},
//		priority:	function($elem,issue) {$elem.html(name(issue.priority));},
    	assigned_to : function($elem, issue) {
            $elem.html("");
            for (var i = 0; i < issue.assigned_to.length; i++) {
                var img = Common.createImage(issue.assigned_to[i].icon);
                $elem.append(img);
            }
        },
//		author:     function($elem,issue) {$elem.html(name(issue.author));},
		subject:	function($elem,issue) {$elem.text(issue.subject);},

//		start_date:	function($elem,issue) {$elem.html(toYYMMDD(issue.start_date));},
//		due_date:	function($elem,issue) {$elem.html(toYYMMDD(issue.due_date));},
		updated_on:	function($elem,issue) {$elem.html(toYYMMDD(issue.updated_on));},

		done_ratio: function($elem,issue) {
			$elem.html("<div class='RateBar'><span></span></div>");
			$elem.find(">div>span").css("width",issue.done_ratio+"%");
		},
		label:		function($elem,issue) {
			//console.log("label bug:",issue.labels.indexOf("bug"), issue.labels, );
			$elem.html("");
			for (var key in issue.labels) {
			    if (issue.labels[key].icon && issue.labels[key].icon != "") {
                    $elem.append("<img src='"+issue.labels[key].icon+"'/>");
			    }
			}
		},

	};
	var COMPS = {
		id:			function(a,b) {console.log(a,b);return a.id-b.id;},
		project:	function(a,b){return compId(a,b,"project");},
		tracker:	function(a,b){return compId(a,b,"tracker");},
		priority:	function(a,b){return compId(a,b,"priority");},
		assigned_to:function(a,b){
		    var aId = (a.assigned_to.length>0) ? a.assigned_to[0].id : 0;
		    var bId = (b.assigned_to.length>0) ? b.assigned_to[0].id : 0;
		    return aId - bId;
		},
		author:     function(a,b){return compName(a,b,"author");},
		subject:	function(a,b){var A=a.subject,B=b.subject;return(A==B?0:(A<B?-1:1));},

		start_date:	function(a,b){return compDate(a,b,"start_date");},
		due_date:	function(a,b){return compDate(a,b,"due_date");},
		updated_on:	function(a,b){return compDate(a,b,"updated_on");},

		done_ratio: function(a,b){return(a.done_ratio-b.done_ratio);},
		label: 		function(a,b){return Repo.getLabelSortOrder(a.labels) - Repo.getLabelSortOrder(b.labels);},
	};
	function compId(a,b,key) {
		var A = a[key]?a[key].id:-1;
		var B = b[key]?b[key].id:-1;
		return A-B;
	}
	function compName(a,b,key) {
		var A = a[key]?a[key].name:"";
		var B = b[key]?b[key].name:"";
		return (A==B?0:(A<B?-1:1));
	}
	function compDate(a,b,key) {
		var A = Date.parse(a[key]);
		var B = Date.parse(b[key]);
		return A-B;
	}

	// カラムメタ情報
	var COLUMN_METAS =[
		{title:"番号",   		width:36, setter:SETTERS.id, comparator:COMPS.id,		style:{textAlign:"right"}},
//		{title:"プロジェクト", 	width:80, setter:SETTERS.project, 	 comparator:COMPS.project },
		{title:"タグ", 			width:32, setter:SETTERS.label,	 	 comparator:COMPS.label },
//		{title:"トラッカー",	width:70, setter:SETTERS.tracker, 	 comparator:COMPS.tracker },
//		{title:"優先度", 		width:48, setter:SETTERS.priority, 	 comparator:COMPS.priority },
		{title:"担当者", 		width:97, setter:SETTERS.assigned_to, comparator:COMPS.assigned_to },
//		{title:"作成者", 		width:97, setter:SETTERS.author,     comparator:COMPS.author },
		{title:"更新日",		width:54, setter:SETTERS.updated_on, comparator:COMPS.updated_on },
//		{title:"開始日", 		width:54, setter:SETTERS.start_date, comparator:COMPS.start_date },
//		{title:"期日", 			width:54, setter:SETTERS.due_date, 	 comparator:COMPS.due_date },
		{title:"進捗", 			width:28, setter:SETTERS.done_ratio, comparator:COMPS.done_ratio },
		{title:"題名",   		width:"100%",  setter:SETTERS.subject, comparator:COMPS.subject, style:{whiteSpace:"normal", height:"auto"}}
	];

	var SORT_NAME = [
	    "id",
//		"project",
		"label",
//		"tracker",
//		"priority",
		"assigned_to",
//		"author",
		"updated_on",
//		"start_date",
//		"due_date",
		"done_ratio",
		"subject"
	];


	//------------------------------------------------------
	var exTable = null;

	// 「進捗」表示用カスタムカラム関数
	function rateSetter($elem,data,index) {
		var val = data[index];
		$elem.html("<div class='RateBar'><span></span></div>");
		$elem.find(">div>span").css("width",val+"%");
	}


	function name(data){
		return data?data.name:"&nbsp;";
	}
	function to2ChStr(n) {
		if (n > 9) return ""+n;
		//return "&nbsp;"+n;
		return "0"+n;
	}
	function toYYMMDD(dateStr) {
		var time = Date.parse(dateStr);
		if (isNaN(time)) return "&nbsp;";
		var date = new Date(time);
		var text = (date.getFullYear()%100)
			+"/"+to2ChStr(date.getMonth()+1)
			+"/"+to2ChStr(date.getDate())
			+" "+to2ChStr(date.getHours())
			+":"+to2ChStr(date.getMinutes())
			+":"+to2ChStr(date.getSeconds())
		;
		return text
	}

	function toMMDD(dateStr) {
		var time = Date.parse(dateStr);
		if (isNaN(time)) return "&nbsp;";
		var date = new Date(time);
		return to2ChStr(date.getMonth()+1)+"/"+to2ChStr(date.getDate());
 	}

	_class.setTickets = function(tickets) {
		var data = [];
		for (var k in tickets) {
			var issue = tickets[k];
			data.push(issue);
		}
		exTable.data(data);
	}
	_class.setTicketNums = function(nums) {
		var data = [];
		for (var i=0; i<nums.length; i++) {
			data.push(TicketPool.get(nums[i]));
		}
		exTable.data(data);
	}

	_class.sort = function(idx, desc) {
		return exTable.sort(idx, desc);
	}

	_class.getSortInfo = function() {
		var sortInfo = exTable.getSortInfo();
		if (sortInfo == null) return null;
		sortInfo.name = SORT_NAME[sortInfo.index];
		return sortInfo;
	}
	_class.refresh = function() {
		return exTable.refresh();
	}

	//---------------------------------------------------------------------
	// Event Handler

	var isDrag = false;

	_class.isDrag = function(b) {
		if (b !== undefined) isDrag = b;
		return isDrag;
	}

	_class.setDragCursor = function() {
		$(document.body).css("cursor", _class.getDragCursor(true));
		$(_Folder).css("cursor", _class.getDragCursor(false));
	}

	_class.getDragCursor = function(isNo) {
		if (isDrag) {
			var sels = _class.getSelection();
			var img = (sels.length>=2) ? "tickets":"ticket";
			if (isNo) img += "-no";
			return "url(img/"+img+".png) 16 8, pointer";
		} else {
			return "default";
		}
	}

	_class.getSelection = function() {
		var selection = [];
		var tickets = $(_TicketSelect);
		for (var i=0; i<tickets.length; i++) {
			selection.push(tickets[i].dataset.num);
		}
		return selection;
	}
	_class.clearSelection = function() {
		$(_TicketSelect).remove_class(TicketSelect);
	}
	_class.addSelection = function(elem) {
		$(elem).add_class(TicketSelect);
	}
	_class.hasScrollBar = function() {
		var tray =  $(_TICKET_TRAY+" "+_ExTableBody)[0];
		return (tray.clientHeight < tray.scrollHeight);
	}

	function bindMove() {
		// Ticket
		var draggable = null;
		var downTime = 0;
		$(document).on("mousedown",_TICKET,function(ev){
			_class.isDrag(true);
			draggable = this;
			downTime = new Date().getTime();
			return false;
		}).on("mousemove",_TICKET,function(ev){
			var isClick = (100 > (new Date().getTime() - downTime));
			if (!isClick && draggable == this) {
				_class.setDragCursor();
				if (_class.isDrag()) {
					_class.addSelection(this);
				}
			}
		}).on("mouseout",_TICKET,function(ev){
			if (draggable == this) {
				draggable = null;
			}
		}).on("mouseup",_TICKET,function(ev){
			var isClick = (200 > (new Date().getTime() - downTime));
			if (isClick) {
				if (!ev.ctrlKey) _class.clearSelection();
				$(this).toggle_class(TicketSelect);
				draggable = null;
			}
		}).on("dblclick",_TICKET,function(ev){
			var num = this.dataset.num;
			//RedMine.openIssue(num);
			//TicketPool.checked(num);
			_class.refresh();
			//Folders.refresh();
			window.open(Repo.getGithubLink(num), "_blank");
		});

		$(document).on("mouseup","body",function(ev){
			//_class.clearSelection();
			// ハンドラが先に実行されるので遅らせる。
			setTimeout(function(){
				draggable = null;
				_class.isDrag(false);
				_class.setDragCursor();
			}, 10);
		});
	}
	
	_class.onLoadIssue = function(json) {
		var issues = [];
		for (var i=0;i<json.items.length;i++) {
			var item = json.items[i];
			var assigned = toAssigned(item.assignees);
			(item.assignees.length>0) ? item.assignees[0].login : "";
			var labels = Repo.getLabels(item);
			var issue = {
				id:				item.number, 		// 番号
				assigned_to:	assigned, 	// 担当者
				updated_on:		item.updated_at, 	// 更新日
				done_ratio:		Repo.getProgress(item, labels), 	// 進捗
				subject:		item.title,
				labels:			labels
			};
			if (labels["REJECT"] === undefined) {
				issues.push(issue);
			}
		}
		TicketTray.setData(issues);
	}
	function toAssigned(assignees) {
	    var assigned = [];
	    for (var i=0;i<assignees.length; i++) {
	        var ass = assignees[i];
	        assigned.push({id:ass.id, name:ass.login, icon:ass.avatar_url});
	    }
	    return assigned;
	}
	
	//----------------------------------------------------------------
	// 初期化

	function save(ev, columnMetas) {
		Storage.put("columnMetas", columnMetas);
	}
	function load(exTable) {
		//var metas = Storage.get("columnMetas", COLUMN_METAS);
		var metas = COLUMN_METAS;
		// Note:関数は保存出来い...
		for (var i=0; i<metas.length; i++) {
			metas[i].setter = COLUMN_METAS[i].setter;
			metas[i].comparator = COLUMN_METAS[i].comparator;
		}
		exTable.header(metas);
	}

	function onScroll() {
	/*
		var bottom = this.scrollTop+this.clientHeight;
		//console.log(this.scrollTop, this.scrollHeight);
		if (Folders.isCurrentInbox() && bottom >= this.scrollHeight) {
			var scrollTop = this.scrollTop;
			var self = this;
			Inbox.next(function(issues){
				setTimeout(function(){
					//console.log("--->",self.scrollTop, scrollTop);
					self.scrollTop = scrollTop;
				},1);
			});
		}
		*/
	}


	$(function(){
		// テーブル生成
		exTable = new ExTable(_TICKET_TRAY);
		load(exTable);
		exTable.data([]);
		$(_TICKET_TRAY).bind("columnmove",save).bind("columnresize",save);
		bindMove();

		var $body = $(_TICKET_TRAY+" "+_ExTableBody);
		//$body.bind("scroll",function(){ // Note: 動かない。jQueryバグ？
		//	console.log("->",this.scrollTop);
		//});
		$body[0].onscroll = onScroll;
	})

	_class.setData = function(data) {
		exTable.data(data);
	}

	_class.clipbordCopy = function(){
		document.oncopy = function(event) {
			var html = "<table>\n";
			var tickets = $(_TicketSelect);
			for (var i=0; i<tickets.length; i++) {
				var dataset = tickets[i].dataset;
	 			html += "<tr><td><a href='"+ Repo.getGithubLink(dataset.num)+"'>#"+dataset.num+"</a></td><td>"+dataset.subject+"</td></tr>\n"
			}
			html += "</table>";
			event.clipboardData.setData("text/html", html);
			event.clipboardData.setData("text/plain", html);
			event.preventDefault();
		};
		document.execCommand("Copy", false, null);
	}
	
})(TicketTray);
