if(typeof Sedo === 'undefined') var Sedo = {};

!function($, window, document, undefined)
{
	/**
	 * XenForo GoToTop Addon from the UItoTop jQuery Plugin 1.2 by Matt Varone
	 * jQuery plugin source: http://www.mattvarone.com/web-design/uitotop-jquery-plugin/
	 **/ 
	Sedo.GoToTop = 
	{
		init: function($e)
		{
			/*Settings*/
			var settings = { 
				text: $e.html(), 
				easingType: $e.data('easing'), 
				containerID: $e.attr('id'),
				containerHoverID: $e.data('containerOver'),
				scrollSpeed: $e.data('scrollspeed'),
				min: $e.data('min'),
				inDelay: $e.data('indelay'),
    				outDelay: $e.data('outdelay'),
    				adv: parseInt($e.data('adv')),
    				timeout: parseInt($e.data('timeout')),
    				bottomDelta: $e.data('bottomDelta') || 0,
    				topDelta: $e.data('topDelta') || 0,    				
			},
			containerIDhash = '#' + settings.containerID,
			containerHoverIDHash = '#'+settings.containerHoverID,
			$qmEl = $e.find('.AdvQm'),
			$qmTrigger = $('#toggleMeMenu'),
			qmEnable = ($qmTrigger.is(':visible'));
			
			/* Functions libraries */
			var makeMeFadeOut = function(){
				$(containerIDhash).fadeOut(settings.Outdelay);
			};
			
			var makeMeFadeIn = function(){
				$(containerIDhash).fadeIn(settings.inDelay);
			};
			
			var scrollTo = function(where){
				var pos = (where == 'bottom') ? 
					$(document).height() - $(window).height() - parseInt(settings.bottomDelta) 
					:
					0 + parseInt(settings.topDelta);

				$('html, body').animate({scrollTop:pos}, {
						duration: settings.scrollSpeed, 
						easing: settings.easingType,
						progress: function(){
							clearTimeout($(containerIDhash).data('scrollTimer'));
						},
						done: function(){
							makeMeFadeOut();
						},
						complete: function(){
							clearTimeout($(containerIDhash).data('scrollTimer'));
						}
					}
				);
			};
			
			var getTimeout = function(){
				if(!settings.timeout){
					return false;
				}
			
				return setTimeout(function() {
					makeMeFadeOut();
				}, (XenForo.isTouchBrowser()) ? '6000' : settings.timeout);
			};

			var qmDependency = function(){
				$qmEl = $e.find('.AdvQm');
				
				if($qmTrigger.hasClass('on')){
					$qmEl.addClass('active');
				}else{
					$qmEl.removeClass('active');					
				}
			};

			/* Qm extension */
			if(!qmEnable){
				var $li = $e.find('li'),
					liCoeff = $li.length,
					liHeight = parseInt($li.css('height')),
					liHeightFix = (liHeight+liHeight/liCoeff)+'px';

				$qmEl.remove();
				$li.css({height: liHeightFix, lineHeight: liHeightFix});
				settings.text = $e.html();				
			}else{
				$qmTrigger.on('click', qmDependency);
			}

			/* Go To Top Container */
			$(containerIDhash).hide().on('click', function(e){
				if(e.target != undefined  && $(e.target).hasClass('AdvDown') && settings.adv){
					scrollTo('bottom');
				}else if(e.target != undefined  && $(e.target).hasClass('AdvQm')){
					$qmTrigger.trigger('click');
				} else {
					scrollTo();		
				}
				
				$('#'+settings.containerHoverID, this).stop().animate({'opacity': 0 }, settings.inDelay, settings.easingType);
				return false;
			})
			.prepend('<span id="'+settings.containerHoverID+'">'+settings.text+'</span>')
			.hover(function() {
					$(containerHoverIDHash, this).stop().animate({
						'opacity': 1
					}, 600, 'linear');
				}, function() { 
					$(containerHoverIDHash, this).stop().animate({
						'opacity': 0
					}, 700, 'linear');
			})
			.mouseover(function(){
				clearTimeout($.data(this, 'scrollTimer'));
			})
			.mouseout(function(){
				$(this).data('scrollTimer', getTimeout());
			})
			.on('show', function(){
				qmDependency();
			});

			/* Scroll management */						
			$(window).scroll(function() {
				var sd = $(window).scrollTop();
				if(typeof document.body.style.maxHeight === "undefined") {
					$(containerIDhash).css({
						'position': 'absolute',
						'top': sd + $(window).height() - 50
					});
				}
				if ( sd > settings.min ){
					makeMeFadeIn();
				}else{
					makeMeFadeOut();
				}
				
				clearTimeout($(containerIDhash).data('scrollTimer'));
				$(containerIDhash).data('scrollTimer', getTimeout());
			});			
		}
	}

	XenForo.register('.SedoGoToTop', 'Sedo.GoToTop.init');
}
(jQuery, this, document);