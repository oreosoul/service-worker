const 
    http  = require('http'),
    url   = require('url'),
    path  = require('path'),
    fs    = require('fs'),
    port  = parseInt(process.argv[2] || 8888, 10),
    mime  = {
        '.html' : ['text/html', 86400],
        '.htm'  : ['text/html', 86400],
        '.css'  : ['text/css', 86400],
        '.js'   : ['application/javascript', 86400],
        '.json' : ['application/json', 86400],
        '.jpg'  : ['image/jpeg', 0],
        '.jpeg' : ['image/jpeg', 0],
        '.png'  : ['image/png', 0],
        '.gif'  : ['image/gif', 0],
        '.ico'  : ['image/x-icon', 0],
        '.svg'  : ['image/svg+xml', 0],
        '.txt'  : ['text/plain', 86400],
        'err'   : ['text/plain', 30]
    };

// new server
http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname,
        fileName = path.join(process.cwd(), uri)

    fs.access(fileName, fs.constants.R_OK, (err) => {
        if(err) {
            serve(404, err)
            return
        }

        if(fs.statSync(fileName).isDirectory()) {
            fileName += 'index.html'
        }
        fs.readFile(fileName, (err, file) => {
            if(err) {
                serve(500, err + '\n')
            } else {
                serve(200, file, path.extname(fileName))
            }
        })
    })
    // serve content
    function serve(code, content, type) {

        let head = mime[type] || mime['err'];

        res.writeHead(code, {
        'Content-Type'    : head[0],
        'Cache-Control'   : 'must-revalidate, max-age=' + (head[1] || 2419200),
        'Content-Length'  : Buffer.byteLength(content)
        });
        res.write(content);
        res.end();

    }
}).listen(port)

console.log('Server running at http://localhost:' + port);
