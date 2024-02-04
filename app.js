const config = require('config');
const Joi = require('joi');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const genres = require('./genres');
const express = require('express');
const app = express();

console.log("Development name:"+config.name);
console.log("Development host:"+config.host);
console.log("Development password:"+config.password);
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// For logging during development only
if(app.get('env') === 'development') {
    const accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory,
    });
    app.use(morgan('tiny', { stream: accessLogStream }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));