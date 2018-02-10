const dgram = require('dgram');
const server = dgram.createSocket('udp4');
// const binary = require('binary');
const jspack = require('jspack').jspack;

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

function filter(number, threshold) {
    return number >= threshold || number <= threshold * -1 ? number : 0;
}

function unpack(msg, pos, threshold) {
    return filter(jspack.Unpack('!f', msg, pos)[0], threshold);
}

server.on('message', (msg, rinfo) => {
    // var buf = new Buffer(msg);
    const data = {
        acc: {
            x: unpack(msg, 0, 1),
            y: unpack(msg, 4, 1),
            z: unpack(msg, 8, 0.3)
        },
        gravity: {
            x: unpack(msg, 12, 0.1),
            y: unpack(msg, 16, 0.1),
            z: unpack(msg, 20, 0.1)
        },
        rot: {
            x: unpack(msg, 24, 0.1),
            y: unpack(msg, 28, 0.1),
            z: unpack(msg, 32, 0.1)
        }
    };
    // if (data.acc.x > 0) {
    //     console.log('accelerating forward', data.acc.x);
    // }
    // if (data.acc.x < 0) {
    //     console.log('stopping acceleration', data.acc.x);
    // }
    // if (data.acc.y > 0) {
    //     console.log('accelerating', data.acc.y);
    // }
    // if (data.acc.y < 0) {
    //     console.log('accelerating', data.acc.y);
    // }
    // if (data.acc.z > 0) {
    //     console.log('going up', data.acc.z);
    // }
    // if (data.acc.z < 0) {
    //     console.log('going down', data.acc.z);
    // }
    if (data.gravity.z > 0) {
        console.log('going up', data.gravity.z);
    }
    if (data.gravity.z < 0) {
        console.log('going down', data.gravity.z);
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3001);