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
  const { date } = req.query; // optional
  const filter = { userId: req.userId };

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    filter.date = { $gte: start, $lte: end };
  }

  const runs = await Run.find(filter).sort({ date: -1 });
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
  const { date } = req.query; // optional
  const filter = { userId: req.userId };

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    filter.date = { $gte: start, $lte: end };
  }

  const swims = await Swim.find(filter).sort({ date: -1 });
  res.json(swims);
});

module.exports = router;
