
module.exports = Notes;

let pubsub = require('./../utils/pubsub.js');

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