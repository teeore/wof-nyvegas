/*
	Overlay Player 2
*/

/** settings to include with the embed

	//required scripts:
	swfobject2.js
	jquery-1.3.2.min.js (jquery-1.3.2.min.js or higher recommended)

	//this is the only required variable
	feedUrl = "http://www.sonypictures.com/previews/movies/salt.xml";

	//the following need not be defined unless you are enabling them
	singlevideoToggle = false;
	useQAplayer = false; //default is false
	clipName = ""; //default is empty
	parentSwf = "";  //default is flashcontent
	htmlVideoMP4Lo = ""; //depreciated
	htmlVideoMP4Hi = ""; //depreciated
	htmlVideoMP4 = ""; //depreciated
	isAutoplay //default is true
	isTrackExternal //default is false
	trackSubsection //default is empty string
	displayBuyLink = false; //disables buy link in universal flash player in Universal Flash Player 1.01.02 (or higher), default is true 
	displayShare = false; //disables share link in universal flash player in Universal Flash Player 1.01.02 (or higher), default is true
	showControls = false; //will hide side controls of html 5 player for overlay player only.  controls for inline html 5 player are always hidden. default is true
	
	//to embed player inline
	variables to set:
	isInline = true;
	inlineContainer = '[ID of the div to be replaced (similar to how swfobject replaces div)]'
	
**/
var closeOverlayCallback = null; //callback function after closeOverlay() is called;
var clipName = null;
var embedContainer = 'embedContainer';
var embedWidth = '676';
var embedHeight = '396';
var useQAplayer = false;
var flashVersion = "10.3";
var parentSwf = 'flashcontent';
var singlevideoToggle = false;
var isInline = false;
var isSingleVideo = false;
var isAutoplay = true;
var isTrackExternal = false;
var trackSubsection = '';
var displayBuyLink = true;
var displayShare = true;
var intlPlayer = false;
var expressInstallURL = null;
var inlineContainer = '';
var overlayLayerId = 'overlayLayer';
var overlayPlayerContainerId = 'overlayPlayerContainer';
var htmlPlayerId = 'htmlPlayer';
var showControls = true;
var playbackCallback = null;
var absolutePathForResources = true;
var overlayPlayer2Date = new Date();

//HTML5 settings
var htmlVideoMP4Lo = ""; //depreciated
var htmlVideoMP4Hi = ""; //depreciated
var htmlVideoMP4 = "";	//depreciated

function isSingleVideoSet(){
	if (singlevideoToggle == true || isSingleVideo == true){
		return true;
	}else{
		return false;
	}
}

