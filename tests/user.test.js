const User = require('../models/User');
const bcrypt = require('bcrypt');
const {api, getUsers} = require('./helpers');
const mongoose = require('mongoose');
const {server} = require('../index');

describe.only('creando un nuevo usuario', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash('1234', saltRounds);
        const user = new User({username: 'McLovin', passwordHash});

        await user.save();
    });

    test('funciona como se esperaba creando un nuevo nombre de usuario', async() => {

        const usersAtStart = await getUsers();

        const newUser = {
            
            username: 'McLovin2021',
            name: 'Fabricio', 
            password: '5678'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await getUsers();
        
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('la creación falla con el código de estado y el mensaje adecuado si el nombre de usuario ya está en uso', async() => {

        const usersAtStart = await getUsers();

        const newUser = {
            
            username: 'McLovin',
            name: 'Fabricio', 
            password: '5678'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.errors.username.message).toContain('`username` to be unique');

        const usersAtEnd = await getUsers();

        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    afterAll(() => {
        mongoose.connection.close();
        server.close();
    });
})