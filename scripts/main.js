feedUrl = 'http://www.sonypictures.com/tv/shows/wheel/minisites/newyearsvegas/channel.xml';
isInline = true;
embedWidth = '940';
embedHeight = '530';
inlineContainer = 'videoplayer';

$(function() {
	$('.captioncontainer').css('height', '100%');
	setTimeout(function() { scrollPage(location.hash); }, 420);
	initListeners();
	setupVirtualTour();
});
var alreadyloaded = false;
var scrolling = false;
function scrollIt (obj, dist) {
	if(scrolling) {
		var left = obj.scrollLeft();
		left += dist;
		obj.scrollLeft(left);
		setTimeout(function(){ scrollIt(obj, dist)}, 23);
	}
}

function initListeners() {
	// tabs
	$('.tablist a').click(function() {
		if( $('#pollcontainer:visible').length > 0 )
			$('#pollcontainer #close').trigger('click');

		if( $(this).hasClass('game') ) return;
		$('.tablist .active').removeClass('active');
		
		if( $(this).hasClass('tour') ) { 
			$('.tab').hide(); 
			toggleVirtualTour(true); 
			return false; 
		}
		toggleVirtualTour(false);

		$(this).parent().addClass('active');
		var tab = $(this).attr('href');
		$('.tab').hide();
		$(tab).show();
		$('#contestantcontainer').scrollLeft(0);


		if( alreadyloaded && $(this).attr('href') == '#contestantstab' )
			sCode.trackPageView("contestants.html");

		return false;
	})
	$('.tablist a').eq(0).trigger('click');
	alreadyloaded = true;

	// video thumbnails
	$('.tab li').click(function() {
		if( $('#pollcontainer:visible').length > 0 )
			$('#pollcontainer #close').trigger('click');
		$('.tab .active').removeClass('active');
		$(this).addClass('active');
		var clipid = $(this).find('a').attr('href');
		externalPlay(clipid);

		return false;
	});


	// paging thumbnails
	$('#contestantstab .left').click(function() {
		$('#contestantcontainer ul').animate({left:0}, 420, 'easeOutCubic');
		return false;
	});

	$('#contestantstab .right').click(function() {
		$('#contestantcontainer ul').animate({left:-900}, 420, 'easeOutCubic');
		return false;
	});

	// gallery
	$('.gallerycontainer .left').mousedown(function() {
		scrolling = true;
		scrollIt( $(this).siblings('.imagecontainer'), -42);
	})
	$('.gallerycontainer .right').mousedown(function() {
		scrolling = true;
		scrollIt( $(this).siblings('.imagecontainer'), 42);
	})
	$('.gallerycontainer .left, .gallerycontainer .right').mouseup(function() {
		scrolling = false;
	})

	// gallery tablet
	$('.gallerycontainer .left').bind('touchstart', function() {
		scrolling = true;
		scrollIt( $(this).siblings('.imagecontainer'), -42);
	})
	$('.gallerycontainer .right').bind('touchstart', function() {
		scrolling = true;
		scrollIt( $(this).siblings('.imagecontainer'), 42);
	})
	$('.gallerycontainer .left, .gallerycontainer .right').bind('touchend', function() {
		scrolling = false;
	});
	if('ontouchstart' in window) {
		$('#backstagesection li').click(function() {
			$(this).toggleClass('active');
		});
	}

	// poll
	$('#poll').click(function() {
		sCode.trackOutboundClick('#poll', 'body_takethepoll_button');
		$('#pollcontainer').slideDown(316);
		checkPoll();
		if('ontouchstart' in window) {
			$('#videoplayer').hide();
		}
	})
	$('#pollcontainer #close').click(function() {
		$('#pollcontainer').slideUp('fast');
		//$.removeCookie('polltaken');
		if('ontouchstart' in window) {
			$('#videoplayer').show();
			$('#virtualtour').css('display', 'none');
		}
	})

	$('#pollcontainer li').click(function() {
		$('#pollcontainer li').removeClass('active');
		$(this).addClass('active');
	})
	$('#vote').click(vote);

	// scrolling 
	$(window).scroll(function() {
		var fixednum = 102; var mtop = 100;
		if( $(this).scrollTop() >= fixednum ) { $('#bars').css({'position':'fixed', 'top':'0'}); $('#hero').css('margin-top', mtop); }
		if( $(this).scrollTop() < fixednum ) { $('#bars').css({'position':'relative', 'top':'-4px'}); $('#hero').css('margin-top', '-9px'); }
	}).scroll();

	// navbar
	$('#nav li').click(function() {
		scrollPage( $(this).find('a').attr('href') );
	});

	$('a[rel="external"]').click(function() {
		/*$('#embedContainer').get(0).pauseVideo();*/
	});
}

