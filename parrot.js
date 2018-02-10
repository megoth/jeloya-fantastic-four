const udpServer = require('./udp-server');
const filter = require('./filter');

module.exports = class Parrot {
    constructor(rollingSpider) {
        this.rollingSpider = rollingSpider;
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
        this.rollingSpider.flatTrim();
        this.rollingSpider.startPing();
        this.rollingSpider.flatTrim();
        this.rollingSpider.takeOff();
    }

    navigate() {
        const alpha = filter(udpServer.alpha(), 20);
        const beta = filter(udpServer.beta(), 20);
        const gamma = filter(udpServer.gamma(), 20);
        const alphaDiff = filter(alpha - this.alpha, 20);
        if (alphaDiff > 0) {
            console.log('turn left!', alphaDiff);
            this.rollingSpider.turnLeft({
                speed: Math.abs(alphaDiff)
            }, () => this.updateStatus(alpha));
        } else if (alphaDiff < 0) {
            console.log('turn right!', alphaDiff);
            this.rollingSpider.turnRight({
                speed: Math.abs(alphaDiff)
            }, () => this.updateStatus(alpha));
        } else if (beta > 0) {
            console.log('move backward!', beta);
            this.rollingSpider.backward({
                speed: Math.abs(beta),
                steps: Math.max(Math.abs(beta) * 2, 40)
            }, () => this.updateStatus(alpha));
        } else if (beta < 0) {
            console.log('move forward!', beta);
            this.rollingSpider.forward({
                speed: Math.abs(beta),
                steps: Math.max(Math.abs(beta) * 2, 40)
            }, () => this.updateStatus(alpha));
        } else if (gamma > 0) {
            console.log('tilt right', gamma);
            this.rollingSpider.right({
                speed: Math.abs(gamma)
            }, () => this.updateStatus(alpha));
        } else if (gamma < 0) {
            console.log('tilt left', gamma);
            this.rollingSpider.left({
                speed: Math.abs(gamma)
            }, () => this.updateStatus(alpha));
        } else {
            // console.log('doing nothing', alpha, beta, gamma);
            this.updateStatus(alpha);
        }
    }
    
    updateStatus(alpha) {
        this.alpha = alpha;
        setTimeout(() => this.navigate(), 100);
    }
};