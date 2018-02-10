const udpServer = require('./udp-server');

module.exports = class Parrot {
    private alpha;
    private beta;
    private gamma;
    private rollingSpider;

    constructor(rollingSpider) {
        this.rollingSpider = rollingSpider;
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
        rollingSpider.flatTrim();
        rollingSpider.startPing();
        rollingSpider.flatTrim();
        rollingSpider.takeOff();
    }

    navigate() {
        console.log('navigate!', this);
    }
};