function scrollPage( id ) {
	var links = {
			'#contestants':'#videosection',
			'#photos':'#photosection',
			'#backstagepass':'#backstagesection'
		};

		var scrollto = links[id];

		if( scrollto === undefined ) return false;

		var offsettop = $(scrollto).offset().top - 96;
		$('html,body').stop().animate({scrollTop:offsettop});

		sCode.trackPageView(id.slice(1)+'.html');
}

function setupVirtualTour() {
	//Swf Properties
	var FLPROPS = {	
		flashversion: '11',
		divId: 'virtualtourcontent',
		width: '940',
		height: '530',
		flashvars: {},
		params: {
			base:'media/', 
			allowScriptAccess:'always',
			allowFullScreen: 'false',
			wmode: 'opaque',
			bgcolor: '#020f18'
		},
		attributes: {},
		path:'media/panorama.jpg'
	};

	swfobject.embedSWF(
		FLPROPS.path,
		FLPROPS.divId,
		FLPROPS.width,
		FLPROPS.height,
		FLPROPS.flashversion,
		"",
		FLPROPS.flashvars,
		FLPROPS.params,
		FLPROPS.attributes
	);
}

function toggleVirtualTour( show ) {
	if(show) {
		//$('#embedContainer').get(0).pauseVideo();
		$('#videoplayer').hide();
		$('#virtualtour').css('display', 'inline-block');
	} 
	else {
		$('#virtualtour').hide();
		$('#videoplayer').css('display', 'inline-block');
	}
	return false;
}

function checkPoll() {
	if( $.cookie('polltaken') ) {
		$.get('poll/pollworker.php', function(data) {
			data = $.parseJSON(data);
			displayPoll(data);	
		});	
	}
}

pollanswers = null;
function displayPoll( data ) {
	$('#pollcontainer').addClass('results');
	var answers = data.answers;
	pollanswers = data.answers;
	var q1 = data.answers[1]['percent']; q1 = q1 < 10 ? 10 : q1 < 20 ? q1 + 5 : q1;
	var q2 = data.answers[2]['percent']; q2 = q2 < 10 ? 10 : q2 < 20 ? q2 + 5 : q2;
	var q3 = data.answers[3]['percent']; q3 = q3 < 10 ? 10 : q3 < 20 ? q3 + 5 : q3;
	var q4 = data.answers[4]['percent']; q4 = q4 < 10 ? 10 : q4 < 20 ? q4 + 5 : q4;
	$('#pollcontainer.results li').eq(0).find('.pollbars').animate({width:q1+'%'}, 316, 'easeOutCubic');
	$('#pollcontainer.results li').eq(0).find('.pollvalue').text(data.answers[1]['percent']+'%');
	$('#pollcontainer.results li').eq(1).find('.pollbars').animate({width:q2+'%'}, 316, 'easeOutCubic');
	$('#pollcontainer.results li').eq(1).find('.pollvalue').text(data.answers[2]['percent']+'%');
	$('#pollcontainer.results li').eq(2).find('.pollbars').animate({width:q3+'%'}, 316, 'easeOutCubic');
	$('#pollcontainer.results li').eq(2).find('.pollvalue').text(data.answers[3]['percent']+'%');
	$('#pollcontainer.results li').eq(3).find('.pollbars').animate({width:q4+'%'}, 316, 'easeOutCubic');
	$('#pollcontainer.results li').eq(3).find('.pollvalue').text(data.answers[4]['percent']+'%');	
}

function vote() {
	if( $('#pollcontainer li.active').length == 0 ) return false;
	var ans = $('#pollcontainer li.active').attr('data-a');
	$.post('poll/pollworker.php', {'answerId':ans}, function(data) {
		data = $.parseJSON(data);
		displayPoll(data);
		$.cookie('polltaken', true);
	});

	return false;
}

