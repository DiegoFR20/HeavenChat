var app = require('./config/server');

var server = app.listen(80, function () {
    console.log("Server ON");
})

var io = require('socket.io').listen(server);

app.set('io', io);

io.on('connection', function (socket) {

    socket.on('msgParaServidor', function (data) {
        socket.on('disconnect', function () {

            socket.broadcast.emit(
                'msgParaCliente',
                { apelido: data.apelido, mensagem: 'acabou de sair do chat' });

        });

        socket.emit(
            'msgParaCliente',
            { apelido: 'Você', mensagem: data.mensagem }
        );

        socket.broadcast.emit(
            'msgParaCliente',
            { apelido: data.apelido, mensagem: data.mensagem }
        );

        if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
            socket.emit(
                'participantesParaCliente',
                { apelido: data.apelido }
            );

            socket.broadcast.emit(
                'participantesParaCliente',
                { apelido: data.apelido }
            );
        }
    });
});