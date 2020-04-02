const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const server = new WebSocket.Server({ port: PORT });
const crypto = require("crypto");

const events = require('events');
const Broker = new events.EventEmitter();

var sha512 = function(string) {
    return crypto.createHash('sha512').update(string).digest('hex');
};

server.on('connection', function connection(ws, req) {
	var id = null;
	var client = sha512(req.headers['sec-websocket-key']);
	ws.on('message', function incoming(msg) {
		if(id === null) {
			id = sha512(msg);
			Broker.on(id, (sender, m) => {
				if(client !== sender) {
					ws.send(m);
				}
			});
			return ":-)"
		}
		Broker.emit(id, client, msg);
	});
});
