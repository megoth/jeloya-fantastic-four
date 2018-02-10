const noble = require('noble');

noble.startScanning();

noble.on('discover', (peripheral) => {
    console.log(`found device: ${peripheral.advertisement.localName} (${peripheral.address})`);
});
