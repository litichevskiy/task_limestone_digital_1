(function() {

    let storage = require('./storage.js'),
        Notes = require('./notes/notes.js'),
        Calendar = require('./calendar/calendar.js'),
        PopUp = require('./pop_up/pop_up.js');

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