const express = require('express'); 
const http = require('http');
const socketio = require('socket.io');
const path = require('path')  
const app = express(); 
const { TextOperation } = require('ot');
const server = http.createServer(app);
const io = socketio(server);


app.use (express.static(path.join(__dirname, 'public'))) // serve public directory files
// get landing page
app.get('/', (req, res)=>{ 
    res.sendFile(path.join(__dirname,'public','/index.html')); 
}); 

let documentState = new TextOperation();


const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>{ 
     
    console.log("Server is Successfully Running, and App is listening on port "+ PORT) ;
    } 
);

io.on('connection', (socket) => {
    console.log('New Websocket Connection');

    socket.emit('doc', documentState);


    socket.on('operation', (operationData) => {
        const operation = TextOperation.fromJSON(operationData);
        documentState = documentState.compose(operation);
        socket.broadcast.emit('operation',operationData);
    });  

    socket.on('disconnect', ()=> {
        console.log(" Disconnected ") ; 
    });
});
