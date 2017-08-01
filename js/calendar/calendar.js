
module.exports = Calendar;

let pubsub = require('./../utils/pubsub.js');

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