

;(function ($, win, doc, undefined) {
	
	var namespace = 'sweetswitch';

	$.fn.inView = function() {
		var $el = $(this);
		var _flag = false;

		var _top = $el.offset().top;
		var _left = $el.offset().left;
		var _height = $el.outerHeight();
		var _width = $el.outerWidth();

		_flag = _top < (window.pageYOffset + window.innerHeight) &&
				_left < (window.pageXOffset + window.innerWidth) &&
				(_top + _height) > window.pageYOffset &&
				(_left + _width) > window.pageXOffset;

		return _flag;
	};

	win[namespace] = {
		status: {
			scrollY: 0,
			scrollDirection: '',
			scrollOverElement: function(delta){
				return win[namespace].status.scrollY > delta ? true : false;
			},
			scrollIsHome: function(){
				return win[namespace].status.scrollY === 0 ? true : false;
			},
			scrollIsEnd: function(){
				return win[namespace].status.scrollY + $(win).outerHeight() === $(doc).outerHeight() ? true : false;
			},
			scrollCheck: {
				beforeScrollY: 0,
				direction: function(){
					return win[namespace].status.scrollCheck.beforeScrollY < win[namespace].status.scrollY ? 
						'down' : 'up';
				},
				init: function(){
					function bodyAddClass() {
						var $body = $('body');
						if (!!win[namespace].status.scrollIsHome()) {
							$body.addClass('is-home');
						} else if (!!win[namespace].status.scrollIsEnd()) {
							$body.addClass('is-end');
						} else {
							$body.removeClass('is-home is-end');
						}
					}
					win[namespace].status.scrollY = $('html').prop('scrollTop');
					win[namespace].status.scrollIsHome();
					win[namespace].status.scrollIsEnd();
					bodyAddClass();

					$(doc).off('scroll.scrollCheck').on('scroll.scrollCheck', function(){
						win[namespace].status.scrollY = $('html').prop('scrollTop');
						win[namespace].status.scrollDirection = win[namespace].status.scrollCheck.direction();
						win[namespace].status.scrollCheck.beforeScrollY = win[namespace].status.scrollY;
						win[namespace].status.scrollIsHome();
						win[namespace].status.scrollIsEnd();
						bodyAddClass();
					});

				}
			}
		},
		isBrowser: function(){
			var agt = navigator.userAgent.toLowerCase(); 
			if (agt.indexOf("chrome") != -1) return 'Chrome'; 
			if (agt.indexOf("opera") != -1) return 'Opera'; 
			if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
			if (agt.indexOf("webtv") != -1) return 'WebTV'; 
			if (agt.indexOf("beonex") != -1) return 'Beonex'; 
			if (agt.indexOf("chimera") != -1) return 'Chimera'; 
			if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
			if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
			if (agt.indexOf("firefox") != -1) return 'Firefox'; 
			if (agt.indexOf("safari") != -1) return 'Safari'; 
			if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
			if (agt.indexOf("netscape") != -1) return 'Netscape'; 
			if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla'; 
			if (agt.indexOf("msie") != -1) { 
					var rv = -1; 
				if (navigator.appName == 'Microsoft Internet Explorer') { 
					var ua = navigator.userAgent; var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"); 
				if (re.exec(ua) != null) 
					rv = parseFloat(RegExp.$1); 
				} 
				return 'IE '+rv; 
			} 
		},
		cookieControl: {
			setCookie: function ( name, value, expiredays ) {
				var todayDate = new Date();
				todayDate.setDate( todayDate.getDate() + expiredays );
				document.cookie = name + '=' + escape( value ) + '; path=/; expires=' + todayDate.toGMTString() + ';'
				console.log(document.cookie);
			},
			isHasCookie: function () {
				var cookiedata = document.cookie;
				console.log(cookiedata);
				if ( cookiedata.indexOf('todayCookie=done') < 0 ){
						return false;
				}
				else {
						return true;
				}
			}
		},
		scrollToTop: function(){
			$('#btnScrollTop').on('click', function(){
				$('body, html').animate({
					scrollTop: 0
				}, 200)
			})
		},
		checkBrowserSize: function(){
			var _winW = $(win).outerWidth();
			var size = '';
			
			if (_winW < 764) {
				size = 'mobile';
			} else if (_winW < 1025) {
				size = 'tablet';
			} else {
				size = 'pc';
			}
			$('html').attr('data-size', size);

			return size;
		},
		accoInfo: function(){
			$('.btn-acco').off('click.accoInfo').on('click.accoInfo', function(){
				var $ts = $(this);
				var $target = $('#'+$ts.attr('data-pnl'));
				if ($ts.hasClass('open')) { 
					$ts.removeClass('open');
					$target.stop().slideUp(200);
				} else {
					$ts.addClass('open');
					$target.stop().slideDown(200);
				}
			})
		},
		inview: function(){
			var inView = window.inView || false;
			if (!document.querySelector('[data-component="inview"]')) { // inview 객체 없을 시
				return;
			}
			if (!inView) { // js load 불가 시, 전체적으로 is-in 클래스 추가
				$('[data-component="inview"]').addClass('is-in');
				console.error('inview 객체는 있지만 inview js파일이 없습니다. in-view.min.js 파일을 import해주세요.');
				return;
			}
			inView.offset({
				top: window.innerHeight * 0.2,
				bottom: window.innerHeight * 0.2,
			});
			inView('[data-component="inview"]')
				.on('enter', function(el){ // inview 시 callback
					el.classList.add('is-in');
				})
				.on('exit', function(el){ // outview 시 callback

			});
		},
		init: function(){

			$(win).off('.'+namespace)
				.on('resize.'+namespace, function(){
					win[namespace].checkBrowserSize();
				});

			$(doc).ready(function(){
				win[namespace].checkBrowserSize();
				$('html').addClass(win[namespace].isBrowser());
				win[namespace].status.scrollCheck.init();
				win[namespace].inview();
				
			})
		}
	}
	
	win[namespace].init();
})(jQuery, window, document);