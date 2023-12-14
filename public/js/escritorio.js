// Referencias del HTML
const lblEscritorio  = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket  = document.querySelector('small');
const divMensajes  = document.querySelector('.alert');
const lblPendientes  = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error( 'El escritorio es obligatorio')
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio
divMensajes.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (tickets) => {
    if ( tickets === 0) {
        lblPendientes.style.display = 'none';
    }
    
    lblPendientes.innerText = tickets;
    lblPendientes.style.display = '';
});

btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg }) => {
        
        if ( !ok ) {
            return divMensajes.style.display = '';
        }

        lblTicket.innerText = ticket.numero;

    });

    

});