const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid'),
mongoose = require('mongoose'),
app = express(),
Models = require('./models.js'),
Movies = Models.Movie,
Users = Models.User;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//returns static files from public folder
app.use(express.static('public'));
//uses morgan to log requests
app.use(morgan('common'));

const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors());

const auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//connects to movie_api database locally
// mongoose.connect('mongodb://localhost:27017/movie_api',
// {useNewUrlParser: true, useUnifiedTopology: true
// });

mongoose.connect( process.env.CONNECTION_URI,
{useNewUrlParser: true, useUnifiedTopology: true
});

//get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }),
 (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//creates user account
app.post('/users',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
(req, res) => {
  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) =>{res.status(201).json(user)
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//updates user info by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
(req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
      res.status(200).send(req.params.Username + ' was deleted.');
    })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get all users
app.get('/users', passport.authenticate('jwt', { session: false }),
(req, res)  => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
(req, res) => {
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
(req, res) => {
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

//deletes a movie from a user's list of favorites
app.put('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  {
    $pull: { FavoriteMovies: req.params.MovieID }
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

// returns default text response
app.get('/', (req, res) => {
  res.send('Welcome to my Movies app!');
});

//error handling
methodOverride = require('method-override');


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Lisenting on Port ' + port);
});
