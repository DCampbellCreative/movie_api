const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Models = require('./models.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extdended: true}));
const Movies = Models.Movie;
const Users = Models.User;

//connects to movie_api database
mongoose.connect('mongodb://localhost:27017/movie_api',
{useNewUrlParser: true, useUnifiedTopology: true
});

//returns JSON object containing all movies
// app.get('/movies', (req, res) => {
//   res.send('Successful GET request returning data on all movies.');
// });

//returns JSON object containing data about a single movie
// app.get('/movies/:title', (req, res) => {
//   res.send('Successful GET request returning data on one movie.');
// });

//returns JSON object containing data about a movies genre
// app.get('/movies/:title/:genre', (req, res) => {
//   res.send('Successful GET request returning data on one movie genres.');
// });

//returns JSON object containing data about a director
// app.get('/directors/:name', (req, res) => {
//   res.send('Successful GET request returning data on a director.');
// });

//creates user account
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) =>{res.status(201).json(user)
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) =>{
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//updates user info by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.stauts(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//deletes user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.parmas.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get all users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//updates user info
// app.put('/users/:name', (req, res) => {
//   let user = user.find((user) => { return user.name === req.params.name })
// });

//adds user account
// app.put('/users', (req, res) => {
// res.send('Text message showing user was successfully updated.')
// });

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
// app.delete('/users/:name', (req, res) => {
// res.send('Text message showing user was successfully deleted.')
// });

//adds movie to users favorites
// app.put('/users/:name/:favorites', (req, res) => {
//   res.send('Text message letting user know movie was successfully added to favorites');
// });

//deletes from users favorites
// app.delete('/users/:name/:favorites', (req, res) => {
//   res.send('Text message letting user know movie was successfully deleted from favorites');
// });

// returns default text response
app.get('/', (req, res) => {
  res.send('Welcome to my Movies app!');
});

//returns static files from public folder
app.use(express.static('public'));

//uses morgan to log requests
app.use(morgan('common'));

//error handling
// const bodyParser = require('body-parser'),
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
