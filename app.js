const config = require('config');
const Joi = require('joi');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
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

const genres = [
    {id: 1, name: "Action"}, 
    {id: 2, name: "Thriller"},
    {id: 3, name: "Comedy"},
];

//GET all genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

//GET a single genre
app.get('/api/genres/:id', (req, res) => {

    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    res.send(genre);
});

//POST
app.post('/api/genres', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send('Bad request');

    if (genres.find(genre => genre.name === req.body.name)) return res.status(409).send('Resource already exists');

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    };
    genres.push(genre);
    res.send(genre);    
});

//PATCH
app.patch('/api/genres/:id', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send('Bad request');

    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Not found');

    const genre_index = genres.indexOf(genre);
    genres[genre_index].name = req.body.name;
    res.send(genre); 
});

// DELETE
app.delete('/api/genres/:id', (req, res) => {

    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Not found');

    const genre_index = genres.indexOf(genre);
    genres.splice(genre_index, 1);
    res.send(genres); 
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));