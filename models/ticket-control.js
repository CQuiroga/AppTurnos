const path = require('path');
const fs = require('fs');

class Ticket {
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    
    // Propiedades
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }

    // Generar un objeto con la estructura del JSON
    get toJson() {
        return {
            ultimo : this.ultimo,
            hoy : this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4,
        }
    }

    // Para manejo del servidor

    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');
        
        if ( hoy === this.hoy ) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }
        else {
            // Si hoy != a el hoy de la base de datos
            this.guardarDB();
        }
    }

    // Para guardar en la BDD

    guardarDB() {
        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ))
    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );
        
        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket( escritorio ) {
        
        // Si todavía no hay tickets
        if ( this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); //this.tickets[0] // tomar sólo un ticket (añadirlo al final)
        ticket.escritorio = escritorio;
        this.ultimos4.unshift( ticket ); // añadir el ticket al principio

        if ( this.ultimos4.length > 4) {
            this.ultimos4.splice( -1,1  )
        }

        this.guardarDB();

        return ticket;
    }

}

module.exports = TicketControl;