const express = require('express');
const app = express();
const port = 3001;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.render('mipagina');
});