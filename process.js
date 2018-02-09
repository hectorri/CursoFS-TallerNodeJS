'use strict';
const Twitter = require('twitter');
const { saveTweet} = require('./model.js');

const client = new Twitter({
    consumer_key: "",
    consumer_secret: "",
    access_token_key: "",
    access_token_secret: ""
});

let stream = undefined;
let status = 'STOP';

function onTweet(data) {
    saveTweet(data).then(() => {
        setTimeout(() => stream.once('data', onTweet), 1000);
    });
    // console.log(data.text);
    // setTimeout(() => stream.once('data', onTweet), 100);
}

process.on('message', (msg) => {
    if (msg.cmd === 'START' && status === 'STOP') {
        stream = client.stream('statuses/filter', { track: msg.filter });
        stream.once('data', onTweet);
        status = msg.cmd;
    }
    if (msg.cmd === 'STOP' && status === 'START') {
        stream.destroy();
        stream = undefined;
        status = msg.cmd;
    }
});