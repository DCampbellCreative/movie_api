const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid'),
mongoose = require('mongoose'),
Models = require('./models.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extdended: true}));
const Movies = Models.Movie;
const Users = Models.User;

//connects to movie_api database
mongoose.connect('mongodb://localhost:27017/movie_api',
{useNewUrlParser: true, useUnifiedTopology: true
});

//imports auth.js file
app.use(express.urlencoded({ extended: true }));
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');


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
app.get('/movies/:Title', (req, res) => {
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
app.get('/genres/:Name', (req, res) => {
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
app.get('/directors/:Name', (req, res) => {
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
      res.status(200).send(req.params.Username + ' was deleted.');
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

//deletes a movie to a user's list of favorites
app.put('/users/:Username/movies/:MovieID', (req, res) => {
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

//returns static files from public folder
app.use(express.static('public'));

//uses morgan to log requests
app.use(morgan('common'));

//error handling
// const express = require('body-parser'),
methodOverride = require('method-override');

app.use(express.urlencoded({
  extdended: true
}));

app.use(express.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,() => {
  console.log('Your app is listening on port 8080.');
});
