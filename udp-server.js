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

let lastUpdate;
let alphaSum = 0;
let betaSum = 0;
let gammaSum = 0;
let light = 0;
let up = false;
let down = false;
let recalibrate = false;
server.on('message', (msg, rinfo) => {
    lastUpdate = Date.now();
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
        },
        ori: {
            x: unpack(msg, 36, 0),
            y: unpack(msg, 40, 0),
            z: unpack(msg, 44, 0)
        },
        light: unpack(msg, 56, 0)
    };

    // console.log(
    //     // unpack(msg, 48, 0),
    //     // unpack(msg, 52, 0),
    //     // unpack(msg, 60, 0),
    //     // unpack(msg, 64, 0),
    //     // unpack(msg, 68, 0),
    //     // unpack(msg, 72, 0),
    //     // unpack(msg, 76, 0),
    //     // unpack(msg, 80, 0),
    //     // unpack(msg, 60, 0),
    //     // unpack(msg, 60, 0),
    //     // unpack(msg, 60, 0),
    // );

    alphaSum += data.rot.a;
    betaSum += data.rot.b;
    gammaSum += data.rot.g;
    light = data.light;
    up = data.acc.x || data.acc.y || data.acc.z;
    down = data.gra.x || data.gra.y || data.gra.z;
    recalibrate = data.ori.x || data.ori.y || data.ori.z;

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
    },
    light: function () {
        return light > 0;
    },
    start: function (callback) {
        const intervalId = setInterval(() => {
            if (!!lastUpdate) {
                console.log('should start', lastUpdate);
                callback();
                clearInterval(intervalId);
            }
        }, 100);
    },
    stop: function () {
        return Date.now() - lastUpdate > 1000;
    },
    up: () => up,
    down: () => down,
    recalibrate: () => recalibrate
};