/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function() {

	    let storage = __webpack_require__(2),
	        Notes = __webpack_require__(3),
	        Calendar = __webpack_require__(5),
	        PopUp = __webpack_require__(6);

	    storage.init();

	    let list = storage.getListNotes();

	    let _calendar = new Calendar({
	            container: document.querySelector('.container_calendar'),
	            button: document.querySelector('.container_calendar .button')
	        }),

	        pop_up = new PopUp({
	            container: document.querySelector('.container_pop_up')
	        }),

	        block_i_want = new Notes({
	            container: document.querySelector('[data-role="i_want"]'),
	            list: list
	        }),

	        block_i_do = new Notes({
	            container: document.querySelector('[data-role="i_do"]'),
	            list: list
	        }),

	        block_i_got = new Notes({
	            container: document.querySelector('[data-role="i_got"]'),
	            list: list
	        });
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	
	module.exports = new PubSub;

	function PubSub ( ) {
	    this.storage = {};
	};

	PubSub.prototype.subscribe = function( eventName, func ){
	    if ( !this.storage.hasOwnProperty( eventName ) ){
	        this.storage[eventName] = [];
	    }
	    this.storage[eventName].push( func );
	};

	PubSub.prototype.publish = function( eventName, data ){
	    ( this.storage[eventName] || [] ).forEach( function( func ){

	            func( data )
	        });
	};

	PubSub.prototype.unSubscribe = function( eventName, func ){
	    var index = this.storage[eventName].indexOf( func );

	    if ( index > -1 ){

	        this.storage[eventName].splice( index, 1  )
	    };
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	let pubsub = __webpack_require__(1);

	module.exports = {

	    addNotes: function( data ) {

	        let storage = JSON.parse( localStorage.getItem('__storage') );

	        storage.push( data );

	        localStorage.setItem('__storage', JSON.stringify( storage ) );

	        pubsub.publish('addNewNotes' + data.name, [data] );
	    },

	    getListNotes: function() {

	        return JSON.parse( localStorage.getItem('__storage') );
	    },

	    init: function() {

	        this.addNotes = this.addNotes.bind( this );

	        pubsub.subscribe('newNotes', this.addNotes );

	        if( !localStorage.getItem('__storage') ) {

	            localStorage.setItem('__storage', JSON.stringify( [] ) );
	            console.log( 'localStorage: A repository was created' );
	        }
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = Notes;

	let pubsub = __webpack_require__(1);

	function Notes( data ) {

	    this.container = data.container;
	    this.button = this.container.querySelector('.select_date');
	    this.date = '';
	    this.name = this.container.dataset.role;
	    this.coord = this.container.getBoundingClientRect();
	    this.storage = [];
	    this.listNotes = this.container.querySelector('.list_notes');

	    this.addNotes( data.list );
	    this.openCloseBlockNotes = this.openCloseBlockNotes.bind( this );
	    this.setDate = this.setDate.bind( this );
	    this.showCalendar = this.showCalendar.bind( this );
	    this.addNotes = this.addNotes.bind( this );
	    this.container.addEventListener('click', this.openCloseBlockNotes, true );
	    this.button.addEventListener('click', this.showCalendar, true );
	    pubsub.subscribe('select_date' + this.name, this.setDate );
	    pubsub.subscribe('addNewNotes' + this.name, this.addNotes );
	};

	let fn = Notes.prototype;

	fn.openCloseBlockNotes = function( event ) {

	    let target = event.target;

	    if( target.dataset.role !== 'open_close' ) return;
	    else this.container.classList.toggle( 'active' );
	};

	fn.setDate = function( obj ) {

	    this.date = obj.date;

	    pubsub.publish('showPopUp', { name: this.name, date: this.date } );
	};

	fn.showCalendar = function( event ) {

	    pubsub.publish('show_calendar', { coord: this.coord, name: this.name } );
	};

	fn.addNotes = function( list ) {

	    let that = this, result = '';

	    list.forEach(function( item ) {

	        if( item.name === that.name ) {

	            that.storage.push( item );
	            result += createNote( item );
	        }
	    });

	    this.listNotes.innerHTML += result;
	};

	function createNote( data ) {

	    let template = '<li class="item_list_notes">'+
	                       '<time class="time">'+data.date+'</time>'+
	                       '<div class="header_notes">'+data.header+'</div>'+
	                       '<div class="body_notes">'+data.content+'</div>'+
	                    '</li>';
	    return template;
	};

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = Calendar;

	let pubsub = __webpack_require__(1);

	const TIME_CLOSE_ERROR = 3000; // ms

	function Calendar( data ) {

	    this.container = data.container;
	    this.button = data.button;
	    this.input = this.container.querySelector('input');
	    this.error = this.container.querySelector('.error');
	    this.close = this.container.querySelector('.close_calendar');
	    this.name = '';

	    this.setDate = this.setDate.bind( this );
	    this.showCalendar = this.showCalendar.bind( this );
	    this.close.addEventListener('click', this.hideCalendar.bind( this ), true );
	    this.button.addEventListener('click', this.setDate, true );
	    pubsub.subscribe('show_calendar', this.showCalendar );
	};

	let fn = Calendar.prototype;

	fn.setDate = function( event ) {

	    let value = this.input.value,
	        that = this;

	    if( !value ) {

	        this.showHideError();

	        setTimeout(function() {

	            that.showHideError();

	        }, TIME_CLOSE_ERROR );
	    }

	    else {

	        pubsub.publish('select_date' + this.name, { date: value } );
	        this.hideCalendar();
	        this.input.value = '';
	    }
	};

	fn.showCalendar = function( data ) {

	    let coord = data.coord;

	    this.container.hidden = false;
	    this.name = data.name;
	    this.container.style.top = coord.top + 'px';
	    this.container.style.left = ( coord.left + coord.width + 15 ) + 'px';
	};

	fn.hideCalendar = function() {

	    this.container.hidden = true;
	};

	fn.showHideError = function() {

	    this.error.hidden = !this.error.hidden;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = PopUp;

	let pubsub = __webpack_require__(1);

	const TIME_CLOSE_ERROR = 3000; //ms

	function PopUp( data ) {

	    this.container = data.container;
	    this.button = this.container.querySelector('.button');
	    this.name = '';
	    this.date = '';
	    this.error = this.container.querySelector('.error');
	    this.bodyNotes = this.container.querySelector('textarea.input');
	    this.close = this.container.querySelector('.close_pop_up')

	    this.showPopUp = this.showPopUp.bind( this );
	    this.hidePopUp = this.hidePopUp.bind( this );
	    pubsub.subscribe('showPopUp', this.showPopUp );

	    let that = this;

	    this.button.addEventListener('click', function( event ) {

	        let value = that.bodyNotes.value;

	        if( !value ) that.error.hidden = false, that.showError();
	        else that.sendNotes();

	    }, true );

	    this.close.addEventListener('click', this.hidePopUp );
	};

	let fn = PopUp.prototype;

	fn.showPopUp = function( data ) {

	    this.container.style.display = 'flex';

	    this.name = data.name;
	    this.date = data.date;
	};

	fn.hidePopUp = function() {

	    this.container.style.display = 'none';
	};

	fn.sendNotes = function() {

	    let _header = this.container.querySelector('[name="header"]');

	    pubsub.publish('newNotes', {
	        content : this.bodyNotes.value,
	        header: _header.value,
	        date: this.date,
	        name: this.name
	    });

	    this.hidePopUp();

	    _header.value = '';
	    this.bodyNotes.value = '';
	};

	fn.showError = function() {

	    let that = this;

	    setTimeout(function() {

	        that.error.hidden = true;

	    }, TIME_CLOSE_ERROR );
	};

/***/ }
/******/ ]);