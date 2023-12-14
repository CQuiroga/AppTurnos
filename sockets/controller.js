const TicketControl = require('../models/ticket-control');

// Instancia al modelo de Tickets

const ticketControl = new TicketControl

const socketController = (socket) => {

    // Acción por defecto (cuando cliente desconectado)
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    
    // Emitir el estado actual de la cola
    socket.emit( 'estado-actual', ticketControl.ultimos4 );

    // Tickets pendientes (por atender)
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length);

    // Cuando cliente conectado
    socket.on( 'siguiente-ticket', ( payload, callback ) => {
       const siguiente = ticketControl.siguiente();
       socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);
       callback( siguiente );
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        
        if (!escritorio) {
            return callback( {
                ok: false,
                msg: 'No hay escritorio asignado!'
            })
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
        // Tickets pendientes (por atender)
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);
        
        if (!ticket) {
            callback( {
                ok: false,
                msg: 'No hay tickets por atender!'
            });
        }else {
            callback( {
                ok: true,
                ticket
            })
        }
        
    });

}

module.exports = {
    socketController,
}