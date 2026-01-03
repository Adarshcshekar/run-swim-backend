const express = require("express");
const Run = require("../models/Run");
const Swim = require("../models/Swim");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/* ADD RUN */
router.post("/run", auth, async (req, res) => {
  const run = new Run({ ...req.body, userId: req.userId });
  await run.save();
  res.json(run);
});

/* GET RUNS */
router.get("/runs", auth, async (req, res) => {
  const runs = await Run.find({ userId: req.userId });
  res.json(runs);
});

/* ADD SWIM */
router.post("/swim", auth, async (req, res) => {
  const swim = new Swim({ ...req.body, userId: req.userId });
  await swim.save();
  res.json(swim);
});

/* GET SWIMS */
router.get("/swims", auth, async (req, res) => {
  const swims = await Swim.find({ userId: req.userId });
  res.json(swims);
});

module.exports = router;
