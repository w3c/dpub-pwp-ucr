/**
* Collect and display data on requirements, ie, the data provided by respec for each element with class "req".
*
* For each requirement, the collected data include:
*	number: the number of the requirement (generated in document order)
*   content: the HTML content of the original element
*   title: the title provided by respec for this requirement (e.g., "Req. 1: ")
*   id: the @id value of the element, to be used to generate hyperlinks.
*
* If the respec file is used with a URI ending with "#saveReqs", a popup will come at the end
* offering to store the requirement data in a (js) file.
* That can be reused in the receiving end.
*
* The code for the popup was shameless borrowed (with his permission:-) from Shane McCarron
*
* To use it
*   - add the preProcess : [collectreqs] to the respec config.
*   - add <script src="scripts/reqscollect.js" class="remove"></script> after the reference to respec
*   - make sure that the reference to respec does not have the 'async' attribute (it does not seem to work if that is the case:-(
*
**/

/* jshint shadow: true, unused: false, laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global $, require */


var reqInfo =  [
];

// Collect the requirements' data
function collectreqs() {
	$(".req").each(function (i) {
		i++;
		var $req = $(this)
		,   title = "Req. " + i
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
	});
}

// This is alternative to respec's very own manipulation of the "a" element for a requirement; while
// that only display the 'title', ie, "Req. 3", this version, relying on the "fullReqRef" class, displays
// the full requirement instead.
function fullreqref() {
	// alert(JSON.stringify(reqInfo, null, '\t'))
	$("a.fullReqRef").each(function(i) {
		var id = $(this).attr("href");
		var $ref = $(this);
		reqInfo.forEach( function(element, index, array) {
			if( ('#' + element.id) === id ) {
				// alert("Bingo " + id)
				// alert(element.title + ": " + element.content)
				$ref.text(element.title + ": " + element.content);
			}
		});
	});
}

require(["core/pubsubhub"], function(respecEvents) {
	respecEvents.sub("end-all", function() {
		//alert("asdfas")
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
	});
});
