const jwtSecret = 'your_jwt_secret'; //same key used in JWTStrategy

const jwt = require('jsonwebtoken'),
passport = require('passport');

require('./passport'); //your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,//username you're encoding in JWT
    expiresIn: '7d',
    algorithm: 'HS256' //used to encode JWT values
  });
}

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
