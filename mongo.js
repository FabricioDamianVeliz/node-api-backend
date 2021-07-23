const mongoose = require('mongoose');
// const password = require('./password.js');

const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env;
const connectionString = NODE_ENV === 'test'
    ? MONGO_DB_URI_TEST
    : MONGO_DB_URI;

//conexion a mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('Base de datos conectada');
    }).catch(err => {
        console.error(err);
    })

// Note.find({}).then(result => {
//     console.log(result);
//     mongoose.connection.close();
// });

// const note = Note({
//     content: 'MongoDB es increible',
//     date: new Date(),
//     important: true
// });

// note.save()
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close();
//     }).catch(err => {
//         console.error(err);
//     })