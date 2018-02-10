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

var NS2S = 1.0 / 1000000000.0;
var last_values = null;
var velocity = null;
var position = null;
var last_timestamp = 0;


server.on('message', (msg, rinfo) => {
    // var buf = new Buffer(msg);
    const data = {
        acc: {
            x: unpack(msg, 0, 0),
            y: unpack(msg, 4, 0),
            z: unpack(msg, 8, 0)
        },
        gravity: {
            x: unpack(msg, 12, 0),
            y: unpack(msg, 16, 0),
            z: unpack(msg, 20, 0)
        },
        rot: {
            x: unpack(msg, 24, 0),
            y: unpack(msg, 28, 0),
            z: unpack(msg, 32, 0)
        }
    };
    var eventData = [data.acc.x, data.acc.y, data.acc.z];
    var time = new Date();
    time = time.getTime();
    if(last_values != null){
        var dt = (time - last_timestamp) * NS2S;

        for(index = 0; index < 3;++index){
            velocity[index] += (eventData[index] + last_values[index])/2 * dt;
            position[index] += velocity[index] * dt;
        }
    }
    else{
        last_values = [0, 0, 0];
        velocity = [0, 0, 0];
        position = [0, 0, 0];
        velocity[0] = velocity[1] = velocity[2] = 0;
        position[0] = position[1] = position[2] = 0;
    }
    last_values = [data.acc.x, data.acc.y, data.acc.z];
    last_timestamp = time;
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
    console.log(velocity);
    console.log(position);
    console.log(data.acc.x);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3001);
