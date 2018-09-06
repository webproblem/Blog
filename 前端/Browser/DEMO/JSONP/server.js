var url = require('url');

require('http').createServer(function(req, res) {
    var data = {
        name: '武林外传',
        time: 2005,
        length: 81,
        address: '同福客栈'
    };
    var callback = url.parse(req.url, true).query.callback;
    res.writeHead(200);
    res.end(`${callback}(${JSON.stringify(data)})`);
}).listen(3000, '127.0.0.1')

console.log('启动服务，监听 127.0.0.1:3000');