var overlayPlayer = function(playerSettings) {

	//absolute path to domain
	var host =  window.location.hostname, 
		domain = 'www.sonypictures.com';
		
	if(window.location.protocol == 'https:') {
		switch(host) {
			case 'secure.sonypictures.com':
				domain = 'secure.sonypictures.com';
				break;
			case 'flash.sonypictures.com':
				domain = 'flash.sonypictures.com';
				break;
		}
	} 
	
	var territoryDomain = (playerSettings.absolutePathForResources || is_lteIE8()) ? window.location.protocol + '//' + domain : '';
	
	//fix console for ie
	if(!window.console) {console = {} ; console.log = function(){};}

	function typeOf(value) {
		var s = typeof value;
		if (s === 'object') {
			if (value) {
				if (value instanceof Array) {
					s = 'array';
				}
			} else {
				s = 'null';
			}
		}
		return s;
	}
	
	function countProperties(obj) {
		var count = 0;

		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				++count;
		}

		return count;
	}
	
	function is_lteIE8(){
		if($.browser.msie && parseInt($.browser.version) <= 8) {
			return true;
		} else {
			return false;
		}
	}
	
	function is_iPad(){
		if( (/iPad/.test(navigator.userAgent)) && (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) && !(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) ){
			//if user agent returns iPad 
			return true;
		}else{
			return false;
		}
	}

	function is_iPhone(){
		//this 
		if( (/iPhone|iPod/.test(navigator.userAgent)) && (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) && !(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) ){
			//if user agent returns iPhone and iPod
			return true;
		}else{
			return false;
		}
	}

	function is_Android(){
		if( /Android/.test(navigator.userAgent)){
			//if user agent returns Android
			return true;
		}else{
			return false;
		}
	}
	
	function is_Kindle() {
		if( /Kindle/.test(navigator.userAgent) || /Silk/.test(navigator.userAgent)){
			//if user agent returns Android
			return true;
		}else{
			return false;
		}
	}
	
	function is_BadChrome() {
		if(/Chrome\/21.0.1180.83/.test(navigator.userAgent)){
			//if user agent returns Android
			return true;
		}else{
			return false;
		}
	}

	function createOverlay() {
	
		//create overlay
		if(isInline != true) {
			var overlayLayer = $(document.createElement('div')).attr({'id': playerSettings.overlayLayerId}).css({
				'height': $(document).height() + 'px',
				'opacity': '.8',
				'-ms-filter':"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)",
				'filter': 'alpha(opacity=80)',
				'zoom': '1'
			}).prependTo('body');
		
			overlayLayer.bind('click',function(){
				try {
					closeOverlay();
				}
				catch(err) {
					console.log(err);
				}
				
			});
		}
		
		//create overlay player container
		var containerWidth;
		if(playerSettings.isInline == false && playerSettings.showControls == true) {
			containerWidth = (parseInt(playerSettings.width) + 85);
		} else {
			containerWidth = playerSettings.width;
		}
		
		var overlayPlayerContainer = $(document.createElement('div')).attr({id: playerSettings.overlayPlayerContainerId}).css({
			'height':  playerSettings.height + 'px',			
			'outline': 'none',			
			'width': containerWidth + 'px',
			'z-index': '9997'
		});
		
		if(isInline != true) {
			
			overlayPlayerContainer.css({
				'display': 'none',
				'left': '50%',
				'margin-left': '-' + (parseInt(playerSettings.width) / 2) + 'px',
				'outline': 'none',
				'position': 'absolute'
			});
			overlayPlayerContainer.insertAfter(overlayLayer);			
		} else {
			overlayPlayerContainer.css({
				'display': 'block',
				'position': 'relative'
			});
			if(playerSettings.inlineContainer != '') {
				overlayPlayerContainer.appendTo('#' + playerSettings.inlineContainer);
			}
		}
		
		$(document.createElement('div')).attr({'id': playerSettings.embedContainer}).css({
			'height':  '100%',			
			'outline': 'none',
			'width': 'auto'
		}).appendTo(overlayPlayerContainer);		
	}
	
	//disable controls and hide player when showing interior pages.  bug fix for mobile safari video element absorbing all touch events when controls are enabled.
	function hidePlayer() {
		$('#' + playerSettings.htmlPlayerId).removeAttr('controls');
		$('#' + playerSettings.htmlPlayerId).css({'-webkit-transform': 'translateX(-9999px)'});
		document.getElementById(playerSettings.htmlPlayerId).pause();
	}
	
	function showPlayer() {
		var videoPlayer = document.getElementById(playerSettings.htmlPlayerId);
		
		$('#' + playerSettings.htmlPlayerId).attr({'controls': 'controls'});
		$('#' + playerSettings.htmlPlayerId).css({'-webkit-transform': 'translateX(0)'});
		
		//unbind to prevent fade in of controls when canplay event is fired
		videoPlayer.removeEventListener('canplay',fadeInControls,false);
			
		if(videoPlayer) {
			videoPlayer.play();
		}
		
		//adjust height of side controls
		$('#' + playerSettings.htmlPlayerId + 'Controls').css({
			'height': embedHeight + 'px'
		});

	}
	
	function returnToVideo() {
		//hide interior pages
		$('#interiorPages').addClass('fade-out');
		$('#interiorPages').unbind();
		$('#interiorPages').bind('webkitAnimationEnd',function(){
			$(this).removeClass('fade-out');
			$(this).hide();
			showPlayer();
		});
	}

	//show page
	function showPage(pageId){
		var selectedPage = $('#' + pageId);
		var selectedPageDom = document.getElementById(pageId);
		
		if(selectedPage.is(':hidden')) {			
			//pause video
			hidePlayer();
			
			//hide all interior pages
			$('.interior').each(function(){
				$(this).hide();
			});
			
			//show selected page
			$('#interiorPages').unbind();
			$('#interiorPages').show();
			selectedPage.show();
			selectedPage.addClass('fade-in');
			selectedPage.unbind();
			selectedPage.bind('webkitAnimationEnd',function(){
				$(this).removeClass('fade-in');						
			})
			
			//adjust height of side controls
			$('#' + playerSettings.htmlPlayerId + 'Controls').css({
				'height': selectedPage.outerHeight() + 'px'
			});	
			
			//adjust height of overlay
			$('#' + playerSettings.overlayLayerId).css({
				'min-height': '100%',
				'height': $(document).height() + 'px'
			});	
			
			//tracking
			if(typeof(sCode) == 'object') {
				var splitPage = pageId.split('page-');
				var trackingId = 'player_' + splitPage[1] + '_button';
				sCode.trackFeaturedContentClick('sonypictures.com',trackingId);
			}
			
		}			
	}	
	
	function createHTMLPlayer() {		
		//loading
		$(document.createElement('p')).attr({
			'id': 'overlayplayer-loading'
		}).addClass('overlayplayer-sprite').text('Loading...').appendTo('#' + playerSettings.embedContainer);
	
		//create html video object
		var htmlPlayer = $(document.createElement('video')).attr({
			//'autoplay': 'autoplay',
			'controls': true,
			'data-title': '',
			'id': playerSettings.htmlPlayerId,
			'height': playerSettings.height,
			'poster': '',
			'src': '',
			'width': playerSettings.width			
		}).appendTo('#' + playerSettings.embedContainer);
		
		//html 5 fallback message 
		var $html5FallbackMessage = $(document.createElement('p')).css({
			'color': '#fff',
			'font-size': '1.2em'
		}).text('This device does not support Flash 10 or HTML 5 Video.').appendTo(htmlPlayer);
		
		var getFlashLink = $(document.createElement('a')).attr({
				'href': 'http://www.adobe.com/go/getflashplayer',
				'target': '_blank'
		}).css({
			'color': '#fff'
		}).text(' Get the free Adobe Flash Player').appendTo($html5FallbackMessage);
		
		htmlPlayer.css({'-webkit-transform': 'translateX(-9999px)'});

		//video tracking
		var videoPlayer = document.getElementById(playerSettings.htmlPlayerId), duration;
		
		//get duration
		videoPlayer.addEventListener('loadedmetadata',function(e){
			duration = e.currentTarget.duration;
		},false);
		
		//start tracking
		/* videoPlayer.addEventListener('playing',function(e){
			if (Math.floor(e.currentTarget.currentTime) == 0) {		
				if(typeof(sCode) == 'object') {
					var rawTitle = e.currentTarget.getAttribute('data-title'),
					sanitizedTitle = rawTitle.split(' ').join('_').replace(/[.!?'&]/,'').toLowerCase();
					//sCode.trackVideo(sanitizedTitle, 'start');
				}
			}
		},false); */
		
		//segment tracking
		var trackingInterval = 15; //seconds
		var trackingCounter = 1;
		
		var segmentTracking = new Object();
		segmentTracking.oneSecond = false;
		segmentTracking.tenSeconds = false;
		segmentTracking.fiftyPercent = false;
		segmentTracking.seventyFivePercent = false;
		segmentTracking.currentSegment = 0;
		
		//append tracking
		function appendTracking(tracking) {
			var newTracking;
			if(is_iPhone() || is_Android()) {
					newTracking = 'mobile_' + tracking;
				} else if(is_iPad()) {
					newTracking = 'tablet_' + tracking;
				} 
			else {
				newTracking = tracking;
			}
			return newTracking;
		}
		
		videoPlayer.addEventListener('timeupdate',function(e){
			if(typeof(sCode) == 'object') {
				var rawTitle = $.trim(e.currentTarget.getAttribute('data-title')),
				sanitizedTitle = rawTitle.split(' ').join('_').replace(/[.!?'&]/,'').toLowerCase();	
				sanitizedTitle = appendTracking(sanitizedTitle);
					
				var currentTime = Math.floor(e.currentTarget.currentTime);
				
				//interval tracking
				if((currentTime / trackingInterval) == trackingCounter) {
					//console.log('fire tracking call ' + currentTime);
					trackingCounter++;
				}
			
				//1 seconds
				if(currentTime == 1) {
					if(segmentTracking.oneSecond == false) {
						sCode.trackVideo(sanitizedTitle, 'start');
						segmentTracking.oneSecond = true;
					}
				}
				
				//10 seconds
				if(currentTime == 10) {
					if(segmentTracking.tenSeconds == false) {
						segmentTracking.currentSegment = 1;
						sCode.trackVideo(sanitizedTitle, 'segment' + segmentTracking.currentSegment);
						segmentTracking.tenSeconds = true;
					}
				}
				
				//50%
				if(currentTime == Math.floor(duration * .5)) {
					if(segmentTracking.fiftyPercent == false) {
						segmentTracking.currentSegment = 2;
						sCode.trackVideo(sanitizedTitle, 'segment' + segmentTracking.currentSegment);
						segmentTracking.fiftyPercent = true;
					}
				}
				
				//75%
				if(currentTime == Math.floor(duration * .75)) {
					if(segmentTracking.seventyFivePercent == false) {
						segmentTracking.currentSegment = 3;
						sCode.trackVideo(sanitizedTitle, 'segment' + segmentTracking.currentSegment);
						segmentTracking.seventyFivePercent = true;
					}
				}
			}
		},false);
		
		//end tracking
		videoPlayer.addEventListener('ended',function(e){
			//console.log('ended');
			if(typeof(sCode) == 'object') {
				var rawTitle = $.trim(e.currentTarget.getAttribute('data-title'));
				sanitizedTitle = rawTitle.split(' ').join('_').replace(/[.!?'&]/,'').toLowerCase();
				sanitizedTitle = appendTracking(sanitizedTitle);
				sCode.trackVideo(sanitizedTitle, 'segment4');
				sCode.trackVideo(sanitizedTitle, 'end');
			}
		},false);
		
		videoPlayer.addEventListener('seeked',function(e){
			var currentTime = Math.floor(e.currentTarget.currentTime);
					
			//reset when seeked
			segmentTracking.oneSecond = false;
			segmentTracking.tenSeconds = false;
			segmentTracking.fiftyPercent = false;
			segmentTracking.seventyFivePercent = false;
			
			//end segment when seeked
			var endSegmentOnSeek = segmentTracking.currentSegment + 1;
			if(endSegmentOnSeek > 3) {
				endSegmentOnSeek = 3;
			}
			//console.log('fire tracking call: segment ' + endSegmentOnSeek);
			
			
			var trackedSections = Math.floor(currentTime / trackingInterval);
			if(trackedSections == 0) {
				trackingCounter = 1;
			} else {
				trackingCounter = trackedSections + 1;				
			}
		},false);
				
		if(playerSettings.isInline !== true) {
			//create top buttons container
			var overlayControls = $(document.createElement('ul')).attr({'id': 'overlayControls'}).appendTo('#' + playerSettings.embedContainer);
			
			overlayControls.css({'display': 'none'});
			
			if(showControls == false) {
				overlayControls.css({'right': '0'});
			}
			
			/* //menu button
			var menubuttonLi = $(document.createElement('li')).appendTo(overlayControls);
			var menubutton = $(document.createElement('a')).attr({'id': 'button-menu'}).addClass('overlayplayer-sprite').text('Menu').appendTo(menubuttonLi);
			*/
			
			//close button
			var closeButtonLi = $(document.createElement('li')).appendTo(overlayControls);
			var closeButton = $(document.createElement('a')).attr({'id': 'button-close'}).addClass('overlayplayer-sprite').text('Close').appendTo(closeButtonLi);
			
			closeButton.bind('click',function(){
				closeOverlay();
				return false;
			});	
		}
		
		
		//create nav list
		var htmlPlayerControls = $(document.createElement('div')).attr({
			'id': playerSettings.htmlPlayerId + 'Controls'
		}).css({
			'height': embedHeight + 'px'
		}).appendTo('#' + playerSettings.embedContainer);
		
		htmlPlayerControls.css({'display': 'none'});
		
		var htmlPlayerControlsUL = $(document.createElement('ul')).appendTo(htmlPlayerControls);
		
		function createButton(options) {
			var id = options.id;
			var text = options.text;
			var page = options.showPage;
			
			//create li as button container
			var buttonContainer = $(document.createElement('li')).appendTo('#' + playerSettings.htmlPlayerId + 'Controls ul');
			
			var button = $(document.createElement('a')).attr({'id': id}).addClass('overlayplayer-sprite').text(text).appendTo(buttonContainer);
			
			button.bind('click',function(){
				showPage(page);
				return false;
			});
			
			return button;
		}
		
		//info button
		var infoButton = createButton({'id': 'nav-info', 'text': 'Info', 'showPage': 'page-info'});
		
		//share button
		if(playerSettings.displayShare !== false) {
			var shareButton = createButton({'id': 'nav-share', 'text': 'Share', 'showPage': 'page-share'});
		}
		//more clips button
		if(playerSettings.singlevideoToggle !== true) {
			var moreClipsButton = createButton({'id': 'nav-moreclips', 'text': 'More Clips', 'showPage': 'page-moreclips'});
			moreClipsButton.parent().hide();
		}
		//buy now button
		if(playerSettings.displayBuyLink !== false) {
			var buyNowButton = createButton({'id': 'nav-buynow', 'text': 'Buy Now', 'showPage': 'page-buynow'});
			buyNowButton.parent().hide();
		}		
		
		//create interior pages
		var interiorPageContainer = $(document.createElement('div')).attr({'id': 'interiorPages'}).appendTo('#' + playerSettings.embedContainer);
		
		function createPage(pageId) {
			var page = $(document.createElement('div')).attr({'id': pageId}).addClass('interior').css({
				'display': 'none',
				'min-height': (playerSettings.height - 40) + 'px',
				'padding': '20px',
				'width': (playerSettings.width - 40) + 'px'
			}).appendTo('#interiorPages');
			
			return page;
		}
		
		function createReturnToVideoButton(jContainer) {
			var button = $(document.createElement('a')).addClass('returntovideo').text('Return to Video').appendTo(jContainer);
			
			button.bind('click',function(){
				returnToVideo();
				return false;
			});
			
			return button;
		}
		
		//info page
		var infoPage = createPage('page-info');
		
			//info page title
			var infoTitleContainer = $(document.createElement('div')).addClass('headerContainer').appendTo(infoPage);
			
			var infoTitle = $(document.createElement('h1')).text('Info').appendTo(infoTitleContainer);
			
			//return to video button
			var infoReturnToVideoButton = createReturnToVideoButton(infoTitleContainer);
		
		//share page
		var sharePage = createPage('page-share');
			//share page title
			var shareTitleContainer = $(document.createElement('div')).addClass('headerContainer').appendTo(sharePage);
			
			//return to video button
			var shareReturnToVideoButton = createReturnToVideoButton(shareTitleContainer);
			
		//more clips page
		var moreClipsPage = createPage('page-moreclips');
			//share page title
			var moreClipsTitleContainer = $(document.createElement('div')).addClass('headerContainer').appendTo(moreClipsPage);
			
			//return to video button
			var moreClipsReturnToVideoButton = createReturnToVideoButton(moreClipsTitleContainer);
		
		//buy now page
		var buyNowPage = createPage('page-buynow');
			//share page title
			var buyNowTitleContainer = $(document.createElement('div')).addClass('headerContainer').appendTo(buyNowPage);
			
			//var infoTitle = $(document.createElement('h1')).text('Buy').appendTo(buyNowTitleContainer);
			
			//return to video button
			var moreClipsReturnToVideoButton = createReturnToVideoButton(buyNowTitleContainer);
	}
	
	function getVideoInfo(itemObject) {
		var videoInfo = new Object();		
		
		function getVideoMetadata(videoObject){
			var videoMetadata = new Object();
			
			var description = videoObject.description;
			var fbLink = videoObject.spvideofacebookUrl;
			var link = videoObject.link;
			var miniUrl = videoObject.spvideominiUrl;
			var title = videoObject.title;
			var twitterText = videoObject.spvideotwitterText;
			var thumbnail = videoObject.mediathumbnail['@attributes'].url;
			var mediaContent = videoObject.mediagroup.mediacontent;
			
			videoMetadata['description'] = description;
			videoMetadata['fbLink'] = fbLink;
			videoMetadata['link'] = link;
			videoMetadata['miniUrl'] = miniUrl;
			videoMetadata['title'] = title;
			videoMetadata['thumbnail'] = thumbnail;
			videoMetadata['twitterText'] = twitterText;
			videoMetadata['videosrc'] = getVideoSrc(mediaContent);
			
			return videoMetadata;			
		}
		
		function getVideoSrc(mediaContentObject) {
			var videoSrc = new Object();
			
			//more than 1 media content node
			if(typeOf(mediaContentObject) == 'array') {
				for(i in mediaContentObject) {
					var videoWidth = mediaContentObject[i]['@attributes'].width;		
					videoSrc[videoWidth] = mediaContentObject[i]['@attributes'].url;	
				}
			}
			// 1 media content node
			else {
				var videoWidth = mediaContentObject['@attributes'].width;				
				videoSrc[videoWidth] = mediaContentObject['@attributes'].url;			
			}
			
			return videoSrc;
		}
		
		//more than 1 item node
		if(typeOf(itemObject.item) == 'array') {
			for (i in itemObject.item) {
				videoInfo[itemObject.item[i].guid] = new Object();
				videoInfo[itemObject.item[i].guid] = getVideoMetadata(itemObject.item[i]);
			}			
		} 
		//1 item node
		else {
			videoInfo[itemObject.item.guid] = new Object();
			videoInfo[itemObject.item.guid] = getVideoMetadata(itemObject.item);
		}		

		return videoInfo;		
	}
	
	function findHighestResolution(videoSrc) {
		//find highest resolution clip
		var highestResolution = 0;
		for (j in videoSrc) {
			if(parseInt(j) > highestResolution) {
				highestResolution = j;
			}
		}
		return highestResolution;
	}
	
	function setHTMLPlayerContent(playThisClip) {	
		//set clip name if specificed in openOverlay() call
		var embedClipName = playerSettings.clipName;		
		
		if(playThisClip != null) {
			embedClipName = playThisClip;
		}
		
		$.ajax({
			url: territoryDomain + '/global/scripts/overlayplayer2/jsonmaker.php',
			data: {
				xml: playerSettings.feedUrl
			},
			async: false,
			dataType: 'jsonp',
			jsonpCallback: 'jsonp' + overlayPlayer2Date.getTime(),
			success: function(data){
				console.log(data);
				if(typeof(data) == 'object') {
					var videoPlayer = document.getElementById(playerSettings.htmlPlayerId);
					
					var feedData = new Object();
					
					//title
					feedData.title = '';
					if(typeof(data.channel.title) == 'string') {
						feedData.title = data.channel.title;
					}
					//description
					feedData.description = '';
					if(typeof(data.channel.description) == 'string') {
						feedData.description = data.channel.description;
					}
					//link
					feedData.link = '';
					if(typeof(data.channel.link) == 'string') {
						feedData.link = data.channel.link;
					}
					//image
					feedData.image = '';
					if(typeof(data.channel.image.url) == 'string') {
						feedData.image = data.channel.image.url;
					}
					//synopsis
					feedData.synopsis = '';
					if(typeof(data.channel.spvideosynopsis) == 'string') {
						feedData.synopsis = data.channel.spvideosynopsis;
					}
					//video rating
					feedData.videorating = '';
					if(typeof(data.channel.spvideorating) == 'string') {
						feedData.videorating = data.channel.spvideorating;
					}
					//buy links
					if(data.channel.spvideobuyLink != undefined) {
						feedData.buylinks = new Object();
						//more than 1 item node
						if(typeOf(data.channel.spvideobuyLink) == 'array') {
							for (i in data.channel.spvideobuyLink) {
								var videoStore = data.channel.spvideobuyLink[i].spvideostore;
								var videoLink = data.channel.spvideobuyLink[i].spvideolink;
								
								feedData.buylink[videoStore] = videoLink;
							}			
						} 
						//1 item node
						else {
							var videoStore = data.channel.spvideobuyLink.spvideostore;
							var videoLink = data.channel.spvideobuyLink.spvideolink;
							
							feedData.buylinks[videoStore] = videoLink;
						}
					}
							
					feedData.videoInfo = new Object();				
					var defaultGUID = (data.channel.spvideodefaultItemGuid) ? data.channel.spvideodefaultItemGuid : null;
					var playClipGUID = defaultGUID;
					if(defaultGUID != null) {
						//get video info
						feedData.videoInfo = getVideoInfo(data.channel);
						
						//loop through returned video object to play specified clip.  if clipName does not match any guids, play default
						var playClip = null;
						var playClipTitle = null;
						var playClipIndex = null;					
						
						for (i in feedData.videoInfo) {
							if(i == embedClipName) {
								playClipGUID = i;
								//play highest resolution clip base on video width;
								playClipIndex = findHighestResolution(feedData.videoInfo[i]['videosrc']);							
								playClip = feedData.videoInfo[i]['videosrc'][playClipIndex];
								playClipTitle = feedData.videoInfo[i]['title'];
								break;
							}
							else {
								//play highest resolution clip base on video width;
								playClipIndex = findHighestResolution(feedData.videoInfo[defaultGUID]['videosrc']);							
								playClip = feedData.videoInfo[defaultGUID]['videosrc'][playClipIndex];
								playClipTitle = feedData.videoInfo[defaultGUID]['title'];
							}
						}
						
						console.log(feedData);
						
						var d = new Date();
	
						//update video src
						videoPlayer.src = $.trim(playClip) + '?cacheBuster=' + d.getTime();
						videoPlayer.setAttribute('data-title',playClipTitle);						
						
						//create current video header
						function createCurrentVideoHeader(videoGUID) {
							//current video header
							var currentVideoContainer = $(document.createElement('div')).addClass('currentVideoContainer');
							
							var currentVideoImage = $(document.createElement('img')).attr({
								'src': feedData.videoInfo[videoGUID].thumbnail,
								'alt': feedData.videoInfo[videoGUID].title,
								'width': '165'
							}).appendTo(currentVideoContainer);
							
							var currentVideoTextContainer = $(document.createElement('div')).addClass('details').appendTo(currentVideoContainer);
							
							var currentVideoPropertyTitle = $(document.createElement('p')).addClass('property-title').text(feedData.title).appendTo(currentVideoTextContainer);
							
							var currentVideoTitle = $(document.createElement('p')).addClass('video-title').text(feedData.videoInfo[videoGUID].title).appendTo(currentVideoTextContainer);
							
							return currentVideoContainer;
						}
						
						function shareURL(shareInfo) {							
							var shareURL = null;
							var service = shareInfo.service;
							var url = shareInfo.url;
							var guid = shareInfo.guid;
							
							switch(service) {
								case 'facebook':
									shareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&t';
								break;
								
								case 'twitter':
									var twitterShareUrl;
									//twitter text found in xml
									if(typeof(feedData.videoInfo[guid].twitterText) == 'string') {
										twitterShareUrl = feedData.videoInfo[guid].twitterText;
									} else {
										//twitter share default text
										twitterShareUrl = 'I just watched the ' + feedData.title + ' ' + feedData.videoInfo[guid].title + ' ' + feedData.videoInfo[guid].miniUrl;
									}
									
									shareURL = 'https://twitter.com/intent/tweet?text='  + encodeURIComponent(twitterShareUrl);
								break;
							}
							
							return shareURL;
						}
						
						function updatedVideoData(pageId,o) {
							try {
								var guid = o.attr('rev');
							
								//remove class playing from all video links
								$('.interior ul.videos li a').each(function(){
									$(this).removeClass('playing');
									$(this).parent().removeClass('playing');
								})
								//add class playing to clicked link
								o.addClass('playing');
								o.parent().addClass('playing');
								
								//update playing video for all pages
								$('.interior ul.videos li a').each(function(){
									if($(this).attr('rev') == guid) {
										$(this).addClass('playing');
										$(this).parent().addClass('playing');
									}
								});
								
								//update current video headers
								$('.interior .headerContainer .currentVideoContainer').not('#page-buynow .headerContainer .currentVideoContainer').remove();
								
								var shareCurrentVideoHeader = createCurrentVideoHeader(guid);
								shareCurrentVideoHeader.prependTo('#page-share .headerContainer');
								
								var moreClipsCurrentVideoHeader = createCurrentVideoHeader(guid);
								moreClipsCurrentVideoHeader.prependTo('#page-moreclips .headerContainer');
								
								//update share info
								//facebook
								$('#' + playerSettings.htmlPlayerId + '-share-facebook').attr({'href': shareURL({
									'service': 'facebook',
									'url': feedData.videoInfo[guid].fbLink,
									'guid': guid
									})
								});
								
								//twitter										
								$('#' + playerSettings.htmlPlayerId + '-share-twitter').attr({'href': shareURL({
									'service': 'twitter',
									'url': feedData.videoInfo[guid].twitterText,
									'guid': guid
									})
								});
								
								//link
								$('#input-sharelink').text(feedData.videoInfo[guid].link);
								$('#button-sharelink').attr({
									'href': 'mailto: ?subject= &body=' + feedData.videoInfo[guid].link
								});
								
								//update video src
								videoPlayer.src = $.trim(o.attr('href')) + '?cacheBuster=' + d.getTime();
								videoPlayer.setAttribute('data-title',o.attr('title'));
								videoPlayer.load();
								
								$('#interiorPages').hide();
								showPlayer();									
							}
							catch(err) {
								console.log(err);
							}			
						}
											
						//info
						var infoPage = $('#page-info');
						
						var propertyImageContainer = $(document.createElement('div')).attr({'id': 'propertyImageContainer'}).appendTo(infoPage);
							
							//property image
							var propertyImage = $(document.createElement('img')).attr({
								'src': feedData.image,
								'alt': feedData.title,
								'width': '98'
							}).appendTo(propertyImageContainer);
							
							//property links 
							var propertyLinksUL = $(document.createElement('ul')).attr({'id': 'property-links'}).appendTo(propertyImageContainer);
							
							//visit the site button
							if(feedData.link != '') {
								var infoButtonVisitTheSiteLI = $(document.createElement('li')).appendTo(propertyLinksUL);
								var infoButtonVisitTheSite = $(document.createElement('a')).attr({
									'href': feedData.link,
									'id': 'page-info-button-visitthesite',
									'target': '_blank'
								}).addClass('overlayplayer-button').text('Visit the Official Site').appendTo(infoButtonVisitTheSiteLI);
								
								infoButtonVisitTheSite.bind('click',function(){
									if(typeof(sCode) == 'object') {
										sCode.trackFeaturedContentClick('sonypictures.com','player_link_button');
									}
								});
							}
						
						var infoContainer = $(document.createElement('div')).attr({'id': 'infoContainer'}).appendTo(infoPage);
											
							//property title
							var propertyTitle = $(document.createElement('h2')).addClass('property-title').text(feedData.title).appendTo(infoContainer);
							
							//property description
							var propertyDescription = $(document.createElement('p')).addClass('property-description').text(feedData.description).appendTo(infoContainer);
							
							//property synopsis
							var propertySynopsis = $(document.createElement('p')).addClass('property-synopsis').text(feedData.synopsis).appendTo(infoContainer);
							
							//video list
							var infoVideoUL = $(document.createElement('ul')).addClass('videos').appendTo(infoContainer);
							
							for(i in feedData.videoInfo) {
								var infoVideoLi = $(document.createElement('li')).css({
								}).appendTo(infoVideoUL);
								
								var infoVideoSrcIndex = findHighestResolution(feedData.videoInfo[i]['videosrc']);							
								var infoVideoSrc = feedData.videoInfo[i]['videosrc'][infoVideoSrcIndex];
								var infoVideoTitle = feedData.videoInfo[i]['title'];
									
								var infoVideoLink = $(document.createElement('a')).attr({
									'id': infoPage.attr('id') + '-' + i,
									'href': infoVideoSrc,
									'rev': i,
									'title': infoVideoTitle
								}).text(feedData.videoInfo[i].title).appendTo(infoVideoLi);
								
								//add class playing to currently playing link
								if(i == playClipGUID) {
									infoVideoLink.addClass('playing');
								}
								
								infoVideoLink.bind('click',function(){
									updatedVideoData($('#page-info').attr('id'),$(this));	
									return false;				
								});
							}	
							
						//share
						var sharePage = $('#page-share');
						var shareCurrentVideoHeader = createCurrentVideoHeader(playClipGUID);
						shareCurrentVideoHeader.prependTo('#' + sharePage.attr('id') + ' .headerContainer');
						
						var shareNav = $(document.createElement('ul')).attr({'id': 'page-share-nav'}).appendTo('#' + sharePage.attr('id') + ' .headerContainer');
						
						function createShareNavLinks(page) {
							var navLI = $(document.createElement('li')).attr({
								'id': 'page-share-nav-' + page
							}).appendTo(shareNav);
							
							var navLink = $(document.createElement('a')).attr({
								'rev': page
							}).text(page).appendTo(navLI);
							
							navLink.bind('click',function(){
								//add class selected to nav link
								$('ul#page-share-nav li a').each(function(){
									$(this).removeClass('selected');
								});
								
								$(this).addClass('selected');
								
								//hide all pages 
								$('#shareSubpages > li').each(function(){
									$(this).hide();
								})
								
								//show correct tab
								$('#' + $(this).attr('rev')).show();
								$('#' + $(this).attr('rev')).addClass('fade-in');
								$('#' + $(this).attr('rev')).unbind();
								$('#' + $(this).attr('rev')).bind('webkitAnimationEnd',function(){
									$(this).removeClass('fade-in');
								});
								
								//tracking
								if(typeof(sCode) == 'object') {
									sCode.trackFeaturedContentClick('sonypictures.com','player_' + $(this).attr('rev') +'_button');
								}
								
								return false;
							});

							return navLink;						
						}
						
						var shareNavLinkPost = createShareNavLinks('post');
						shareNavLinkPost.addClass('selected');
						
						var shareNavLinkLink = createShareNavLinks('link');
						
						var shareSubpages = $(document.createElement('ul')).attr({'id': 'shareSubpages'}).appendTo(sharePage);
						
							//post video
							var postPage = $(document.createElement('li')).attr({'id': 'post'}).appendTo(shareSubpages);
							
							var postPageInstructions = $(document.createElement('h2')).text('Post this video to one of the following websites:').appendTo(postPage);
							
							var shareLinksUL = $(document.createElement('ul')).attr({'id': playerSettings.htmlPlayerId + '-share-links'}).appendTo(postPage);						
							
							function createShareLink(shareService, shareURL) {
								var shareLI = $(document.createElement('li')).appendTo(shareLinksUL);
								
								var shareButton = $(document.createElement('a')).attr({
									'id': playerSettings.htmlPlayerId + '-share-' + shareService,
									'href': shareURL,
									'target': '_blank',
									'rel': shareService
								}).text(shareService).appendTo(shareLI);	
								
								//tracking
								shareButton.bind('click',function(){
									if(typeof(sCode) == 'object') {
										var shareUrl = null;
										var shareUniqueId = null;
										switch(shareService) {
											case 'facebook':
												shareUrl = 'http://www.facebook.com/sharer.php';
												shareUniqueId = 'postfacebook_button';
											break;
											
											case 'twitter':
												shareUrl = 'http://www.twitter.com';
												shareUniqueId = 'posttwitter_button';
											break;
										}
										sCode.trackOutboundClick(shareUrl,shareUniqueId);
									}
								});
								
								return shareButton;							
							}
													
							var shareFacebook = createShareLink('facebook',shareURL({
									'service': 'facebook',
									'url': feedData.videoInfo[playClipGUID].fbLink,
									'guid': playClipGUID
									})
								);
							
							var shareTwitter = createShareLink('twitter',shareURL({
									'service': 'twitter',
									'url': feedData.videoInfo[playClipGUID].twitterText,
									'guid': playClipGUID
									})
								);							

							//link
							var linkPage = $(document.createElement('li')).attr({'id': 'link'}).appendTo(shareSubpages);
							
							var linkPageInstructions = $(document.createElement('h2')).text('Email the following link to your friends:').appendTo(linkPage);
							
							var linkPageInput = $(document.createElement('p')).attr({
								'id': 'input-sharelink'
							}).text(feedData.videoInfo[playClipGUID].link).appendTo(linkPage);
							
							var linkPageInputButton = $(document.createElement('a')).attr({
								'id': 'button-sharelink',
								'href': 'mailto: ?subject= &body=' + feedData.videoInfo[playClipGUID].link
							}).addClass('overlayplayer-button').text('Email Link').appendTo(linkPage);
							
							linkPageInputButton.bind('click',function(){
								if(typeof(sCode) == 'object') {
									sCode.trackFeaturedContentClick('sonypictures.com','player_emaillink_button');
								}
							});
							
							/* var linkPageInputButtonInstructions = $(document.createElement('p')).addClass('instructions').text('Click the link to communicate with your friends.').appendTo(linkPage); */
							
							//show post page
							$('#page-share ul#shareSubpages > li').each(function(){
								$(this).hide();
							});
							
							$('#post').show();
							$('#page-share-nav-post').addClass('selected');
							
						//more clips
						if(playerSettings.singlevideoToggle !== true && countProperties(feedData.videoInfo) > 1) {	
							//show nav button
							$('#nav-moreclips').parent().show();
							
							var moreClipsPage = $('#page-moreclips');
							var moreClipsCurrentVideoHeader = createCurrentVideoHeader(playClipGUID);
							moreClipsCurrentVideoHeader.prependTo('#' + moreClipsPage.attr('id') + ' .headerContainer');
							
							var moreClipsVideoUL = $(document.createElement('ul')).addClass('videos').appendTo(moreClipsPage);
							
							for (i in feedData.videoInfo) {
								var moreClipsVideoLI = $(document.createElement('li')).appendTo(moreClipsVideoUL);
								
								var moreClipsVideoSrcIndex = findHighestResolution(feedData.videoInfo[i]['videosrc']);						
								var moreClipsVideoSrc = feedData.videoInfo[i]['videosrc'][moreClipsVideoSrcIndex];
								var moreClipsTitle = feedData.videoInfo[i]['title'];
								
								var moreClipsVideoLink = $(document.createElement('a')).attr({
									'id': moreClipsPage.attr('id') + '-' + i,
									'href': moreClipsVideoSrc,
									'rev': i,
									'title': moreClipsTitle
								}).appendTo(moreClipsVideoLI);
								var moreClipsVideoImage = $(document.createElement('img')).attr({
									'src': feedData.videoInfo[i].thumbnail,
									'width': '120'
								}).appendTo(moreClipsVideoLink);
								
								var moreClipsVideoDetails = $(document.createElement('div')).addClass('details').appendTo(moreClipsVideoLI);
								var moreClipsPropertyTitle = $(document.createElement('p')).addClass('property-title').text(feedData.title).appendTo(moreClipsVideoDetails);
								var moreClipsVideoTitle = $(document.createElement('p')).addClass('video-title').text(feedData.videoInfo[i].title).appendTo(moreClipsVideoDetails);
								
								//add class playing to currently playing link
								if(i == playClipGUID) {
									moreClipsVideoLink.parent().addClass('playing');
								}
								
								moreClipsVideoLink.bind('click', function(){
									updatedVideoData($('#page-moreclips').attr('id'),$(this));	
									return false;
								});
								
								moreClipsVideoLink.parent().bind('click',function(){
									$(this).children('a').trigger('click');
									return false;
								});						
							}
						}

						//buy now
						if(feedData.buylinks != undefined && playerSettings.displayBuyLink !== false) {		
							//show nav button
							$('#nav-buynow').parent().show();
							
							var buyNowPage = $('#page-buynow');
							
							//create buy now header
								var buyNowVideoContainer = $(document.createElement('div')).addClass('currentVideoContainer');
								
								var buyNowVideoImage = $(document.createElement('img')).attr({
									'src': feedData.videoInfo[defaultGUID].thumbnail,
									'alt': feedData.videoInfo[defaultGUID].title,
									'width': '165'
								}).appendTo(buyNowVideoContainer);
								
								var buyNowVideoTextContainer = $(document.createElement('div')).addClass('details').appendTo(buyNowVideoContainer);
								
								var buyNowVideoPropertyTitle = $(document.createElement('p')).addClass('property-title').text(feedData.title).appendTo(buyNowVideoTextContainer);
								
								var buyNowVideoTitle = $(document.createElement('p')).addClass('video-title').text(feedData.description).appendTo(buyNowVideoTextContainer);

								buyNowVideoContainer.prependTo('#' + buyNowPage.attr('id') + ' .headerContainer');
							
							var partnersContainer = $(document.createElement('div')).attr({'id':'partners'}).appendTo(buyNowPage);
							
							var partnersContainerTitle = $(document.createElement('h2')).text('Available for purchase from:').appendTo(partnersContainer);
							
							var partnersContainerUL = $(document.createElement('ul')).appendTo(partnersContainer);
							
							for(i in feedData.buylinks) {
								var partnersContainerLI = $(document.createElement('li')).appendTo(partnersContainerUL);
								
								var buyLink = $(document.createElement('a')).attr({
									'id': 'buy-' + i,
									'href': feedData.buylinks[i],
									'target': '_blank',
									'rel': i
								}).addClass('overlayplayer-sprite').text(i).appendTo(partnersContainerLI);

								buyLink.bind('click',function(){
									if(typeof(sCode) == 'object') {
										var targetUrl = $(this).attr('href').split('/')[2];
										sCode.trackOutboundClickToBuy('http://' + targetUrl, 'player_' + $(this).attr('rel') + '_button');
									}
								});
							}
						} 				
					}
					
				videoPlayer.load();
				videoPlayer.addEventListener('canplay',function(e){
					console.log(e.currentTarget.src + ' loaded');
					e.currentTarget.play();
				},false);
				fadeInControls();
				}
			},
			error: function(data){
				console.log('error ' + data);
			}
		});
	}
	
	function fadeInControls() {
		//destroy loading gif
		$('#overlayplayer-loading').remove();
		
		//show player
		$('#' + playerSettings.htmlPlayerId).css({'-webkit-transform': 'translateX(0)'});
		
		//fade in overlay controls
		$('#overlayControls').css({'display': 'block'});
		$('#overlayControls').unbind();
		$('#overlayControls').addClass('fade-in');
		$('#overlayControls').bind('webkitAnimationEnd',function(){
			$(this).removeClass('fade-in');
		});
		
		//fade in player controls
		if(playerSettings.isInline != true && playerSettings.showControls != false) {
			$('#' + playerSettings.htmlPlayerId + 'Controls').css({'display': 'block'});
			$('#' + playerSettings.htmlPlayerId + 'Controls').unbind();
			$('#' + playerSettings.htmlPlayerId + 'Controls').addClass('fade-in');
			$('#' + playerSettings.htmlPlayerId + 'Controls').bind('webkitAnimationEnd',function(){
				$(this).removeClass('fade-in');
			});
		}
	}
	
	function detectPlayer(playThisClip) {
	
		function embedHTML5Player() {
			createHTMLPlayer();
			setHTMLPlayerContent(playThisClip);
		}
	
		function embedFlashPlayer() {
			//updated overlayPlayerContainer css.  reduce width to account for html controls removal
			$('#' + playerSettings.overlayPlayerContainerId).css({'width': playerSettings.width + 'px'});

			var flashvars = {
				'feedURL': playerSettings.feedUrl,
				'clipName': embedClipName,
				'isInline': playerSettings.isInline,
				'isSingleVideo': playerSettings.singlevideoToggle,
				'isAutoplay': playerSettings.isAutoplay,
				'isTrackExternal': playerSettings.isTrackExternal,
				'playbackCallback': playerSettings.playbackCallback || null,
				'trackSubsection': playerSettings.trackSubsection,
				'displayBuyLink': playerSettings.displayBuyLink,
				'displayShare': playerSettings.displayShare
			};

			var params = {
				'allowScriptAccess': 'always', 
				'wmode': 'transparent', 
				'allowFullScreen': 'true'
			};
		 
			var attributes = {
				'id': playerSettings.embedContainer,
				'style': 'outline:none'
			};
			
			//create flash error message
			var flashError = $(document.createElement('p')).text('To view this content, JavaScript must be enabled, and you need the latest version of the Adobe Flash Player.').appendTo('#' + playerSettings.embedContainer);
			
			var getFlashLink = $(document.createElement('a')).attr({
				'href': 'http://www.adobe.com/go/getflashplayer',
				'target': '_blank'
			}).css({
				'color': '#fff'
			}).text(' Get the free Adobe Flash Player').appendTo(flashError);
			
			swfobject.embedSWF( universalPlayerURL, playerSettings.embedContainer, playerSettings.width, playerSettings.height, playerSettings.flashVersion, playerSettings.expressInstallURL, flashvars, params, attributes);
		}
		
		var universalPlayerURL = window.location.protocol + "//flash.sonypictures.com/video/universalplayer/"+(playerSettings.useQAplayer?'qa/':'')+(playerSettings.intlPlayer?'intTheatricalPlayer.swf':'theatricalPlayer.swf');
		
		var embedClipName = playerSettings.clipName;
		if(playThisClip != null) {
			embedClipName = playThisClip; 
		}
		
		//set position of player container
		if(playerSettings.isInline != true) {
			var bodyScrollTop = $(window).scrollTop();
			$('#' + playerSettings.overlayPlayerContainerId).css({'top': (bodyScrollTop + 75) + 'px'});
		}
		
		//check for exceptions to load html5 player
		if(is_Android() || is_BadChrome()) {
			embedHTML5Player();
		}
		//check for flash support
		else if(swfobject.hasFlashPlayerVersion('1')) {
			embedFlashPlayer();
		} 
		//fallback to html5 player
		else {
			embedHTML5Player();
		}
	}
	
	this.init = function() {
		//load stylesheet
		$(document.createElement('link')).attr({
			'href': 'https://flash.sonypictures.com/tv/shows/wheel/minisites/familycruisesweepstakes/styles/overlayplayer2.css',
			'type': 'text/css',
			'rel': 'stylesheet'
		}).appendTo('head');
		
		createOverlay();
		
		if(playerSettings.isInline == true) {
			detectPlayer();
		}
	}
	
	function openOverlay(playThisClip) {
		if ($('#' + playerSettings.overlayLayerId).is(":hidden")) {
			//load player
			detectPlayer(playThisClip);
			
			//fade in overlay, then player
			$('#' + playerSettings.overlayLayerId).fadeIn('fast', function(){
				$('#' + playerSettings.overlayPlayerContainerId).fadeIn('fast');
			});
		}
	}
	
	function closeOverlay() {
		if ($('#' + playerSettings.overlayLayerId).is(":visible")) {
			//destroy player
			var overlayPlayerContainer = $('#' + playerSettings.overlayPlayerContainerId);
			overlayPlayerContainer.fadeOut('fast',function(){
				$('#' + playerSettings.embedContainer).empty().remove();
					$(document.createElement('div')).attr({'id': playerSettings.embedContainer}).css({
					'height':  '100%',			
					'outline': 'none',
					'width': 'auto'
				}).appendTo(overlayPlayerContainer);
				
				//fade out overlay
				$('#' + playerSettings.overlayLayerId).fadeOut('fast');
				
				var theSwf = document.getElementById(parentSwf);
				if(theSwf){
					if(typeof(theSwf.overlayPlayerclosed) == 'function'){
						theSwf.overlayPlayerclosed();
					}
				}

				//callback
				if(playerSettings.closeOverlayCallback != null) {
					playerSettings.closeOverlayCallback();
				}
			});	
		}
	}
	
	this.openOverlay = function(playThisClip) {
		openOverlay(playThisClip);
	}
	
	this.closeOverlay = function() {
		closeOverlay();
	}
	
	this.updateFeed = function(feedDetails) {
		//destroy current player
		$('#' + playerSettings.overlayLayerId).remove().empty();
		$('#' + playerSettings.overlayPlayerContainerId).remove().empty();
		
		playerSettings.feedUrl = feedDetails.feedUrl;
		
		if(feedDetails.clipName != null) {
			playerSettings.clipName = feedDetails.clipName;
		}
		
		createOverlay();
		
		if(playerSettings.isInline == true) {
			detectPlayer();
		} else {
			openOverlay(playerSettings.clipName);
		}		
	}
};

var newOverlay;
$(document).ready(function(){

	playerSettings = {
		'absolutePathForResources': absolutePathForResources,
		'closeOverlayCallback': closeOverlayCallback,
		'displayBuyLink': displayBuyLink,
		'displayShare': displayShare,
		'clipName': clipName,
		'feedUrl': feedUrl,
		'embedContainer': embedContainer,
		'expressInstallURL': expressInstallURL,
		'flashVersion': flashVersion,
		'height': embedHeight,
		'htmlPlayerId': htmlPlayerId,
		'inlineContainer': inlineContainer,
		'intlPlayer': intlPlayer,
		'isAutoplay': isAutoplay,
		'isInline': isInline,
		'isTrackExternal': isTrackExternal,
		'overlayLayerId': overlayLayerId,
		'overlayPlayerContainerId': overlayPlayerContainerId,
		'parentSwf': parentSwf,
		'playbackCallback': playbackCallback,
		'showControls': showControls,
		'singlevideoToggle': isSingleVideoSet(),
		'trackSubsection': trackSubsection,
		'useQAplayer': useQAplayer,
		'width': embedWidth
	};
	
	newOverlay = new overlayPlayer(playerSettings);
	newOverlay.init();
});

function openOverlay(clipName) {
	newOverlay.openOverlay(clipName);
}

function externalPlay(clipName) {
	if(playerSettings.isInline == true) {
		//html5
		if(document.getElementById(playerSettings.htmlPlayerId)) {
			$('#page-info-' + clipName).trigger('click');
		} else {
			//swf
			document.getElementById(playerSettings.embedContainer).playVideo(clipName);
		}
	}
}

function closeOverlay() {
	newOverlay.closeOverlay();
}

function updateFeed(feedDetails) {
	newOverlay.updateFeed(feedDetails);
}
