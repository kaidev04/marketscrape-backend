const { getSentiment } = require('./sentiment');
const http = require('http').createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
});

const io = require('socket.io')(http, {
    cors: { origin: '*' }
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
