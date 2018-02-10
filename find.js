var noble = require('noble');

module.exports = function (device_name, callback) {
    noble.startScanning();

    const eventListener = noble.on('discover', function (peripheral) {
        if (peripheral.advertisement.localName === device_name) {
            noble.stopScanning();
            callback(peripheral.uuid);
        } else {
            console.log('found another device: ', peripheral.advertisement.localName);
        }
    })
};
