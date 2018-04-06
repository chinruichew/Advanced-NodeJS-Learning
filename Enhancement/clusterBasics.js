process.env.UV_THREADPOOL_SIZE = 1;

const express = require('express');
const cluster = require('cluster');
const crypto = require('crypto');

// Check if file is in master mode
if(cluster.isMaster) {
    // cause index.js to be executed again but in child mode
    cluster.fork();
    cluster.fork();
} else {
    // Child which will act like a server
    const app = express();

    app.get('/', (req, res) => {
        // Time Delay
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            res.send('Hello World!');
        });
    });

    app.get('/fast', (req, res) => {
        res.send('That was really fast!');
    });

    app.listen(3000);
}