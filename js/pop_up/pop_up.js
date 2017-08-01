
module.exports = PopUp;

let pubsub = require('./../utils/pubsub.js');

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