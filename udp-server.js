const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const jspack = require('jspack').jspack;
const filter = require('./filter');

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

function unpack(msg, pos, threshold) {
    return filter(jspack.Unpack('!f', msg, pos)[0], threshold);
}

var alphaSum = 0;
var betaSum = 0;
var gammaSum = 0;
server.on('message', (msg, rinfo) => {
    // var buf = new Buffer(msg);
    const data = {
        acc: {
            x: unpack(msg, 0, 0.3),
            y: unpack(msg, 4, 0.3),
            z: unpack(msg, 8, 0.3)
        },
        gra: {
            x: unpack(msg, 12, 0.1),
            y: unpack(msg, 16, 0.1),
            z: unpack(msg, 20, 0.1)
        },
        rot: {
            a: unpack(msg, 32, 0),
            b: unpack(msg, 24, 0),
            g: unpack(msg, 28, 0)
        }
    };

    alphaSum += data.rot.a;
    betaSum += data.rot.b;
    gammaSum += data.rot.g;
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3001);

module.exports = {
    alpha: function () {
        return alphaSum;
    },
    beta: function () {
        return betaSum;
    },
    gamma: function () {
        return gammaSum;
    }
};