const express = require("express");
const Run = require("../models/Run");
const Swim = require("../models/Swim");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/* =====================================================
   IMPORT RUNS FROM APPLE HEALTH (HealthKit)
===================================================== */
router.post("/import/healthkit/runs", auth, async (req, res) => {
  try {
    const { runs } = req.body;

    if (!Array.isArray(runs) || runs.length === 0) {
      return res.status(400).json({
        message: "Runs array is required",
      });
    }

    const userId = req.userId;

    // 1️⃣ Find already imported runs
    const existing = await Run.find(
      {
        userId,
        externalId: { $in: runs.map((r) => r.externalId) },
      },
      { externalId: 1 }
    );

    const existingIds = new Set(existing.map((r) => r.externalId));

    // 2️⃣ Filter new runs only
    const newRuns = runs
      .filter((r) => !existingIds.has(r.externalId))
      .map((r) => ({
        userId,
        distance: r.distance, // km
        duration: r.duration, // minutes
        calories: r.calories,
        date: new Date(r.date),
        externalId: r.externalId,
        source: "healthkit",
      }));

    // 3️⃣ Insert
    if (newRuns.length > 0) {
      await Run.insertMany(newRuns);
    }

    res.json({
      imported: newRuns.length,
      skipped: runs.length - newRuns.length,
      totalReceived: runs.length,
    });
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    res.status(500).json({
      message: "Failed to import HealthKit runs",
    });
  }
});

module.exports = router;
