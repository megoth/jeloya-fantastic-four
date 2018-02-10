const Drone = require('parrot-minidrone');
const drone = new Drone({
    autoconnect: true,
    // droneFilter: 'Mambo_614243'
});

drone.on('connected', () => drone.takeOff());
drone.on('flightStatusChange', (status) => {
    if (status === 'hovering') {
        drone.land();
        process.exit();
    }
});