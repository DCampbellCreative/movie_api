const express = require('express'),
morgan = require('morgan');

const app = express();

//returns JSON object containing top 10 movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//returns default text response
app.get('/', (req, res) => {
  res.send('Welcome to my Movies app!');
});

//returns static files from public folder
app.use(express.static('public'));

//uses morgan to log requests
app.use(morgan('common'));

//error handling
const bodyParser = require('body-parser'),
methodOverrider = require('method-override');

app.use(bodyParser.urlencoded({
  extdended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,() => {
  console.log('Your app is listening on port 8080.');
});
