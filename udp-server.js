const dgram = require('dgram');
const server = dgram.createSocket('udp4');
// const binary = require('binary');
const jspack = require('jspack').jspack;

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    // var buf = new Buffer(msg);
    const data = {
        acc: {
            x: jspack.Unpack('!f', msg, 0)[0],
            y: jspack.Unpack('!f', msg, 4)[0],
            z: jspack.Unpack('!f', msg, 8)[0]
        },
        rot: {
            x: jspack.Unpack('!f', msg, 24)[0],
            y: jspack.Unpack('!f', msg, 28)[0],
            z: jspack.Unpack('!f', msg, 32)[0]
        }
    };
    console.log(data);
    // console.log(binary.parse(msg).word8s('x').vars);
    // console.log(binary.parse(msg).word8s('y').vars);
    // console.log(`server got: ${JSON.stringify(msg.data)}`);
    // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3001);