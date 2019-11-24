process.setMaxListeners(0);
require('events').EventEmitter.defaultMaxListeners = 150;

var WebTorrent = require('webtorrent-hybrid')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var client = null;
var server = null;

var listClient = new WebTorrent();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

let tasks = []
let currentWorking = 0
let tasksResponse = {}

var escapeShell = function(cmd) {
    return '"' + cmd.replace(/(["\s'$`\\])/g, '\\$1') + '"';
};

listClient.on('torrent', function(torrent) {
    console.log('torrent ready - list')
    var files = []
    torrent.files.forEach(function(file) {
        files.push({ name: file.name, length: file.length })
    })
    tasksResponse[torrent.infoHash](files)
    torrent.destroy(function() {
        currentWorking--
        addTask()
    })
})


function addTask() {
    if (currentWorking > 10 || !tasks.length) return false

    try {
        listClient.add(tasks.shift(), function(torrent) {
            setTimeout(function() {
                if (!torrent) return false
                torrent.destroy(function() {
                    currentWorking--
                    addTask()
                })

            }, 15000)
        })
        currentWorking++
    } catch (e) {
        currentWorking--
        console.log('Already added')
    }

}

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('startServer', function(msg, response) {
        console.log(msg)
        if (client) {
            client.destroy()
            if (server)
                server.destroy()
        }
        client = new WebTorrent()
        var magnetURI = 'magnet:?xt=urn:btih:' + msg.hash

        client.on('torrent', function(torrent) {
            console.log('torrent ready', torrent.files)
            var files = []
            torrent.files.forEach(function(file) {
                files.push({ name: file.name, length: file.length })
            })
            response(files)

        })

        client.add(magnetURI, function(torrent) {
            // create HTTP server for this torrent
            server = torrent.createServer()
            server.listen(8083) // start the server listening to a port
        })
    })

    socket.on('getFiles', function(msg, response) {
        console.log(msg)
        var magnetURI = 'magnet:?xt=urn:btih:' + msg.hash

        if (!tasks.includes(magnetURI)) {
            tasks.push(magnetURI)
            tasksResponse[msg.hash] = response
            addTask()
        }
    })

    socket.on('startVlc', function(msg, response) {
        const { exec } = require('child_process');
        let os = require('os')
        let executable = 'vlc'
        if (os.platform() == 'win32' || os.platform() == 'win64') {
            executable = '"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe"'
        }
        let files = msg.reduce(function(acc, val, index) { return acc + `"${('http://localhost:8083/' + index + '/' + encodeURIComponent(val.name))}" ` }, '')
        exec(`${executable} ${files}`, (err, stdout, stderr) => {
            if (err) {
                response({ ok: false, err })
                return;
            }
            response({ ok: true })
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    })

    let mdb = require('./mdb.js')
    mdb.init(socket)
});

http.listen(3021, function() {
    console.log('listening on *:3021');
});