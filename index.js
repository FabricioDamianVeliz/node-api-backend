require('dotenv').config();
require('./mongo');
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/Note');
const notFound = require('./middleware/notFound.js');
const handleErrors = require('./middleware/handleErrors');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const User = require('./models/User');
const userExtractor = require('./middleware/userExtractor');

//const Sentry = require('@sentry/node');
//const Tracing = require('@sentry/tracing');
// const nodemon = require('nodemon');
// const logger = require('./loggerMiddleware');
// const http = require('http');

app.use(cors());
app.use(express.json());
app.use(express.static('images'));

// app.use(logger);

// let notes = [];

// const app = http.createServer((req,res) => {
//     res.writeHead(200,{'Content-Type':'application/json'});
//     res.end(JSON.stringify(notes));
// });

app.get('/',(req,res) => {
    res.send('<h1>Hola Mundo</h1>');
});

app.get('/api/notes', async(req,res) => {
    
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1
    });
    
    res.json(notes);
        
});

app.get('/api/notes/:id', (req,res,next) => {

    // const id = Number(req.params.id);
    const {id} = req.params;

    Note.findById(id)
        .then(note => {
            if(note){
                return res.json(note);
            }else{
                res.status(404).end();
            }
        })
        .catch(error => next(error));
        // console.log(err.message);
        // res.status(400).end();
        // const note = notes.find(note => note.id === id);
});

app.put('/api/notes/:id', userExtractor, (req,res,next) => {

    const {id} = req.params;
    const note = req.body;
    const newNoteInfo = {
        content: note.content,
        important: note.important 
    };

    Note.findByIdAndUpdate(id,newNoteInfo,{new: true})
        .then(result => {
            res.json(result);
        })
        .catch(error => next(error));

});

app.delete('/api/notes/:id', userExtractor, (req,res,next) => {

    const {id} = req.params;

    // notes = notes.filter(note => note.id !== id);

    Note.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error));

});

app.post('/api/notes', userExtractor, async(req,res,next) => {

    const {content, important = false} = req.body;

    const {userId} = req;

    const user = await User.findById(userId);

    if(!content){
        return res.status(400).json({
            error: 'Falta el campo contenido obligatorio'
        });
    }

    const newNote = new Note({
        content,
        date: new Date(),
        important,
        user: user._id
    });

    // const ids = notes.map(note => note.id);
    // const maxId = Math.max(...ids);

    // const newNote = {
    //     id: maxId + 1,
    //     constent: note.content,
    //     important: typeof note.important !== 'undefined' ? note.important : false,
    //     date: new Date().toISOString()
    // }

    // notes = notes.concat(newNote);

    // newNote.save()
    //     .then(savedNote => {
    //         res.status(201).json(savedNote);
    //     })
    //     .catch(error => next(error));

    try {
        const savedNote = await newNote.save();
        user.notes = user.notes.concat(savedNote._id);
        await user.save();
        res.status(201).json(savedNote);
    } catch (error) {
        next(error);
    }
    
});

app.use('/api/users',usersRouter);
app.use('/api/login',loginRouter);
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Servidor que se ejecuta en el puerto ${PORT}`);
});

module.exports = {app, server};
