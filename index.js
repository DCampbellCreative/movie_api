const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid');

const app = express();

let movies = [
  {
    title: 'Goodfellas',
  },
  {
    title: 'Casino',
  },
  {
    title: 'The Departed',
  }
];

//returns JSON object containing all movies
app.get('/movies', (req, res) => {
  res.send('Successful GET request returning data on all movies.');
});

//returns JSON object containing data about a single movie
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning data on one movie.');
});

//returns JSON object containing data about a movies genre
app.get('/movies/:title/:genre', (req, res) => {
  res.send('Successful GET request returning data on one movie genres.');
});

//returns JSON object containing data about a director
app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returning data on a director.');
});

//adds user account
// app.post('/users', (req, res) => {
//   let newUser = req.body;
//
//   if(!newUser.name) {
//     const message = 'Missing name in request body';
//     res.status(400).send(message);
//   } else {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).send(newUser);
//   }
// });

//adds user account
app.post('/users', (req, res) => {
res.send('Text message showing user was successfully added.')
});

//updates user info
// app.put('/users/:name', (req, res) => {
//   let user = user.find((user) => { return user.name === req.params.name })
// });

//adds user account
app.put('/users', (req, res) => {
res.send('Text message showing user was successfully updated.')
});

//deletes a user from list
// app.delete('/users/:name', (req, res) => {
//   let user = user.find((user) => { return user.name === req.params.name});
//
//   if (user) {
//     user = user.filter((obj) => { return obj.name !== req.params.name});
//     res.status(201).send('User ' + req.params.name + ' was deleted.');
//   }
// });

//deletes a user from list
app.delete('/users/:name', (req, res) => {
res.send('Text message showing user was successfully deleted.')
});

//adds movie to users favorites
app.put('/users/:name/:favorites', (req, res) => {
  res.send('Text message letting user know movie was successfully added to favorites');
});

//deletes from users favorites
app.delete('/users/:name/:favorites', (req, res) => {
  res.send('Text message letting user know movie was successfully deleted from favorites');
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
methodOverride = require('method-override');

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
