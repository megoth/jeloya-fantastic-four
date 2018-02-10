const udpServer = require('./udp-server');

module.exports = class Parrot {
    private alpha;
    private beta;
    private gamma;

    constructor() {
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
    }

    navigate() {
        console.log('navigate!', this);
    }
};