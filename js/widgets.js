$("#gr_grid_widget_1537519538").bind("DOMSubtreeModified", function(){
	$('#gr_grid_widget_1537519538 .gr_grid_container a').each(function( index ) {
	  $(this).attr("target", "_blank");
	});

	$("#goodreads").html($("#gr_grid_widget_1537519538").html());
});