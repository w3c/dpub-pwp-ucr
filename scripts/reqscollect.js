/**
* Collect and display data on requirements, ie, the data provided by respec for each element with class "req".
*
* Handling 'requirements'. This is slightly different than respec's own "req" class, which did not cut it for my needs.
*
* For the users, the following are available
*
* 1. A requirement can be set via
*
*   <element class=req" id="rid">Some requirement</element>
*
* Where 'element' can be a <p>, a <span>...
*
* Effect: the element will be prepended by "Req. X", where X is the number of the requirement, assigning a number
* in document order. (This is an undocumented respec feature.)
*
* 2. A simple reference to a requirement looks as follows:
*
*   <a class="reqRef" href='#rid'></a>
*
* Effect: the <a> element becomes <a href='#rid'>Req. X</a> where 'X' is refers to the number of the requirement.
* (This is also an undocumented respect feature)
*
* 3. A full reference to requirement looks as follows:
*
*   <a class="fullReqRef" href="#rid"></a>
*
* Effect: the <a> element becomes a <a href='#rid'>Req.X: Some requirement</a>.
* (Minor note: if the original requirement text finishes with a full stop, that character is removed.
* This makes it easier to include the reference within a paragraph)
*
* 4. A table of the form:
*
* <table id="reqtable">
* </table>
*
* Will be expanded with rows; each row has two cells, the first being <a href='#rid'>Req. X</a>, the second the description
* (ie, the "Some requirement" text in this example).
*
* 5. If the URI of the respec includes the "#saveReqs" fragment ID, a popup dialogue will offer to store the list of
* requirements in a separate js file. The file is of the form:
*
* var reqInfo = [
*	{
*		"number": 1,
*		"content": "The publication should be readable in a browser",
*		"title": "Req. 1",
*		"id": "r_browser"
*	},
*	{
*		"number": 2,
*		"content": "PWPs should be able to make use of all facilities offered by the OWP",
*		"title": "Req. 2",
*		"id": "r_owp"
*	},
*
* this can be used by other documents to refer to the requirements' list
*
*
* The code for the popup was shamelessly stolen (with his permission:-) from Shane McCarron
*
* To use it
*   - add <script src="scripts/reqscollect.js" class="remove"></script> after the reference to respec
*   - make sure that the reference to respec does not have the 'async' attribute (it does not seem to work if that is the case:-(
*
**/

/* jshint shadow: true, unused: false, laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global $, require */

var reqInfo =  [
];

require(["core/pubsubhub"], function(respecEvents) {
	respecEvents.sub("start-all", function() {
		// Collect the necessary information on the various requirement entries right at the start...
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

		$("a.fullReqRef").each(function(i) {
			var id = $(this).attr("href");
			var $ref = $(this);
			reqInfo.forEach( function(element, index, array) {
				if( ('#' + element.id) === id ) {
					$ref.text(element.title + ": " + element.content);
				}
			});
		});

		// Generate the table of requirements
		$("#reqtable").each( function(i) {
			var $table = $(this);
			reqInfo.forEach( function(element, index, array) {
				// Add a new table row to the table itself
				var $row = $("<tr></tr>");
				$table.append($row);

				cellref = $("<td></td>");
				$row.append(cellref)
				reqref = $("<a></a>");
				cellref.append(reqref);
				reqref.attr("href","#" + element.id);
				reqref.text(element.title)

				celltitle = $("<td></td>");
				$row.append(celltitle);
				celltitle.text(element.content);
			})
		})
	});

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
