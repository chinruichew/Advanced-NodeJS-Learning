const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    signatureVersion: 'v4',
    region: 'ap-southeast-1'
});

module.exports = app => {
    app.get('/api/upload', requireLogin, async(req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket: 'advanced-nodejs-learning-bucket',
            ContentType: 'image/jpeg',
            Key: key
        }, (err, url) => {
            if(err) {
                console.log(err);
            }
            res.send({key, url});
        });
    });
};