/**
*
* Note:
*    - The code for the popup was shamelessly stolen (with his permission:-) from Shane McCarron
*    - The code for setting and numbering a requirement is based on the requirement.js code in respec
*
**/

/* jshint shadow: true, unused: false, laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global $, require */

function rdisplay() {
	ucrUri = respecConfig.ucrUri === undefined ? "" : respecConfig.ucrUri ;
	$(".req-ref,.req-ref-descr,.req-ref-full").each(function(i) {
		var id = $(this).attr("href");
		var $ref = $(this);
		reqInfo.forEach( function(element, index, array) {
			if( ('#' + element.id) === id ) {
				if($ref.hasClass("req-ref-descr")) {
					$ref.replaceWith("<span>" + element.content + "</span>")
				} else {
					$ref.attr("href", ucrUri + id)
					if($ref.hasClass('req-ref-full')) {
						$ref.append(element.title + ": " + element.content);
					} else {
						$ref.append(element.title)
					}
				}
			}
		});
	});

	// Generate the table of requirements
    $("#reqtable").each( function() {
        var $table = $(this),
            $tbody = $table.find("tbody");
        reqInfo.forEach( function(element, index, array) {
            var $row = $("<tr></tr>"),
                $refCell = $("<td></td>"),
                $desCell = $("<td></td>"),
                $link = $("<a></a>");

            $link.attr("href", ucrUri + "#" + element.id);
            $link.append(element.title);
            $refCell.append($link);
            $row.append($refCell);

            $desCell.append(element.content);
            $row.append($desCell);

            $tbody.append($row);
        })
    });
//	$("table#reqtable").each( function(i) {
//		var $table = $(this);
//		$("table#reqtable tbody").each( function(i) {
//			var $table = $(this);
//		});
//		reqInfo.forEach( function(element, index, array) {
//			// Add a new table row to the table itself
//			var $row = $("<tr></tr>");
//			$table.append($row);
//
//			cellref = $("<td></td>");
//			$row.append(cellref)
//			reqref = $("<a></a>");
//			cellref.append(reqref);
//			reqref.attr("href", ucrUri + "#" + element.id);
//			reqref.append(element.title)
//
//			celltitle = $("<td></td>");
//			$row.append(celltitle);
//			celltitle.append(element.content);
//		})
//	});

    // Generate the tables of conformance tiers
    $("table.conformance").each( function() {
        var $table = $(this),
            $tbody = $table.find("tbody");
        reqInfo.forEach( function(element, index, array) {
            var $req = $("#" + element.id);
            if ($req.hasClass($table.data("display"))) {
                var $row = $("<tr></tr>"),
                    $refCell = $("<td></td>"),
                    $desCell = $("<td></td>"),
                    $link = $("<a></a>");

                $link.attr("href", ucrUri + "#" + element.id);
                $link.append(element.title);
                $refCell.append($link);
                $row.append($refCell);

                $desCell.append(element.content);
                $row.append($desCell);

                $tbody.append($row);
            }
        })
    });

	$("ul#reclist, ol#reclist").each( function(i) {
		var $list = $(this);
		reqInfo.forEach( function(element, index, array){
			var $li = $("<li></li>");
			$list.append($li);

			$a = $("<a></a>");
			$li.append($a);
			$a.attr("href", ucrUri + '#' + element.id);
			$a.append(element.title)

			$span = $("<span></span>");
			$li.append($span);
			$span.append(": " + element.content)
		})
	})
}

function ucdisplay() {
    ucrUri = respecConfig.ucrUri === undefined ? "" : respecConfig.ucrUri ;

    $("table.uc-category").each( function() {
        var $table = $(this),
            $tbody = $table.find("tbody");
        ucInfo.forEach( function(element, index, array) {
            var $uc = $("#" + element.id);
            if ($uc.hasClass($table.data("display"))) {
                var reqId = "r_" + element.id.split("_")[1],
                    req = $.grep(reqInfo, function (a) { return a.id == reqId })[0],
                    $row = $("<tr></tr>"),
                    $reqCell = $("<td></td>"),
                    $reqLink = $("<a></a>"),
                    $ucCell = $("<td></td>"),
                    $ucLink = $("<a></a>"),
                    $desCell = $("<td></td>");

                $reqLink.attr("href", ucrUri + "#" + req.id);
                $reqLink.append(req.title);
                $reqCell.append($reqLink);
                $row.append($reqCell);

                $ucLink.attr("href", ucrUri + "#" + element.id);
                $ucLink.append(element.title);
                $ucCell.append($ucLink);
                $row.append($ucCell);

                $desCell.append(element.content);
                $row.append($desCell);

                $tbody.append($row);
            }
        })
    });

}

require(["core/pubsubhub"], function(respecEvents) {
	// respecEvents.sub("start-all", function() {
	// });
});
