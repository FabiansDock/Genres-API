
function log(req, res, next) {
    console.log('Logged...');
    next();
}

module.exports = log;