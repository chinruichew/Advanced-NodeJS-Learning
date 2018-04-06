const express = require('express');
const crypto = require('crypto');

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