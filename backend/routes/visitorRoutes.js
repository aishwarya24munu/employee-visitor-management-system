const express = require("express");
const Visitor = require("../models/Visitor");

const router = express.Router();

// GET all visitors + Search by name or mobile
router.get("/", async (req, res) => {
  try {
    const { search = "" } = req.query;

    const visitors = await Visitor.find({
      $or: [
        { visitorName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch visitors" });
  }
});

// ADD visitor
router.post("/", async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE visitor
router.put("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.json(visitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE visitor
router.delete("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;