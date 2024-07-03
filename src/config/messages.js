
import {Server} from 'socket.io'
import Message from '../models/messages.model.js'


function socketServer(httpServer) {
    const io = new Server(httpServer);


    io.on('connection', (socket) => {
        console.log('Nueva conexión');


       socket.on('new-message', (data) => {
        console.log('Nuevo mensaje recibido:', data);

            const newMessage = new Message({
                user: data.user,
                message: data.message
            });

            newMessage.save()
                .then(() => {
                    io.emit('message-all', [newMessage]);
                })
                .catch((err) => {
                    console.error('Error al guardar el mensaje:', err);
                });
        });
    });
}

export default socketServer
