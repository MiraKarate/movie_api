/** 
 * Movie API Documentation 
 * The API URL is: 
*/

/**
 * root file of the myFlix back end application
 * importing packages required for the project
 * @requires express
 * @requires bodyParser
 * @requires fs
 * @requires path
 * @requires uuid
 * @requires morgan
 * @requires CORS
 * @requires ./auth
 * @requires ./passport
 * @requires mongoose
 * @requires ./models.js
 * @requires express-validator
 */

// required frameworks, packages
const bodyParser = require('body-parser'),// require bodyparser
  express = require('express'), // require express
  morgan = require('morgan'), // require morgan
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  { check, validationResult } = require('express-validator'); // Input validation

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

// CORS middleware
/**
 * CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
 * https://www.npmjs.com/package/cors
 */
const cors = require('cors');
//app.use(cors({ origin: '*' }))

let allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http://testsite.com', 'http://localhost:1234', 'https://myflix-mirakarate.netlify.app', 'https://mirakarate.github.io'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// use of body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // express.static to serve “documentation.html” file from public folder 
app.use(morgan("common"));



mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // online database
// mongoose.connect('mongodb://localhost:27017/myflix', { useNewUrlParser: true, useUnifiedTopology: true }); // local database

// Authentication (auth.js is handling login endpoint and generating JWT tokens)
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


/** 
 * API Endpoints 
 * */

/**
 * Welcome page text response
 * @function
 * @method GET - endpoint '/'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with the welcome message
 */
// READ 
app.get('/', (req, res) => {
  res.send("Welcome to myFlix!");
});

/**
 * Allows a user to view the documentation page. 
 */

app.get('/documentation', (req, res) => { //READ
  res.sendFile('public/documentation.html', { root: __dirname });
});


/**
 * Returns a list of all movies
 * @method GET
 * @param {string} endpoint - /movies
 * @param {function} callback - function(req, res)
 * @returns {object} - JSON object containing all movies
 */

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


/**
 * Retrieves a specific movie by its' title
 * @function
 * @method GET - endpoint '/movies/:Title'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with the info of one movie
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Get genres 
app.get('/movies/genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre': req.params.genre })
    .then((movies) => {
      res.status(200).json(movies.Genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 *  Return data about a genre (description) by name/title
 * @function
 * @method GET - endpoint '/movies/genre/:genreName'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with info of one genre
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * Return data about a director (bio, birth year, death year) by name
 * @function
 * @method GET - endpoint '/movies/directors/:directorName'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with info of one director
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});


// USERS //


/**
 * Returns all registered users
 * @function
 * @method GET - endpoint '/users'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with a list of users 
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * Retrieves a specific user by their Name
 * @function
 * @method GET - endpoint '/users/:Username'
 * @param {string} Username
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding data of the user
 */

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * Allows users to register by filling out required information
 * @function
 * @method POST - endpoint '/users'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding data of the new user
 * @param {string} Username
 * @param {string} Password
 * @param {string} Email
 */
app.post('/users', [check('Username', 'Username is required').isLength({ min: 5 }),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
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


/**
 * Allows existing user to update their information
 * @function
 * @method PATCH - endpoint '/users/:Username'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding updated data of the user
 * @param {string} Username
 * @param {string} Password
 * @param {string} Email
 */
app.put('/users/:Username', [check('Username', 'Username is required').isLength({ min: 5 }),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
  * Allows registered users to add a movie to their favorites
  * @function
  * @method POST - endpoint '/users/:Username/movies/:MovieID'
  * @param {object} - HTTP request object
  * @param {object} - HTTP response object
  * @returns {object} - JSON object holding updated data of the user
  */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(400).send('Bad request!');
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Allows registered users to remove a movie from their favorites
 * @function
 * @method DELETE - endpoint '/users/:Username/movies/:MovieID'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding updated data of the user
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(400).send('Bad request!');
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Allows a registered user to delete their account
 * @function
 * @method DELETE - endpoint '/users/:Username'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {string} - message confirming account deletion
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// error-handling middleware function that logs all application-level errors to the terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});