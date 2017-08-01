
let pubsub = require('./utils/pubsub.js');

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