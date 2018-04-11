const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
    // Assign collection and query name as unique key
    const key = Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    });

    // Get any cache value for the key
    const cacheValue = await client.get(key);
    if(cacheValue) {
        const doc = JSON.parse(cacheValue);
        Array.isArray(doc)? doc.map(d => new this.model(d)): new this.model(doc);
    }

    // If no cache, get the data through MongoDB query
    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));
    return result;
};