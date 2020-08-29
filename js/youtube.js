(function($) {
	var apiKey = "AIzaSyDDESJFiHL92Z8tgF2filtAT116nkuAe2Q";
	var playlist = "PL5LmSJWMsjQmkksc8VEWU3qrDLjveLAVG"
	var maxRes = 3;
	var nextPage = null;
	var prevPage = null;
	var mainDiv = $("#blog");

	if(isMobile.any) {
		$("#loading").remove();
	}

	var getVideos = function(page) {
		var requestData = {
			part: "snippet",
	        maxResults: maxRes,
	        playlistId: playlist,
	        key: apiKey
    	};

    	if(typeof page !== "undefined") {
    		requestData.pageToken = page;
    	}

		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/playlistItems",
			method: "GET",
			data: requestData
		}).done(function( data ) {
			if(typeof data.nextPageToken !== "undefined") {
				nextPage = data.nextPageToken;
			}else {nextPage = null;}
			if(typeof data.prevPageToken !== "undefined") {
				prevPage = data.prevPageToken;
			}else {prevPage = null;}
			printData(data);
			$("#widgets").fadeIn( "slow" );
			$("#loading").fadeOut( "slow" );
		});
	};

	var printData = function(data) {
		mainDiv.html("");
		
		for (var i = 0; i < data.items.length; i++) {
			var title = data.items[i].snippet.title;
			var videoCode = data.items[i].snippet.resourceId.videoId;

			var thumbnail = "img/default-thumbnail.jpg";
			if(typeof data.items[i].snippet.thumbnails.maxres !== "undefined") {
				thumbnail = data.items[i].snippet.thumbnails.maxres.url;
			}else if(typeof data.items[i].snippet.thumbnails.high !== "undefined") {
				thumbnail = data.items[i].snippet.thumbnails.high.url;
			}else if(typeof data.items[i].snippet.thumbnails.default !== "undefined") {
				thumbnail = data.items[i].snippet.thumbnails.default.url;
			}
			
			var htmlTitle = $("<h1>").addClass("title").html(title);
			
			var htmlVideo = $('<div class="video-wrapper" data-video-id="' + videoCode + '"></div>');
            if(isMobile.any) {
                htmlVideo.append(buildIframe(videoCode));
            } else {
                htmlVideo.append('<img src="' + thumbnail + '">');
                htmlVideo.append('<div class="play"></div>');
                htmlVideo.click(function() {
                    var $elem = $(this).closest(".video-wrapper");
                    var videoCode = $elem.data('video-id');

                    $elem.html(buildIframe(videoCode));
                });
			}

			var articleWrapper = $("<article>");
			articleWrapper.append(htmlTitle);
			articleWrapper.append(htmlVideo);
			articleWrapper.append('<div class="clearfix"></div>');

			mainDiv.append(articleWrapper);
		}

		var pagination = $("<div>").addClass("pagination");
		if(prevPage !== null) {
			var prevBtn = $("<div>").addClass('prev btn').html('Prev');
			prevBtn.click(function() {
				$("#loading").fadeIn( "slow" );
				getVideos(prevPage);
				$("html, body").animate({ scrollTop: 0 }, "slow");
			});

			pagination.append(prevBtn);
		}

		if(nextPage !== null) {
			var nextBtn = $("<div>").addClass('next btn').html('Next');
			nextBtn.click(function() {
				$("#loading").fadeIn( "slow" );
				getVideos(nextPage);
				$("html, body").animate({ scrollTop: 0 }, "slow");
			});

			pagination.append(nextBtn);
		}

		pagination.append('<div class="clearfix"></div>');
		mainDiv.append(pagination);
	};

	var buildIframe = function(code) {
        //$elem.html('<iframe width="1280" height="720" src="https://www.youtube-nocookie.com/embed/' + videoCode + '?rel=0&autoplay=1&controls=1&showinfo=0&VQ=HD720" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
        return '<iframe width="640" height="360" src="//youtube.com/embed/' + code + '?VQ=HD720&rel=0&autoplay=1&controls=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
    };

	getVideos();
})(jQuery);
