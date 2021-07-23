const mongoose = require('mongoose');
const {server} = require('../index');
const Note = require('../models/Note');
const {initialNotes,api} = require('./helpers');

beforeEach(async () => {
    await Note.deleteMany({});

    //paralelo
    // const notesObjects = initialNotes.map(note => new Note(note));
    // const promises = notesObjects.map(note => note.save());
    // await Promise.all(promises);

    //secuencial
    for(const note of initialNotes){
        const noteObject = new Note(note);
        await noteObject.save();
    }

    // const note1 = new Note(initialNotes[0]);
    // await note1.save();
    // const note2 = new Note(initialNotes[1]);
    // await note2.save();
})

describe('GET all notes', () => {
    test('las notas se devuelven en json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });
    
    test('tenemos 2 notas', async () => {
        
        const response = await api.get('/api/notes');
        expect(response.body).toHaveLength(initialNotes.length);
            
    });
    
    test('el contenido de alguna de las notas es correcto', async () => {
        
        const response = await api.get('/api/notes');
        const contents = response.body.map(note => note.content);
        expect(contents).toContain('Aprendiendo FullStack JS');
            
    });
});

describe('create a note', () => {
    test('se puede agregar una nota válida', async () => {
    
        const newNote = {
            content: 'Proximamente async/await',
            important: true
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const response = await api.get('/api/notes');
        const contents = response.body.map(note => note.content);
        expect(response.body).toHaveLength(initialNotes.length+1);
        expect(contents).toContain(newNote.content);
        
    });
    
    test('no se puede agregar una nota válida', async () => {
        
        const newNote = {
            important: true
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)
        
        const response = await api.get('/api/notes');
        expect(response.body).toHaveLength(initialNotes.length);
    
    });
});

test('una nota se puede borrar', async () => {
    
    const response = await api.get('/api/notes');
    const{body: notes} = response;
    const noteToDelete = notes[0];

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const responseTwo = await api.get('/api/notes');
    expect(responseTwo.body).toHaveLength(initialNotes.length-1);

    const contents = responseTwo.body.map(note => note.content);
    expect(contents).not.toContain(noteToDelete.content);
});

test('una nota no se puede borrar', async () => {

    await api
        .delete('/api/notes/1234')
        .expect(400)

    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(initialNotes.length);

});

afterAll(() => {
    mongoose.connection.close();
    server.close();
})