require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));


// Configuracion global de rutas
app.use(require('./routes/index'));
 
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  useFindAndModify: true,
  useCreateIndex: true
}, (err) => {
    if(err){
        throw err;
    }
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});