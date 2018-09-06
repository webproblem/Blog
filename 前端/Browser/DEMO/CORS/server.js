var url = require('url');

require('http').createServer(function(req, res) {
    var data = {
        name: '武林外传',
        time: 2005,
        length: 81,
        address: '同福客栈'
    };
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(data));
}).listen(3000, '127.0.0.1')

console.log('启动服务，监听 127.0.0.1:3000');