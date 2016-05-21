var a = (function () {
"use strict";

var

util = {
	isObject: function (v) {
		return (
			v &&
			typeof v === 'object' &&
			typeof v !== null &&
			Object.prototype.toString.call(v) === "[object Object]"
		) ? true : false;
	},
	isArray: function (v) {
		if ( typeof Array.isArray === 'function' ) {
			return Array.isArray(v);
		}
		return (
			v &&
			typeof v === 'object' &&
			typeof v.length === 'number' &&
			typeof v.splice === 'function' &&
			!v.propertyIsEnumerable('length') &&
			Object.prototype.toString.call(v) === "[object Array]"
		) ? true : false;
	},
	getArgs: function (a) {
		var args = new Array(a.length),
			i;
		for (i=0; i<args.length; i+=1) {
			args[i] = a[i];
		}
		return args;
	},
	extend: function () {
		var args = Array.prototype.slice.call(arguments),
			len = args.length,
			arr = [],
			objects = [],
			first, last,
			result;
			
		if (len === 1) {
			first = args[0];
			if ( this.isArray(first)  &&  first.length > 1 ) {
				last = first.pop();
				objects = first;
			} else if ( this.isObject(first) ){
				result = Object.create(first);
			}
		} else if (len === 2) {
			first = args[0];
			last = args[len-1];
			if ( this.isObject(first) ) {
				result = Object.create(first);
			}
		} else if (len > 2) {
			last = args.pop();
			objects = args;
		}
		
		if (objects.length !== 0) {
			arr.push( {} );
			objects.forEach(function (el, i) {
				if ( this.isObject(el) ) {
					Object.keys(el).forEach(function (k) {
						arr[i][k] = el[k];
					});
					arr.push( Object.create(arr[i]) );
				}
			});
			result = arr[arr.length-1];
		}
		
		if ( last && this.isObject(last) ) {
			Object.keys(last).forEach(function(key) {
				result[key] = last[key];
			});
		}
		return result;
	}
},
instantiatePubsub = function () {
	var subscribers = {},
	getSubscribers = function () {
		return subscribers;
	},
	subscribe = function (evt, fn, par) {
		var events,
			add = function (str) {
				if (typeof subscribers[str] === 'undefined') {
					subscribers[str] = [];
				}
				subscribers[str].push({
					fn: fn,
					par: par
				});
			};
		
		if (typeof evt === 'string') {
			if ( evt.indexOf(' ') === -1 ) {
				add(evt);
			} else {
				events = evt.split(' ');
				events.forEach(function (el) {
					add(el);
				});
			}
		} else if ( util.isObject(evt) ) {
			Object.keys(evt).forEach(function (i) {
				if (typeof subscribers[i] === 'undefined') {
					subscribers[i] = [];
				}
				if (typeof evt[i] === 'function') {
					subscribers[i].push({
						fn: evt[i],
						par: undefined
					});
				} else if ( util.isObject(evt[i]) ) {
					subscribers[i].push({
						fn: evt[i].fn,
						par: evt[i].par
					});
				}
			});
		}
	},
	on = function (evt, fn, par) { // alies
		subscribe(evt, fn, par);
	},
	publish = function (evtName, evtData) {
		if (typeof subscribers[evtName] !== 'undefined') {
			subscribers[evtName].forEach(function (i) {
				i.fn(evtData, i.par);
			});
		}
	};
	return {
		getSubscribers: getSubscribers,
		subscribe: subscribe,
		on: on,
		publish: publish
	};
},

modals = (function () {
	var rateModal = (function () {
		var el = {},
			origin = '.uk-modal',
			root = 'form[name="rate"]',
			pre = origin+' '+root,
			
		selectElements = function () {
			el.rootElement = $(pre);
			el.inputs = $(pre+' .j-input');
			el.labels = $(pre+' .j-label');
			el.chkProductUser = $(pre+' input[name="product-user"]:checkbox');
			el.chkWillAnswer = $(pre+' input[name="will-answer"]:checkbox');
			el.progress = $(pre+' .j-progress');
			el.wizardPanel = $(pre+' .wizard-panel');
			el.rateRadios = $(pre+' .j-rate-radios');
			el.okcancelBtns = $(pre+' .j-okcancel');
			el.ok = $(pre+' .j-ok');
			el.cancel = $(pre+' .j-cancel');
			el.surveyCancel = $(pre+' .j-survey-cancel');
			el.surveyNext = $(pre+ ' .j-survey-next');
			el.surveyPrev = $(pre+ ' .j-survey-prev');
			el.quest1 = $(pre+' .j-quest-1');
			el.quest2 = $(pre+' .j-quest-2');
			el.quest3 = $(pre+' .j-quest-3');
			el.quest4 = $(pre+' .j-quest-4');
			el.quest5 = $(pre+' .j-quest-5');
			el.quest6 = $(pre+' .j-quest-6');
			el.quest7 = $(pre+' .j-quest-7');
			el.quest8 = $(pre+' .j-quest-8');
			el.quest9 = $(pre+' .j-quest-9');
		},
		question = (function () {
			var current = 1,
				last = 9,
			next = function () {
				var n = current + 1,
					nextEl = 'quest'+n.toString();
				el['quest'+current.toString()].velocity('slideUp', {duration: 400, complete: function () {
					el[nextEl].velocity('slideDown', 400);
				}});
				current += 1;
			},
			prev = function () {
				var p = current - 1,
					prevEl = 'quest'+p.toString();
				el['quest'+current.toString()].velocity('slideUp', {duration: 400, complete: function () {
					el[prevEl].velocity('slideDown', 400);
				}});
				current -= 1;
			};
			
			return {
				next: next,
				prev: prev
			};
		}()),
		wizard = function (opt) {
			if ( opt === true ) {
				if ( !el.wizardPanel.is('.velocity-animating') ) {
					el.wizardPanel.velocity('slideDown');
					el.okcancelBtns.addClass('no-display');
					//progress.removeClass('no-display');
				}
			} else if ( opt === false ) {
				if ( !el.wizardPanel.is('.velocity-animating') ) {
					el.wizardPanel.velocity('slideUp');
					el.okcancelBtns.removeClass('no-display');
					//progress.addClass('no-display');
				}
			}
		},
		attachHandlers = function () {
			el.quest1.on('change', 'input[type="radio"]', function () {
				el.surveyNext.prop({disabled: false});
			});
			el.quest2.on('change', 'input[type="radio"]', function () {
				el.surveyPrev.prop({disabled: false});
			});
			el.quest3.on('change', 'input[type="radio"]', function () {
				
			});
			
			
			el.rootElement.on('click', root, function (e) {
				
			});
			
			el.rateRadios.on('click', 'input[type="radio"][name="vote"]', function () {
				UIkit.notify('فاک بو', {status: 'danger', timeout: 500});
				el.chkProductUser.prop({disabled: false}).parent().removeClass('disabled');
				el.ok.prop({disabled: false});
		
			});
			el.chkProductUser.on('change', function () {
				var dis = $(this),
					isChecked = dis.is(':checked');

				if ( isChecked === true ) {
					el.chkWillAnswer.prop({disabled: false}).parent().removeClass('disabled');
				} else if ( isChecked === false ) {
					el.chkWillAnswer.prop({disabled: true}).parent().addClass('disabled');
					if ( el.wizardPanel.is(':visible') ) {
						el.wizardPanel.velocity('slideUp');
						el.chkWillAnswer.prop({checked: false});
					}
				}
			});
			
			el.chkWillAnswer.on('change', function () {
				var dis = $(this);
				if ( dis.is(':checked') === true ) {
					wizard(true);
				} else {
					wizard(false);
				}
			});
			el.surveyCancel.on('click', function () {
				wizard(false);
				el.chkWillAnswer.prop({checked: false});
			});
			el.surveyNext.on('click', function () {
				question.next();
			});
			el.surveyPrev.on('click', function () {
				question.prev();
			});
		},
		
		
		
		
		define = function () {
			selectElements();
			attachHandlers();
		};
		
		
		return {
			define: define
		};
	}()),
	
	define = function () {
		rateModal.define();
	};
	
	
	return {
		define: define
		
	};
}());
	
	

	return {
		util: util,
		instantiatePubsub: instantiatePubsub,
		modals: modals
		
	};
}());