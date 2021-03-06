const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation
const valdiateRegisterInput = require('../../validation/register');
const valdiateLoginInput = require('../../validation/login');

//load user model
const User = require('../../models/User');

//@route  GET api/users/test
//@desc   Tests users route
//@access public
router.get('/test', (req, res) => {
  res.json({msg: 'Users Works!'});
});

//@route  GET api/users/register
//@desc   Register user
//@access public
router.post('/register', (req, res) => {
  const {errors, isValid} = valdiateRegisterInput(req.body);

  //check validation
  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({email: req.body.email})
    .then((user) => {
      if(user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //size
          r: 'pg',  //rating
          d: 'mm'   //default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if(error) {
              throw error;
            }
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.json(user)
              })
              .catch((error) => {
                console.log(error);
              })
          })
        })
      }
    })
});

//@route  GET api/users/login
//@desc   Login User / Returning jwt token
//@access public
router.post('/login', (req, res) => {
  const {errors, isValid} = valdiateLoginInput(req.body);

  //check validation
  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email

  User.findOne({email})
    .then(user => {
      //check for user
      if(!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      //check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            //user matched
            //res.json({msg: 'Success'});

            const payload = {id: user.id, name: user.name, avatar: user.avatar};

            //sign token
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (error, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })
    })
});

//@route  GET api/users/current
//@desc   Return current user
//@access private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;