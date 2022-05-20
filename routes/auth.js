const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../utils/tokenVerification');

const User = require('../model/User');

const registerValidation = require("../validation/register");
const loginValidation = require("../validation/login");


router.post('/register', async (req, res) =>  {
  // validate
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check for existing user
  const emailExists = await User.findOne({email: req.body.email});

  if (emailExists) {
    return res.status(400).send("Error: Email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser =  await user.save();
    res.send({
      user: savedUser._id,
    });
  } catch (error) {
    res.status(400).send(error)
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if email exists
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return res.status(400).send("Email does not exists");
  }

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  // Create and assign token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send({'auth-token': token, 'user-id': user._id});
});


router.get('/', auth, async (req, res) => {
  const authToken = req.header('auth-token');

  if (!authToken) {
    res.status(400).send('No auth-token found');
  }

  const token = jwt.verify(authToken, process.env.TOKEN_SECRET);

  if (!token) {
    res.status(400).send('Invalid user');
  }
  const user = await User.findOne({_id: token._id});

  res.send({
    name: user.name,
    email: user.email
  });
});

module.exports = router;
