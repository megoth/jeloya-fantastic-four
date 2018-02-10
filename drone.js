    const udpServer = require('./udp-server');
const RollingSpider = require('rolling-spider');
const find = require('./find');

find('Mambo_614243', function (uuid) {
    const rollingSpider = new RollingSpider({
        uuid: uuid
    });
    rollingSpider.connect(function () {
        console.log('connected!');
        rollingSpider.setup(function () {
            console.log('starting');
            rollingSpider.flatTrim();
            rollingSpider.startPing();
            rollingSpider.flatTrim();
            rollingSpider.takeOff();

            decideNavigation(rollingSpider);
        });
    });
});

function decideNavigation(rollingSpider) {
    const alpha = udpServer.alpha();
    const beta = udpServer.beta();
    const gamma = udpServer.gamma();
    if (alpha > 0) {
        console.log('turn left!', alpha);
        rollingSpider.turnLeft({
            speed: Math.abs(alpha)
        }, () => awaitNavigation(rollingSpider));
    } else if (alpha < 0) {
        console.log('turn right!', alpha);
        rollingSpider.turnRight({
            speed: Math.abs(alpha)
        }, () => awaitNavigation(rollingSpider));
    } else if (beta > 0) {
        console.log('move backward!', beta);
        rollingSpider.backward({
            speed: Math.abs(beta)
        }, () => awaitNavigation(rollingSpider));
    } else if (beta < 0) {
        console.log('move forward!', beta);
        rollingSpider.forward({
            speed: Math.abs(beta)
        }, () => awaitNavigation(rollingSpider));
    } else if (gamma > 0) {
        console.log('tilt right', gamma);
        rollingSpider.right({
            speed: Math.abs(gamma)
        }, () => awaitNavigation(rollingSpider));
    } else if (gamma < 0) {
        console.log('tilt left', gamma);
        rollingSpider.left({
            speed: Math.abs(gamma)
        }, () => awaitNavigation(rollingSpider));
    } else {
        console.log('doing nothing', alpha, beta, gamma);
        awaitNavigation(rollingSpider);
    }
}

function awaitNavigation(rollingSpider) {
    return setTimeout(() => decideNavigation(rollingSpider), 100);
}