const udpServer = require('./udp-server');
const RollingSpider = require('rolling-spider');
const find = require('./find');
const Parrot = require('./parrot');
const player = require('play-sound')();

find('Mambo_614243', (uuid) => {
    const rollingSpider = new RollingSpider({
        uuid: uuid
    });
    rollingSpider.connect(() => {
        player.play('audio/turret_deploy_4.wav');
        console.log('connected!');
        rollingSpider.setup(() => {
            udpServer.start(() => new Parrot(rollingSpider).start());
        });
    });
});

// function decideNavigation(rollingSpider) {
//     const alpha = udpServer.alpha();
//     const beta = udpServer.beta();
//     const gamma = udpServer.gamma();
//     if (alpha > 0) {
//         console.log('turn left!', alpha);
//         rollingSpider.turnLeft({
//             speed: Math.abs(alpha)
//         }, () => awaitNavigation(rollingSpider));
//     } else if (alpha < 0) {
//         console.log('turn right!', alpha);
//         rollingSpider.turnRight({
//             speed: Math.abs(alpha)
//         }, () => awaitNavigation(rollingSpider));
//     } else if (beta > 0) {
//         console.log('move backward!', beta);
//         rollingSpider.backward({
//             speed: Math.abs(beta)
//         }, () => awaitNavigation(rollingSpider));
//     } else if (beta < 0) {
//         console.log('move forward!', beta);
//         rollingSpider.forward({
//             speed: Math.abs(beta)
//         }, () => awaitNavigation(rollingSpider));
//     } else if (gamma > 0) {
//         console.log('tilt right', gamma);
//         rollingSpider.right({
//             speed: Math.abs(gamma)
//         }, () => awaitNavigation(rollingSpider));
//     } else if (gamma < 0) {
//         console.log('tilt left', gamma);
//         rollingSpider.left({
//             speed: Math.abs(gamma)
//         }, () => awaitNavigation(rollingSpider));
//     } else {
//         console.log('doing nothing', alpha, beta, gamma);
//         awaitNavigation(rollingSpider);
//     }
// }
//
// function awaitNavigation(rollingSpider) {
//     return setTimeout(() => decideNavigation(rollingSpider), 100);
// }