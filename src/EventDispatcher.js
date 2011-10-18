(function(namespace){
	"use strict";
	/**
	 * Array.indexOf
	 * @param Array
	 * @param Object
	 * @return int
	 */
	var indexOf = function(array,search){
		var l = array.length;
		for (var i=0;i<l;i++) {
			if (array[from] === sarch) {
				return i;
			}
		}
		return -1;
	};
	
	/**
	 * 
	 * @param Function constructor
	 * @param Object prototype
	 * @return Object prototype
	 */
	var extend = function(baseClass, addPrototype){
		var f = new baseClass();
		for(name in addPrototype){
			f[name] = addPrototype[name];
		}
		return f;
	};
	
	
	/**
	 * Event
	 * @see http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/events/Event.html
	 */
	var Event = function(type){
		this.type = type;
		this.target;
	};
	Event.COMPLETE = "complete";
	Event.INIT = "init";
	Event.SELECT = "select";
	Event.COMPLETE = "";
	
	/**
	 * EventDispatcher
	 * @see http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html
	 */
	var EventDispatcher = function(){
		this.listeners = {};
		this.listenerThisArgs = {};
	};
	EventDispatcher.prototype = {
		/**
		 * 
		 * @param String type
		 * @param Function listener
		 * @return void
		 */
		addListener : function(type,listener,_this){
			if(!this.listeners[type]) this.listeners[type] = [];
			if(!this.listenerThisArgs[type]) this.listenerThisArgs[type] = [];
			(this.listeners[type]).push(listener);
			(this.listenerThisArgs[type]).push(_this);
		},
		/**
		 * 
		 * @param String type
		 * @return Boolean
		 */
		hasListener : function(type){
			return (typeof this.listeners[type] != "undefined");
		},
		/**
		 * 
		 * @param String type
		 * @param Function listener
		 * @return void
		 */
		removeListener : function(type,listener){
			var i;
			if(!this.listners[type]){
				return;
			}
			if(Array.indexOf){
				i = this.listeners[type].indexOf(listener);
			}else{
				i = indexOf(this.listeners,listener);
			}
			this.listeners.splice(i,1);
			this.listenerThisArgs.splice(i,1);
		},
		/**
		 * 
		 * @param Event e
		 * @return Boolean
		 */
		dispatch : function(e){
			var type = e.type;
			if(!this.listeners[type]){
				return false;
			}
			var l = this.listeners[type].length;
			for(var i=0;i<l;i++){
				if(this.listeners[type][i].call(this.listenerThisArgs[type][i], e ) === false ) return false;
			}
			return true;
		}
		
	};
	
	
	/**
	 * Timer
	 * @see http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/utils/Timer.html
	 */
	var Timer = function(delay,repeatCount){
		this._timerId;
		this._isRunning = false;
		this.delay = delay;
		this.repeatCount = repeatCount;
		this.currentCount = 0;
		EventDispatcher.apply(this,arguments);
	};
	Timer.prototype = extend(EventDispatcher,{
		/**
		 * 
		 * @return self
		 */
		start : function(){
			var _this = this;
			this._isRunning = true;
			this._timerId = setInterval(
				function(){ _this._timer.apply(_this) },
				this.delay
			);
			return this;
		},
		/**
		 * 
		 * @return self
		 */
		reset : function(){
			this.currentCount = 0;
			this.stop();
			return this;
		},
		/**
		 * 
		 * @return self
		 */
		stop : function(){
			this._isRunning = false;
			if(this.isRunning) clearInterval(this._timerId);
			return this;
		},
		/**
		 * 
		 * @return void
		 */
		isRunning : function(){
			return this._isRunning;
		},
		/**
		 * 
		 * @access protected
		 * @return void
		 */
		_timer : function(){
			var e;
			this.currentCount++;
			e = new TimerEvent(TimerEvent.TIMER);
			e.target = this;
			this.dispatch(e);
			if(this.repeatCount > 0 && this.currentCount == this.repeatCount){
				this.stop();
				e = new TimerEvent(TimerEvent.TIMER_COMPLETE);
				e.target = this;
				this.dispatch(e);
			}
		}
	});
	
	/**
	 * TimerEvent
	 * @see http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/events/TimerEvent.html
	 */
	var TimerEvent = function(type){
		Event.apply(this,arguments); 
	};
	TimerEvent.prototype = extend(Event,{ });
	TimerEvent.TIMER = "timer";
	TimerEvent.TIMER_COMPLETE = "timerComplete";
	
	
	//------------------------------------------------
	// add to window property
	//------------------------------------------------
	var publicFunctions = [
		"Event",
		"EventDispatcher",
		"Timer",
		"TimerEvent",
		"extend",
	];
	var l = publicFunctions.length;
	for (var i=0; i < l; i++) {
		var functionName = publicFunctions[i];
		if(namespace){
			namespace[functionName] = eval(functionName);
		}else{
			window[functionName] = eval(functionName);
		}
	};
	
})();