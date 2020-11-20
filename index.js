const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : '' });
app.use(morgan(
    (tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens.body(req, res)
        ].join(' ');
    })
);

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Pepito',
        number: '678-9123567'
    }
];

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date.toUTCString()}</p>`);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id));
    if(person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== Number(request.params.id));
    response.status(204).end();
});

const randomId = () => {
    const max = 3000;
    const min = 100;
    return Math.floor(Math.random() * (max - min) + min);
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and/or number missing'
        });
    } else {
        const personFound = persons.find(p => p.name.toUpperCase() === body.name.toUpperCase());
        if (personFound === undefined) {
            const person = {
                name: body.name,
                number: body.number,
                id: randomId()
            };
            persons = persons.concat(person);
            response.json(person);
        } else {
            response.status(400).json({
                error: 'duplicated name'
            });
        }
    }

});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
