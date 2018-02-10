module.exports = function filter(number, threshold) {
    return number >= threshold || number <= threshold * -1 ? number : 0;
};