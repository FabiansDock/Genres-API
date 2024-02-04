const express = require('express');
const router = express.Router()

const genres = [
    {id: 1, name: "Action"}, 
    {id: 2, name: "Thriller"},
    {id: 3, name: "Comedy"},
];

//GET all genres
router.get('/', (req, res) => {
    res.send(genres);
});

//GET a single genre
router.get('/:id', (req, res) => {

    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    res.send(genre);
});

//POST
router.post('/', (req, res) => {
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
router.patch('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {

    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Not found');

    const genre_index = genres.indexOf(genre);
    genres.splice(genre_index, 1);
    res.send(genres); 
});

module.exports = router;