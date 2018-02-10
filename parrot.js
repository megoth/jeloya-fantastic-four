const udpServer = require('./udp-server');
const filter = require('./filter');

module.exports = class Parrot {
    constructor(rollingSpider) {
        this.rollingSpider = rollingSpider;
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
    }

    start() {
        this.rollingSpider.flatTrim();
        this.rollingSpider.startPing();
        this.rollingSpider.flatTrim();
        this.rollingSpider.takeOff();
        this.navigate();
    }

    navigate() {
        const turnLeftAndRight = filter(udpServer.alpha(), 40);
        const forwardAndBackward = filter(udpServer.beta(), 20);
        const tiltLeftAndRight = filter(udpServer.gamma(), 35);
        const alphaDiff = filter(turnLeftAndRight - this.alpha, 30);
        const stop = udpServer.stop();
        const light = udpServer.light();
        const up = udpServer.up();
        const down = udpServer.down();
        const recalibrate = udpServer.recalibrate();
        if (stop) {
            console.log('shutting down!');
            this.rollingSpider.land();
            process.exit(0);
        } else if (recalibrate) {
            console.log('recalibrate!!!!!');
            this.alpha = turnLeftAndRight;
            this.beta = forwardAndBackward;
            this.gamma = tiltLeftAndRight;
            this.rollingSpider.flatTrim(() => this.updateStatus(turnLeftAndRight));
        } else if (light) {
            console.log('do a flip!');
            this.rollingSpider.frontFlip();
            setTimeout(() => this.updateStatus(turnLeftAndRight), 1000);
        } else if (up) {
            console.log('go up!');
            this.rollingSpider.up({
                speed: 30,
                steps: 10
            }, () => this.updateStatus(turnLeftAndRight));
            // setTimeout(() => this.updateStatus(turnLeftAndRight), 1000);
        } else if (down) {
            console.log('go down');
            this.rollingSpider.down({
                speed: 30,
                steps: 10
            },() => this.updateStatus(turnLeftAndRight));
            // setTimeout(() => this.updateStatus(turnLeftAndRight), 1000);
        } else if (alphaDiff > 0) {
            console.log('turn left!', alphaDiff);
            this.rollingSpider.turnLeft({
                speed: Math.abs(alphaDiff)
            }, () => this.updateStatus(turnLeftAndRight));
        } else if (alphaDiff < 0) {
            console.log('turn right!', alphaDiff);
            this.rollingSpider.turnRight({
                speed: Math.abs(alphaDiff)
            }, () => this.updateStatus(turnLeftAndRight));
        } else if (forwardAndBackward > 0) {
            console.log('move backward!', forwardAndBackward);
            this.rollingSpider.backward({
                speed: Math.abs(forwardAndBackward),
                steps: 10
            }, () => this.updateStatus(turnLeftAndRight));
        } else if (forwardAndBackward < 0) {
            console.log('move forward!', forwardAndBackward);
            this.rollingSpider.forward({
                speed: Math.abs(forwardAndBackward),
                steps: 10
            }, () => this.updateStatus(turnLeftAndRight));
        } else if (tiltLeftAndRight > 0) {
            console.log('tilt right', tiltLeftAndRight);
            this.rollingSpider.right({
                speed: Math.abs(tiltLeftAndRight),
                steps: 10
            }, () => this.updateStatus(turnLeftAndRight));
        } else if (tiltLeftAndRight < 0) {
            console.log('tilt left', tiltLeftAndRight);
            this.rollingSpider.left({
                speed: Math.abs(tiltLeftAndRight),
                steps: 10
            }, () => this.updateStatus(turnLeftAndRight));
        } else {
            // console.log('doing nothing', turnLeftAndRight, forwardAndBackward, tiltLeftAndRight);
            this.updateStatus(turnLeftAndRight);
        }
    }
    
    updateStatus(alpha) {
        this.alpha = alpha;
        setTimeout(() => this.navigate(), 100);
    }
};