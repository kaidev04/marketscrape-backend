const http = require('http').createServer();
const { getSentiment } = require('./sentiment');

const io = require('socket.io')(http, {
    cors: { origin: 'http://127.0.0.1:5500' }
});

io.on('connection', socket => {
    console.log("user connected");

    socket.on('get-data', searchInput => {
        socket.emit('disable-submit');
        console.log('get data', searchInput);
        getSentiment(searchInput, function(data) {
            socket.emit('return-data', data)
            console.log('returning ', data)
        })
    })
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );
