const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const bcrypt = require('bcrypt');
const User= require('../user/user.model');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  
  User.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
          return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
        }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (req.body.username === user.username && passwordIsValid) {
        const token = jwt.sign({
          username: user.username
        }, config.jwtSecret);
        return res.json({
          token,
          username: user.username
        });
    } 
    return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
  })
}


/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber };
