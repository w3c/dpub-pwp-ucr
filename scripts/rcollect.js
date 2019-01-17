/**
*
* Note: 
*    The code for the popup was shamelessly stolen (with his permission:-) from Shane McCarron
*    The code for setting and numbering a requirement is based on the requirement.js code in respec
*
**/

/* jshint shadow: true, unused: false, laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global $, require */

var reqInfo =  [
];

var ucInfo =  [
];

function rcollect() {
	// Collect the necessary information on the various requirement entries right at the start...
	$(".req-set").each(function (i) {
		i++;
		var $req = $(this)
		,   title = "Req.&nbsp;" + i
		,   content = $req.html()
		;
		if( content.charAt(content.length-1) === '.' ) {
			content = content.slice(0,-1);
		}
		reqInfo.push({
            number: i,
			content: content,
			title: title,
			id: $req.attr("id")
		});
		$req.prepend("<a href='#" + $req.attr("id") + "'>" + title + "</a>: ");
	});
}

function uccollect() {
    // Collect the necessary information on the various use case entries right at the start...
    $("ul.use-cases > li").each(function (i) {
        i++;
        var $uc = $(this),
            title = "UC&nbsp;" + i,
            content = $uc.html();
        //if( content.charAt(content.length-1) === '.' ) {
        //    content = content.slice(0,-1);
        //}
        ucInfo.push({
            number: i,
            content: content,
            title: title,
            id: $uc.attr("id")
        });
        $uc.prepend("<a href='#" + $uc.attr("id") + "'>" + title + "</a>: ");
    });
}

function rstore() {
	var m = document.URL;
	if (m.match(/\#saveReqs/)) {
		var $modal
		,   $overlay
		,   buttons = {}
		;
		var conf, doc, msg;
		var ui = {
			closeModal: function () {
				if ($overlay) {
					$overlay.fadeOut(200, function () { $overlay.remove(); $overlay = null; });
				}
				if (!$modal) {
					return;
				}
				$modal.remove();
				$modal = null;
			}
		,   freshModal: function (title, content) {
				if ($modal) {
					$modal.remove();
				}
				if ($overlay) {
					$overlay.remove();
				}
				var width = 500;
				$overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide();
				$modal = $("<div id='respec-modal' class='removeOnSave'><h3></h3><div class='inside'></div></div>").hide();
				$modal.find("h3").text(title);
				$modal.find(".inside").append(content);
				$("body")
					.append($overlay)
					.append($modal);
				$overlay
					.click(this.closeModal)
					.css({
						display:    "block"
					,   opacity:    0
					,   position:   "fixed"
					,   zIndex:     10000
					,   top:        "0px"
					,   left:       "0px"
					,   height:     "100%"
					,   width:      "100%"
					,   background: "#000"
					})
					.fadeTo(200, 0.5)
					;
				$modal
					.css({
						display:        "block"
					,   position:       "fixed"
					,   opacity:        0
					,   zIndex:         11000
					,   left:           "50%"
					,   marginLeft:     -(width/2) + "px"
					,   top:            "100px"
					,   background:     "#fff"
					,   border:         "5px solid #666"
					,   borderRadius:   "5px"
					,   width:          width + "px"
					,   padding:        "0 20px 20px 20px"
					,   maxHeight:      ($(window).height() - 150) + "px"
					,   overflowY:      "auto"
					})
					.fadeTo(200, 1)
					;
			}
		};
		var supportsDownload = $("<a href='foo' download='x'>A</a>")[0].download === "x"
		;
		var $div = $("<div></div>")
		,   buttonCSS = {
				background:     "#eee"
			,   border:         "1px solid #000"
			,   borderRadius:   "5px"
			,   padding:        "5px"
			,   margin:         "5px"
			,   display:        "block"
			,   width:          "100%"
			,   color:          "#000"
			,   textDecoration: "none"
			,   textAlign:      "center"
			,   fontSize:       "inherit"
			}
		,   addButton = function (title, content, fileName, popupContent) {
				if (supportsDownload) {
					$("<a></a>")
						.appendTo($div)
						.text(title)
						.css(buttonCSS)
						.attr({
							href:   "data:text/html;charset=utf-8," + encodeURIComponent(content)
						,   download:   fileName
						})
						.click(function () {
							ui.closeModal();
						})
						;
				}
				else {
					$("<button></button>")
						.appendTo($div)
						.text(title)
						.css(buttonCSS)
						.click(function () {
							popupContent();
							ui.closeModal();
						})
						;
				}

			}
		;
		var s = "var reqInfo = " + JSON.stringify(reqInfo, null, '\t') ;
		addButton("Save Requirement References", s, "reqInfo.js", s) ;
		ui.freshModal("Save Requirement References", $div);
	}
}

// require(["core/pubsubhub"], function(respecEvents) {
// 	respecEvents.sub("start-all", function() {
// 		rcollect();
// 	});
// 	respecEvents.sub("end-all", function() {
// 		rstore();
// 	});
// });
