var http = require('http');
var static = require('node-static');
var file = new static.Server('.');

const PORT = 8090;

http.createServer(function(req, res) {
    file.serve(req, res);
}).listen(PORT);

console.log(`Server running on port ${PORT}`);