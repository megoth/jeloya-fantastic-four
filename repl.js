var arDrone = require('ar-drone');
var client  = arDrone.createClient({
    'ip': '192.168.99.32'
});
client.createRepl();