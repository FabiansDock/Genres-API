const config = require('config');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const logger = require('./middleware/logger');
const home = require('./routes/home');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

console.log("Name: "+config.name);
console.log("Host: "+config.host);
console.log("Password: "+config.password);
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// For logging during development only
if(app.get('env') === 'development') {
    const accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory,
    });
    app.use(logger);
    app.use(morgan('tiny', { stream: accessLogStream }));
}

app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));