const express = require('express');
const crypto = require('crypto');
const Worker = require('webworker-threads').Worker;

// Child which will act like a server
const app = express();

app.get('/', (req, res) => {
    const worker = new Worker(function() {
        this.onmessage = function() {
            let counter = 0;
            while(counter < 1e9) {
                counter++;
            }

            postMessage(counter);
        };
    });

    worker.onmessage = function(message) {
        console.log(message.data);
        res.send(String(message.data));
    };

    worker.postMessage();
});

app.get('/fast', (req, res) => {
    res.send('That was really fast!');
});

app.listen(3001);