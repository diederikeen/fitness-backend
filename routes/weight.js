const router = require('express').Router();

const verify = require('../utils/tokenVerification');
const weightTrackerValidation = require('../validation/weightTracker');
const WeightTracker = require('../model/WeightTracker');


router.post('/', verify, async (req, res) => {
  const user = req.user;

  const { error } = weightTrackerValidation(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const weightObject = new WeightTracker({
    weight: req.body.weight,
    date: req.body.date,
    user: user._id,
  });


  try {
    const weight = await weightObject.save();
    console.log({weight});
    res.send({
      data: weight,
    });
  } catch(error) {
    console.log({error});
    res.status(400).send(error)
  }
});

router.get('/', verify, async (req, res) => {
  const user = req.user;

  try {
    const results = await WeightTracker.find({user: user._id});
    res.send({
      data: results,
    })
  } catch(error) {
    res.status(400).send(error)
  }
});

module.exports = router;
